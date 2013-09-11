package org.siemac.metamac.portal.web.services;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.mockito.Mockito;
import org.siemac.metamac.core.common.conf.ConfigurationService;
import org.siemac.metamac.portal.web.WebConstants;
import org.siemac.metamac.portal.web.model.DatasetSelection;
import org.siemac.metamac.portal.web.model.DatasetSelectionDimension;
import org.siemac.metamac.portal.web.ws.MetamacApisLocator;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Arrays;

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

    @Ignore
    @Test
    public void testExportDatasetToExcel() throws Exception {
        DatasetSelection datasetSelection = new DatasetSelection();


        DatasetSelectionDimension timeDimension = new DatasetSelectionDimension("TIME_PERIOD", 21);
        timeDimension.setSelectedCategories(Arrays.asList("2013", "2012"));

        DatasetSelectionDimension indicadores = new DatasetSelectionDimension("INDICADORES", 0);
        indicadores.setSelectedCategories(Arrays.asList("INDICE_OCUPACION_PLAZAS"));

        DatasetSelectionDimension categoriaAlojamiento = new DatasetSelectionDimension("CATEGORIA_ALOJAMIENTO", 20);
        categoriaAlojamiento.setSelectedCategories(Arrays.asList("1_2_3_ESTRELLAS"));

        DatasetSelectionDimension destinoAlojamiento = new DatasetSelectionDimension("DESTINO_ALOJAMIENTO", 40);
        destinoAlojamiento.setSelectedCategories(Arrays.asList("EL_HIERRO"));

        datasetSelection.addDimension(timeDimension);
        datasetSelection.addDimension(indicadores);
        datasetSelection.addDimension(categoriaAlojamiento);
        datasetSelection.addDimension(destinoAlojamiento);

        excelExportService.exportDatasetToExcel(datasetSelection);
    }

}
