package org.siemac.metamac.portal.core.serviceimpl.validators;

import java.io.OutputStream;
import java.util.List;

import org.siemac.metamac.core.common.exception.MetamacExceptionItem;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;

public class ExportServiceInvocationValidatorImpl extends BaseInvocationValidator {

    public static void checkExportDatasetToExcel(Dataset dataset, DatasetSelection datasetSelection, OutputStream resultOutputStream, List<MetamacExceptionItem> exceptions) {
        // TODO checkExportDatasetToExcel
    }

}
