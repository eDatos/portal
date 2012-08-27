package com.stat4you.importation.service.impl;

import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.collections.CollectionUtils;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stat4you.common.configuration.Stat4YouConfiguration;
import com.stat4you.common.criteria.Stat4YouCriteria;
import com.stat4you.common.criteria.Stat4YouCriteriaOrder;
import com.stat4you.common.criteria.Stat4YouCriteriaOrder.OrderTypeEnum;
import com.stat4you.common.criteria.Stat4YouCriteriaPaginator;
import com.stat4you.common.criteria.Stat4YouCriteriaPropertyRestriction;
import com.stat4you.common.criteria.Stat4YouCriteriaPropertyRestriction.OperationType;
import com.stat4you.common.criteria.Stat4YouCriteriaResult;
import com.stat4you.common.exception.CommonExceptionCodeEnum;
import com.stat4you.importation.conf.ImportationConstants;
import com.stat4you.importation.processor.StatisticProcessor;
import com.stat4you.importation.service.processor.AttributesCallback;
import com.stat4you.importation.service.processor.DatasetCallback;
import com.stat4you.importation.service.processor.ObservationsExtendedCallback;
import com.stat4you.importation.service.processor.StatisticDtoProcessor;
import com.stat4you.statistics.data.service.DataService;
import com.stat4you.statistics.dsd.criteria.DatasetCriteriaOrderEnum;
import com.stat4you.statistics.dsd.criteria.DatasetCriteriaPropertyEnum;
import com.stat4you.statistics.dsd.domain.DatasetStateEnum;
import com.stat4you.statistics.dsd.dto.DatasetBasicDto;
import com.stat4you.statistics.dsd.dto.DatasetDto;
import com.stat4you.statistics.dsd.dto.DimensionDto;
import com.stat4you.statistics.dsd.service.DsdService;
import com.stat4you.transformation.dto.DigitalAgendaEuropeCsvDto;
import com.stat4you.transformation.dto.PxImportDto;
import com.stat4you.transformation.dto.StatisticDto;
import com.stat4you.transformation.service.TransformationService;

@Service("importationService")
public class ImportationServiceImpl extends ImportationServiceImplBase {

    private static final Logger   log = LoggerFactory.getLogger(ImportationServiceImpl.class);

    @Autowired
    private TransformationService transformationService;

    @Autowired
    private DsdService            dsdService;

    @Autowired
    private DataService           dataService;

    /**
     * Importation of a px file
     */
    public String importPx(ServiceContext ctx, PxImportDto pxImportDto) throws ApplicationException {
        try {
            log.info("Starting importation of a px: " + pxImportDto.getPxUrl());

            // Transform
            StatisticDto statisticDto = transformationService.transformPxToStatistic(ctx, pxImportDto);
            StatisticDtoProcessor processor = new StatisticDtoProcessor(pxImportDto.getPxUrl(), statisticDto);
            
            // Create and publish
            String datasetUri = importDsdAndData(ctx, processor);

            logImportationSuccess(pxImportDto.getPxUrl());
            log.info("Px imported: " + pxImportDto.getPxUrl());
            return datasetUri;

        } catch (Exception e) {
            // Log error in file of failed
            StringBuilder errorDescription = new StringBuilder();
            errorDescription.append(pxImportDto.getPxUrl());
            if (e instanceof ApplicationException) {
                errorDescription.append(" - ");
                ApplicationException applicationException = (ApplicationException) e;
                errorDescription.append(applicationException.getErrorCode() + ". " + applicationException.getMessage());
                if (e.getCause() != null && applicationException.getCause().getMessage() != null) {
                    errorDescription.append(". ");
                    errorDescription.append(applicationException.getCause().getMessage());
                }
            } else if (e.getCause() != null && e.getCause().getLocalizedMessage() != null) {
                errorDescription.append(" - ");
                errorDescription.append(e.getCause().getLocalizedMessage());
            }
            logImportationFailed(errorDescription.toString());

            // Relaunch
            if (e instanceof ApplicationException) {
                throw (ApplicationException) e;
            } else {
                throw new ApplicationException(CommonExceptionCodeEnum.UNKNOWN.name(), "Error importing px: " + pxImportDto.getPxUrl());
            }
        }
    }

    @Override
    public String importDigitalAgendaEuropeCsv(ServiceContext ctx, DigitalAgendaEuropeCsvDto digitalAgendaEuropeCsvDto) throws ApplicationException {
        try {
            log.info("Starting importation of a csv: " + digitalAgendaEuropeCsvDto.getUrl());

            // Transform
            StatisticDto statisticDto = transformationService.transformDigitalAgendaEuropeCsvToStatistic(ctx, digitalAgendaEuropeCsvDto);
            StatisticDtoProcessor processor = new StatisticDtoProcessor(digitalAgendaEuropeCsvDto.getUrl(), statisticDto);
            
            // Create and publish
            String datasetUri = importDsdAndData(ctx, processor);

            log.info("Csv imported: " + digitalAgendaEuropeCsvDto.getUrl());
            return datasetUri;

        } catch (Exception e) {
            log.info("Error importing csv: " + digitalAgendaEuropeCsvDto.getUrl());
            // Relaunch
            if (e instanceof ApplicationException) {
                throw (ApplicationException) e;
            } else {
                throw new ApplicationException(CommonExceptionCodeEnum.UNKNOWN.name(), "Error importing csv: " + digitalAgendaEuropeCsvDto.getUrl());
            }
        }
    }
    
