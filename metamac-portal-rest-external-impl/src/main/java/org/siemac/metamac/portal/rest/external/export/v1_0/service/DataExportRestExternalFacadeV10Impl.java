package org.siemac.metamac.portal.rest.external.export.v1_0.service;

import static org.siemac.metamac.portal.rest.external.RestExternalConstantsPrivate.SERVICE_CONTEXT;
import static org.siemac.metamac.portal.rest.external.service.utils.PortalRestExternalUtils.manageException;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.io.FilenameUtils;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.core.common.io.DeleteOnCloseFileInputStream;
import org.siemac.metamac.portal.core.conf.PortalConfiguration;
import org.siemac.metamac.portal.core.domain.DatasetSelectionDimension;
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
import org.siemac.metamac.rest.export.v1_0.domain.PxExportation;
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
            if (exportationBody != null && exportationBody.getDatasetSelection() != null) {
                try {
                    datasetSelectionForTsv = DatasetSelectionMapper.toDatasetSelectionForTsv(exportationBody.getDatasetSelection());
                    dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(datasetSelectionForTsv.getDimensions());
                } catch (Exception e) {
                    org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.PARAMETER_INCORRECT,
                            RestExternalConstants.PARAMETER_SELECTION);
                    throw new RestException(exception, Status.BAD_REQUEST);
                }
            }

            // Retrieve dataset
            Dataset dataset = retrieveDataset(agencyID, resourceID, version, lang, dimensionSelection);

            // Export
            final File tmpFileObservations = File.createTempFile("metamac", "tsv");
            final File tmpFileAttributes = File.createTempFile("metamac", "tsv");
            FileOutputStream outputStreamObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outputStreamAttributes = new FileOutputStream(tmpFileAttributes);
            exportService.exportDatasetToTsv(SERVICE_CONTEXT, dataset, datasetSelectionForTsv, lang, outputStreamObservations, outputStreamAttributes);
            outputStreamObservations.close();
            outputStreamAttributes.close();

            String filenamePrefix = null;
            if (filename != null) {
                filenamePrefix = FilenameUtils.getBaseName(filename);
            } else {
                filenamePrefix = "dataset-" + agencyID + "-" + resourceID + "-" + version;
            }
            File tsvZip = generateTsvZip(tmpFileObservations, tmpFileAttributes, filename);
            return buildResponseOkWithFile(tsvZip, filename + ".zip");
        } catch (Exception e) {
            throw manageException(e);
        }
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
                dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(datasetSelectionForExcel.getDimensions());
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
    public Response exportDatasetToPx(PxExportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename) {
        try {
            // Transform possible selection (not required)
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

            // Retrieve dataset
            Dataset dataset = retrieveDataset(agencyID, resourceID, version, lang, dimensionSelection);

            // Export
            final File tmpFile = File.createTempFile("metamac", "px");
            FileOutputStream outputStream = new FileOutputStream(tmpFile);
            exportService.exportDatasetToPx(SERVICE_CONTEXT, dataset, lang, outputStream);
            outputStream.close();

            if (filename == null) {
                filename = "dataset-" + agencyID + "-" + resourceID + "-" + version + ".px";
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

    private boolean isEmpty(DatasetSelection datasetSelection) {
        return datasetSelection == null || datasetSelection.getDimensions() == null || CollectionUtils.isEmpty(datasetSelection.getDimensions().getDimensions());
    }

    private File generateTsvZip(File fileObservations, File fileAttributes, String filenamePrefix) throws Exception {

        File zipFile = File.createTempFile("metamac", "zip");
        ZipOutputStream out = new ZipOutputStream(new FileOutputStream(zipFile));

        addToZip(out, fileObservations, filenamePrefix + "-observations.tsv");
        addToZip(out, fileAttributes, filenamePrefix + "-attributes.tsv");
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
}