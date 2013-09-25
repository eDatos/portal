package org.siemac.metamac.portal.core.serviceapi;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;

import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;
import org.junit.runner.RunWith;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.domain.ExportPersonalisation;
import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;
import org.siemac.metamac.portal.core.serviceapi.utils.Asserts;
import org.siemac.metamac.portal.core.serviceapi.utils.DatasetMockBuilder;
import org.siemac.metamac.portal.core.serviceapi.utils.DatasetSelectionMockBuilder;
import org.siemac.metamac.portal.core.serviceapi.utils.ExcelUtils;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.AttributeAttachmentLevelType;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dimension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.transaction.annotation.Transactional;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring/portal/applicationContext-test.xml"})
@TransactionConfiguration(transactionManager = "txManagerCore", defaultRollback = true)
@Transactional
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
public class ExportServiceTest implements ExportServiceTestBase {

    @Autowired
    private ExportService        exportService;

    @Rule
    public TemporaryFolder       tempFolder = new TemporaryFolder();

    private final ServiceContext ctx        = getServiceContext();

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

        exportService.exportDatasetToExcel(ctx, dataset, datasetSelection, null, "es", out);
        
        // TODO test with labels

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
        // Tested in testExportDatasetToTsv* methods
    }

    @Test
    public void testExportDatasetToTsvWithCodes() throws Exception {

        Dataset dataset = buildDatasetToExportTsv();

        File tmpFile = tempFolder.newFile();
        FileOutputStream out = new FileOutputStream(tmpFile);

        ExportPersonalisation exportPersonalisation = new ExportPersonalisation();
        for (Dimension dimension : dataset.getMetadata().getDimensions().getDimensions()) {
            exportPersonalisation.getDimensionsLabelVisualisationsMode().put(dimension.getId(), LabelVisualisationModeEnum.CODE);
        }

        exportService.exportDatasetToTsv(ctx, dataset, exportPersonalisation, "es", out);

        out.close();

        BufferedReader bufferedReader = new BufferedReader(new FileReader(tmpFile));
        assertEquals("DESTINO_ALOJAMIENTO\tTIME_PERIOD\tCATEGORIA_ALOJAMIENTO\tINDICADORES\tOBS_VALUE\tATTRIBUTE_B\tATTRIBUTE_C\tATTRIBUTE_D", bufferedReader.readLine());
        assertEquals("ANDALUCIA\t2013\t1_2_3_ESTRELLAS\tINDICE_OCUPACION_PLAZAS\t1\ta1\t\td1", bufferedReader.readLine());
        assertEquals("ANDALUCIA\t2013\t4_5_ESTRELLAS\tINDICE_OCUPACION_PLAZAS\t2\ta2\t\td2", bufferedReader.readLine());
        assertEquals("ANDALUCIA\t2012\t1_2_3_ESTRELLAS\tINDICE_OCUPACION_PLAZAS\t3\ta3\t\td3", bufferedReader.readLine());
        assertEquals("ANDALUCIA\t2012\t4_5_ESTRELLAS\tINDICE_OCUPACION_PLAZAS\t4\t\t\td4", bufferedReader.readLine());
        assertEquals("ARAGON\t2013\t1_2_3_ESTRELLAS\tINDICE_OCUPACION_PLAZAS\t5\ta5\t\td5", bufferedReader.readLine());
        assertEquals("ARAGON\t2013\t4_5_ESTRELLAS\tINDICE_OCUPACION_PLAZAS\t6\ta6\t\td6", bufferedReader.readLine());
        assertEquals("ARAGON\t2012\t1_2_3_ESTRELLAS\tINDICE_OCUPACION_PLAZAS\t\ta7\t\td7", bufferedReader.readLine());
        assertEquals("ARAGON\t2012\t4_5_ESTRELLAS\tINDICE_OCUPACION_PLAZAS\t8\ta8\t\td8", bufferedReader.readLine());
        assertEquals(null, bufferedReader.readLine());
        bufferedReader.close();
    }

    @Test
    public void testExportDatasetToTsvWithLabels() throws Exception {

        Dataset dataset = buildDatasetToExportTsv();

        File tmpFile = tempFolder.newFile();
        FileOutputStream out = new FileOutputStream(tmpFile);

        ExportPersonalisation exportPersonalisation = new ExportPersonalisation();
        for (Dimension dimension : dataset.getMetadata().getDimensions().getDimensions()) {
            exportPersonalisation.getDimensionsLabelVisualisationsMode().put(dimension.getId(), LabelVisualisationModeEnum.LABEL);
        }

        exportService.exportDatasetToTsv(ctx, dataset, exportPersonalisation, "es", out);

        out.close();

        BufferedReader bufferedReader = new BufferedReader(new FileReader(tmpFile));
        assertEquals("DESTINO_ALOJAMIENTO\tTIME_PERIOD\tCATEGORIA_ALOJAMIENTO\tINDICADORES\tOBS_VALUE\tATTRIBUTE_B\tATTRIBUTE_C\tATTRIBUTE_D", bufferedReader.readLine());
        assertEquals("Andalucía\tAño 2013\t1, 2 y 3 estrellas\tÍndice de ocupación de plazas\t1\ta1\t\td1", bufferedReader.readLine());
        assertEquals("Andalucía\tAño 2013\t4 y 5 estrellas\tÍndice de ocupación de plazas\t2\ta2\t\td2", bufferedReader.readLine());
        assertEquals("Andalucía\tAño 2012\t1, 2 y 3 estrellas\tÍndice de ocupación de plazas\t3\ta3\t\td3", bufferedReader.readLine());
        assertEquals("Andalucía\tAño 2012\t4 y 5 estrellas\tÍndice de ocupación de plazas\t4\t\t\td4", bufferedReader.readLine());
        assertEquals("Aragón\tAño 2013\t1, 2 y 3 estrellas\tÍndice de ocupación de plazas\t5\ta5\t\td5", bufferedReader.readLine());
        assertEquals("Aragón\tAño 2013\t4 y 5 estrellas\tÍndice de ocupación de plazas\t6\ta6\t\td6", bufferedReader.readLine());
        assertEquals("Aragón\tAño 2012\t1, 2 y 3 estrellas\tÍndice de ocupación de plazas\t\ta7\t\td7", bufferedReader.readLine());
        assertEquals("Aragón\tAño 2012\t4 y 5 estrellas\tÍndice de ocupación de plazas\t8\ta8\t\td8", bufferedReader.readLine());
        assertEquals(null, bufferedReader.readLine());
        bufferedReader.close();
    }

    @Test
    public void testExportDatasetToTsvWithCodesAndLabels() throws Exception {

        Dataset dataset = buildDatasetToExportTsv();

        File tmpFile = tempFolder.newFile();
        FileOutputStream out = new FileOutputStream(tmpFile);

        ExportPersonalisation exportPersonalisation = new ExportPersonalisation();
        for (Dimension dimension : dataset.getMetadata().getDimensions().getDimensions()) {
            exportPersonalisation.getDimensionsLabelVisualisationsMode().put(dimension.getId(), LabelVisualisationModeEnum.CODE_AND_LABEL);
        }

        exportService.exportDatasetToTsv(ctx, dataset, exportPersonalisation, "es", out);

        out.close();

        BufferedReader bufferedReader = new BufferedReader(new FileReader(tmpFile));
        assertEquals(
                "DESTINO_ALOJAMIENTO\tDESTINO_ALOJAMIENTO_CODE\tTIME_PERIOD\tTIME_PERIOD_CODE\tCATEGORIA_ALOJAMIENTO\tCATEGORIA_ALOJAMIENTO_CODE\tINDICADORES\tINDICADORES_CODE\tOBS_VALUE\tATTRIBUTE_B\tATTRIBUTE_C\tATTRIBUTE_D",
                bufferedReader.readLine());
        assertEquals("Andalucía\tANDALUCIA\tAño 2013\t2013\t1, 2 y 3 estrellas\t1_2_3_ESTRELLAS\tÍndice de ocupación de plazas\tINDICE_OCUPACION_PLAZAS\t1\ta1\t\td1", bufferedReader.readLine());
        assertEquals("Andalucía\tANDALUCIA\tAño 2013\t2013\t4 y 5 estrellas\t4_5_ESTRELLAS\tÍndice de ocupación de plazas\tINDICE_OCUPACION_PLAZAS\t2\ta2\t\td2", bufferedReader.readLine());
        assertEquals("Andalucía\tANDALUCIA\tAño 2012\t2012\t1, 2 y 3 estrellas\t1_2_3_ESTRELLAS\tÍndice de ocupación de plazas\tINDICE_OCUPACION_PLAZAS\t3\ta3\t\td3", bufferedReader.readLine());
        assertEquals("Andalucía\tANDALUCIA\tAño 2012\t2012\t4 y 5 estrellas\t4_5_ESTRELLAS\tÍndice de ocupación de plazas\tINDICE_OCUPACION_PLAZAS\t4\t\t\td4", bufferedReader.readLine());
        assertEquals("Aragón\tARAGON\tAño 2013\t2013\t1, 2 y 3 estrellas\t1_2_3_ESTRELLAS\tÍndice de ocupación de plazas\tINDICE_OCUPACION_PLAZAS\t5\ta5\t\td5", bufferedReader.readLine());
        assertEquals("Aragón\tARAGON\tAño 2013\t2013\t4 y 5 estrellas\t4_5_ESTRELLAS\tÍndice de ocupación de plazas\tINDICE_OCUPACION_PLAZAS\t6\ta6\t\td6", bufferedReader.readLine());
        assertEquals("Aragón\tARAGON\tAño 2012\t2012\t1, 2 y 3 estrellas\t1_2_3_ESTRELLAS\tÍndice de ocupación de plazas\tINDICE_OCUPACION_PLAZAS\t\ta7\t\td7", bufferedReader.readLine());
        assertEquals("Aragón\tARAGON\tAño 2012\t2012\t4 y 5 estrellas\t4_5_ESTRELLAS\tÍndice de ocupación de plazas\tINDICE_OCUPACION_PLAZAS\t8\ta8\t\td8", bufferedReader.readLine());
        assertEquals(null, bufferedReader.readLine());
        bufferedReader.close();
    }

    @Override
    @Test
    public void testExportSvgToImage() throws Exception {
        //@formatter:off
        // No test
        String svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\">" +
                        "<g fill=\"none\">" +
                            "<path stroke=\"blue\" d=\"M5 60 l215 0\" />" +
                        "</g>" +
                     "</svg>";
		
        //@formatter:on

        File tmpFile = tempFolder.newFile();
        FileOutputStream out = new FileOutputStream(tmpFile);

        exportService.exportSvgToImage(ctx, svg, null, null, out);

        out.close();

        // Validation: nothing special... Only test service does not throw error and generate a PNG
        assertTrue(tmpFile.length() > 0);
        BufferedReader bufferedReader = new BufferedReader(new FileReader(tmpFile));
        assertTrue(bufferedReader.readLine().contains("PNG"));
    }

    private ServiceContext getServiceContext() {
        return new ServiceContext("junit", "junit", "app");
    }

    private Dataset buildDatasetToExportTsv() {
        //@formatter:off
        return DatasetMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", "Destino de alojamiento").representation("ANDALUCIA", "Andalucía").representation("ARAGON", "Aragón")
                .dimension("TIME_PERIOD").representation("2013", "Año 2013").representation("2012", "Año 2012")
                .dimension("CATEGORIA_ALOJAMIENTO").representation("1_2_3_ESTRELLAS", "1, 2 y 3 estrellas").representation("4_5_ESTRELLAS", "4 y 5 estrellas")
                .dimension("INDICADORES").representation("INDICE_OCUPACION_PLAZAS", "Índice de ocupación de plazas")
                .attribute("ATTRIBUTE_A", "Attribute A", AttributeAttachmentLevelType.DATASET)
                .attribute("ATTRIBUTE_B", "Attribute B", AttributeAttachmentLevelType.PRIMARY_MEASURE)
                .attribute("ATTRIBUTE_C", "Attribute C",AttributeAttachmentLevelType.PRIMARY_MEASURE)
                .attribute("ATTRIBUTE_D", "Attribute D",AttributeAttachmentLevelType.PRIMARY_MEASURE)
                .observations("1 | 2 | 3 | 4 | 5 | 6 |  | 8")
                .attributeValues("ATTRIBUTE_B", "a1 | a2 | a3 |  | a5 | a6 | a7 | a8")
                .attributeValues("ATTRIBUTE_D", "d1 | d2 | d3 | d4 | d5 | d6 | d7 | d8")
                .build();
        //@formatter:on
    }
}