package org.siemac.metamac.portal.core.serviceapi;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStreamReader;

import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;
import org.junit.runner.RunWith;
import org.siemac.metamac.portal.core.domain.DatasetSelectionForExcel;
import org.siemac.metamac.portal.core.domain.DatasetSelectionForTsv;
import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;
import org.siemac.metamac.portal.core.serviceapi.utils.Asserts;
import org.siemac.metamac.portal.core.serviceapi.utils.DatasetMockBuilder;
import org.siemac.metamac.portal.core.serviceapi.utils.DatasetSelectionMockBuilder;
import org.siemac.metamac.portal.core.serviceapi.utils.ExcelUtils;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.AttributeAttachmentLevelType;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
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
    public void testExportDatasetToExcel() throws Exception {
        // Tested in testExportDatasetToExcel* methods
    }

    @Test
    public void testExportDatasetToExcelWithCodes() throws Exception {
        //@formatter:off
        DatasetSelectionForExcel datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", 0, LabelVisualisationModeEnum.CODE).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", 1, LabelVisualisationModeEnum.CODE).dimensionValues("2013", "2012")
                .dimension("CATEGORIA_ALOJAMIENTO", 20, LabelVisualisationModeEnum.CODE).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", 40, LabelVisualisationModeEnum.CODE).dimensionValues("INDICE_OCUPACION_PLAZAS")
                .buildForExcel();

         //@formatter:on

        File tmpFile = tempFolder.newFile();
        FileOutputStream out = new FileOutputStream(tmpFile);

        Dataset dataset = buildDatasetToExportExcel();
        exportService.exportDatasetToExcel(ctx, dataset, datasetSelection, "es", out);

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

    @Test
    public void testExportDatasetToExcelWithLabels() throws Exception {
        //@formatter:off
        DatasetSelectionForExcel datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", 0, LabelVisualisationModeEnum.LABEL).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", 1, LabelVisualisationModeEnum.LABEL).dimensionValues("2013", "2012")
                .dimension("CATEGORIA_ALOJAMIENTO", 20, LabelVisualisationModeEnum.LABEL).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", 40, LabelVisualisationModeEnum.LABEL).dimensionValues("INDICE_OCUPACION_PLAZAS")
                .buildForExcel();

         //@formatter:on

        File tmpFile = tempFolder.newFile();
        FileOutputStream out = new FileOutputStream(tmpFile);

        Dataset dataset = buildDatasetToExportExcel();
        exportService.exportDatasetToExcel(ctx, dataset, datasetSelection, "es", out);

        out.close();

        String[][] content = ExcelUtils.readExcelContent(tmpFile);
        //@formatter:off
        String[][] expected = {
                {null, null, "1, 2, 3 *", "4, 5 *"},
                {"Andalucía", "Año 2013", "1.1", "2.2"},
                {null, "Año 2012", "3.3", "4.4"},
                {"Aragón", "Año 2013", "5.5", "6.6"},
                {null, "Año 2012", "7.7", "8.8"}
        };
        //@formatter:on
        Asserts.assertArrayEquals(expected, content);
    }

    @Test
    public void testExportDatasetToExcelWithLabelsAndCodes() throws Exception {
        //@formatter:off
        DatasetSelectionForExcel datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", 0, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", 1, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("2013", "2012")
                .dimension("CATEGORIA_ALOJAMIENTO", 20, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", 40, null).dimensionValues("INDICE_OCUPACION_PLAZAS")// do not specify visualisation mode (apply default)
                .buildForExcel();

         //@formatter:on

        File tmpFile = tempFolder.newFile();
        FileOutputStream out = new FileOutputStream(tmpFile);

        Dataset dataset = buildDatasetToExportExcel();
        exportService.exportDatasetToExcel(ctx, dataset, datasetSelection, "es", out);

        out.close();

        String[][] content = ExcelUtils.readExcelContent(tmpFile);
        //@formatter:off
        String[][] expected = {
                {null, null, "1, 2, 3 * (1_2_3_ESTRELLAS)", "4, 5 * (4_5_ESTRELLAS)"},
                {"Andalucía (ANDALUCIA)", "Año 2013 (2013)", "1.1", "2.2"},
                {null, "Año 2012 (2012)", "3.3", "4.4"},
                {"Aragón (ARAGON)", "Año 2013 (2013)", "5.5", "6.6"},
                {null, "Año 2012 (2012)", "7.7", "8.8"}
        };
        //@formatter:on
        Asserts.assertArrayEquals(expected, content);
    }

    @Override
    public void testExportDatasetToTsv() throws Exception {
        // Tested in testExportDatasetToTsv* methods
    }

    @Test
    public void testExportDatasetToTsvWithCodes() throws Exception {

        Dataset dataset = buildDatasetToExportTsv();

        File tmpFile = tempFolder.newFile();
        FileOutputStream out = new FileOutputStream(tmpFile);

        //@formatter:off
        DatasetSelectionForTsv datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", LabelVisualisationModeEnum.CODE).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", LabelVisualisationModeEnum.CODE).dimensionValues("2013", "2012")
                .dimension("CATEGORIA_ALOJAMIENTO", LabelVisualisationModeEnum.CODE).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", LabelVisualisationModeEnum.CODE).dimensionValues("INDICE_OCUPACION_PLAZAS")
                .attribute("ATTRIBUTE_B", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_C", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_D", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_E", LabelVisualisationModeEnum.CODE)
                .buildForTsv();
        //@formatter:on

        exportService.exportDatasetToTsv(ctx, dataset, datasetSelection, "es", out);

        out.close();

        BufferedReader bufferedReader = createBufferedReader(tmpFile);
        assertEquals("DESTINO_ALOJAMIENTO\tTIME_PERIOD\tCATEGORIA_ALOJAMIENTO\tINDICADORES\tOBS_VALUE\tATTRIBUTE_B\tATTRIBUTE_C\tATTRIBUTE_D\tATTRIBUTE_E", bufferedReader.readLine());
        assertEquals("ANDALUCIA\t2013\t1_2_3_ESTRELLAS\tINDICE_OCUPACION_PLAZAS\t1\tb1\t\td1\te1", bufferedReader.readLine());
        assertEquals("ANDALUCIA\t2013\t4_5_ESTRELLAS\tINDICE_OCUPACION_PLAZAS\t2\tb2\t\td2\te2", bufferedReader.readLine());
        assertEquals("ANDALUCIA\t2012\t1_2_3_ESTRELLAS\tINDICE_OCUPACION_PLAZAS\t3\tb3\t\td3\te3", bufferedReader.readLine());
        assertEquals("ANDALUCIA\t2012\t4_5_ESTRELLAS\tINDICE_OCUPACION_PLAZAS\t4\t\t\td4\te4", bufferedReader.readLine());
        assertEquals("ARAGON\t2013\t1_2_3_ESTRELLAS\tINDICE_OCUPACION_PLAZAS\t5\tb5\t\td5\te5", bufferedReader.readLine());
        assertEquals("ARAGON\t2013\t4_5_ESTRELLAS\tINDICE_OCUPACION_PLAZAS\t6\tb6\t\td6\te6", bufferedReader.readLine());
        assertEquals("ARAGON\t2012\t1_2_3_ESTRELLAS\tINDICE_OCUPACION_PLAZAS\t\tb7\t\td7\te7", bufferedReader.readLine());
        assertEquals("ARAGON\t2012\t4_5_ESTRELLAS\tINDICE_OCUPACION_PLAZAS\t8\tb8\t\td8\te8", bufferedReader.readLine());
        assertEquals(null, bufferedReader.readLine());
        bufferedReader.close();
    }

    @Test
    public void testExportDatasetToTsvWithLabels() throws Exception {

        Dataset dataset = buildDatasetToExportTsv();

        File tmpFile = tempFolder.newFile();
        FileOutputStream out = new FileOutputStream(tmpFile);

        //@formatter:off
        DatasetSelectionForTsv datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", LabelVisualisationModeEnum.LABEL).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", LabelVisualisationModeEnum.LABEL).dimensionValues("2013", "2012")
                .dimension("CATEGORIA_ALOJAMIENTO", LabelVisualisationModeEnum.LABEL).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", LabelVisualisationModeEnum.LABEL).dimensionValues("INDICE_OCUPACION_PLAZAS")
                .attribute("ATTRIBUTE_B", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_C", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_D", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_E", LabelVisualisationModeEnum.LABEL)
                .buildForTsv();
        //@formatter:on

        exportService.exportDatasetToTsv(ctx, dataset, datasetSelection, "es", out);

        out.close();

        BufferedReader bufferedReader = createBufferedReader(tmpFile);
        assertEquals("DESTINO_ALOJAMIENTO\tTIME_PERIOD\tCATEGORIA_ALOJAMIENTO\tINDICADORES\tOBS_VALUE\tATTRIBUTE_B\tATTRIBUTE_C\tATTRIBUTE_D\tATTRIBUTE_E", bufferedReader.readLine());
        assertEquals("Andalucía\tAño 2013\t1, 2 y 3 estrellas\tÍndice de ocupación de plazas\t1\tAttribute b1\t\tAttribute d1\te1", bufferedReader.readLine());
        assertEquals("Andalucía\tAño 2013\t4 y 5 estrellas\tÍndice de ocupación de plazas\t2\tAttribute b2\t\tAttribute d2\te2", bufferedReader.readLine());
        assertEquals("Andalucía\tAño 2012\t1, 2 y 3 estrellas\tÍndice de ocupación de plazas\t3\tAttribute b3\t\tAttribute d3\te3", bufferedReader.readLine());
        assertEquals("Andalucía\tAño 2012\t4 y 5 estrellas\tÍndice de ocupación de plazas\t4\t\t\tAttribute d4\te4", bufferedReader.readLine());
        assertEquals("Aragón\tAño 2013\t1, 2 y 3 estrellas\tÍndice de ocupación de plazas\t5\tAttribute b5\t\tAttribute d5\te5", bufferedReader.readLine());
        assertEquals("Aragón\tAño 2013\t4 y 5 estrellas\tÍndice de ocupación de plazas\t6\tAttribute b6\t\tAttribute d6\te6", bufferedReader.readLine());
        assertEquals("Aragón\tAño 2012\t1, 2 y 3 estrellas\tÍndice de ocupación de plazas\t\tAttribute b7\t\tAttribute d7\te7", bufferedReader.readLine());
        assertEquals("Aragón\tAño 2012\t4 y 5 estrellas\tÍndice de ocupación de plazas\t8\tAttribute b8\t\tAttribute d8\te8", bufferedReader.readLine());
        assertEquals(null, bufferedReader.readLine());
        bufferedReader.close();
    }

    @Test
    public void testExportDatasetToTsvWithCodesAndLabels() throws Exception {

        Dataset dataset = buildDatasetToExportTsv();

        File tmpFile = tempFolder.newFile();
        FileOutputStream out = new FileOutputStream(tmpFile);

        //@formatter:off
        DatasetSelectionForTsv datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("2013", "2012")
                .dimension("CATEGORIA_ALOJAMIENTO", LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("INDICE_OCUPACION_PLAZAS")
                .attribute("ATTRIBUTE_B", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_C", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_D", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_E", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .buildForTsv();
        //@formatter:on

        exportService.exportDatasetToTsv(ctx, dataset, datasetSelection, "es", out);

        out.close();

        BufferedReader bufferedReader = createBufferedReader(tmpFile);
        assertEquals(
                "DESTINO_ALOJAMIENTO\tDESTINO_ALOJAMIENTO_CODE\tTIME_PERIOD\tTIME_PERIOD_CODE\tCATEGORIA_ALOJAMIENTO\tCATEGORIA_ALOJAMIENTO_CODE\tINDICADORES\tINDICADORES_CODE\tOBS_VALUE\tATTRIBUTE_B\tATTRIBUTE_B_CODE\tATTRIBUTE_C\tATTRIBUTE_C_CODE\tATTRIBUTE_D\tATTRIBUTE_D_CODE\tATTRIBUTE_E\tATTRIBUTE_E_CODE",
                bufferedReader.readLine());
        assertEquals(
                "Andalucía\tANDALUCIA\tAño 2013\t2013\t1, 2 y 3 estrellas\t1_2_3_ESTRELLAS\tÍndice de ocupación de plazas\tINDICE_OCUPACION_PLAZAS\t1\tAttribute b1\tb1\t\tAttribute d1\td1\te1\te1",
                bufferedReader.readLine());
        assertEquals("Andalucía\tANDALUCIA\tAño 2013\t2013\t4 y 5 estrellas\t4_5_ESTRELLAS\tÍndice de ocupación de plazas\tINDICE_OCUPACION_PLAZAS\t2\tAttribute b2\tb2\t\tAttribute d2\td2\te2\te2",
                bufferedReader.readLine());
        assertEquals(
                "Andalucía\tANDALUCIA\tAño 2012\t2012\t1, 2 y 3 estrellas\t1_2_3_ESTRELLAS\tÍndice de ocupación de plazas\tINDICE_OCUPACION_PLAZAS\t3\tAttribute b3\tb3\t\tAttribute d3\td3\te3\te3",
                bufferedReader.readLine());
        assertEquals("Andalucía\tANDALUCIA\tAño 2012\t2012\t4 y 5 estrellas\t4_5_ESTRELLAS\tÍndice de ocupación de plazas\tINDICE_OCUPACION_PLAZAS\t4\t\t\t\tAttribute d4\td4\te4\te4",
                bufferedReader.readLine());
        assertEquals("Aragón\tARAGON\tAño 2013\t2013\t1, 2 y 3 estrellas\t1_2_3_ESTRELLAS\tÍndice de ocupación de plazas\tINDICE_OCUPACION_PLAZAS\t5\tAttribute b5\tb5\t\tAttribute d5\td5\te5\te5",
                bufferedReader.readLine());
        assertEquals("Aragón\tARAGON\tAño 2013\t2013\t4 y 5 estrellas\t4_5_ESTRELLAS\tÍndice de ocupación de plazas\tINDICE_OCUPACION_PLAZAS\t6\tAttribute b6\tb6\t\tAttribute d6\td6\te6\te6",
                bufferedReader.readLine());
        assertEquals("Aragón\tARAGON\tAño 2012\t2012\t1, 2 y 3 estrellas\t1_2_3_ESTRELLAS\tÍndice de ocupación de plazas\tINDICE_OCUPACION_PLAZAS\t\tAttribute b7\tb7\t\tAttribute d7\td7\te7\te7",
                bufferedReader.readLine());
        assertEquals("Aragón\tARAGON\tAño 2012\t2012\t4 y 5 estrellas\t4_5_ESTRELLAS\tÍndice de ocupación de plazas\tINDICE_OCUPACION_PLAZAS\t8\tAttribute b8\tb8\t\tAttribute d8\td8\te8\te8",
                bufferedReader.readLine());
        assertEquals(null, bufferedReader.readLine());
        bufferedReader.close();
    }

    @Test
    public void testExportDatasetToTsvWithCodesAndSomeLabels() throws Exception {

        Dataset dataset = buildDatasetToExportTsv();

        File tmpFile = tempFolder.newFile();
        FileOutputStream out = new FileOutputStream(tmpFile);

        //@formatter:off
        DatasetSelectionForTsv datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", LabelVisualisationModeEnum.CODE).dimensionValues("2013", "2012")
                .dimension("CATEGORIA_ALOJAMIENTO", LabelVisualisationModeEnum.LABEL).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES").dimensionValues("INDICE_OCUPACION_PLAZAS")         // do not specify visualisation mode (apply default)
                .attribute("ATTRIBUTE_B", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_C", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_D", null) // do not specify visualisation mode (apply default)
                .attribute("ATTRIBUTE_E", LabelVisualisationModeEnum.CODE)

                .buildForTsv();
        //@formatter:on

        exportService.exportDatasetToTsv(ctx, dataset, datasetSelection, "es", out);

        out.close();

        BufferedReader bufferedReader = createBufferedReader(tmpFile);
        assertEquals(
                "DESTINO_ALOJAMIENTO\tDESTINO_ALOJAMIENTO_CODE\tTIME_PERIOD\tCATEGORIA_ALOJAMIENTO\tINDICADORES\tINDICADORES_CODE\tOBS_VALUE\tATTRIBUTE_B\tATTRIBUTE_C\tATTRIBUTE_C_CODE\tATTRIBUTE_D\tATTRIBUTE_D_CODE\tATTRIBUTE_E",
                bufferedReader.readLine());
        assertEquals("Andalucía\tANDALUCIA\t2013\t1, 2 y 3 estrellas\tÍndice de ocupación de plazas\tINDICE_OCUPACION_PLAZAS\t1\tb1\t\tAttribute d1\td1\te1", bufferedReader.readLine());
        assertEquals("Andalucía\tANDALUCIA\t2013\t4 y 5 estrellas\tÍndice de ocupación de plazas\tINDICE_OCUPACION_PLAZAS\t2\tb2\t\tAttribute d2\td2\te2", bufferedReader.readLine());
        assertEquals("Andalucía\tANDALUCIA\t2012\t1, 2 y 3 estrellas\tÍndice de ocupación de plazas\tINDICE_OCUPACION_PLAZAS\t3\tb3\t\tAttribute d3\td3\te3", bufferedReader.readLine());
        assertEquals("Andalucía\tANDALUCIA\t2012\t4 y 5 estrellas\tÍndice de ocupación de plazas\tINDICE_OCUPACION_PLAZAS\t4\t\t\tAttribute d4\td4\te4", bufferedReader.readLine());
        assertEquals("Aragón\tARAGON\t2013\t1, 2 y 3 estrellas\tÍndice de ocupación de plazas\tINDICE_OCUPACION_PLAZAS\t5\tb5\t\tAttribute d5\td5\te5", bufferedReader.readLine());
        assertEquals("Aragón\tARAGON\t2013\t4 y 5 estrellas\tÍndice de ocupación de plazas\tINDICE_OCUPACION_PLAZAS\t6\tb6\t\tAttribute d6\td6\te6", bufferedReader.readLine());
        assertEquals("Aragón\tARAGON\t2012\t1, 2 y 3 estrellas\tÍndice de ocupación de plazas\tINDICE_OCUPACION_PLAZAS\t\tb7\t\tAttribute d7\td7\te7", bufferedReader.readLine());
        assertEquals("Aragón\tARAGON\t2012\t4 y 5 estrellas\tÍndice de ocupación de plazas\tINDICE_OCUPACION_PLAZAS\t8\tb8\t\tAttribute d8\td8\te8", bufferedReader.readLine());
        assertEquals(null, bufferedReader.readLine());
        bufferedReader.close();
    }

    @Override
    @Test
    public void testExportDatasetToPx() throws Exception {

        Dataset dataset = buildDatasetToExportTsv();

        File tmpFile = tempFolder.newFile();
        FileOutputStream out = new FileOutputStream(tmpFile);
        exportService.exportDatasetToPx(ctx, dataset, null, out);

        out.close();

        BufferedReader bufferedReader = createBufferedReader(tmpFile);
        assertEquals("CHARSET=\"ANSI\";", bufferedReader.readLine());
        assertEquals("AXIS-VERSION=\"2000\";", bufferedReader.readLine());
        assertEquals("LANGUAGE=\"es\";", bufferedReader.readLine());
        assertEquals("LANGUAGES=\"es\",\"en\";", bufferedReader.readLine());
        assertEquals("CREATION-DATE=\"20130102 13:15\";", bufferedReader.readLine());
        assertEquals("NEXT-UPDATE=\"20130103 09:00\";", bufferedReader.readLine());
        assertEquals("UPDATE-FREQUENCY=\"Label updateFrequency\";", bufferedReader.readLine());
        assertEquals("UPDATE-FREQUENCY[en]=\"Label updateFrequency (en)\";", bufferedReader.readLine());
        assertEquals("SHOWDECIMALS=2;", bufferedReader.readLine());
        assertEquals("AUTOPEN=NO;", bufferedReader.readLine());
        assertEquals("COPYRIGHT=NO;", bufferedReader.readLine());
        assertEquals("DESCRIPTION=\"description\";", bufferedReader.readLine());
        assertEquals("DESCRIPTION[en]=\"description (en)\";", bufferedReader.readLine());
        assertEquals("TITLE=\"title\";", bufferedReader.readLine());
        assertEquals("TITLE[en]=\"title (en)\";", bufferedReader.readLine());
        assertEquals("STUB=\"CATEGORIA_ALOJAMIENTO\",\"INDICADORES\";", bufferedReader.readLine());
        assertEquals("HEADING=\"DESTINO_ALOJAMIENTO\",\"TIME_PERIOD\";", bufferedReader.readLine());
        assertEquals("VALUES(\"DESTINO_ALOJAMIENTO\")=\"Andalucía\",\"Aragón\";", bufferedReader.readLine());
        assertEquals("VALUES(\"TIME_PERIOD\")=\"Año 2013\",\"Año 2012\";", bufferedReader.readLine());
        assertEquals("VALUES(\"CATEGORIA_ALOJAMIENTO\")=\"1, 2 y 3 estrellas\",\"4 y 5 estrellas\";", bufferedReader.readLine());
        assertEquals("VALUES(\"INDICADORES\")=\"Índice de ocupación de plazas\";", bufferedReader.readLine());
        assertEquals("CODES(\"DESTINO_ALOJAMIENTO\")=\"ANDALUCIA\",\"ARAGON\";", bufferedReader.readLine());
        assertEquals("CODES(\"TIME_PERIOD\")=\"2013\",\"2012\";", bufferedReader.readLine());
        assertEquals("CODES(\"CATEGORIA_ALOJAMIENTO\")=\"1_2_3_ESTRELLAS\",\"4_5_ESTRELLAS\";", bufferedReader.readLine());
        assertEquals("CODES(\"INDICADORES\")=\"INDICE_OCUPACION_PLAZAS\";", bufferedReader.readLine());
        assertEquals("LAST-UPDATED=\"20130102 09:00\";", bufferedReader.readLine());

        // CONTACT="Instituto Canario de Estadística (ISTAC)#www.gobiernodecanarias.org/"
        // "istac#consultas.istac@gobiernodecanarias.org#";
        // REFPERIOD="Mes";
        // SOURCE="Instituto Canario de Estadística (ISTAC) e Instituto de Estudios "
        // "Turísticos (IET).";
        // SURVEY="Estadística de Movimientos Turísticos en Fronteras de Canarias (FRONTUR-Canarias)";
        // INFO="FRONTUR-Canarias: Resultados mensuales de entrada de turistas";
        // NOTEX="Los datos corresponden a turistas entrados por vía aérea.";
        // NOTE="En las estimaciones para el total de Canarias se incluyen los turistas de "
        // "La Gomera y El Hierro.#(p) Dato provisional.#(*) Dato estimado con menos de 20 "
        // "observaciones muestrales.";
        // NOTEX("Motivos de la estancia")="Notex para motivos de la estancia";
        // NOTEX[en]("Reason for stay")="Notex para motivos de la estancia English";
        // NOTE("Motivos de la estancia")="Note para motivos de la estancia";
        // NOTE[en]("Reason for stay")="Note para motivos de la estancia English";
        // NOTEX("Islas de destino principal")="Notex para Islas de destino principal";
        // NOTEX[en]("Principal destination")="Notex para Islas de destino principal English";
        // NOTE("Islas de destino principal")="Note para Islas de destino principal";
        // NOTE[en]("Principal destination")="Note para Islas de destino principal English";
        // VALUENOTEX("Motivos de la estancia","TOTAL MOTIVOS")="Value notex 1";
        // VALUENOTEX[en]("Reason for stay","TOTAL")="Value notex 1 English";
        // VALUENOTEX("Motivos de la estancia","Trabajo o negocios")="Value notex 2";
        // VALUENOTEX("Islas de destino principal","CANARIAS")="Value notex Canarias";
        // VALUENOTEX[en]("Principal destination","CANARY ISLANDS")="Value notex Canary Islands";
        // VALUENOTE("Motivos de la estancia","Ocio o vacaciones")="Value note 1";
        // VALUENOTE("Islas de destino principal","CANARIAS")="Value note Canarias";
        // VALUENOTE[en]("Reason for stay","Work")="Value note Reason form stay - Work english";
        // CELLNOTEX("*","*","*")="Nota para todas las observaciones";
        // CELLNOTEX[en]("*","*","*")="Nota para todas las observaciones English";
        // CELLNOTEX("Trabajo o negocios","*","2010 Septiembre (p)")="Trabajo o negocios, todas las islas en 2010 Septiembre";
        // CELLNOTEX[en]("Work","*","2010 Septiembre (p)")="EN Trabajo o negocios, todas las islas en 2010 Septiembre";
        // CELLNOTEX("Trabajo o negocios","Lanzarote","2010 Septiembre (p)")="Cell notex 1";
        // CELLNOTEX("Ocio o vacaciones","La Palma","*")="Ocio o vacaciones en La Palma";
        // CELLNOTE("Trabajo o negocios","*","2010 Septiembre (p)")="Trabajo o negocios en 2010 Septiembre";
        // CELLNOTE("Trabajo o negocios","Lanzarote","2010 Septiembre (p)")="Trabajo o negocios en Lanzarote en 2010 Septiembre";
        // CELLNOTE[en]("Work","Lanzarote EN","2010 Septiembre (p)")="Work Lanzarote 2010 September";
        // CELLNOTEX("Trabajo o negocios","*","*")="Cellnotex Trabajo o negocios";
        // CELLNOTEX[en]("Work","*","*")="EN Cellnotex Trabajo o negocios";
        // DATANOTECELL("*","*","*")="Data note cell 4";
        // DATANOTECELL("Trabajo o negocios","ES708","2010 Noviembre (p)")="ES Data note cell 1";
        // DATANOTECELL("Trabajo o negocios","ES707","2010 Noviembre (p)")="ES Data note cell 2";
        // DATANOTECELL[en]("Trabajo o negocios","ES707","2010 Noviembre (p)")="EN Data note cell 2";
        // DATANOTECELL("Personal","ES708","2010 Septiembre (p)")="ES Data note cell 4";

        assertEquals("DATA=", bufferedReader.readLine());
        assertEquals("1 2 3 4 5 6 \".\" 8; ", bufferedReader.readLine());

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
        BufferedReader bufferedReader = createBufferedReader(tmpFile);
        assertTrue(bufferedReader.readLine().contains("PNG"));
    }

    private ServiceContext getServiceContext() {
        return new ServiceContext("junit", "junit", "app");
    }

    private Dataset buildDatasetToExportExcel() {
        //@formatter:off
        Dataset dataset = DatasetMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO").dimensionValue("ANDALUCIA", "Andalucía").dimensionValue("ARAGON", "Aragón")
                .dimension("TIME_PERIOD").dimensionValue("2013", "Año 2013").dimensionValue("2012", "Año 2012")
                .dimension("CATEGORIA_ALOJAMIENTO").dimensionValue("1_2_3_ESTRELLAS", "1, 2, 3 *").dimensionValue("4_5_ESTRELLAS", "4, 5 *")
                .dimension("INDICADORES").dimensionValue("INDICE_OCUPACION_PLAZAS")
                .observations("1.1 | 2.2 | 3.3 | 4.4 | 5.5 | 6.6 | 7.7 | 8.8")
                .build();
        return dataset;
        //@formatter:on
    }

    private Dataset buildDatasetToExportTsv() {
        //@formatter:off
        return DatasetMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", "Destino de alojamiento").heading().dimensionValue("ANDALUCIA", "Andalucía").dimensionValue("ARAGON", "Aragón")
                .dimension("TIME_PERIOD").heading().dimensionValue("2013", "Año 2013").dimensionValue("2012", "Año 2012")
                .dimension("CATEGORIA_ALOJAMIENTO").stub().dimensionValue("1_2_3_ESTRELLAS", "1, 2 y 3 estrellas").dimensionValue("4_5_ESTRELLAS", "4 y 5 estrellas")
                .dimension("INDICADORES").stub().dimensionValue("INDICE_OCUPACION_PLAZAS", "Índice de ocupación de plazas")
                .attribute("ATTRIBUTE_A", "Attribute A", AttributeAttachmentLevelType.DATASET)
                .attribute("ATTRIBUTE_B", "Attribute B", AttributeAttachmentLevelType.PRIMARY_MEASURE)
                           .attributeValue("b1", "Attribute b1").attributeValue("b2", "Attribute b2").attributeValue("b3", "Attribute b3")
                           .attributeValue("b4", "Attribute b4").attributeValue("b5", "Attribute b5").attributeValue("b6", "Attribute b6")
                           .attributeValue("b7", "Attribute b7").attributeValue("b8", "Attribute b8").attributeValue("b9", "Attribute b9")
                .attribute("ATTRIBUTE_C", "Attribute C",AttributeAttachmentLevelType.PRIMARY_MEASURE)
                .attribute("ATTRIBUTE_D", "Attribute D",AttributeAttachmentLevelType.PRIMARY_MEASURE)
                           .attributeValue("d1", "Attribute d1").attributeValue("d2", "Attribute d2").attributeValue("d3", "Attribute d3")
                           .attributeValue("d4", "Attribute d4").attributeValue("d5", "Attribute d5").attributeValue("d6", "Attribute d6")
                           .attributeValue("d7", "Attribute d7").attributeValue("d8", "Attribute d8").attributeValue("d9", "Attribute d9")
                .attribute("ATTRIBUTE_E", "Attribute E",AttributeAttachmentLevelType.PRIMARY_MEASURE)
                .observations("1 | 2 | 3 | 4 | 5 | 6 |  | 8")
                .attributeData("ATTRIBUTE_B", "b1 | b2 | b3 |  | b5 | b6 | b7 | b8")
                .attributeData("ATTRIBUTE_D", "d1 | d2 | d3 | d4 | d5 | d6 | d7 | d8")
                .attributeData("ATTRIBUTE_E", "e1 | e2 | e3 | e4 | e5 | e6 | e7 | e8")
                .build();
        //@formatter:on
    }

    private BufferedReader createBufferedReader(File file) throws Exception {
        return new BufferedReader(new InputStreamReader(new FileInputStream(file), "UTF8"));
    }
}