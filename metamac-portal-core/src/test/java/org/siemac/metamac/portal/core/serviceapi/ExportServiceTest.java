package org.siemac.metamac.portal.core.serviceapi;

import static org.junit.Assert.assertEquals;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;

import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.serviceapi.utils.Asserts;
import org.siemac.metamac.portal.core.serviceapi.utils.DatasetMockBuilder;
import org.siemac.metamac.portal.core.serviceapi.utils.DatasetSelectionMockBuilder;
import org.siemac.metamac.portal.core.serviceapi.utils.ExcelUtils;
import org.siemac.metamac.portal.core.serviceimpl.ExportServiceImpl;
import org.siemac.metamac.portal.core.serviceimpl.validators.ExportServiceInvocationValidatorBaseImpl;
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

        Dataset dataset = DatasetMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO").representation("ANDALUCIA", "Andalucía").representation("ARAGON", "Aragón")
                .dimension("TIME_PERIOD").representation("2013").representation("2012")
                .dimension("CATEGORIA_ALOJAMIENTO").representation("1_2_3_ESTRELLAS", "1, 2, 3 *").representation("4_5_ESTRELLAS", "4, 5 *")
                .dimension("INDICADORES").representation("INDICE_OCUPACION_PLAZAS")
                .observations("1.1 | 2.2 | 3.3 | 4.4 | 5.5 | 6.6 | 7.7 | 8.8")
                .build();
        //@formatter:on

        File tmpFile = tempFolder.newFile();
        FileOutputStream out = new FileOutputStream(tmpFile);

        exportService.exportDatasetToExcel(ctx, dataset, datasetSelection, "es", out);

        out.close();

        String[][] content = ExcelUtils.readExcelContent(tmpFile);
        //@formatter:off
        String[][] expected = {
                {null, null, "1, 2, 3 *", "4, 5 *"},
                {"Andalucía", "2013", "1.1", "2.2"},
                {null, "2012", "3.3", "4.4"},
                {"Aragón", "2013", "5.5", "6.6"},
                {null, "2012", "7.7", "8.8"}
        };
        //@formatter:on
        Asserts.assertArrayEquals(expected, content);
    }

    @Override
    @Test
    public void testExportDatasetToTsv() throws Exception {
        //@formatter:off
        Dataset dataset = DatasetMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO").representation("ANDALUCIA").representation("ARAGON")
                .dimension("TIME_PERIOD").representation("2013").representation("2012")
                .dimension("CATEGORIA_ALOJAMIENTO").representation("1_2_3_ESTRELLAS").representation("4_5_ESTRELLAS")
                .dimension("INDICADORES").representation("INDICE_OCUPACION_PLAZAS")
                .observations("1 | 2 | 3 | 4 | 5 | 6 | 7 | 8")
                .build();
        //@formatter:on

        File tmpFile = tempFolder.newFile();
        FileOutputStream out = new FileOutputStream(tmpFile);

        exportService.exportDatasetToTsv(ctx, dataset, out);

        out.close();

        BufferedReader bufferedReader = new BufferedReader(new FileReader(tmpFile));
        assertEquals("DESTINO_ALOJAMIENTO\tTIME_PERIOD\tCATEGORIA_ALOJAMIENTO\tINDICADORES\tOBS_VALUE", bufferedReader.readLine());
        assertEquals("ANDALUCIA\t2013\t1_2_3_ESTRELLAS\tINDICE_OCUPACION_PLAZAS\t1", bufferedReader.readLine());
        assertEquals("ANDALUCIA\t2013\t4_5_ESTRELLAS\tINDICE_OCUPACION_PLAZAS\t2", bufferedReader.readLine());
        assertEquals("ANDALUCIA\t2012\t1_2_3_ESTRELLAS\tINDICE_OCUPACION_PLAZAS\t3", bufferedReader.readLine());
        assertEquals("ANDALUCIA\t2012\t4_5_ESTRELLAS\tINDICE_OCUPACION_PLAZAS\t4", bufferedReader.readLine());
        assertEquals("ARAGON\t2013\t1_2_3_ESTRELLAS\tINDICE_OCUPACION_PLAZAS\t5", bufferedReader.readLine());
        assertEquals("ARAGON\t2013\t4_5_ESTRELLAS\tINDICE_OCUPACION_PLAZAS\t6", bufferedReader.readLine());
        assertEquals("ARAGON\t2012\t1_2_3_ESTRELLAS\tINDICE_OCUPACION_PLAZAS\t7", bufferedReader.readLine());
        assertEquals("ARAGON\t2012\t4_5_ESTRELLAS\tINDICE_OCUPACION_PLAZAS\t8", bufferedReader.readLine());
        assertEquals(null, bufferedReader.readLine());
        bufferedReader.close();
    }

    private ServiceContext getServiceContext() {
        return new ServiceContext("junit", "junit", "app");
    }
}