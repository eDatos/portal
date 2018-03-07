package org.siemac.metamac.portal.core.serviceimpl.validators;

import static org.siemac.metamac.core.common.serviceimpl.utils.ValidationUtils.checkMetadataRequired;

import java.io.OutputStream;
import java.util.List;

import org.siemac.metamac.core.common.exception.MetamacExceptionItem;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.domain.DatasetSelectionForExcel;
import org.siemac.metamac.portal.core.domain.DatasetSelectionForPlainText;
import org.siemac.metamac.portal.core.error.ServiceExceptionParameters;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Query;

public class ExportServiceInvocationValidatorImpl extends BaseInvocationValidator {

    public static void checkExportDatasetToExcel(Dataset dataset, DatasetSelection datasetSelection, String lang, OutputStream resultOutputStream, List<MetamacExceptionItem> exceptions) {
        checkMetadataRequired(dataset, ServiceExceptionParameters.DATASET, exceptions);
        checkMetadataRequired(datasetSelection, ServiceExceptionParameters.DATASET_SELECTION, exceptions);
        checkMetadataRequired(resultOutputStream, ServiceExceptionParameters.STREAM, exceptions);
    }

    public static void checkExportQueryToExcel(Query query, Dataset relatedDataset, DatasetSelectionForExcel datasetSelection, String lang, OutputStream resultOutputStream,
            List<MetamacExceptionItem> exceptions) {
        checkMetadataRequired(query, ServiceExceptionParameters.QUERY, exceptions);
        checkMetadataRequired(relatedDataset, ServiceExceptionParameters.DATASET, exceptions);
        checkMetadataRequired(datasetSelection, ServiceExceptionParameters.DATASET_SELECTION, exceptions);
        checkMetadataRequired(resultOutputStream, ServiceExceptionParameters.STREAM, exceptions);
    }

    public static void checkExportDatasetToTsv(Dataset dataset, DatasetSelection datasetSelection, String lang, OutputStream resultObservationsOutputStream, OutputStream resultAttributesOutputStream,
            List<MetamacExceptionItem> exceptions) {
        checkExportDatasetToPlainText(dataset, resultObservationsOutputStream, resultAttributesOutputStream, exceptions);
    }

    public static void checkExportDatasetToCsvCommaSeparated(Dataset dataset, DatasetSelectionForPlainText datasetSelection, String lang, OutputStream resultObservationsOutputStream,
            OutputStream resultAttributesOutputStream, List<MetamacExceptionItem> exceptions) {
        checkExportDatasetToPlainText(dataset, resultObservationsOutputStream, resultAttributesOutputStream, exceptions);
    }

    public static void checkExportDatasetToCsvSemicolonSeparated(Dataset dataset, DatasetSelectionForPlainText datasetSelection, String lang, OutputStream resultObservationsOutputStream,
            OutputStream resultAttributesOutputStream, List<MetamacExceptionItem> exceptions) {
        checkExportDatasetToPlainText(dataset, resultObservationsOutputStream, resultAttributesOutputStream, exceptions);
    }

    public static void checkExportDatasetToPx(Dataset dataset, String lang, OutputStream resultOutputStream, List<MetamacExceptionItem> exceptions) {
        checkMetadataRequired(dataset, ServiceExceptionParameters.DATASET, exceptions);
        checkMetadataRequired(resultOutputStream, ServiceExceptionParameters.STREAM, exceptions);
    }

    public static void checkExportSvgToImage(String svg, Float width, String mimeType, OutputStream resultOutputStream, List<MetamacExceptionItem> exceptions) {
        checkMetadataRequired(resultOutputStream, ServiceExceptionParameters.STREAM, exceptions);
        checkMetadataRequired(svg, ServiceExceptionParameters.SVG, exceptions);
        // width, mimeType optional
    }

    private static void checkExportDatasetToPlainText(Dataset dataset, OutputStream resultObservationsOutputStream, OutputStream resultAttributesOutputStream, List<MetamacExceptionItem> exceptions) {
        checkMetadataRequired(dataset, ServiceExceptionParameters.DATASET, exceptions);
        checkMetadataRequired(resultObservationsOutputStream, ServiceExceptionParameters.STREAM, exceptions);
        checkMetadataRequired(resultAttributesOutputStream, ServiceExceptionParameters.STREAM, exceptions);
    }

}
