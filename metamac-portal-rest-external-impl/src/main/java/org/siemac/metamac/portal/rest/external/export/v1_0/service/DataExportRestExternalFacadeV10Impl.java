package org.siemac.metamac.portal.rest.external.export.v1_0.service;

import static org.siemac.metamac.portal.rest.external.RestExternalConstantsPrivate.SERVICE_CONTEXT;
import static org.siemac.metamac.portal.rest.external.service.utils.PortalRestExternalUtils.manageException;

import java.io.File;
import java.io.FileOutputStream;
import java.util.List;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang.StringUtils;
import org.siemac.metamac.core.common.io.DeleteOnCloseFileInputStream;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.serviceapi.ExportService;
import org.siemac.metamac.portal.rest.external.RestExternalConstants;
import org.siemac.metamac.portal.rest.external.exception.RestServiceExceptionType;
import org.siemac.metamac.portal.rest.external.invocation.StatisticalResourcesRestExternalFacade;
import org.siemac.metamac.rest.exception.RestException;
import org.siemac.metamac.rest.exception.utils.RestExceptionUtils;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.statistical_resources.rest.common.StatisticalResourcesRestConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("dataExportRestExternalFacadeV10")
public class DataExportRestExternalFacadeV10Impl implements DataExportV1_0 {

    @Autowired
    private ExportService                          exportService;

    @Autowired
    private StatisticalResourcesRestExternalFacade statisticalResourcesRestExternal;

    @Override
    public Response exportDatasetToTsv(String agencyID, String resourceID, String version, String dimensionSelection) {
        try {
            // Retrieve dataset
            final Dataset dataset = statisticalResourcesRestExternal.retrieveDataset(agencyID, resourceID, version, null, StatisticalResourcesRestConstants.FIELD_EXCLUDE_METADATA, dimensionSelection);

            // Export
            final File tmpFile = File.createTempFile("dataset", "tsv");
            FileOutputStream outputStream = new FileOutputStream(tmpFile);
            exportService.exportDatasetToTsv(SERVICE_CONTEXT, dataset, outputStream);
            outputStream.close();

            final String filename = "dataset-" + agencyID + "-" + resourceID + "-" + version + ".tsv";
            return Response.ok(new DeleteOnCloseFileInputStream(tmpFile)).header("Content-Disposition", "attachment; filename=" + filename).build();
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    @Override
    public Response exportDatasetToExcel(String agencyID, String resourceID, String version, List<String> lang, String datasetSelectionJson) {
        try {
            // Check and transform selection
            if (StringUtils.isEmpty(datasetSelectionJson)) {
                org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils
                        .getException(RestServiceExceptionType.PARAMETER_REQUIRED, RestExternalConstants.PARAMETER_SELECTION);
                throw new RestException(exception, Status.BAD_REQUEST);

            }
            DatasetSelection datasetSelection = null;
            String dimensionSelection = null;
            try {
                datasetSelection = DatasetSelectionMapper.fromJSON(datasetSelectionJson);
                dimensionSelection = DatasetSelectionMapper.getDimsParameter(datasetSelection);
            } catch (Exception e) {
                org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.PARAMETER_INCORRECT,
                        RestExternalConstants.PARAMETER_SELECTION);
                throw new RestException(exception, Status.BAD_REQUEST);
            }

            // Retrieve dataset
            final Dataset dataset = statisticalResourcesRestExternal.retrieveDataset(agencyID, resourceID, version, null, null, dimensionSelection);

            // Export
            final File tmpFile = File.createTempFile("dataset", "xlsx");
            FileOutputStream outputStream = new FileOutputStream(tmpFile);
            exportService.exportDatasetToExcel(SERVICE_CONTEXT, dataset, datasetSelection, outputStream);
            outputStream.close();

            final String filename = "dataset-" + agencyID + "-" + resourceID + "-" + version + ".xlsx";
            return Response.ok(new DeleteOnCloseFileInputStream(tmpFile)).header("Content-Disposition", "attachment; filename=" + filename).build();
        } catch (Exception e) {
            throw manageException(e);
        }
    }

}