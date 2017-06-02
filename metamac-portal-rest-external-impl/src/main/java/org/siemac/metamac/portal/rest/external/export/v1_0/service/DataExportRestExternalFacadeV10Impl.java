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

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.io.FilenameUtils;
import org.codehaus.jackson.jaxrs.JacksonJsonProvider;
import org.codehaus.jackson.map.ObjectMapper;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.core.common.io.DeleteOnCloseFileInputStream;
import org.siemac.metamac.portal.core.conf.PortalConfiguration;
import org.siemac.metamac.portal.core.domain.DatasetSelectionDimension;
import org.siemac.metamac.portal.core.domain.DatasetSelectionForExcel;
import org.siemac.metamac.portal.core.domain.DatasetSelectionForPlainText;
import org.siemac.metamac.portal.core.enume.PlainTextTypeEnum;
import org.siemac.metamac.portal.core.exporters.SvgExportSupportedMimeType;
import org.siemac.metamac.portal.core.invocation.StatisticalResourcesRestExternalFacade;
import org.siemac.metamac.portal.core.serviceapi.ExportService;
import org.siemac.metamac.portal.rest.external.RestExternalConstants;
import org.siemac.metamac.portal.rest.external.exception.RestServiceExceptionType;
import org.siemac.metamac.portal.rest.external.export.v1_0.mapper.DatasetSelectionMapper;
import org.siemac.metamac.rest.exception.RestException;
import org.siemac.metamac.rest.exception.utils.RestExceptionUtils;
import org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection;
import org.siemac.metamac.rest.export.v1_0.domain.ExcelExportation;
import org.siemac.metamac.rest.export.v1_0.domain.PlainTextExportation;
import org.siemac.metamac.rest.export.v1_0.domain.PxExportation;
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

    @Autowired
    private JacksonJsonProvider                    jacksonJsonProvider;

    @Override
    public Response exportDatasetToTsv(PlainTextExportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename) {
        return exportDatasetToPlainText(PlainTextTypeEnum.TSV, exportationBody, agencyID, resourceID, version, lang, filename);
    }

    @Override
    public Response exportDatasetToTsv(String jsonBody, String agencyID, String resourceID, String version, String lang, String filename) {
        ObjectMapper objectMapper = jacksonJsonProvider.locateMapper(PlainTextExportation.class, MediaType.APPLICATION_JSON_TYPE);
        try {
            PlainTextExportation tsvExportation = objectMapper.readValue(jsonBody, PlainTextExportation.class);
            return exportDatasetToPlainText(PlainTextTypeEnum.TSV, tsvExportation, agencyID, resourceID, version, lang, filename);
        } catch (IOException e) {
            org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.PARAMETER_INCORRECT, RestExternalConstants.PARAMETER_SELECTION);
            throw new RestException(exception, Status.BAD_REQUEST);
        }
    }

    @Override
    public Response exportDatasetToCsvComma(PlainTextExportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename) {
        return exportDatasetToPlainText(PlainTextTypeEnum.CSV_COMMA, exportationBody, agencyID, resourceID, version, lang, filename);
    }

    @Override
    public Response exportDatasetToCsvComma(String jsonBody, String agencyID, String resourceID, String version, String lang, String filename) {
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
    public Response exportDatasetToCsvSemicolon(PlainTextExportation exportationBody, String agencyID, String resourceID, String version, String lang, String filename) {
        return exportDatasetToPlainText(PlainTextTypeEnum.CSV_SEMICOLON, exportationBody, agencyID, resourceID, version, lang, filename);
    }

    @Override
    public Response exportDatasetToCsvSemicolon(String jsonBody, String agencyID, String resourceID, String version, String lang, String filename) {
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
    public Response exportDatasetToExcelForm(String jsonBody, String agencyID, String resourceID, String version, String lang, String filename) {
        ObjectMapper objectMapper = jacksonJsonProvider.locateMapper(ExcelExportation.class, MediaType.APPLICATION_JSON_TYPE);
        try {
            ExcelExportation excelExportation = objectMapper.readValue(jsonBody, ExcelExportation.class);
            return exportDatasetToExcel(excelExportation, agencyID, resourceID, version, lang, filename);
        } catch (IOException e) {
            org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.PARAMETER_INCORRECT, RestExternalConstants.PARAMETER_SELECTION);
            throw new RestException(exception, Status.BAD_REQUEST);
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

            // Retrieve dataset: In PX-FILE all languages is fetched, the "lang" parameter is ignored
            Dataset dataset = statisticalResourcesRestExternal.retrieveDataset(agencyID, resourceID, version, null, null, dimensionSelection); // all langs
            
            // Export
            final File tmpFile = File.createTempFile("metamac", "px");
            FileOutputStream outputStream = new FileOutputStream(tmpFile);
            exportService.exportDatasetToPx(SERVICE_CONTEXT, dataset, null, outputStream); // In PX file, all provided langs are sending
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
    public Response exportDatasetToPxForm(String jsonBody, String agencyID, String resourceID, String version, String lang, String filename) {
        ObjectMapper objectMapper = jacksonJsonProvider.locateMapper(PxExportation.class, MediaType.APPLICATION_JSON_TYPE);
        try {
            PxExportation pxExportation = objectMapper.readValue(jsonBody, PxExportation.class);
            return exportDatasetToPx(pxExportation, agencyID, resourceID, version, lang, filename);
        } catch (IOException e) {
            org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.PARAMETER_INCORRECT, RestExternalConstants.PARAMETER_SELECTION);
            throw new RestException(exception, Status.BAD_REQUEST);
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

            filename += SvgExportSupportedMimeType.getFileExtension(mimeType);

            return buildResponseOkWithFile(tmpFile, filename);
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    @Override
    public Response exportSvgToImageForm(String svg, String filename, Float width, String mimeType) {
        return exportSvgToImage(svg, filename, width, mimeType);
    }

    private Response buildResponseOkWithFile(File file, String filename) throws FileNotFoundException {
        return Response.ok(new DeleteOnCloseFileInputStream(file)).header("Content-Disposition", "attachment; filename=" + filename).build();
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

    private boolean isEmpty(DatasetSelection datasetSelection) {
        return datasetSelection == null || datasetSelection.getDimensions() == null || CollectionUtils.isEmpty(datasetSelection.getDimensions().getDimensions());
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
            DatasetSelectionForPlainText datasetSelectionForPlainText = null;
            String dimensionSelection = null;
            if (exportationBody != null && exportationBody.getDatasetSelection() != null) {
                try {
                    datasetSelectionForPlainText = DatasetSelectionMapper.toDatasetSelectionForPlainText(exportationBody.getDatasetSelection());
                    dimensionSelection = DatasetSelectionMapper.toStatisticalResourcesApiDimsParameter(datasetSelectionForPlainText.getDimensions());
                } catch (Exception e) {
                    org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.PARAMETER_INCORRECT,
                            RestExternalConstants.PARAMETER_SELECTION);
                    throw new RestException(exception, Status.BAD_REQUEST);
                }
            }

            // Retrieve dataset
            Dataset dataset = retrieveDataset(agencyID, resourceID, version, lang, dimensionSelection);

            // Export
            final File tmpFileObservations = File.createTempFile("metamac", plainTextTypeEnum.getExtension());
            final File tmpFileAttributes = File.createTempFile("metamac", plainTextTypeEnum.getExtension());
            FileOutputStream outputStreamObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outputStreamAttributes = new FileOutputStream(tmpFileAttributes);

            switch (plainTextTypeEnum) {
                case TSV:
                    exportService.exportDatasetToTsv(SERVICE_CONTEXT, dataset, datasetSelectionForPlainText, lang, outputStreamObservations, outputStreamAttributes);
                    break;
                case CSV_COMMA:
                    exportService.exportDatasetToCsvCommaSeparated(SERVICE_CONTEXT, dataset, datasetSelectionForPlainText, lang, outputStreamObservations, outputStreamAttributes);
                    break;
                case CSV_SEMICOLON:
                    exportService.exportDatasetToCsvSemicolonSeparated(SERVICE_CONTEXT, dataset, datasetSelectionForPlainText, lang, outputStreamObservations, outputStreamAttributes);
                    break;
                default:
                    break;
            }

            outputStreamObservations.close();
            outputStreamAttributes.close();

            String filenamePrefix = null;
            if (filename != null) {
                filenamePrefix = FilenameUtils.getBaseName(filename);
            } else {
                filenamePrefix = "dataset-" + agencyID + "-" + resourceID + "-" + version;
                filename = filenamePrefix;
            }
            File plainTextZip = generatePlainTextZip(plainTextTypeEnum, tmpFileObservations, tmpFileAttributes, filenamePrefix);
            return buildResponseOkWithFile(plainTextZip, filename + ".zip");
        } catch (Exception e) {
            throw manageException(e);
        }
    }

}