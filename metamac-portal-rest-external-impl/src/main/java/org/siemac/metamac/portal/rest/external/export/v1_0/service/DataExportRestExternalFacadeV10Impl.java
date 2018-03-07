package org.siemac.metamac.portal.rest.external.export.v1_0.service;

import static org.siemac.metamac.portal.rest.external.RestExternalConstantsPrivate.SERVICE_CONTEXT;
import static org.siemac.metamac.portal.rest.external.service.utils.PortalRestExternalUtils.manageException;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.jaxrs.JacksonJsonProvider;
import org.codehaus.jackson.map.ObjectMapper;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.core.common.io.DeleteOnCloseFileInputStream;
import org.siemac.metamac.core.common.util.shared.UrnUtils;
import org.siemac.metamac.portal.core.conf.PortalConfiguration;
import org.siemac.metamac.portal.core.constants.PortalConstants.ResourceType;
import org.siemac.metamac.portal.core.domain.DatasetSelectionDimension;
import org.siemac.metamac.portal.core.domain.DatasetSelectionForExcel;
import org.siemac.metamac.portal.core.domain.DatasetSelectionForPlainText;
import org.siemac.metamac.portal.core.enume.PlainTextTypeEnum;
import org.siemac.metamac.portal.core.exporters.PxExporter;
import org.siemac.metamac.portal.core.exporters.SvgExportSupportedMimeType;
import org.siemac.metamac.portal.core.invocation.IndicatorsRestExternalFacade;
import org.siemac.metamac.portal.core.invocation.IndicatorsSystemsRestExternalFacade;
import org.siemac.metamac.portal.core.invocation.SrmRestExternalFacade;
import org.siemac.metamac.portal.core.invocation.StatisticalResourcesRestExternalFacade;
import org.siemac.metamac.portal.core.invocation.mapper.IndicatorsRestExternalMapper;
import org.siemac.metamac.portal.core.serviceapi.ExportService;
import org.siemac.metamac.portal.rest.external.RestExternalConstants;
import org.siemac.metamac.portal.rest.external.exception.RestServiceExceptionType;
import org.siemac.metamac.portal.rest.external.export.v1_0.mapper.DatasetSelectionMapper;
import org.siemac.metamac.rest.exception.RestException;
import org.siemac.metamac.rest.exception.utils.RestExceptionUtils;
import org.siemac.metamac.rest.export.v1_0.domain.ExcelExportation;
import org.siemac.metamac.rest.export.v1_0.domain.PlainTextExportation;
import org.siemac.metamac.rest.export.v1_0.domain.PxExportation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Query;
import org.siemac.metamac.rest.structural_resources.v1_0.domain.Agency;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.gobcan.istac.indicators.rest.types.DataType;
import es.gobcan.istac.indicators.rest.types.IndicatorInstanceType;
import es.gobcan.istac.indicators.rest.types.IndicatorType;
import es.gobcan.istac.indicators.rest.types.IndicatorsSystemType;

@Service("dataExportRestExternalFacadeV10")
public class DataExportRestExternalFacadeV10Impl implements DataExportV1_0 {

    private String                                 MEDIA_TYPE_TEXT_TAB_SEPARATED_VALUES = "text/tab-separated-values";
    private String                                 MEDIA_TYPE_TEXT_CSV                  = "text/csv";
    private String                                 MEDIA_TYPE_APPLICATION_XLSX          = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    @Autowired
    private ExportService                          exportService;

    @Autowired
    private PortalConfiguration                    portalConfiguration;

    @Autowired
    private StatisticalResourcesRestExternalFacade statisticalResourcesRestExternal;

    @Autowired
    private SrmRestExternalFacade                  srmRestExternal;

    @Autowired
    private IndicatorsRestExternalFacade           indicatorsRestExternal;

    @Autowired
    private IndicatorsSystemsRestExternalFacade    indicatorsSystemsRestExternal;

    @Autowired
    private JacksonJsonProvider                    jacksonJsonProvider;

