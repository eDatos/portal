package org.siemac.metamac.portal.core.serviceimpl;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.domain.DatasetDataAccess;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.domain.DatasetSelectionDimension;
import org.siemac.metamac.portal.core.error.ServiceExceptionType;
import org.siemac.metamac.portal.core.serviceapi.validators.ExportServiceInvocationValidator;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("exportService")
public class ExportServiceImpl extends ExportServiceImplBase {

    public static final int                  ROW_ACCESS_WINDOW_SIZE = 100;

    @Autowired
    private ExportServiceInvocationValidator exportServiceInvocationValidator;

    @Override
    public void exportDatasetToExcel(ServiceContext ctx, Dataset dataset, DatasetSelection datasetSelection, OutputStream resultOutputStream) throws MetamacException {

        exportServiceInvocationValidator.checkExportDatasetToExcel(ctx, dataset, datasetSelection, resultOutputStream);

        DatasetDataAccess datasetDataAccess = new DatasetDataAccess(dataset);

        int rows = datasetSelection.getRows();
        int columns = datasetSelection.getColumns();

        SXSSFWorkbook wb = new SXSSFWorkbook(ROW_ACCESS_WINDOW_SIZE);
        Sheet sh = wb.createSheet();

        int leftHeaderSize = datasetSelection.getLeftDimensions().size();

        // Top header
        int headerRow = 0;
        for (DatasetSelectionDimension dimension : datasetSelection.getTopDimensions()) {
            Row row = sh.createRow(headerRow);
            List<String> selectedCategories = dimension.getSelectedCategories();
            int headerColumn = leftHeaderSize;
            int multiplier = datasetSelection.getMultiplierForDimension(dimension);
            int repeat = columns / (multiplier * selectedCategories.size());
            for (int i = 0; i < repeat; i++) {
                for (String selectedCategory : selectedCategories) {
                    Cell cell = row.createCell(headerColumn);
                    cell.setCellValue(selectedCategory);
                    headerColumn += multiplier;
                }
            }
            headerRow++;
        }
        int topHeaderSize = headerRow;

        // Observations and left header
        int observationsStartRow = topHeaderSize;
        List<DatasetSelectionDimension> leftDimensions = datasetSelection.getLeftDimensions();
        for (int i = 0; i < rows; i++) {
            Row row = sh.createRow(observationsStartRow + i);
            for (int j = 0; j < columns; j++) {
                Map<String, String> permutationAtCell = datasetSelection.permutationAtCell(i, j);
                Double observation = datasetDataAccess.observationAtPermutation(permutationAtCell);
                if (observation != null) {
                    Cell cell = row.createCell(leftHeaderSize + j);
                    cell.setCellValue(observation);
                }
            }

            // LeftHeader
            for (int leftDimensionIndex = 0; leftDimensionIndex < leftDimensions.size(); leftDimensionIndex++) {
                DatasetSelectionDimension dimension = leftDimensions.get(leftDimensionIndex);
                int multiplier = datasetSelection.getMultiplierForDimension(dimension);
                if (i % multiplier == 0) {
                    String categoryId = dimension.getSelectedCategories().get((i / multiplier) % dimension.getSelectedCategories().size());
                    Cell cell = row.createCell(leftDimensionIndex);
                    cell.setCellValue(categoryId);
                }
            }
        }

        try {
            wb.write(resultOutputStream);
        } catch (IOException e) {
            throw new MetamacException(e, ServiceExceptionType.UNKNOWN, "Error writing excel to OutputStream");
        }

        // dispose of temporary files backing this workbook on disk
        wb.dispose();
    }

}
