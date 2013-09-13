package org.siemac.metamac.portal.core.serviceimpl;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.domain.DatasetAccess;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.domain.DatasetSelectionDimension;
import org.siemac.metamac.portal.core.error.ServiceExceptionType;
import org.siemac.metamac.portal.core.serviceapi.validators.ExportServiceInvocationValidator;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.Map;

@Service("exportService")
public class ExportServiceImpl extends ExportServiceImplBase {

    public static final int ROW_ACCESS_WINDOW_SIZE = 100;

    @Autowired
    private ExportServiceInvocationValidator exportServiceInvocationValidator;

    @Override
    public void exportDatasetToExcel(ServiceContext ctx, Dataset dataset, DatasetSelection datasetSelection, OutputStream resultOutputStream) throws MetamacException {
        exportServiceInvocationValidator.checkExportDatasetToExcel(ctx, dataset, datasetSelection, resultOutputStream);
        ExcelExporter excelExport = new ExcelExporter(dataset, datasetSelection);
        excelExport.write(resultOutputStream);
    }

    private class ExcelExporter {
        private DatasetAccess datasetAccess;
        private DatasetSelection datasetSelection;
        private Sheet sheet;
        private int rows;
        private int columns;
        private int leftHeaderSize;
        private int topHeaderSize;
        private SXSSFWorkbook workbook;

        private ExcelExporter(Dataset dataset, DatasetSelection datasetSelection) {
            this.datasetAccess = new DatasetAccess(dataset);
            this.datasetSelection = datasetSelection;
        }

        private void initialize() {
            workbook = new SXSSFWorkbook(ROW_ACCESS_WINDOW_SIZE);
            sheet = workbook.createSheet();
            rows = datasetSelection.getRows();
            columns = datasetSelection.getColumns();
            leftHeaderSize = datasetSelection.getLeftDimensions().size();
        }

        private void topHeader() {
            int headerRow = 0;
            for (DatasetSelectionDimension dimension : datasetSelection.getTopDimensions()) {
                Row row = sheet.createRow(headerRow);
                List<String> selectedCategories = dimension.getSelectedCategories();
                int headerColumn = leftHeaderSize;
                int multiplier = datasetSelection.getMultiplierForDimension(dimension);
                int repeat = columns / (multiplier * selectedCategories.size());
                for (int i = 0; i < repeat; i++) {
                    for (String selectedCategory : selectedCategories) {
                        String categoryLabel = datasetAccess.representationLabel(dimension.getId(), selectedCategory);
                        Cell cell = row.createCell(headerColumn);
                        cell.setCellValue(categoryLabel);
                        headerColumn += multiplier;
                    }
                }
                headerRow++;
            }
            topHeaderSize = headerRow;
        }

        private void content() {
            int observationsStartRow = topHeaderSize;
            for (int i = 0; i < rows; i++) {
                Row row = sheet.createRow(observationsStartRow + i);
                leftHeaderAtRow(i, row);
                observationsAtRow(i, row);
            }
        }

        private void leftHeaderAtRow(int observationRowIndex, Row row) {
            List<DatasetSelectionDimension> leftDimensions = datasetSelection.getLeftDimensions();
            for (int leftDimensionIndex = 0; leftDimensionIndex < leftDimensions.size(); leftDimensionIndex++) {
                DatasetSelectionDimension dimension = leftDimensions.get(leftDimensionIndex);
                int multiplier = datasetSelection.getMultiplierForDimension(dimension);
                if (observationRowIndex % multiplier == 0) {
                    String categoryId = dimension.getSelectedCategories().get((observationRowIndex / multiplier) % dimension.getSelectedCategories().size());
                    String categoryLabel = datasetAccess.representationLabel(dimension.getId(), categoryId);
                    Cell cell = row.createCell(leftDimensionIndex);
                    cell.setCellValue(categoryLabel);
                }
            }
        }

        private void observationsAtRow(int observationRowIndex, Row row) {
            for (int j = 0; j < columns; j++) {
                Map<String, String> permutationAtCell = datasetSelection.permutationAtCell(observationRowIndex, j);
                Double observation = datasetAccess.observationAtPermutation(permutationAtCell);
                if (observation != null) {
                    Cell cell = row.createCell(leftHeaderSize + j);
                    cell.setCellValue(observation);
                }
            }
        }

        public void write(OutputStream os) throws MetamacException {
            initialize();
            topHeader();
            content();

            try {
                workbook.write(os);
            } catch (IOException e) {
                throw new MetamacException(e, ServiceExceptionType.UNKNOWN, "Error writing excel to OutputStream");
            }
            workbook.dispose();
        }

    }


}