    @Override
    public Response exportDatasetToTsv(PlainTextExportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename) {
        return exportDatasetToPlainText(PlainTextTypeEnum.TSV, exportationBody, agencyID, resourceID, version, lang, filename);
    }

    @Override
    public Response exportDatasetToTsv(String jsonBody, String agencyID, String resourceID, String version, String lang, String filename) {
        PlainTextExportation exportationBody = getPlainTextExportation(jsonBody);
        return exportDatasetToPlainText(PlainTextTypeEnum.TSV, exportationBody, agencyID, resourceID, version, lang, filename);
    }

    @Override
    public Response exportIndicatorToTsv(PlainTextExportation exportationBody, String resourceID, String filename) {
        return exportIndicatorToPlainText(PlainTextTypeEnum.TSV, exportationBody, resourceID, filename);
    }

    @Override
    public Response exportIndicatorToTsv(String jsonBody, String resourceID, String filename) {
        PlainTextExportation exportationBody = getPlainTextExportation(jsonBody);
        return exportIndicatorToPlainText(PlainTextTypeEnum.TSV, exportationBody, resourceID, filename);
    }

    @Override
    public Response exportIndicatorInstanceToTsv(PlainTextExportation exportationBody, String indicatorSystemCode, String resourceID, String filename) {
        return exportIndicatorInstanceToPlainText(PlainTextTypeEnum.TSV, exportationBody, indicatorSystemCode, resourceID, filename);
    }

    @Override
    public Response exportIndicatorInstanceToTsv(String jsonBody, String indicatorSystemCode, String resourceID, String filename) {
        PlainTextExportation exportationBody = getPlainTextExportation(jsonBody);
        return exportIndicatorInstanceToPlainText(PlainTextTypeEnum.TSV, exportationBody, indicatorSystemCode, resourceID, filename);
    }

    @Override
    public Response exportIndicatorToPxForm(String jsonBody, String resourceID, String filename) {
        PxExportation pxExportationBody = getPxExportation(jsonBody);
        return exportIndicatorToPx(pxExportationBody, resourceID, filename);
    }

    @Override
    public Response exportIndicatorInstanceToPx(String jsonBody, String indicatorSystemCode, String resourceID, String filename) {
        PxExportation pxExportationBody = getPxExportation(jsonBody);
        return exportIndicatorInstanceToPx(pxExportationBody, indicatorSystemCode, resourceID, filename);
    }