    @Override
    public String importStatistic(ServiceContext ctx, StatisticProcessor processor) throws ApplicationException {
        try {
            log.info("Starting importation of: " + processor.getUrl());

            // Create and publish
            String datasetUri = importDsdAndData(ctx, processor);

            log.info("Imported: " + processor.getUrl());
            return datasetUri;
        } catch (Exception e) {
            log.info("Error importing: " + processor.getUrl());
            // Relaunch
            if (e instanceof ApplicationException) {
                throw (ApplicationException) e;
            } else {
                throw new ApplicationException(CommonExceptionCodeEnum.UNKNOWN.name(), "Error importing: " + processor.getUrl());
            }
        }
    }

    /**
     * Import in Dsd, creating metadatas and inserting data
     */
    private String importDsdAndData(ServiceContext ctx, StatisticProcessor processor) throws ApplicationException {

        // Retrieve possible existing dataset by url
        String datasetUrl = processor.getUrl();
        DatasetBasicDto datasetDtoActual = findDatasetActualByUrl(ctx, datasetUrl);

        // PROCESS DATA SET
        DatasetCallback callbackDataset = new DatasetCallback();
        processor.processDataset(callbackDataset);
        DatasetDto datasetDtoNew = callbackDataset.getDataset();
        
        // Check must be a new dataset
        Boolean createNewDataset = Boolean.FALSE;
        Boolean discardDatasetDraft = Boolean.FALSE;
        if (datasetDtoActual == null) {
            // Dataset doesnt exist previosly or is unpublished
            log.info("Dataset " + datasetUrl + ": dataset doesnt exist previosly or is unpublished");
            createNewDataset = Boolean.TRUE;
        } else if (DatasetStateEnum.DRAFT.equals(datasetDtoActual.getState())) {
            discardDatasetDraft = Boolean.TRUE;
            if (datasetDtoActual.getPublishedUri() == null) {
                // Dataset never was published and it will be deleted
                createNewDataset = Boolean.TRUE;
            }
        } else {
            // Check if dataset is different
            List<DimensionDto> dimensionsActual = dsdService.retrieveDatasetDimensions(ctx, datasetDtoActual.getUri());
            Boolean dimensionsChanged = isDatasetDimensionsChanged(dimensionsActual, datasetDtoNew.getDimensions());
            if (dimensionsChanged) {
                log.info("Dataset " + datasetUrl + ": dataset with dimensions changed");
                createNewDataset = Boolean.TRUE;
            }
        }

        // Create or update
        String datasetUri = null;
        try {
            if (discardDatasetDraft) {
                // Discard actual draft
                dsdService.discardDatasetDraft(ctx, datasetDtoActual.getUri());
                log.info("Dataset " + datasetUrl + ": dataset draft discarted with uri " + datasetDtoActual.getUri());
            }
            if (createNewDataset) {
                // Generate unique identifier
                String identifierUnique = dsdService.generateDatasetIdentifier(ctx, datasetDtoNew.getProviderUri(), datasetDtoNew.getIdentifier());
                datasetDtoNew.setIdentifier(identifierUnique);

                // Create
                datasetUri = dsdService.createDataset(ctx, datasetDtoNew);
                log.info("Dataset " + datasetUrl + ": dataset created with uri " + datasetUri);
            } else {
                // Create new version in draft
                datasetUri = dsdService.updateDatasetPublished(ctx, datasetDtoActual.getUri(), datasetDtoNew);
                log.info("Dataset " + datasetUrl + ": dataset updated with uri " + datasetUri);
            }

           
            // ================================================================================================================
            // TODO Cuando se puedan procesar las observaciones de forma "Asíncrona" habrá que mejorar este código para que 
            // TODO se vayan procesando las observaciones y poco a poco irlas insertando. Hay que validar que las invocaciones
            // TODO se hagan en la misma transacción para así garantizar el uso de la misma conexión a la BBDD.
            // ================================================================================================================
            
            // Insert observations and attributes
            // PROCESS OBSERVATION
            ObservationsExtendedCallback observationExtendedCallback = new ObservationsExtendedCallback();
            processor.processObservations(observationExtendedCallback); 
            dataService.createObservationsExtended(ctx, datasetUri, observationExtendedCallback.getObservations());
            
            AttributesCallback attributesCallback = new AttributesCallback();
            processor.processAttributes(attributesCallback);
            if (!CollectionUtils.isEmpty(attributesCallback.getAttributes())) {
                dataService.createAttributes(ctx, datasetUri, attributesCallback.getAttributes());
            }

            // Publish
            dsdService.publishDataset(ctx, datasetUri);
            log.info("Dataset " + datasetUrl + ": dataset published with uri " + datasetUri);

            return datasetUri;
        } catch (ApplicationException e) {
            log.info("Recovering from exception. Discard draft version of dataset " + datasetUrl);
            if (datasetUri != null) {
                dsdService.discardDatasetDraft(ctx, datasetUri);
            }
            throw e;
        }
    }

