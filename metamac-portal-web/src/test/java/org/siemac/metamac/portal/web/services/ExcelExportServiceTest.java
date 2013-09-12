package org.siemac.metamac.portal.web.services;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;
import org.siemac.metamac.portal.web.model.DatasetSelection;
import org.siemac.metamac.portal.web.test.mocks.DatasetDataMockBuilder;
import org.siemac.metamac.portal.web.test.mocks.DatasetSelectionMockBuilder;
import org.siemac.metamac.portal.web.test.utils.AssertArrays;
import org.siemac.metamac.portal.web.test.utils.ExcelUtils;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Data;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;

import java.io.File;
import java.io.FileOutputStream;

public class ExcelExportServiceTest {

    @Rule
    public TemporaryFolder tempFolder = new TemporaryFolder();

    private ExcelExportService excelExportService;

    @Before
    public void before() throws Exception {
        excelExportService = new ExcelExportService();
    }

    @Test
    public void testExportDatasetToExcel() throws Exception {
        DatasetSelection datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", 0).categories("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", 1).categories("2013", "2012")
                .dimension("CATEGORIA_ALOJAMIENTO", 20).categories("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", 40).categories("INDICE_OCUPACION_PLAZAS")
                .build();

        Data data = DatasetDataMockBuilder.create()
                .observations("1.1 | 2.2 | 3.3 | 4.4 | 5.5 | 6.6 | 7.7 | 8.8")
                .dimension("DESTINO_ALOJAMIENTO").representation("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD").representation("2013", "2012")
                .dimension("CATEGORIA_ALOJAMIENTO").representation("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES").representation("INDICE_OCUPACION_PLAZAS")
                .build();


        File tmpFile = tempFolder.newFile();
        FileOutputStream out = new FileOutputStream(tmpFile);
        Dataset dataset = new Dataset();
        dataset.setData(data);

        excelExportService.exportDatasetToExcel(dataset, datasetSelection, out);
        out.close();

        String[][] content = ExcelUtils.readExcelContent(tmpFile);
        String[][] expected = {
            {null, null, "1_2_3_ESTRELLAS", "4_5_ESTRELLAS"},
            {"ANDALUCIA", "2013", "1.1", "2.2"},
            {null, "2012", "3.3", "4.4"},
            {"ARAGON", "2013", "5.5", "6.6"},
            {null, "2012", "7.7", "8.8"}
        };
        AssertArrays.assertArrayEquals(expected, content);
    }

}