    private PlainTextExportation getPlainTextExportation(String jsonBody) {
        ObjectMapper objectMapper = jacksonJsonProvider.locateMapper(PlainTextExportation.class, MediaType.APPLICATION_JSON_TYPE);
        try {
            return objectMapper.readValue(jsonBody, PlainTextExportation.class);
        } catch (IOException e) {
            org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.PARAMETER_INCORRECT, RestExternalConstants.PARAMETER_SELECTION);
            throw new RestException(exception, Status.BAD_REQUEST);
        }
    }

    @Override
    public Response exportDatasetToCsvComma(PlainTextExportation exportationBody, String resourceType, String agencyID, String resourceID, String version, String lang, String filename) {
        return exportDatasetToPlainText(PlainTextTypeEnum.CSV_COMMA, exportationBody, agencyID, resourceID, version, lang, filename);
    }

    @Override
    public Response exportDatasetToCsvComma(String jsonBody, String resourceType, String agencyID, String resourceID, String version, String lang, String filename) {
        ObjectMapper objectMapper = jacksonJsonProvider.locateMapper(PlainTextExportation.class, MediaType.APPLICATION_JSON_TYPE);
        try {
            PlainTextExportation tsvExportation = objectMapper.readValue(jsonBody, PlainTextExportation.class);
            return exportDatasetToPlainText(PlainTextTypeEnum.CSV_COMMA, tsvExportation, agencyID, resourceID, version, lang, filename);
        } catch (IOException e) {
            org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.PARAMETER_INCORRECT, RestExternalConstants.PARAMETER_SELECTION);
            throw new RestException(exception, Status.BAD_REQUEST);
        }
    }

    @Override
    public Response exportDatasetToCsvSemicolon(PlainTextExportation exportationBody, String resourceType, String agencyID, String resourceID, String version, String lang, String filename) {
        return exportDatasetToPlainText(PlainTextTypeEnum.CSV_SEMICOLON, exportationBody, agencyID, resourceID, version, lang, filename);
    }

    @Override
    public Response exportDatasetToCsvSemicolon(String jsonBody, String resourceType, String agencyID, String resourceID, String version, String lang, String filename) {
        ObjectMapper objectMapper = jacksonJsonProvider.locateMapper(PlainTextExportation.class, MediaType.APPLICATION_JSON_TYPE);
        try {
            PlainTextExportation tsvExportation = objectMapper.readValue(jsonBody, PlainTextExportation.class);
            return exportDatasetToPlainText(PlainTextTypeEnum.CSV_SEMICOLON, tsvExportation, agencyID, resourceID, version, lang, filename);
        } catch (IOException e) {
            org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.PARAMETER_INCORRECT, RestExternalConstants.PARAMETER_SELECTION);
            throw new RestException(exception, Status.BAD_REQUEST);
        }
    }

    @Override
    public Response exportDatasetToExcel(ExcelExportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename) {

        try {
            // Transform possible selection (not required)
            DatasetSelectionForExcel datasetSelectionForExcel = checkAndTransformSelectionForExcel(exportationBody);
            String dimensionSelection = null;
            if (datasetSelectionForExcel != null) {
                dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(datasetSelectionForExcel.getDimensions());
            }

            Dataset dataset = retrieveDataset(agencyID, resourceID, version, lang, dimensionSelection);

            if (datasetSelectionForExcel == null) {
                datasetSelectionForExcel = DatasetSelectionMapper.datasetToDatasetSelectionForExcel(dataset.getMetadata().getDimensions(), dataset.getMetadata().getAttributes(),
                        dataset.getMetadata().getRelatedDsd());
            }

            if (filename == null) {
                filename = buildFilename(".xlsx", ResourceType.DATASET.getName(), agencyID, resourceID, version);
            }

            return exportDatasetToExcel(dataset, datasetSelectionForExcel, lang, filename);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    @Override
    public Response exportQueryToExcel(ExcelExportation exportationBody, String agencyID, String resourceID, String lang, String filename) {
        try {
            // Transform possible selection (not required)
            DatasetSelectionForExcel datasetSelectionForExcel = checkAndTransformSelectionForExcel(exportationBody);
            String dimensionSelection = null;
            if (datasetSelectionForExcel != null) {
                dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(datasetSelectionForExcel.getDimensions());
            }

            Query query = retrieveDatasetFromQuery(agencyID, resourceID, lang, dimensionSelection);
            Dataset relatedDataset = retrieveDataset(query.getMetadata().getRelatedDataset().getUrn(), lang, dimensionSelection);

            if (datasetSelectionForExcel == null) {
                datasetSelectionForExcel = DatasetSelectionMapper.datasetToDatasetSelectionForExcel(query.getMetadata().getDimensions(), query.getMetadata().getAttributes(),
                        query.getMetadata().getRelatedDsd());
            }

            if (filename == null) {
                filename = buildFilename(".xlsx", ResourceType.QUERY.getName(), agencyID, resourceID);
            }

            return exportQueryToExcel(query, relatedDataset, datasetSelectionForExcel, lang, filename);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    @Override
    public Response exportIndicatorToExcel(ExcelExportation exportationBody, String resourceID, String filename) {

        try {
            // Transform possible selection (not required)
            DatasetSelectionForExcel datasetSelectionForExcel = checkAndTransformSelectionForExcel(exportationBody);
            String dimensionSelection = null;
            if (datasetSelectionForExcel != null) {
                dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(datasetSelectionForExcel.getDimensions());
            }

            Dataset dataset = retrieveDatasetFromIndicator(resourceID, dimensionSelection);

            if (datasetSelectionForExcel == null) {
                datasetSelectionForExcel = DatasetSelectionMapper.datasetToDatasetSelectionForExcel(dataset.getMetadata().getDimensions(), dataset.getMetadata().getAttributes(),
                        dataset.getMetadata().getRelatedDsd());
            }

            if (filename == null) {
                filename = buildFilename(".xlsx", ResourceType.INDICATOR.getName(), resourceID);
            }
            return exportDatasetToExcel(dataset, datasetSelectionForExcel, null, filename);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    @Override
    public Response exportIndicatorInstanceToExcel(ExcelExportation exportationBody, String indicatorSystemCode, String resourceID, String filename) {
        try {
            // Transform possible selection (not required)
            DatasetSelectionForExcel datasetSelectionForExcel = checkAndTransformSelectionForExcel(exportationBody);
            String dimensionSelection = null;
            if (datasetSelectionForExcel != null) {
                dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(datasetSelectionForExcel.getDimensions());
            }

            Dataset dataset = retrieveDatasetFromIndicatorInstance(indicatorSystemCode, resourceID, dimensionSelection);

            if (datasetSelectionForExcel == null) {
                datasetSelectionForExcel = DatasetSelectionMapper.datasetToDatasetSelectionForExcel(dataset.getMetadata().getDimensions(), dataset.getMetadata().getAttributes(),
                        dataset.getMetadata().getRelatedDsd());
            }

            if (filename == null) {
                filename = buildFilename(".xlsx", ResourceType.INDICATOR_INSTANCE.getName(), indicatorSystemCode, resourceID);
            }
            return exportDatasetToExcel(dataset, datasetSelectionForExcel, null, filename);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    private Response exportDatasetToExcel(Dataset dataset, DatasetSelectionForExcel datasetSelectionForExcel, String lang, String filename) {
        try {
            // Export
            final File tmpFile = File.createTempFile("metamac", "xlsx");
            FileOutputStream outputStream = new FileOutputStream(tmpFile);
            exportService.exportDatasetToExcel(SERVICE_CONTEXT, dataset, datasetSelectionForExcel, lang, outputStream);
            outputStream.close();

            return buildResponseOkWithFile(tmpFile, filename, MEDIA_TYPE_APPLICATION_XLSX);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    private Response exportQueryToExcel(Query query, Dataset relatedDataset, DatasetSelectionForExcel datasetSelectionForExcel, String lang, String filename) {
        try {
            // Export
            final File tmpFile = File.createTempFile("metamac", "xlsx");
            FileOutputStream outputStream = new FileOutputStream(tmpFile);
            exportService.exportQueryToExcel(SERVICE_CONTEXT, query, relatedDataset, datasetSelectionForExcel, lang, outputStream);
            outputStream.close();

            return buildResponseOkWithFile(tmpFile, filename, MEDIA_TYPE_APPLICATION_XLSX);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    private DatasetSelectionForPlainText checkAndTransformSelectionForPlainText(PlainTextExportation exportationBody) {
        DatasetSelectionForPlainText datasetSelectionForPlainText = null;
        if (exportationBody != null && exportationBody.getDatasetSelection() != null) {
            try {
                datasetSelectionForPlainText = DatasetSelectionMapper.toDatasetSelectionForPlainText(exportationBody.getDatasetSelection());
            } catch (Exception e) {
                org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.PARAMETER_INCORRECT,
                        RestExternalConstants.PARAMETER_SELECTION);
                throw new RestException(exception, Status.BAD_REQUEST);
            }
        }
        return datasetSelectionForPlainText;
    }
    private DatasetSelectionForExcel checkAndTransformSelectionForExcel(ExcelExportation exportationBody) throws Exception {
        DatasetSelectionForExcel datasetSelectionForExcel = null;
        if (exportationBody != null && exportationBody.getDatasetSelection() != null) {
            try {
                datasetSelectionForExcel = DatasetSelectionMapper.toDatasetSelectionForExcel(exportationBody.getDatasetSelection());
            } catch (Exception e) {
                org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.PARAMETER_INCORRECT,
                        RestExternalConstants.PARAMETER_SELECTION);
                throw new RestException(exception, Status.BAD_REQUEST);
            }
        }
        return datasetSelectionForExcel;
    }

    private String buildFilename(String extension, String... parts) {
        StringBuilder filename = new StringBuilder();
        return filename.append(StringUtils.join(parts, "-")).append(extension).toString();
    }

    @Override
    public Response exportDatasetToExcelForm(String jsonBody, String agencyID, String resourceID, String version, String lang, String filename) {
        ExcelExportation excelExportation = getExcelExportation(jsonBody);
        return exportDatasetToExcel(excelExportation, agencyID, resourceID, version, lang, filename);
    }

    @Override
    public Response exportQueryToExcelForm(String jsonBody, String agencyID, String resourceID, String lang, String filename) {
        ExcelExportation excelExportation = getExcelExportation(jsonBody);
        return exportQueryToExcel(excelExportation, agencyID, resourceID, lang, filename);
    }

    @Override
    public Response exportIndicatorToExcelForm(String jsonBody, String resourceID, String filename) {
        ExcelExportation excelExportation = getExcelExportation(jsonBody);
        return exportIndicatorToExcel(excelExportation, resourceID, filename);
    }

    @Override
    public Response exportIndicatorInstaceToExcelForm(String jsonBody, String indicatorSystemCode, String resourceID, String filename) {
        ExcelExportation excelExportation = getExcelExportation(jsonBody);
        return exportIndicatorInstanceToExcel(excelExportation, indicatorSystemCode, resourceID, filename);
    }

    private ExcelExportation getExcelExportation(String jsonBody) {
        try {
            ObjectMapper objectMapper = jacksonJsonProvider.locateMapper(ExcelExportation.class, MediaType.APPLICATION_JSON_TYPE);
            return objectMapper.readValue(jsonBody, ExcelExportation.class);
        } catch (IOException e) {
            org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.PARAMETER_INCORRECT, RestExternalConstants.PARAMETER_SELECTION);
            throw new RestException(exception, Status.BAD_REQUEST);
        }
    }

    @Override
    public Response exportDatasetToPx(PxExportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename) {
        try {
            // Transform possible selection (not required)
            String dimensionSelection = getDimensionSelectionForPx(exportationBody);

            // Retrieve dataset: In PX-FILE all languages is fetched, the "lang" parameter is ignored
            Dataset dataset = statisticalResourcesRestExternal.retrieveDataset(agencyID, resourceID, version, null, null, dimensionSelection); // all langs

            // If we have a selection, we can´t use the ID on the MATRIX, we need to generate a random one
            if (dimensionSelection != null) {
                dataset.setId(PxExporter.generateMatrixFromString(dimensionSelection));
            }

            if (filename == null) {
                filename = buildFilename(".px", ResourceType.DATASET.getName(), agencyID, resourceID, version);
            }
            return exportResourceToPx(dataset, filename);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    @Override
    public Response exportIndicatorToPx(PxExportation exportationBody, String resourceID, String filename) {
        try {
            // Transform possible selection (not required)
            String dimensionSelection = getDimensionSelectionForPx(exportationBody);

            // Retrieve dataset: In PX-FILE all languages is fetched, the "lang" parameter is ignored
            Dataset dataset = retrieveDatasetFromIndicator(resourceID, dimensionSelection); // all langs

            if (filename == null) {
                filename = buildFilename(".px", ResourceType.INDICATOR.getName(), resourceID);
            }
            return exportResourceToPx(dataset, filename);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    @Override
    public Response exportIndicatorInstanceToPx(PxExportation exportationBody, String indicatorSystemCode, String resourceID, String filename) {
        try {
            // Transform possible selection (not required)
            String dimensionSelection = getDimensionSelectionForPx(exportationBody);

            // Retrieve dataset: In PX-FILE all languages is fetched, the "lang" parameter is ignored
            Dataset dataset = retrieveDatasetFromIndicatorInstance(indicatorSystemCode, resourceID, dimensionSelection); // all langs

            if (filename == null) {
                filename = buildFilename(".px", ResourceType.INDICATOR_INSTANCE.getName(), indicatorSystemCode, resourceID);
            }
            return exportResourceToPx(dataset, filename);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    private Response exportResourceToPx(Dataset dataset, String filename) {
        try {
            // Export
            final File tmpFile = File.createTempFile("metamac", "px");
            FileOutputStream outputStream = new FileOutputStream(tmpFile);
            exportService.exportDatasetToPx(SERVICE_CONTEXT, dataset, null, outputStream); // In PX file, all provided langs are sending
            outputStream.close();

            return buildResponseOkWithFile(tmpFile, filename, MediaType.TEXT_PLAIN);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    private String getDimensionSelectionForPx(PxExportation exportationBody) {
        String dimensionSelection = null;
        if (exportationBody != null && exportationBody.getDatasetSelection() != null) {
            try {
                List<DatasetSelectionDimension> datasetSelectionDimensions = DatasetSelectionMapper.toDatasetSelectionDimensions(exportationBody.getDatasetSelection());
                dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(datasetSelectionDimensions);
            } catch (Exception e) {
                org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.PARAMETER_INCORRECT,
                        RestExternalConstants.PARAMETER_SELECTION);
                throw new RestException(exception, Status.BAD_REQUEST);
            }
        }
        return dimensionSelection;
    }

    @Override
    public Response exportDatasetToPxForm(String jsonBody, String agencyID, String resourceID, String version, String lang, String filename) {
        PxExportation pxExportation = getPxExportation(jsonBody);
        return exportDatasetToPx(pxExportation, agencyID, resourceID, version, lang, filename);
    }

    private PxExportation getPxExportation(String jsonBody) {
        ObjectMapper objectMapper = jacksonJsonProvider.locateMapper(PxExportation.class, MediaType.APPLICATION_JSON_TYPE);
        PxExportation pxExportation = null;
        try {
            pxExportation = objectMapper.readValue(jsonBody, PxExportation.class);
        } catch (IOException e) {
            org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.PARAMETER_INCORRECT, RestExternalConstants.PARAMETER_SELECTION);
            throw new RestException(exception, Status.BAD_REQUEST);
        }
        return pxExportation;
    }

    @Override
    public Response exportSvgToImage(String svg, String filename, Float width, String mimeType) {
        try {
            // Export
            final File tmpFile = File.createTempFile("metamac", "image");
            FileOutputStream outputStream = new FileOutputStream(tmpFile);
            exportService.exportSvgToImage(SERVICE_CONTEXT, svg, width, mimeType, outputStream);
            outputStream.close();

            if (filename == null) {
                filename = "chart";
            }

            filename += SvgExportSupportedMimeType.getFileExtension(mimeType);

            return buildResponseOkWithFile(tmpFile, filename, mimeType);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    @Override
    public Response exportSvgToImageForm(String svg, String filename, Float width, String mimeType) {
        return exportSvgToImage(svg, filename, width, mimeType);
    }

    private Response buildResponseOkWithFile(File file, String filename, String mimeType) throws FileNotFoundException {
        return Response.ok(new DeleteOnCloseFileInputStream(file), mimeType).header("Content-Disposition", "attachment; filename=" + filename).build();
    }

    private Dataset retrieveDataset(String agencyID, String resourceID, String version, String lang, String dimensionSelection) throws MetamacException {
        List<String> langs = new ArrayList<String>();
        String langAlternative = portalConfiguration.retrieveLanguageDefault();
        if (lang != null) {
            langs.add(lang);
        }
        if (!langAlternative.equals(lang)) {
            langs.add(langAlternative);
        }
        return statisticalResourcesRestExternal.retrieveDataset(agencyID, resourceID, version, langs, null, dimensionSelection);
    }

    private Dataset retrieveDataset(String urn, String lang, String dimensionSelection) throws MetamacException {
        String[] urnSplited = UrnUtils.splitUrnStructure(urn);
        String agencyID = urnSplited[0];
        String resourceID = urnSplited[1];
        String version = urnSplited[2];
        return retrieveDataset(agencyID, resourceID, version, lang, dimensionSelection);
    }

    private Dataset retrieveDatasetFromIndicatorInstance(String indicatorSystemCode, String resourceID, String dimensionSelection) {
        String selectedRepresentations = IndicatorsRestExternalMapper.dimensionSelectionToSelectedRepresentations(dimensionSelection);
        DataType indicatorInstanceData = indicatorsSystemsRestExternal.retrieveIndicatorInstanceDataByCode(indicatorSystemCode, resourceID, selectedRepresentations);
        IndicatorInstanceType indicatorInstance = indicatorsSystemsRestExternal.retrieveIndicatorInstanceByCode(indicatorSystemCode, resourceID);
        IndicatorsSystemType indicatorSystem = indicatorsSystemsRestExternal.retrieveIndicatorsSystem(indicatorSystemCode);
        Agency organisation = srmRestExternal.retrieveOrganization();
        return IndicatorsRestExternalMapper.indicatorInstanceToDatasetMapper(indicatorInstance, indicatorInstanceData, organisation, indicatorSystem);
    }

    private Dataset retrieveDatasetFromIndicator(String resourceID, String dimensionSelection) {
        String selectedRepresentations = IndicatorsRestExternalMapper.dimensionSelectionToSelectedRepresentations(dimensionSelection);
        DataType indicatorData = indicatorsRestExternal.retrieveIndicatorData(resourceID, selectedRepresentations);
        IndicatorType indicator = indicatorsRestExternal.retrieveIndicator(resourceID);
        Agency organisation = srmRestExternal.retrieveOrganization();
        return IndicatorsRestExternalMapper.indicatorToDatasetMapper(indicator, indicatorData, organisation);
    }

    private Query retrieveDatasetFromQuery(String agencyID, String resourceID, String lang, String dimensionSelection) throws MetamacException {
        List<String> langs = new ArrayList<String>();
        String langAlternative = portalConfiguration.retrieveLanguageDefault();
        if (lang != null) {
            langs.add(lang);
        }
        if (!langAlternative.equals(lang)) {
            langs.add(langAlternative);
        }
        return statisticalResourcesRestExternal.retrieveQuery(agencyID, resourceID, langs, null, dimensionSelection);
    }

    private File generatePlainTextZip(PlainTextTypeEnum plainTextTypeEnum, File fileObservations, File fileAttributes, String filenamePrefix) throws Exception {

        File zipFile = File.createTempFile("metamac", "zip");
        ZipOutputStream out = new ZipOutputStream(new FileOutputStream(zipFile));

        addToZip(out, fileObservations, filenamePrefix + "-observations." + plainTextTypeEnum.getExtension());
        addToZip(out, fileAttributes, filenamePrefix + "-attributes." + plainTextTypeEnum.getExtension());
        out.close();

        return zipFile;
    }

    private void addToZip(ZipOutputStream zip, File fileToZip, String filenameToZip) throws Exception {
        InputStream in = new FileInputStream(fileToZip);
        zip.putNextEntry(new ZipEntry(filenameToZip));

        // Transfer bytes from the file to the ZIP file
        byte[] buf = new byte[1024];
        int len;
        while ((len = in.read(buf)) > 0) {
            zip.write(buf, 0, len);
        }

        // Complete the entry
        zip.closeEntry();
        in.close();
    }

    private Response exportDatasetToPlainText(PlainTextTypeEnum plainTextTypeEnum, PlainTextExportation exportationBody, String agencyID, String resourceID, String version, String lang,
            String filename) {
        try {
            // Transform possible selection (not required)
            DatasetSelectionForPlainText datasetSelectionForPlainText = checkAndTransformSelectionForPlainText(exportationBody);
            String dimensionSelection = null;
            if (datasetSelectionForPlainText != null) {
                dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(datasetSelectionForPlainText.getDimensions());
            }

            // Retrieve dataset
            Dataset dataset = retrieveDataset(agencyID, resourceID, version, lang, dimensionSelection);

            if (filename == null) {
                filename = buildFilename(".zip", ResourceType.DATASET.getName(), agencyID, resourceID, version);
            }

            return exportResourceToPlainText(plainTextTypeEnum, dataset, datasetSelectionForPlainText, lang, filename);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    private Response exportIndicatorToPlainText(PlainTextTypeEnum plainTextTypeEnum, PlainTextExportation exportationBody, String resourceID, String filename) {
        try {
            // Transform possible selection (not required)
            DatasetSelectionForPlainText datasetSelectionForPlainText = checkAndTransformSelectionForPlainText(exportationBody);
            String dimensionSelection = null;
            if (datasetSelectionForPlainText != null) {
                dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(datasetSelectionForPlainText.getDimensions());
            }

            // Retrieve dataset
            Dataset dataset = retrieveDatasetFromIndicator(resourceID, dimensionSelection);

            if (filename == null) {
                filename = buildFilename(".zip", ResourceType.INDICATOR.getName(), resourceID);
            }

            return exportResourceToPlainText(plainTextTypeEnum, dataset, datasetSelectionForPlainText, null, filename);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    private Response exportIndicatorInstanceToPlainText(PlainTextTypeEnum plainTextTypeEnum, PlainTextExportation exportationBody, String indicatorSystemCode, String resourceID, String filename) {
        try {
            // Transform possible selection (not required)
            DatasetSelectionForPlainText datasetSelectionForPlainText = checkAndTransformSelectionForPlainText(exportationBody);
            String dimensionSelection = null;
            if (datasetSelectionForPlainText != null) {
                dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(datasetSelectionForPlainText.getDimensions());
            }

            // Retrieve dataset
            Dataset dataset = retrieveDatasetFromIndicatorInstance(indicatorSystemCode, resourceID, dimensionSelection);

            if (filename == null) {
                filename = buildFilename(".zip", ResourceType.INDICATOR_INSTANCE.getName(), indicatorSystemCode, resourceID);
            }

            return exportResourceToPlainText(plainTextTypeEnum, dataset, datasetSelectionForPlainText, null, filename);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    private Response exportResourceToPlainText(PlainTextTypeEnum plainTextTypeEnum, Dataset dataset, DatasetSelectionForPlainText datasetSelectionForPlainText, String lang, String filename) {
        try {
            // Export
            final File tmpFileObservations = File.createTempFile("metamac", plainTextTypeEnum.getExtension());
            final File tmpFileAttributes = File.createTempFile("metamac", plainTextTypeEnum.getExtension());
            FileOutputStream outputStreamObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outputStreamAttributes = new FileOutputStream(tmpFileAttributes);

            String mimeType = MediaType.TEXT_PLAIN;

            switch (plainTextTypeEnum) {
                case TSV:
                    exportService.exportDatasetToTsv(SERVICE_CONTEXT, dataset, datasetSelectionForPlainText, lang, outputStreamObservations, outputStreamAttributes);
                    mimeType = MEDIA_TYPE_TEXT_TAB_SEPARATED_VALUES;
                    break;
                case CSV_COMMA:
                    exportService.exportDatasetToCsvCommaSeparated(SERVICE_CONTEXT, dataset, datasetSelectionForPlainText, lang, outputStreamObservations, outputStreamAttributes);
                    mimeType = MEDIA_TYPE_TEXT_CSV;
                    break;
                case CSV_SEMICOLON:
                    exportService.exportDatasetToCsvSemicolonSeparated(SERVICE_CONTEXT, dataset, datasetSelectionForPlainText, lang, outputStreamObservations, outputStreamAttributes);
                    mimeType = MEDIA_TYPE_TEXT_CSV;
                    break;
                default:
                    break;
            }

            outputStreamObservations.close();
            outputStreamAttributes.close();
            String filenamePrefix = FilenameUtils.getBaseName(filename);
            File plainTextZip = generatePlainTextZip(plainTextTypeEnum, tmpFileObservations, tmpFileAttributes, filenamePrefix);
            return buildResponseOkWithFile(plainTextZip, filename, mimeType);

        } catch (Exception e) {
            throw manageException(e);
        }
    }

}