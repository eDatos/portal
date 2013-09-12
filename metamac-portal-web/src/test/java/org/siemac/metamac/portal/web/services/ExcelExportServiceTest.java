package org.siemac.metamac.portal.web.services;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.siemac.metamac.core.common.conf.ConfigurationService;
import org.siemac.metamac.portal.web.WebConstants;
import org.siemac.metamac.portal.web.mocks.DatasetSelectionMockFactory;
import org.siemac.metamac.portal.web.model.DatasetSelection;
import org.siemac.metamac.portal.web.ws.MetamacApisLocator;
import org.springframework.test.util.ReflectionTestUtils;

import static org.mockito.Matchers.eq;

public class ExcelExportServiceTest {

    public static final String METAMAC_STATISTICAL_RESOURCES_ENDPOINT = "http://estadisticas.arte-consultores.com/metamac-statistical-resources-external-web/apis/statistical-resources";
    private ExcelExportService excelExportService;

    @Before
    public void before() throws Exception {
        ConfigurationService configurationService = Mockito.mock(ConfigurationService.class);
        Mockito.when(configurationService.getProperty(eq(WebConstants.METAMAC_STATISTICAL_RESOURCES_ENDPOINT))).thenReturn(METAMAC_STATISTICAL_RESOURCES_ENDPOINT);

        MetamacApisLocator metamacApisLocator = new MetamacApisLocator();
        ReflectionTestUtils.setField(metamacApisLocator, "configurationService", configurationService);
        metamacApisLocator.init();

        excelExportService = new ExcelExportService();
        ReflectionTestUtils.setField(excelExportService, "metamacApisLocator", metamacApisLocator);
    }

    @Test
    public void testExportDatasetToExcel() throws Exception {
        DatasetSelection datasetSelection = DatasetSelectionMockFactory.create()
                .dimension("TIME_PERIOD", 21).categories("2013", "2012")
                .dimension("INDICADORES", 0).categories("INDICE_OCUPACION_PLAZAS")
                .dimension("CATEGORIA_ALOJAMIENTO", 20).categories("1_2_3_ESTRELLAS")
                .dimension("DESTINO_ALOJAMIENTO", 40).categories("EL_HIERRO")
                .build();
        excelExportService.exportDatasetToExcel(datasetSelection);
    }

}
