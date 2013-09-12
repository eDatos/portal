package org.siemac.metamac.portal.web.services;


import com.google.common.base.Joiner;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.siemac.metamac.portal.web.model.DatasetDataAccess;
import org.siemac.metamac.portal.web.model.DatasetSelection;
import org.siemac.metamac.portal.web.model.DatasetSelectionDimension;
import org.siemac.metamac.portal.web.ws.MetamacApisLocator;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.statistical_resources.rest.external.v1_0.service.StatisticalResourcesV1_0;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ExcelExportService {

    public static final int ROW_ACCESS_WINDOW_SIZE = 100;
    @Autowired
    private MetamacApisLocator metamacApisLocator;

    public void exportDatasetToExcel(DatasetSelection datasetSelection) {
        StatisticalResourcesV1_0 statisticalResourcesV1_0 = metamacApisLocator.getStatisticalResourcesV1_0();

        List<String> languages = new ArrayList<String>();
        languages.add("es");
        String fields = "";
        String dims = getDimsParameter(datasetSelection);

        Dataset dataset = statisticalResourcesV1_0.retrieveDataset("ISTAC", "C00031A_000002", "001.000", languages, fields, dims);
        DatasetDataAccess datasetDataAccess = new DatasetDataAccess(dataset);

        int rows = datasetSelection.getRows();
        int columns = datasetSelection.getColumns();


        SXSSFWorkbook wb = new SXSSFWorkbook(ROW_ACCESS_WINDOW_SIZE);
        Sheet sh = wb.createSheet();
        for (int i = 0; i < rows; i++) {
            Row row = sh.createRow(i);
            for (int j = 0; j < columns; j++) {
                Map<String,String> permutationAtCell = datasetSelection.permutationAtCell(i, j);
                Double observation = datasetDataAccess.observationAtPermutation(permutationAtCell);
                if (observation != null) {
                    Cell cell = row.createCell(j);
                    cell.setCellValue(observation);
                }
            }
        }

        try {
            FileOutputStream out = new FileOutputStream("/Users/axelhzf/export.xlsx");
            wb.write(out);
            out.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        // dispose of temporary files backing this workbook on disk
        wb.dispose();
    }

    private String getDimsParameter(DatasetSelection datasetSelection) {
        StringBuilder sb = new StringBuilder();
        Joiner joiner = Joiner.on("|");

        for(DatasetSelectionDimension dimension : datasetSelection.getDimensions()) {
            sb.append(dimension.getId());
            sb.append(":");
            sb.append(joiner.join(dimension.getSelectedCategories()));
            sb.append(":");
        }
        sb.deleteCharAt(sb.length() - 1); //delete last :
        return sb.toString();
    }

}
