package org.siemac.metamac.portal.rest.external.export.v1_0.service;

import static org.siemac.metamac.portal.rest.external.RestExternalConstantsPrivate.SERVICE_CONTEXT;
import static org.siemac.metamac.portal.rest.external.service.utils.PortalRestExternalUtils.manageException;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.util.Arrays;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.collections.CollectionUtils;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.core.common.io.DeleteOnCloseFileInputStream;
import org.siemac.metamac.portal.core.conf.PortalConfiguration;
import org.siemac.metamac.portal.core.domain.DatasetSelectionForExcel;
import org.siemac.metamac.portal.core.domain.DatasetSelectionForTsv;
import org.siemac.metamac.portal.core.serviceapi.ExportService;
import org.siemac.metamac.portal.rest.external.RestExternalConstants;
import org.siemac.metamac.portal.rest.external.exception.RestServiceExceptionType;
import org.siemac.metamac.portal.rest.external.export.v1_0.mapper.DatasetSelectionMapper;
import org.siemac.metamac.portal.rest.external.invocation.StatisticalResourcesRestExternalFacade;
import org.siemac.metamac.rest.exception.RestException;
import org.siemac.metamac.rest.exception.utils.RestExceptionUtils;
import org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection;
import org.siemac.metamac.rest.export.v1_0.domain.ExcelExportation;
import org.siemac.metamac.rest.export.v1_0.domain.TsvExportation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("dataExportRestExternalFacadeV10")
public class DataExportRestExternalFacadeV10Impl implements DataExportV1_0 {

    @Autowired
    private ExportService                          exportService;

    @Autowired
    private PortalConfiguration                    portalConfiguration;

    @Autowired
    private StatisticalResourcesRestExternalFacade statisticalResourcesRestExternal;

    @Override
    public Response exportDatasetToTsv(TsvExportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename) {
        try {
            // Transform possible selection (not required)
            DatasetSelectionForTsv datasetSelectionForTsv = null;
            String dimensionSelection = null;
            try {
                datasetSelectionForTsv = DatasetSelectionMapper.toDatasetSelectionForTsv(exportationBody.getDatasetSelection());
                dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(datasetSelectionForTsv);
            } catch (Exception e) {
                org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.PARAMETER_INCORRECT,
                        RestExternalConstants.PARAMETER_SELECTION);
                throw new RestException(exception, Status.BAD_REQUEST);
            }

            // Retrieve dataset
            Dataset dataset = retrieveDataset(agencyID, resourceID, version, lang, dimensionSelection);

            // Export
            final File tmpFile = File.createTempFile("metamac", "tsv");
            FileOutputStream outputStream = new FileOutputStream(tmpFile);
            exportService.exportDatasetToTsv(SERVICE_CONTEXT, dataset, datasetSelectionForTsv, lang, outputStream);
            outputStream.close();

            if (filename == null) {
                filename = "dataset-" + agencyID + "-" + resourceID + "-" + version + ".tsv";
            }
            return buildResponseOkWithFile(tmpFile, filename);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    private boolean isEmpty(DatasetSelection datasetSelection) {
        return datasetSelection == null || datasetSelection.getDimensions() == null || CollectionUtils.isEmpty(datasetSelection.getDimensions().getDimensions());
    }

    @Override
    public Response exportDatasetToExcel(ExcelExportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename) {
        try {
            // Check and transform selection
            if (exportationBody == null || isEmpty(exportationBody.getDatasetSelection())) {
                org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils
                        .getException(RestServiceExceptionType.PARAMETER_REQUIRED, RestExternalConstants.PARAMETER_SELECTION);
                throw new RestException(exception, Status.BAD_REQUEST);
            }
            DatasetSelectionForExcel datasetSelectionForExcel = null;
            String dimensionSelection = null;
            try {
                datasetSelectionForExcel = DatasetSelectionMapper.toDatasetSelectionForExcel(exportationBody.getDatasetSelection());
                dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(datasetSelectionForExcel);
            } catch (Exception e) {
                org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.PARAMETER_INCORRECT,
                        RestExternalConstants.PARAMETER_SELECTION);
                throw new RestException(exception, Status.BAD_REQUEST);
            }

            // Retrieve dataset
            Dataset dataset = retrieveDataset(agencyID, resourceID, version, lang, dimensionSelection);

            // Export
            final File tmpFile = File.createTempFile("metamac", "xlsx");
            FileOutputStream outputStream = new FileOutputStream(tmpFile);
            exportService.exportDatasetToExcel(SERVICE_CONTEXT, dataset, datasetSelectionForExcel, lang, outputStream);
            outputStream.close();

            if (filename == null) {
                filename = "dataset-" + agencyID + "-" + resourceID + "-" + version + ".xlsx";
            }
            return buildResponseOkWithFile(tmpFile, filename);
        } catch (Exception e) {
            throw manageException(e);
        }
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
            return buildResponseOkWithFile(tmpFile, filename);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    private Response buildResponseOkWithFile(File file, String filename) throws FileNotFoundException {
        return Response.ok(new DeleteOnCloseFileInputStream(file)).header("Content-Disposition", "attachment; filename=" + filename).build();
    }

    private Dataset retrieveDataset(String agencyID, String resourceID, String version, String lang, String dimensionSelection) throws MetamacException {
        String langAlternative = portalConfiguration.retrieveLanguageDefault();
        return statisticalResourcesRestExternal.retrieveDataset(agencyID, resourceID, version, Arrays.asList(lang, langAlternative), null, dimensionSelection);
    }
}