    /**
     * Find last dataset created by datasetUrl. State must be draft or published
     */
    private DatasetBasicDto findDatasetActualByUrl(ServiceContext ctx, String datasetUrl) throws ApplicationException {

        Stat4YouCriteria criteria = new Stat4YouCriteria();

        // Restriction
        criteria.setRestriction(new Stat4YouCriteriaPropertyRestriction(DatasetCriteriaPropertyEnum.URL.name(), datasetUrl, OperationType.EQ));

        // Order
        List<Stat4YouCriteriaOrder> ordersBy = new ArrayList<Stat4YouCriteriaOrder>();
        Stat4YouCriteriaOrder orderCreationDate = new Stat4YouCriteriaOrder();
        orderCreationDate.setPropertyName(DatasetCriteriaOrderEnum.CREATION_DATE.name());
        orderCreationDate.setType(OrderTypeEnum.DESC);
        ordersBy.add(orderCreationDate);
        criteria.setOrdersBy(ordersBy);
        // Pagination
        criteria.setPaginator(new Stat4YouCriteriaPaginator());
        criteria.getPaginator().setFirstResult(Integer.valueOf(0));
        criteria.getPaginator().setCountTotalResults(Boolean.FALSE);
        criteria.getPaginator().setMaximumResultSize(Integer.MAX_VALUE);
        Stat4YouCriteriaResult<DatasetBasicDto> criteriaResult = dsdService.findDatasets(ctx, criteria);

        // Retrieve last dataset was created (state must be draft or published)
        if (!CollectionUtils.isEmpty(criteriaResult.getResults())) {
            for (DatasetBasicDto datasetBasicDto : criteriaResult.getResults()) {
                if (DatasetStateEnum.DRAFT.equals(datasetBasicDto.getState()) || DatasetStateEnum.PUBLISHED.equals(datasetBasicDto.getState())) {
                    return datasetBasicDto;
                }
            }
        }
        return null;
    }

    /**
     * Compares old dimensions with new dimensions.
     * Dataset is changed if it has different number of dimensions or if their identifiers are different.
     */
    private Boolean isDatasetDimensionsChanged(List<DimensionDto> dimensionsActual, List<DimensionDto> dimensionsNew) {
        if (dimensionsActual.size() != dimensionsNew.size()) {
            return Boolean.TRUE;
        }
        for (DimensionDto dimensionDtoActual : dimensionsActual) {
            Boolean existsYet = Boolean.FALSE;
            for (DimensionDto dimensionDtoNew : dimensionsNew) {
                if (dimensionDtoActual.getIdentifier().equals(dimensionDtoNew.getIdentifier())) {
                    existsYet = Boolean.TRUE;
                    break;
                }
            }
            if (!existsYet) {
                return Boolean.TRUE;
            }
        }
        return Boolean.FALSE;
    }

    private void logImportationSuccess(String statisticDescription) throws ApplicationException {
        logPxImportationResult(statisticDescription, true);
    }

    private void logImportationFailed(String statisticDescription) throws ApplicationException {
        logPxImportationResult(statisticDescription, false);
    }

    private void logPxImportationResult(String statisticDescription, boolean success) throws ApplicationException {

        try {
            StringBuilder filePath = new StringBuilder();
            filePath.append(Stat4YouConfiguration.instance().getProperty(ImportationConstants.IMPORTATION_RESULTS_DIRECTORY));
            filePath.append("/");
            File dir = new File(filePath.toString());
            if (!dir.exists()) {
                dir.mkdirs();
            }
            DateTimeFormatter fmt = DateTimeFormat.forPattern("yyyyMMdd");
            filePath.append(fmt.print(new DateTime()));
            if (success) {
                filePath.append("-success");
            } else {
                filePath.append("-fail");
            }

            File file = new File(filePath.toString());
            if (!file.exists()) {
                file.createNewFile();
            }
            PrintWriter out = new PrintWriter(new FileWriter(file, true));
            try {
                out.println(statisticDescription);
            } finally {
                out.flush();
                out.close();
            }
        } catch (Exception e) {
            throw new ApplicationException(CommonExceptionCodeEnum.UNKNOWN.toString(), "Error logging");
        }
    }
}
