package org.siemac.metamac.portal.core.serviceimpl.validators;

import static org.siemac.metamac.core.common.serviceimpl.utils.ValidationUtils.checkMetadataRequired;

import java.io.OutputStream;
import java.util.List;

import org.siemac.metamac.core.common.exception.MetamacExceptionItem;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.error.ServiceExceptionParameters;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;

public class ExportServiceInvocationValidatorImpl extends BaseInvocationValidator {

    public static void checkExportDatasetToExcel(Dataset dataset, DatasetSelection datasetSelection, String lang, OutputStream resultOutputStream, List<MetamacExceptionItem> exceptions) {
        checkMetadataRequired(dataset, ServiceExceptionParameters.DATASET, exceptions);
        checkMetadataRequired(datasetSelection, ServiceExceptionParameters.DATASET_SELECTION, exceptions);
        checkMetadataRequired(resultOutputStream, ServiceExceptionParameters.STREAM, exceptions);
        checkMetadataRequired(lang, ServiceExceptionParameters.LANG, exceptions);
    }

    public static void checkExportDatasetToTsv(Dataset dataset, OutputStream resultOutputStream, List<MetamacExceptionItem> exceptions) {
        checkMetadataRequired(dataset, ServiceExceptionParameters.DATASET, exceptions);
        checkMetadataRequired(resultOutputStream, ServiceExceptionParameters.STREAM, exceptions);
    }

    public static void checkExportSvgToImage(String svg, Float width, String mimeType, OutputStream resultOutputStream, List<MetamacExceptionItem> exceptions) {
        checkMetadataRequired(resultOutputStream, ServiceExceptionParameters.STREAM, exceptions);
        checkMetadataRequired(svg, ServiceExceptionParameters.SVG, exceptions);
        // width, mimeType optional
    }
}
