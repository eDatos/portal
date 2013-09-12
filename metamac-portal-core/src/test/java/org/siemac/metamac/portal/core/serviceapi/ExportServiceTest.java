package org.siemac.metamac.portal.core.serviceapi;

import java.io.File;
import java.io.FileOutputStream;

import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.serviceapi.utils.Asserts;
import org.siemac.metamac.portal.core.serviceapi.utils.DatasetDataMockBuilder;
import org.siemac.metamac.portal.core.serviceapi.utils.DatasetSelectionMockBuilder;
import org.siemac.metamac.portal.core.serviceapi.utils.ExcelUtils;
import org.siemac.metamac.portal.core.serviceimpl.ExportServiceImpl;
import org.siemac.metamac.portal.core.serviceimpl.validators.ExportServiceInvocationValidatorBaseImpl;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Data;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.springframework.test.util.ReflectionTestUtils;

public class ExportServiceTest implements ExportServiceTestBase {

    @Rule
    public TemporaryFolder       tempFolder = new TemporaryFolder();

    private ExportService        exportService;

    private final ServiceContext ctx        = getServiceContext();

    @Before
    public void before() throws Exception {
        exportService = new ExportServiceImpl();
        ReflectionTestUtils.setField(exportService, "exportServiceInvocationValidator", new ExportServiceInvocationValidatorBaseImpl());
    }

    @Override
    @Test
    public void testExportDatasetToExcel() throws Exception {
        //@formatter:off
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
        //@formatter:on

        File tmpFile = tempFolder.newFile();
        FileOutputStream out = new FileOutputStream(tmpFile);
        Dataset dataset = new Dataset();
        dataset.setData(data);

        exportService.exportDatasetToExcel(ctx, dataset, datasetSelection, out);

        out.close();

        String[][] content = ExcelUtils.readExcelContent(tmpFile);
        //@formatter:off
        String[][] expected = {
                {null, null, "1_2_3_ESTRELLAS", "4_5_ESTRELLAS"},
                {"ANDALUCIA", "2013", "1.1", "2.2"},
                {null, "2012", "3.3", "4.4"},
                {"ARAGON", "2013", "5.5", "6.6"},
                {null, "2012", "7.7", "8.8"}
            };
        //@formatter:on
        Asserts.assertArrayEquals(expected, content);
    }

    private ServiceContext getServiceContext() {
        return new ServiceContext("junit", "junit", "app");
    }

}
