package org.siemac.metamac.portal.web.services;


import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.siemac.metamac.portal.web.model.DatasetDataAccess;
import org.siemac.metamac.portal.web.model.DatasetSelection;
import org.siemac.metamac.portal.web.model.DatasetSelectionDimension;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.Map;

@Service
public class ExcelExportService {

    public static final int ROW_ACCESS_WINDOW_SIZE = 100;

    public void exportDatasetToExcel(Dataset dataset, DatasetSelection datasetSelection, OutputStream resultOutputStream) throws Exception {

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
                Map<String,String> permutationAtCell = datasetSelection.permutationAtCell(i, j);
                Double observation = datasetDataAccess.observationAtPermutation(permutationAtCell);
                if (observation != null) {
                    Cell cell = row.createCell(leftHeaderSize + j);
                    cell.setCellValue(observation);
                }
            }

            //LeftHeader
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
            throw new Exception("Error writing excel to OutputStream");
        }

        // dispose of temporary files backing this workbook on disk
        wb.dispose();
    }



}
