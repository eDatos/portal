package org.siemac.metamac.portal.web.test.utils;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Iterator;

public class ExcelUtils {

    public static String[][] readExcelContent(File tmpFile) throws IOException {
        FileInputStream file = new FileInputStream(tmpFile);
        XSSFWorkbook workbook = new XSSFWorkbook(file);
        XSSFSheet sheet = workbook.getSheetAt(0);

        int rows = sheet.getPhysicalNumberOfRows();
        int columns = sheet.iterator().next().getLastCellNum();

        String[][] result = new String[rows][columns];

        Iterator<Row> rowIterator = sheet.iterator();
        while(rowIterator.hasNext()) {
            Row row = rowIterator.next();
            Iterator<Cell> cellIterator = row.cellIterator();
            while(cellIterator.hasNext()) {
                Cell cell = cellIterator.next();
                String value;
                if (cell.getCellType() == Cell.CELL_TYPE_STRING) {
                     value = cell.getStringCellValue();
                } else {
                    value = "" + cell.getNumericCellValue();
                }
                result[row.getRowNum()][cell.getColumnIndex()] = value;
            }
        }
        return result;
    }

}
