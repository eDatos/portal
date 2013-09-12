package org.siemac.metamac.portal.web.services;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.siemac.metamac.core.common.conf.ConfigurationService;
import org.siemac.metamac.portal.web.WebConstants;
import org.siemac.metamac.portal.web.mocks.DatasetSelectionMockBuilder;
import org.siemac.metamac.portal.web.model.DatasetSelection;
import org.siemac.metamac.portal.web.ws.MetamacApisLocator;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.FileOutputStream;

import static org.mockito.Matchers.eq;

public class ExcelExportServiceTest {

    public static final String METAMAC_STATISTICAL_RESOURCES_ENDPOINT = "http://estadisticas.arte-consultores.com/metamac-statistical-resources-external-web/apis/statistical-resources";
    private ExcelExportService excelExportService;
    private DatasetService datasetService;

    @Before
    public void before() throws Exception {
        ConfigurationService configurationService = Mockito.mock(ConfigurationService.class);
        Mockito.when(configurationService.getProperty(eq(WebConstants.METAMAC_STATISTICAL_RESOURCES_ENDPOINT))).thenReturn(METAMAC_STATISTICAL_RESOURCES_ENDPOINT);

        MetamacApisLocator metamacApisLocator = new MetamacApisLocator();
        ReflectionTestUtils.setField(metamacApisLocator, "configurationService", configurationService);
        metamacApisLocator.init();

        excelExportService = new ExcelExportService();
        datasetService = new DatasetService();
        ReflectionTestUtils.setField(datasetService, "metamacApisLocator", metamacApisLocator);
    }

    @Test
    public void testExportDatasetToExcel() throws Exception {
        DatasetSelection datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", 0).categories("ANDALUCIA", "ARAGON", "ASTURIAS")
                .dimension("TIME_PERIOD", 1).categories("2013", "2012", "2011", "2010", "2009")
                .dimension("CATEGORIA_ALOJAMIENTO", 2).categories("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", 40).categories("INDICE_OCUPACION_PLAZAS")
                .build();


        FileOutputStream out = new FileOutputStream("/Users/axelhzf/export.xlsx");
        Dataset dataset = datasetService.retrieve("ISTAC", "C00031A_000002", "001.000", datasetSelection);
        excelExportService.exportDatasetToExcel(dataset, datasetSelection, out);
        out.close();
    }

}
