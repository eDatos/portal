package org.siemac.metamac.portal.core.serviceapi;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;

import org.apache.commons.lang.StringUtils;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;
import org.junit.runner.RunWith;
import org.siemac.metamac.portal.core.domain.DatasetSelectionForExcel;
import org.siemac.metamac.portal.core.domain.DatasetSelectionForPlainText;
import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;
import org.siemac.metamac.portal.core.enume.PlainTextTypeEnum;
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
                .dimension("TIME_PERIOD", 1, LabelVisualisationModeEnum.CODE).dimensionValues("2012", "2013")
                .dimension("CATEGORIA_ALOJAMIENTO", 20, LabelVisualisationModeEnum.CODE).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", 40, LabelVisualisationModeEnum.CODE).dimensionValues("INDICE_OCUPACION_PLAZAS")
                .attribute("ATTRIBUTE_A", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_A2", LabelVisualisationModeEnum.CODE)
                .attribute("NOTEX", LabelVisualisationModeEnum.CODE)
                .attribute("VALUENOTEX", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_DESTINO_ALOJAMIENTO_01", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03", LabelVisualisationModeEnum.CODE)
                .attribute("INDICADORES_A", LabelVisualisationModeEnum.CODE)
                .attribute("CELLNOTE_A", LabelVisualisationModeEnum.CODE)
                .attribute("CELLNOTE_B", LabelVisualisationModeEnum.CODE)
                .attribute("CELLNOTE_C", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_B", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_C", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_D", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_E", LabelVisualisationModeEnum.CODE)
                .buildForExcel();

         //@formatter:on

        File tmpFile = tempFolder.newFile();
        FileOutputStream out = new FileOutputStream(tmpFile);

        Dataset dataset = buildDatasetToExport();
        exportService.exportDatasetToExcel(ctx, dataset, datasetSelection, "es", out);

        out.close();

        // Check excel checksum
        byte[] expected = new byte[]{60, -54, 18, 59, -43, -68, 103, -118, -84, 35, -117, 83, 127, -76, 50, 23};
        Asserts.assertBytesArray(expected, ExcelUtils.createExcelContentHash(tmpFile));
    }

    @Test
    public void testExportDatasetToExcelWithLabels() throws Exception {
        //@formatter:off
        DatasetSelectionForExcel datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", 0, LabelVisualisationModeEnum.LABEL).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", 1, LabelVisualisationModeEnum.LABEL).dimensionValues("2012", "2013")
                .dimension("CATEGORIA_ALOJAMIENTO", 20, LabelVisualisationModeEnum.LABEL).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", 40, LabelVisualisationModeEnum.LABEL).dimensionValues("INDICE_OCUPACION_PLAZAS")
                .buildForExcel();

         //@formatter:on

        File tmpFile = tempFolder.newFile();
        FileOutputStream out = new FileOutputStream(tmpFile);

        Dataset dataset = buildDatasetToExport();
        exportService.exportDatasetToExcel(ctx, dataset, datasetSelection, "es", out);

        out.close();

        // Check excel checksum
        byte[] expected = new byte[]{107, -124, -50, -9, -32, -60, -70, -4, -68, 105, -101, -1, -79, 100, -19, -2};
        Asserts.assertBytesArray(expected, ExcelUtils.createExcelContentHash(tmpFile));
    }

    @Test
    public void testExportDatasetToExcelWithLabelsAndCodes() throws Exception {
        //@formatter:off
        DatasetSelectionForExcel datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", 0, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", 1, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("2012", "2013")
                .dimension("CATEGORIA_ALOJAMIENTO", 20, LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", 40, null).dimensionValues("INDICE_OCUPACION_PLAZAS")// do not specify visualisation mode (apply default)
                .buildForExcel();

         //@formatter:on

        File tmpFile = tempFolder.newFile();
        FileOutputStream out = new FileOutputStream(tmpFile);

        Dataset dataset = buildDatasetToExport();
        exportService.exportDatasetToExcel(ctx, dataset, datasetSelection, "es", out);

        out.close();

        // Check excel checksum
        byte[] expected = new byte[]{-66, -1, -51, 126, 26, -33, -48, -44, 11, -107, -128, 26, -3, 121, -59, -89};
        Asserts.assertBytesArray(expected, ExcelUtils.createExcelContentHash(tmpFile));
    }

    @Override
    public void testExportDatasetToTsv() throws Exception {
        // Tested in testExportDatasetToPlainText* methods
    }

    @Override
    public void testExportDatasetToCsvCommaSeparated() throws Exception {
        // Tested in testExportDatasetToPlainText* methods
    }

    @Override
    public void testExportDatasetToCsvSemicolonSeparated() throws Exception {
        // Tested in testExportDatasetToPlainText* methods
    }

    @Test
    public void testExportDatasetToPlainTextWithCodes() throws Exception {

        Dataset dataset = buildDatasetToExport();

        //@formatter:off
        DatasetSelectionForPlainText datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", LabelVisualisationModeEnum.CODE).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", LabelVisualisationModeEnum.CODE).dimensionValues("2013", "2012")
                .dimension("CATEGORIA_ALOJAMIENTO", LabelVisualisationModeEnum.CODE).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", LabelVisualisationModeEnum.CODE).dimensionValues("INDICE_OCUPACION_PLAZAS")
                .attribute("ATTRIBUTE_A", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_A2", LabelVisualisationModeEnum.CODE)
                .attribute("NOTEX", LabelVisualisationModeEnum.CODE)
                .attribute("VALUENOTEX", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_DESTINO_ALOJAMIENTO_01", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03", LabelVisualisationModeEnum.CODE)
                .attribute("INDICADORES_A", LabelVisualisationModeEnum.CODE)
                .attribute("CELLNOTE_A", LabelVisualisationModeEnum.CODE)
                .attribute("CELLNOTE_B", LabelVisualisationModeEnum.CODE)
                .attribute("CELLNOTE_C", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_B", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_C", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_D", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_E", LabelVisualisationModeEnum.CODE)
                .buildForTsv();
        //@formatter:on

        {
            // TSV
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportDatasetToTsv(ctx, dataset, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate observations with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.TSV.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.TSV.getSeparator(), tmpFileAttributes);
        }

        {
            // CSV comma separated
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportDatasetToCsvCommaSeparated(ctx, dataset, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate observations with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.CSV_COMMA.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.CSV_COMMA.getSeparator(), tmpFileAttributes);
        }

        {
            // CSV semicolon separated
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportDatasetToCsvSemicolonSeparated(ctx, dataset, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate observations with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.CSV_SEMICOLON.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodes(PlainTextTypeEnum.CSV_SEMICOLON.getSeparator(), tmpFileAttributes);
        }
    }

    private void validateAttributesWithDatasetAndDimensionAttachmentCodes(String separator, File tmpFileAttributes) throws Exception, IOException {
        BufferedReader bufferedReaderAttributes = createBufferedReader(tmpFileAttributes);
        assertEquals("DESTINO_ALOJAMIENTO" + separator + "TIME_PERIOD" + separator + "CATEGORIA_ALOJAMIENTO" + separator + "INDICADORES" + separator + "ATTRIBUTE" + separator + "ATTRIBUTE_VALUE",
                bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_A" + separator + "a1",
                bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_A2" + separator + "a2",
                bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "NOTEX" + separator + "a3",
                bufferedReaderAttributes.readLine());
        assertEquals("ANDALUCIA" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "VALUENOTEX" + separator + "vn1",
                bufferedReaderAttributes.readLine());
        assertEquals("ARAGON" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "VALUENOTEX" + separator + "vn2",
                bufferedReaderAttributes.readLine());
        assertEquals("ANDALUCIA" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_DESTINO_ALOJAMIENTO_01" + separator + "da1",
                bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "1_2_3_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01" + separator
                + "ca1", bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01" + separator
                + "ca2", bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "1_2_3_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02" + separator
                + "ca3", bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02" + separator
                + "ca4", bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03" + separator
                + "ca5", bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "INDICE_OCUPACION_PLAZAS" + separator + "INDICADORES_A" + separator + "ioA_1",
                bufferedReaderAttributes.readLine());
        assertEquals("ANDALUCIA" + separator + "2012" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_A" + separator + "cnA_1",
                bufferedReaderAttributes.readLine());
        assertEquals("ANDALUCIA" + separator + "2013" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_A" + separator + "cnA_2",
                bufferedReaderAttributes.readLine());
        assertEquals("ARAGON" + separator + "2012" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_A" + separator + "cnA_3",
                bufferedReaderAttributes.readLine());
        assertEquals("ARAGON" + separator + "2013" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_A" + separator + "cnA_4",
                bufferedReaderAttributes.readLine());
        assertEquals("ANDALUCIA" + separator + "2012" + separator + "1_2_3_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_1",
                bufferedReaderAttributes.readLine());
        assertEquals("ANDALUCIA" + separator + "2012" + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_2",
                bufferedReaderAttributes.readLine());
        assertEquals("ANDALUCIA" + separator + "2013" + separator + "1_2_3_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_3",
                bufferedReaderAttributes.readLine());
        assertEquals("ARAGON" + separator + "2012" + separator + "1_2_3_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_5",
                bufferedReaderAttributes.readLine());
        assertEquals("ARAGON" + separator + "2012" + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_6", bufferedReaderAttributes.readLine());
        assertEquals("ARAGON" + separator + "2013" + separator + "1_2_3_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_7",
                bufferedReaderAttributes.readLine());
        assertEquals("ARAGON" + separator + "2013" + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_8", bufferedReaderAttributes.readLine());
        assertEquals("ANDALUCIA" + separator + "2012" + separator + "1_2_3_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "CELLNOTE_C" + separator + "cnC_1",
                bufferedReaderAttributes.readLine());
        assertEquals("ANDALUCIA" + separator + "2012" + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "CELLNOTE_C" + separator + "cnC_2",
                bufferedReaderAttributes.readLine());
        assertEquals("ARAGON" + separator + "2012" + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY + separator + "CELLNOTE_C" + separator + "cnC_6", bufferedReaderAttributes.readLine());
        assertEquals(null, bufferedReaderAttributes.readLine());

        bufferedReaderAttributes.close();
    }

    private void validateObservationsWithDatasetAndDimensionAttachmentCodes(String separator, File tmpFileObservations) throws Exception, IOException {
        BufferedReader bufferedReaderObservations = createBufferedReader(tmpFileObservations);
        assertEquals("DESTINO_ALOJAMIENTO" + separator + "TIME_PERIOD" + separator + "CATEGORIA_ALOJAMIENTO" + separator + "INDICADORES" + separator + "OBS_VALUE" + separator + "ATTRIBUTE_B"
                + separator + "ATTRIBUTE_C" + separator + "ATTRIBUTE_D" + separator + "ATTRIBUTE_E", bufferedReaderObservations.readLine());
        assertEquals("ANDALUCIA" + separator + "2012" + separator + "1_2_3_ESTRELLAS" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "1.1" + separator + "b1" + separator + StringUtils.EMPTY
                + separator + "d1" + separator + "e1", bufferedReaderObservations.readLine());
        assertEquals("ANDALUCIA" + separator + "2012" + separator + "4_5_ESTRELLAS" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "2" + separator + "b2" + separator + StringUtils.EMPTY
                + separator + "d2" + separator + "e2", bufferedReaderObservations.readLine());
        assertEquals("ANDALUCIA" + separator + "2013" + separator + "1_2_3_ESTRELLAS" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "3" + separator + "b3" + separator + StringUtils.EMPTY
                + separator + "d3" + separator + "e3", bufferedReaderObservations.readLine());
        assertEquals("ANDALUCIA" + separator + "2013" + separator + "4_5_ESTRELLAS" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "4" + separator + StringUtils.EMPTY + separator
                + StringUtils.EMPTY + separator + "d4" + separator + "e4", bufferedReaderObservations.readLine());
        assertEquals("ARAGON" + separator + "2012" + separator + "1_2_3_ESTRELLAS" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "5" + separator + "b5" + separator + StringUtils.EMPTY
                + separator + "d5" + separator + "e5", bufferedReaderObservations.readLine());
        assertEquals("ARAGON" + separator + "2012" + separator + "4_5_ESTRELLAS" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "6" + separator + "b6" + separator + StringUtils.EMPTY
                + separator + "d6" + separator + "e6", bufferedReaderObservations.readLine());
        assertEquals("ARAGON" + separator + "2013" + separator + "1_2_3_ESTRELLAS" + separator + "INDICE_OCUPACION_PLAZAS" + separator + StringUtils.EMPTY + separator + "b7" + separator
                + StringUtils.EMPTY + separator + "d7" + separator + "e7", bufferedReaderObservations.readLine());
        assertEquals("ARAGON" + separator + "2013" + separator + "4_5_ESTRELLAS" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "8" + separator + "b8" + separator + StringUtils.EMPTY
                + separator + "d8" + separator + "e8", bufferedReaderObservations.readLine());
        assertEquals(null, bufferedReaderObservations.readLine());
        bufferedReaderObservations.close();
    }

    @Test
    public void testExportDatasetToTsvWithLabels() throws Exception {

        Dataset dataset = buildDatasetToExport();

        //@formatter:off
        DatasetSelectionForPlainText datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", LabelVisualisationModeEnum.LABEL).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", LabelVisualisationModeEnum.LABEL).dimensionValues("2013", "2012")
                .dimension("CATEGORIA_ALOJAMIENTO", LabelVisualisationModeEnum.LABEL).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", LabelVisualisationModeEnum.LABEL).dimensionValues("INDICE_OCUPACION_PLAZAS")
                .attribute("ATTRIBUTE_A", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_A2", LabelVisualisationModeEnum.LABEL)
                .attribute("NOTEX", LabelVisualisationModeEnum.LABEL)
                .attribute("VALUENOTEX", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_DESTINO_ALOJAMIENTO_01", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03", LabelVisualisationModeEnum.LABEL)
                .attribute("INDICADORES_A", LabelVisualisationModeEnum.LABEL)
                .attribute("CELLNOTE_A", LabelVisualisationModeEnum.LABEL)
                .attribute("CELLNOTE_B", LabelVisualisationModeEnum.LABEL)
                .attribute("CELLNOTE_C", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_B", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_C", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_D", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_E", LabelVisualisationModeEnum.LABEL)
                .buildForTsv();
        //@formatter:on

        {
            // TSV
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportDatasetToTsv(ctx, dataset, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate observations with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentLabels(PlainTextTypeEnum.TSV.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentLabels(PlainTextTypeEnum.TSV.getSeparator(), tmpFileAttributes);
        }

        {
            // Csv comma separated
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportDatasetToCsvCommaSeparated(ctx, dataset, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate observations with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentLabels(PlainTextTypeEnum.CSV_COMMA.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentLabels(PlainTextTypeEnum.CSV_COMMA.getSeparator(), tmpFileAttributes);
        }

        {
            // Csv semi colon separated
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportDatasetToCsvSemicolonSeparated(ctx, dataset, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate observations with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentLabels(PlainTextTypeEnum.CSV_SEMICOLON.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentLabels(PlainTextTypeEnum.CSV_SEMICOLON.getSeparator(), tmpFileAttributes);
        }
    }

    private void validateAttributesWithDatasetAndDimensionAttachmentLabels(String separator, File tmpFileAttributes) throws Exception, IOException {
        BufferedReader bufferedReaderAttributes = createBufferedReader(tmpFileAttributes);
        assertEquals("DESTINO_ALOJAMIENTO" + separator + "TIME_PERIOD" + separator + "CATEGORIA_ALOJAMIENTO" + separator + "INDICADORES" + separator + "ATTRIBUTE" + separator + "ATTRIBUTE_VALUE",
                bufferedReaderAttributes.readLine());
        assertEquals("" + separator + "" + separator + "" + separator + "" + separator + "ATTRIBUTE_A" + separator + "a1", bufferedReaderAttributes.readLine());
        assertEquals("" + separator + "" + separator + "" + separator + "" + separator + "ATTRIBUTE_A2" + separator + "Attribute a2", bufferedReaderAttributes.readLine());
        assertEquals("" + separator + "" + separator + "" + separator + "" + separator + "NOTEX" + separator + "Notex a3", bufferedReaderAttributes.readLine());
        assertEquals("Andalucía" + separator + "" + separator + "" + separator + "" + separator + "VALUENOTEX" + separator + "vn1", bufferedReaderAttributes.readLine());
        assertEquals("Aragón" + separator + "" + separator + "" + separator + "" + separator + "VALUENOTEX" + separator + "vn2", bufferedReaderAttributes.readLine());
        assertEquals("Andalucía" + separator + "" + separator + "" + separator + "" + separator + "ATTRIBUTE_DESTINO_ALOJAMIENTO_01" + separator + "Destino 1", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("" + separator + "" + separator + "\"1, 2 y 3 estrellas\"" + separator + "" + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01" + separator + "ca1",
                    bufferedReaderAttributes.readLine());
        } else {
            assertEquals("" + separator + "" + separator + "1, 2 y 3 estrellas" + separator + "" + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01" + separator + "ca1",
                    bufferedReaderAttributes.readLine());
        }

        assertEquals("" + separator + "" + separator + "4 y 5 estrellas" + separator + "" + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01" + separator + "ca2", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("" + separator + "" + separator + "\"1, 2 y 3 estrellas\"" + separator + "" + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02" + separator + "ca3",
                    bufferedReaderAttributes.readLine());
        } else {
            assertEquals("" + separator + "" + separator + "1, 2 y 3 estrellas" + separator + "" + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02" + separator + "ca3",
                    bufferedReaderAttributes.readLine());
        }

        assertEquals("" + separator + "" + separator + "4 y 5 estrellas" + separator + "" + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02" + separator + "ca4", bufferedReaderAttributes.readLine());
        assertEquals("" + separator + "" + separator + "4 y 5 estrellas" + separator + "" + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03" + separator + "Categoría 5",
                bufferedReaderAttributes.readLine());
        assertEquals("" + separator + "" + separator + "" + separator + "Índice de ocupación de plazas" + separator + "INDICADORES_A" + separator + "ioA_1", bufferedReaderAttributes.readLine());
        assertEquals("Andalucía" + separator + "Año 2012" + separator + "" + separator + "" + separator + "CELLNOTE_A" + separator + "cnA_1", bufferedReaderAttributes.readLine());
        assertEquals("Andalucía" + separator + "Año 2013" + separator + "" + separator + "" + separator + "CELLNOTE_A" + separator + "cnA_2", bufferedReaderAttributes.readLine());
        assertEquals("Aragón" + separator + "Año 2012" + separator + "" + separator + "" + separator + "CELLNOTE_A" + separator + "cnA_3", bufferedReaderAttributes.readLine());
        assertEquals("Aragón" + separator + "Año 2013" + separator + "" + separator + "" + separator + "CELLNOTE_A" + separator + "cnA_4", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "Año 2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + "" + separator + "CELLNOTE_B" + separator + "cnB_1",
                    bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Andalucía" + separator + "Año 2012" + separator + "1, 2 y 3 estrellas" + separator + "" + separator + "CELLNOTE_B" + separator + "cnB_1", bufferedReaderAttributes.readLine());
        }

        assertEquals("Andalucía" + separator + "Año 2012" + separator + "4 y 5 estrellas" + separator + "" + separator + "CELLNOTE_B" + separator + "cnB_2", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "Año 2013" + separator + "\"1, 2 y 3 estrellas\"" + separator + "" + separator + "CELLNOTE_B" + separator + "cnB_3",
                    bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Andalucía" + separator + "Año 2013" + separator + "1, 2 y 3 estrellas" + separator + "" + separator + "CELLNOTE_B" + separator + "cnB_3", bufferedReaderAttributes.readLine());
        }

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Aragón" + separator + "Año 2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + "" + separator + "CELLNOTE_B" + separator + "cnB_5",
                    bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Aragón" + separator + "Año 2012" + separator + "1, 2 y 3 estrellas" + separator + "" + separator + "CELLNOTE_B" + separator + "cnB_5", bufferedReaderAttributes.readLine());
        }

        assertEquals("Aragón" + separator + "Año 2012" + separator + "4 y 5 estrellas" + separator + "" + separator + "CELLNOTE_B" + separator + "cnB_6", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Aragón" + separator + "Año 2013" + separator + "\"1, 2 y 3 estrellas\"" + separator + "" + separator + "CELLNOTE_B" + separator + "cnB_7",
                    bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Aragón" + separator + "Año 2013" + separator + "1, 2 y 3 estrellas" + separator + "" + separator + "CELLNOTE_B" + separator + "cnB_7", bufferedReaderAttributes.readLine());
        }

        assertEquals("Aragón" + separator + "Año 2013" + separator + "4 y 5 estrellas" + separator + "" + separator + "CELLNOTE_B" + separator + "cnB_8", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "Año 2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + "" + separator + "CELLNOTE_C" + separator + "Cell C1",
                    bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Andalucía" + separator + "Año 2012" + separator + "1, 2 y 3 estrellas" + separator + "" + separator + "CELLNOTE_C" + separator + "Cell C1",
                    bufferedReaderAttributes.readLine());
        }

        assertEquals("Andalucía" + separator + "Año 2012" + separator + "4 y 5 estrellas" + separator + "" + separator + "CELLNOTE_C" + separator + "Cell C2", bufferedReaderAttributes.readLine());
        assertEquals("Aragón" + separator + "Año 2012" + separator + "4 y 5 estrellas" + separator + "" + separator + "CELLNOTE_C" + separator + "Cell C6", bufferedReaderAttributes.readLine());
        assertEquals(null, bufferedReaderAttributes.readLine());
        bufferedReaderAttributes.close();
    }

    private void validateObservationsWithDatasetAndDimensionAttachmentLabels(String separator, File tmpFileObservations) throws Exception, IOException {
        BufferedReader bufferedReader = createBufferedReader(tmpFileObservations);

        assertEquals("DESTINO_ALOJAMIENTO" + separator + "TIME_PERIOD" + separator + "CATEGORIA_ALOJAMIENTO" + separator + "INDICADORES" + separator + "OBS_VALUE" + separator + "ATTRIBUTE_B"
                + separator + "ATTRIBUTE_C" + separator + "ATTRIBUTE_D" + separator + "ATTRIBUTE_E", bufferedReader.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "Año 2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + "Índice de ocupación de plazas" + separator + "1.1" + separator + "Attribute b1"
                    + separator + "" + separator + "Attribute d1" + separator + "e1", bufferedReader.readLine());
        } else {
            assertEquals("Andalucía" + separator + "Año 2012" + separator + "1, 2 y 3 estrellas" + separator + "Índice de ocupación de plazas" + separator + "1.1" + separator + "Attribute b1"
                    + separator + "" + separator + "Attribute d1" + separator + "e1", bufferedReader.readLine());
        }

        assertEquals("Andalucía" + separator + "Año 2012" + separator + "4 y 5 estrellas" + separator + "Índice de ocupación de plazas" + separator + "2" + separator + "Attribute b2" + separator + ""
                + separator + "Attribute d2" + separator + "e2", bufferedReader.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "Año 2013" + separator + "\"1, 2 y 3 estrellas\"" + separator + "Índice de ocupación de plazas" + separator + "3" + separator + "Attribute b3"
                    + separator + "" + separator + "Attribute d3" + separator + "e3", bufferedReader.readLine());
        } else {
            assertEquals("Andalucía" + separator + "Año 2013" + separator + "1, 2 y 3 estrellas" + separator + "Índice de ocupación de plazas" + separator + "3" + separator + "Attribute b3"
                    + separator + "" + separator + "Attribute d3" + separator + "e3", bufferedReader.readLine());
        }

        assertEquals("Andalucía" + separator + "Año 2013" + separator + "4 y 5 estrellas" + separator + "Índice de ocupación de plazas" + separator + "4" + separator + "" + separator + "" + separator
                + "Attribute d4" + separator + "e4", bufferedReader.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Aragón" + separator + "Año 2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + "Índice de ocupación de plazas" + separator + "5" + separator + "Attribute b5"
                    + separator + "" + separator + "Attribute d5" + separator + "e5", bufferedReader.readLine());
        } else {
            assertEquals("Aragón" + separator + "Año 2012" + separator + "1, 2 y 3 estrellas" + separator + "Índice de ocupación de plazas" + separator + "5" + separator + "Attribute b5" + separator
                    + "" + separator + "Attribute d5" + separator + "e5", bufferedReader.readLine());
        }

        assertEquals("Aragón" + separator + "Año 2012" + separator + "4 y 5 estrellas" + separator + "Índice de ocupación de plazas" + separator + "6" + separator + "Attribute b6" + separator + ""
                + separator + "Attribute d6" + separator + "e6", bufferedReader.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Aragón" + separator + "Año 2013" + separator + "\"1, 2 y 3 estrellas\"" + separator + "Índice de ocupación de plazas" + separator + "" + separator + "Attribute b7"
                    + separator + "" + separator + "Attribute d7" + separator + "e7", bufferedReader.readLine());
        } else {
            assertEquals("Aragón" + separator + "Año 2013" + separator + "1, 2 y 3 estrellas" + separator + "Índice de ocupación de plazas" + separator + "" + separator + "Attribute b7" + separator
                    + "" + separator + "Attribute d7" + separator + "e7", bufferedReader.readLine());
        }

        assertEquals("Aragón" + separator + "Año 2013" + separator + "4 y 5 estrellas" + separator + "Índice de ocupación de plazas" + separator + "8" + separator + "Attribute b8" + separator + ""
                + separator + "Attribute d8" + separator + "e8", bufferedReader.readLine());
        assertEquals(null, bufferedReader.readLine());
        bufferedReader.close();
    }

    @Test
    public void testExportDatasetToTsvWithCodesAndLabels() throws Exception {

        Dataset dataset = buildDatasetToExport();

        //@formatter:off
        DatasetSelectionForPlainText datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("2013", "2012")
                .dimension("CATEGORIA_ALOJAMIENTO", LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES", LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("INDICE_OCUPACION_PLAZAS")
                .attribute("ATTRIBUTE_B", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_C", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_D", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_E", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_A", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_A2", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("NOTEX", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("VALUENOTEX", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_DESTINO_ALOJAMIENTO_01", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("INDICADORES_A", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("CELLNOTE_A", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("CELLNOTE_B", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("CELLNOTE_C", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .buildForTsv();
        //@formatter:on

        {
            // TSV
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportDatasetToTsv(ctx, dataset, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate attributes with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodesAndLabels(PlainTextTypeEnum.TSV.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodesAndLabels(PlainTextTypeEnum.TSV.getSeparator(), tmpFileAttributes);
        }

        {
            // CSV comma separated
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportDatasetToCsvCommaSeparated(ctx, dataset, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate attributes with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodesAndLabels(PlainTextTypeEnum.CSV_COMMA.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodesAndLabels(PlainTextTypeEnum.CSV_COMMA.getSeparator(), tmpFileAttributes);
        }

        {
            // CSV semicolon separated
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportDatasetToCsvSemicolonSeparated(ctx, dataset, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate attributes with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodesAndLabels(PlainTextTypeEnum.CSV_SEMICOLON.getSeparator(), tmpFileObservations);

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodesAndLabels(PlainTextTypeEnum.CSV_SEMICOLON.getSeparator(), tmpFileAttributes);
        }
    }

    private void validateAttributesWithDatasetAndDimensionAttachmentCodesAndLabels(String separator, File tmpFileAttributes) throws Exception, IOException {
        BufferedReader bufferedReaderAttributes = createBufferedReader(tmpFileAttributes);
        assertEquals("DESTINO_ALOJAMIENTO" + separator + "DESTINO_ALOJAMIENTO_CODE" + separator + "TIME_PERIOD" + separator + "TIME_PERIOD_CODE" + separator + "CATEGORIA_ALOJAMIENTO" + separator
                + "CATEGORIA_ALOJAMIENTO_CODE" + separator + "INDICADORES" + separator + "INDICADORES_CODE" + separator + "ATTRIBUTE" + separator + "ATTRIBUTE_VALUE" + separator
                + "ATTRIBUTE_VALUE_CODE", bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_A" + separator + "a1" + separator + "a1", bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_A2" + separator + "Attribute a2" + separator + "a2", bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "NOTEX" + separator + "Notex a3" + separator + "a3", bufferedReaderAttributes.readLine());
        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "VALUENOTEX" + separator + "vn1" + separator + "vn1", bufferedReaderAttributes.readLine());
        assertEquals("Aragón" + separator + "ARAGON" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "VALUENOTEX" + separator + "vn2" + separator + "vn2", bufferedReaderAttributes.readLine());
        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_DESTINO_ALOJAMIENTO_01" + separator + "Destino 1" + separator + "da1", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "\"1, 2 y 3 estrellas\"" + separator
                    + "1_2_3_ESTRELLAS" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01" + separator + "ca1" + separator + "ca1",
                    bufferedReaderAttributes.readLine());
        } else {
            assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "1, 2 y 3 estrellas" + separator
                    + "1_2_3_ESTRELLAS" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01" + separator + "ca1" + separator + "ca1",
                    bufferedReaderAttributes.readLine());
        }

        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "4 y 5 estrellas" + separator + "4_5_ESTRELLAS"
                + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01" + separator + "ca2" + separator + "ca2",
                bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "\"1, 2 y 3 estrellas\"" + separator
                    + "1_2_3_ESTRELLAS" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02" + separator + "ca3" + separator + "ca3",
                    bufferedReaderAttributes.readLine());
        } else {
            assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "1, 2 y 3 estrellas" + separator
                    + "1_2_3_ESTRELLAS" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02" + separator + "ca3" + separator + "ca3",
                    bufferedReaderAttributes.readLine());
        }

        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "4 y 5 estrellas" + separator + "4_5_ESTRELLAS"
                + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02" + separator + "ca4" + separator + "ca4",
                bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "4 y 5 estrellas" + separator + "4_5_ESTRELLAS"
                + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03" + separator + "Categoría 5" + separator + "ca5",
                bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "INDICADORES_A" + separator + "ioA_1" + separator + "ioA_1",
                bufferedReaderAttributes.readLine());
        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2012" + separator + "2012" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_A" + separator + "cnA_1" + separator + "cnA_1", bufferedReaderAttributes.readLine());
        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2013" + separator + "2013" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_A" + separator + "cnA_2" + separator + "cnA_2", bufferedReaderAttributes.readLine());
        assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2012" + separator + "2012" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + StringUtils.EMPTY + separator + "CELLNOTE_A" + separator + "cnA_3" + separator + "cnA_3", bufferedReaderAttributes.readLine());
        assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2013" + separator + "2013" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + StringUtils.EMPTY + separator + "CELLNOTE_A" + separator + "cnA_4" + separator + "cnA_4", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2012" + separator + "2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + "1_2_3_ESTRELLAS" + separator
                    + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_1" + separator + "cnB_1", bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2012" + separator + "2012" + separator + "1, 2 y 3 estrellas" + separator + "1_2_3_ESTRELLAS" + separator
                    + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_1" + separator + "cnB_1", bufferedReaderAttributes.readLine());
        }

        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2012" + separator + "2012" + separator + "4 y 5 estrellas" + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY
                + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_2" + separator + "cnB_2", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2013" + separator + "2013" + separator + "\"1, 2 y 3 estrellas\"" + separator + "1_2_3_ESTRELLAS" + separator
                    + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_3" + separator + "cnB_3", bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2013" + separator + "2013" + separator + "1, 2 y 3 estrellas" + separator + "1_2_3_ESTRELLAS" + separator
                    + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_3" + separator + "cnB_3", bufferedReaderAttributes.readLine());
        }

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2012" + separator + "2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + "1_2_3_ESTRELLAS" + separator
                    + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_5" + separator + "cnB_5", bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2012" + separator + "2012" + separator + "1, 2 y 3 estrellas" + separator + "1_2_3_ESTRELLAS" + separator
                    + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_5" + separator + "cnB_5", bufferedReaderAttributes.readLine());
        }

        assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2012" + separator + "2012" + separator + "4 y 5 estrellas" + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY
                + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_6" + separator + "cnB_6", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2013" + separator + "2013" + separator + "\"1, 2 y 3 estrellas\"" + separator + "1_2_3_ESTRELLAS" + separator
                    + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_7" + separator + "cnB_7", bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2013" + separator + "2013" + separator + "1, 2 y 3 estrellas" + separator + "1_2_3_ESTRELLAS" + separator
                    + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_7" + separator + "cnB_7", bufferedReaderAttributes.readLine());
        }

        assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2013" + separator + "2013" + separator + "4 y 5 estrellas" + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY
                + separator + StringUtils.EMPTY + separator + "CELLNOTE_B" + separator + "cnB_8" + separator + "cnB_8", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2012" + separator + "2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + "1_2_3_ESTRELLAS" + separator
                    + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_C" + separator + "Cell C1" + separator + "cnC_1", bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2012" + separator + "2012" + separator + "1, 2 y 3 estrellas" + separator + "1_2_3_ESTRELLAS" + separator
                    + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_C" + separator + "Cell C1" + separator + "cnC_1", bufferedReaderAttributes.readLine());
        }

        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2012" + separator + "2012" + separator + "4 y 5 estrellas" + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY
                + separator + StringUtils.EMPTY + separator + "CELLNOTE_C" + separator + "Cell C2" + separator + "cnC_2", bufferedReaderAttributes.readLine());
        assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2012" + separator + "2012" + separator + "4 y 5 estrellas" + separator + "4_5_ESTRELLAS" + separator + StringUtils.EMPTY
                + separator + StringUtils.EMPTY + separator + "CELLNOTE_C" + separator + "Cell C6" + separator + "cnC_6", bufferedReaderAttributes.readLine());
        assertEquals(null, bufferedReaderAttributes.readLine());
        bufferedReaderAttributes.close();
    }

    private void validateObservationsWithDatasetAndDimensionAttachmentCodesAndLabels(String separator, File tmpFileObservations) throws Exception, IOException {
        BufferedReader bufferedReader = createBufferedReader(tmpFileObservations);
        assertEquals("DESTINO_ALOJAMIENTO" + separator + "DESTINO_ALOJAMIENTO_CODE" + separator + "TIME_PERIOD" + separator + "TIME_PERIOD_CODE" + separator + "CATEGORIA_ALOJAMIENTO" + separator
                + "CATEGORIA_ALOJAMIENTO_CODE" + separator + "INDICADORES" + separator + "INDICADORES_CODE" + separator + "OBS_VALUE" + separator + "ATTRIBUTE_B" + separator + "ATTRIBUTE_B_CODE"
                + separator + "ATTRIBUTE_C" + separator + "ATTRIBUTE_C_CODE" + separator + "ATTRIBUTE_D" + separator + "ATTRIBUTE_D_CODE" + separator + "ATTRIBUTE_E" + separator + "ATTRIBUTE_E_CODE",
                bufferedReader.readLine());
        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2012" + separator + "2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + "1_2_3_ESTRELLAS" + separator
                    + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "1.1" + separator + "Attribute b1" + separator + "b1" + separator + StringUtils.EMPTY
                    + separator + "Attribute d1" + separator + "d1" + separator + "e1" + separator + "e1", bufferedReader.readLine());
        } else {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2012" + separator + "2012" + separator + "1, 2 y 3 estrellas" + separator + "1_2_3_ESTRELLAS" + separator
                    + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "1.1" + separator + "Attribute b1" + separator + "b1" + separator + StringUtils.EMPTY
                    + separator + "Attribute d1" + separator + "d1" + separator + "e1" + separator + "e1", bufferedReader.readLine());
        }
        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2012" + separator + "2012" + separator + "4 y 5 estrellas" + separator + "4_5_ESTRELLAS" + separator
                + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "2" + separator + "Attribute b2" + separator + "b2" + separator + StringUtils.EMPTY + separator
                + "Attribute d2" + separator + "d2" + separator + "e2" + separator + "e2", bufferedReader.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2013" + separator + "2013" + separator + "\"1, 2 y 3 estrellas\"" + separator + "1_2_3_ESTRELLAS" + separator
                    + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "3" + separator + "Attribute b3" + separator + "b3" + separator + StringUtils.EMPTY
                    + separator + "Attribute d3" + separator + "d3" + separator + "e3" + separator + "e3", bufferedReader.readLine());
        } else {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2013" + separator + "2013" + separator + "1, 2 y 3 estrellas" + separator + "1_2_3_ESTRELLAS" + separator
                    + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "3" + separator + "Attribute b3" + separator + "b3" + separator + StringUtils.EMPTY
                    + separator + "Attribute d3" + separator + "d3" + separator + "e3" + separator + "e3", bufferedReader.readLine());
        }

        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "Año 2013" + separator + "2013" + separator + "4 y 5 estrellas" + separator + "4_5_ESTRELLAS" + separator
                + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "4" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                + StringUtils.EMPTY + separator + "Attribute d4" + separator + "d4" + separator + "e4" + separator + "e4", bufferedReader.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2012" + separator + "2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + "1_2_3_ESTRELLAS" + separator
                    + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "5" + separator + "Attribute b5" + separator + "b5" + separator + StringUtils.EMPTY
                    + separator + "Attribute d5" + separator + "d5" + separator + "e5" + separator + "e5", bufferedReader.readLine());
        } else {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2012" + separator + "2012" + separator + "1, 2 y 3 estrellas" + separator + "1_2_3_ESTRELLAS" + separator
                    + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "5" + separator + "Attribute b5" + separator + "b5" + separator + StringUtils.EMPTY
                    + separator + "Attribute d5" + separator + "d5" + separator + "e5" + separator + "e5", bufferedReader.readLine());
        }

        assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2012" + separator + "2012" + separator + "4 y 5 estrellas" + separator + "4_5_ESTRELLAS" + separator
                + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "6" + separator + "Attribute b6" + separator + "b6" + separator + StringUtils.EMPTY + separator
                + "Attribute d6" + separator + "d6" + separator + "e6" + separator + "e6", bufferedReader.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2013" + separator + "2013" + separator + "\"1, 2 y 3 estrellas\"" + separator + "1_2_3_ESTRELLAS" + separator
                    + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + StringUtils.EMPTY + separator + "Attribute b7" + separator + "b7" + separator
                    + StringUtils.EMPTY + separator + "Attribute d7" + separator + "d7" + separator + "e7" + separator + "e7", bufferedReader.readLine());
        } else {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2013" + separator + "2013" + separator + "1, 2 y 3 estrellas" + separator + "1_2_3_ESTRELLAS" + separator
                    + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + StringUtils.EMPTY + separator + "Attribute b7" + separator + "b7" + separator
                    + StringUtils.EMPTY + separator + "Attribute d7" + separator + "d7" + separator + "e7" + separator + "e7", bufferedReader.readLine());
        }

        assertEquals("Aragón" + separator + "ARAGON" + separator + "Año 2013" + separator + "2013" + separator + "4 y 5 estrellas" + separator + "4_5_ESTRELLAS" + separator
                + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS" + separator + "8" + separator + "Attribute b8" + separator + "b8" + separator + StringUtils.EMPTY + separator
                + "Attribute d8" + separator + "d8" + separator + "e8" + separator + "e8", bufferedReader.readLine());
        assertEquals(null, bufferedReader.readLine());
        bufferedReader.close();
    }

    @Test
    public void testExportDatasetToTsvWithCodesAndSomeLabels() throws Exception {

        Dataset dataset = buildDatasetToExport();

        //@formatter:off
        DatasetSelectionForPlainText datasetSelection = DatasetSelectionMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", LabelVisualisationModeEnum.CODE_AND_LABEL).dimensionValues("ANDALUCIA", "ARAGON")
                .dimension("TIME_PERIOD", LabelVisualisationModeEnum.CODE).dimensionValues("2013", "2012")
                .dimension("CATEGORIA_ALOJAMIENTO", LabelVisualisationModeEnum.LABEL).dimensionValues("1_2_3_ESTRELLAS", "4_5_ESTRELLAS")
                .dimension("INDICADORES").dimensionValues("INDICE_OCUPACION_PLAZAS")         // do not specify visualisation mode (apply default)
                .attribute("ATTRIBUTE_A", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_A2", LabelVisualisationModeEnum.CODE)
                .attribute("NOTEX", LabelVisualisationModeEnum.LABEL)
                .attribute("VALUENOTEX", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_DESTINO_ALOJAMIENTO_01", LabelVisualisationModeEnum.LABEL)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03", LabelVisualisationModeEnum.CODE)
                .attribute("INDICADORES_A", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("CELLNOTE_A", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("CELLNOTE_B", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("CELLNOTE_C", null)                  // do not specify visualisation mode (apply default)
                .attribute("ATTRIBUTE_B", LabelVisualisationModeEnum.CODE)
                .attribute("ATTRIBUTE_C", LabelVisualisationModeEnum.CODE_AND_LABEL)
                .attribute("ATTRIBUTE_D", null)
                .attribute("ATTRIBUTE_E", LabelVisualisationModeEnum.CODE)

                .buildForTsv();
        //@formatter:on

        {
            // TSV
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportDatasetToTsv(ctx, dataset, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate attributes with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileObservations, PlainTextTypeEnum.TSV.getSeparator());

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileAttributes, PlainTextTypeEnum.TSV.getSeparator());
        }

        {
            // CSV comma separated
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportDatasetToCsvCommaSeparated(ctx, dataset, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate attributes with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileObservations, PlainTextTypeEnum.CSV_COMMA.getSeparator());

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileAttributes, PlainTextTypeEnum.CSV_COMMA.getSeparator());
        }

        {
            // CSV semicolon separated
            File tmpFileObservations = tempFolder.newFile();
            File tmpFileAttributes = tempFolder.newFile();
            FileOutputStream outObservations = new FileOutputStream(tmpFileObservations);
            FileOutputStream outAttributes = new FileOutputStream(tmpFileAttributes);

            exportService.exportDatasetToCsvSemicolonSeparated(ctx, dataset, datasetSelection, "es", outObservations, outAttributes);
            outObservations.close();
            outAttributes.close();

            // Validate attributes with dataset and dimension attachment
            validateObservationsWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileObservations, PlainTextTypeEnum.CSV_SEMICOLON.getSeparator());

            // Validate attributes with dataset and dimension attachment
            validateAttributesWithDatasetAndDimensionAttachmentCodesAndSomeLabels(tmpFileAttributes, PlainTextTypeEnum.CSV_SEMICOLON.getSeparator());
        }
    }

    private void validateAttributesWithDatasetAndDimensionAttachmentCodesAndSomeLabels(File tmpFileAttributes, String separator) throws Exception, IOException {
        BufferedReader bufferedReaderAttributes = createBufferedReader(tmpFileAttributes);
        assertEquals("DESTINO_ALOJAMIENTO" + separator + "DESTINO_ALOJAMIENTO_CODE" + separator + "TIME_PERIOD" + separator + "CATEGORIA_ALOJAMIENTO" + separator + "INDICADORES" + separator
                + "INDICADORES_CODE" + separator + "ATTRIBUTE" + separator + "ATTRIBUTE_VALUE" + separator + "ATTRIBUTE_VALUE_CODE", bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + "ATTRIBUTE_A" + separator + StringUtils.EMPTY + separator + "a1", bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + "ATTRIBUTE_A2" + separator + StringUtils.EMPTY + separator + "a2", bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + "NOTEX" + separator + "Notex a3" + separator + StringUtils.EMPTY, bufferedReaderAttributes.readLine());
        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                + "VALUENOTEX" + separator + "vn1" + separator + "vn1", bufferedReaderAttributes.readLine());
        assertEquals("Aragón" + separator + "ARAGON" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                + "VALUENOTEX" + separator + "vn2" + separator + "vn2", bufferedReaderAttributes.readLine());
        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                + "ATTRIBUTE_DESTINO_ALOJAMIENTO_01" + separator + "Destino 1" + separator + StringUtils.EMPTY, bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "\"1, 2 y 3 estrellas\"" + separator + StringUtils.EMPTY + separator
                    + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01" + separator + "ca1" + separator + "ca1", bufferedReaderAttributes.readLine());
        } else {
            assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "1, 2 y 3 estrellas" + separator + StringUtils.EMPTY + separator
                    + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01" + separator + "ca1" + separator + "ca1", bufferedReaderAttributes.readLine());
        }

        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "4 y 5 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01" + separator + "ca2" + separator + "ca2", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "\"1, 2 y 3 estrellas\"" + separator + StringUtils.EMPTY + separator
                    + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02" + separator + "ca3" + separator + "ca3", bufferedReaderAttributes.readLine());
        } else {
            assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "1, 2 y 3 estrellas" + separator + StringUtils.EMPTY + separator
                    + StringUtils.EMPTY + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02" + separator + "ca3" + separator + "ca3", bufferedReaderAttributes.readLine());
        }

        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "4 y 5 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02" + separator + "ca4" + separator + "ca4", bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "4 y 5 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY
                + separator + "ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03" + separator + StringUtils.EMPTY + separator + "ca5", bufferedReaderAttributes.readLine());
        assertEquals(StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "Índice de ocupación de plazas" + separator
                + "INDICE_OCUPACION_PLAZAS" + separator + "INDICADORES_A" + separator + "ioA_1" + separator + "ioA_1", bufferedReaderAttributes.readLine());
        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2012" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                + "CELLNOTE_A" + separator + "cnA_1" + separator + "cnA_1", bufferedReaderAttributes.readLine());
        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2013" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                + "CELLNOTE_A" + separator + "cnA_2" + separator + "cnA_2", bufferedReaderAttributes.readLine());
        assertEquals("Aragón" + separator + "ARAGON" + separator + "2012" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_A"
                + separator + "cnA_3" + separator + "cnA_3", bufferedReaderAttributes.readLine());
        assertEquals("Aragón" + separator + "ARAGON" + separator + "2013" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_A"
                + separator + "cnA_4" + separator + "cnA_4", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                    + "CELLNOTE_B" + separator + "cnB_1" + separator + "cnB_1", bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2012" + separator + "1, 2 y 3 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                    + "CELLNOTE_B" + separator + "cnB_1" + separator + "cnB_1", bufferedReaderAttributes.readLine());
        }

        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2012" + separator + "4 y 5 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                + "CELLNOTE_B" + separator + "cnB_2" + separator + "cnB_2", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2013" + separator + "\"1, 2 y 3 estrellas\"" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                    + "CELLNOTE_B" + separator + "cnB_3" + separator + "cnB_3", bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2013" + separator + "1, 2 y 3 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                    + "CELLNOTE_B" + separator + "cnB_3" + separator + "cnB_3", bufferedReaderAttributes.readLine());
        }

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                    + "CELLNOTE_B" + separator + "cnB_5" + separator + "cnB_5", bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "2012" + separator + "1, 2 y 3 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                    + "CELLNOTE_B" + separator + "cnB_5" + separator + "cnB_5", bufferedReaderAttributes.readLine());
        }
        assertEquals("Aragón" + separator + "ARAGON" + separator + "2012" + separator + "4 y 5 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_B"
                + separator + "cnB_6" + separator + "cnB_6", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "2013" + separator + "\"1, 2 y 3 estrellas\"" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                    + "CELLNOTE_B" + separator + "cnB_7" + separator + "cnB_7", bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "2013" + separator + "1, 2 y 3 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                    + "CELLNOTE_B" + separator + "cnB_7" + separator + "cnB_7", bufferedReaderAttributes.readLine());
        }

        assertEquals("Aragón" + separator + "ARAGON" + separator + "2013" + separator + "4 y 5 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_B"
                + separator + "cnB_8" + separator + "cnB_8", bufferedReaderAttributes.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                    + "CELLNOTE_C" + separator + "Cell C1" + separator + "cnC_1", bufferedReaderAttributes.readLine());
        } else {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2012" + separator + "1, 2 y 3 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                    + "CELLNOTE_C" + separator + "Cell C1" + separator + "cnC_1", bufferedReaderAttributes.readLine());
        }

        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2012" + separator + "4 y 5 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator
                + "CELLNOTE_C" + separator + "Cell C2" + separator + "cnC_2", bufferedReaderAttributes.readLine());
        assertEquals("Aragón" + separator + "ARAGON" + separator + "2012" + separator + "4 y 5 estrellas" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "CELLNOTE_C"
                + separator + "Cell C6" + separator + "cnC_6", bufferedReaderAttributes.readLine());

        assertEquals(null, bufferedReaderAttributes.readLine());
        bufferedReaderAttributes.close();
    }

    private void validateObservationsWithDatasetAndDimensionAttachmentCodesAndSomeLabels(File tmpFileObservations, String separator) throws Exception, IOException {
        BufferedReader bufferedReader = createBufferedReader(tmpFileObservations);
        assertEquals("DESTINO_ALOJAMIENTO" + separator + "DESTINO_ALOJAMIENTO_CODE" + separator + "TIME_PERIOD" + separator + "CATEGORIA_ALOJAMIENTO" + separator + "INDICADORES" + separator
                + "INDICADORES_CODE" + separator + "OBS_VALUE" + separator + "ATTRIBUTE_B" + separator + "ATTRIBUTE_C" + separator + "ATTRIBUTE_C_CODE" + separator + "ATTRIBUTE_D" + separator
                + "ATTRIBUTE_D_CODE" + separator + "ATTRIBUTE_E", bufferedReader.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + "Índice de ocupación de plazas" + separator
                    + "INDICE_OCUPACION_PLAZAS" + separator + "1.1" + separator + "b1" + separator + StringUtils.EMPTY + separator + "Attribute d1" + separator + "d1" + separator + "e1",
                    bufferedReader.readLine());
        } else {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2012" + separator + "1, 2 y 3 estrellas" + separator + "Índice de ocupación de plazas" + separator
                    + "INDICE_OCUPACION_PLAZAS" + separator + "1.1" + separator + "b1" + separator + StringUtils.EMPTY + separator + "Attribute d1" + separator + "d1" + separator + "e1",
                    bufferedReader.readLine());
        }

        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2012" + separator + "4 y 5 estrellas" + separator + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS"
                + separator + "2" + separator + "b2" + separator + StringUtils.EMPTY + separator + "Attribute d2" + separator + "d2" + separator + "e2", bufferedReader.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2013" + separator + "\"1, 2 y 3 estrellas\"" + separator + "Índice de ocupación de plazas" + separator
                    + "INDICE_OCUPACION_PLAZAS" + separator + "3" + separator + "b3" + separator + StringUtils.EMPTY + separator + "Attribute d3" + separator + "d3" + separator + "e3",
                    bufferedReader.readLine());
        } else {
            assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2013" + separator + "1, 2 y 3 estrellas" + separator + "Índice de ocupación de plazas" + separator
                    + "INDICE_OCUPACION_PLAZAS" + separator + "3" + separator + "b3" + separator + StringUtils.EMPTY + separator + "Attribute d3" + separator + "d3" + separator + "e3",
                    bufferedReader.readLine());
        }

        assertEquals("Andalucía" + separator + "ANDALUCIA" + separator + "2013" + separator + "4 y 5 estrellas" + separator + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS"
                + separator + "4" + separator + StringUtils.EMPTY + separator + StringUtils.EMPTY + separator + "Attribute d4" + separator + "d4" + separator + "e4", bufferedReader.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "2012" + separator + "\"1, 2 y 3 estrellas\"" + separator + "Índice de ocupación de plazas" + separator
                    + "INDICE_OCUPACION_PLAZAS" + separator + "5" + separator + "b5" + separator + StringUtils.EMPTY + separator + "Attribute d5" + separator + "d5" + separator + "e5",
                    bufferedReader.readLine());
        } else {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "2012" + separator + "1, 2 y 3 estrellas" + separator + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS"
                    + separator + "5" + separator + "b5" + separator + StringUtils.EMPTY + separator + "Attribute d5" + separator + "d5" + separator + "e5", bufferedReader.readLine());
        }

        assertEquals("Aragón" + separator + "ARAGON" + separator + "2012" + separator + "4 y 5 estrellas" + separator + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS"
                + separator + "6" + separator + "b6" + separator + StringUtils.EMPTY + separator + "Attribute d6" + separator + "d6" + separator + "e6", bufferedReader.readLine());

        if (PlainTextTypeEnum.CSV_COMMA.getSeparator().equals(separator)) {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "2013" + separator + "\"1, 2 y 3 estrellas\"" + separator + "Índice de ocupación de plazas" + separator
                    + "INDICE_OCUPACION_PLAZAS" + separator + StringUtils.EMPTY + separator + "b7" + separator + StringUtils.EMPTY + separator + "Attribute d7" + separator + "d7" + separator + "e7",
                    bufferedReader.readLine());
        } else {
            assertEquals("Aragón" + separator + "ARAGON" + separator + "2013" + separator + "1, 2 y 3 estrellas" + separator + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS"
                    + separator + StringUtils.EMPTY + separator + "b7" + separator + StringUtils.EMPTY + separator + "Attribute d7" + separator + "d7" + separator + "e7", bufferedReader.readLine());
        }
        assertEquals("Aragón" + separator + "ARAGON" + separator + "2013" + separator + "4 y 5 estrellas" + separator + "Índice de ocupación de plazas" + separator + "INDICE_OCUPACION_PLAZAS"
                + separator + "8" + separator + "b8" + separator + StringUtils.EMPTY + separator + "Attribute d8" + separator + "d8" + separator + "e8", bufferedReader.readLine());
        assertEquals(null, bufferedReader.readLine());
        bufferedReader.close();
    }

    @Override
    @Test
    public void testExportDatasetToPx() throws Exception {

        Dataset dataset = buildDatasetToExport();

        File tmpFile = tempFolder.newFile();
        FileOutputStream out = new FileOutputStream(tmpFile);
        exportService.exportDatasetToPx(ctx, dataset, null, out);

        out.close();

        BufferedReader bufferedReader = createBufferedReader(tmpFile, "ISO-8859-1");
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
        assertEquals("SUBJECT-AREA=\"title\";", bufferedReader.readLine());
        assertEquals("SUBJECT-AREA[en]=\"title (en)\";", bufferedReader.readLine());
        assertEquals("COPYRIGHT=NO;", bufferedReader.readLine());
        assertEquals("DESCRIPTION=\"description\";", bufferedReader.readLine());
        assertEquals("DESCRIPTION[en]=\"description (en)\";", bufferedReader.readLine());
        assertEquals("TITLE=\"title\";", bufferedReader.readLine());
        assertEquals("TITLE[en]=\"title (en)\";", bufferedReader.readLine());
        assertEquals("DESCRIPTIONDEFAULT=YES;", bufferedReader.readLine());
        assertEquals("CONTENTS=\"TODO-CONTENTS\";", bufferedReader.readLine()); // (METAMAC-1927)
        assertEquals("UNITS=\"TODO-UNITS\";", bufferedReader.readLine()); // (METAMAC-1927)
        assertEquals("DECIMALS=2;", bufferedReader.readLine());
        assertEquals("STUB=\"CATEGORIA_ALOJAMIENTO\",\"INDICADORES\";", bufferedReader.readLine());
        assertEquals("HEADING=\"DESTINO_ALOJAMIENTO\",\"TIME_PERIOD\";", bufferedReader.readLine());
        assertEquals("VALUES(\"DESTINO_ALOJAMIENTO\")=\"Andalucía\",\"Aragón\";", bufferedReader.readLine());
        assertEquals("VALUES(\"TIME_PERIOD\")=\"Año 2012\",\"Año 2013\";", bufferedReader.readLine());
        assertEquals("VALUES(\"CATEGORIA_ALOJAMIENTO\")=\"1, 2 y 3 estrellas\",\"4 y 5 estrellas\";", bufferedReader.readLine());
        assertEquals("VALUES(\"INDICADORES\")=\"Índice de ocupación de plazas\";", bufferedReader.readLine());
        assertEquals("CODES(\"DESTINO_ALOJAMIENTO\")=\"ANDALUCIA\",\"ARAGON\";", bufferedReader.readLine());
        assertEquals("CODES(\"TIME_PERIOD\")=\"2012\",\"2013\";", bufferedReader.readLine());
        assertEquals("CODES(\"CATEGORIA_ALOJAMIENTO\")=\"1_2_3_ESTRELLAS\",\"4_5_ESTRELLAS\";", bufferedReader.readLine());
        assertEquals("CODES(\"INDICADORES\")=\"INDICE_OCUPACION_PLAZAS\";", bufferedReader.readLine());
        assertEquals("LAST-UPDATED=\"20130102 09:00\";", bufferedReader.readLine());
        assertEquals("NOTEX=\"a3\";", bufferedReader.readLine());
        assertEquals("NOTE=\"a1#a2\";", bufferedReader.readLine());
        assertEquals("VALUENOTEX(\"DESTINO_ALOJAMIENTO\",\"Andalucía\")=\"vn1\";", bufferedReader.readLine());
        assertEquals("VALUENOTEX(\"DESTINO_ALOJAMIENTO\",\"Aragón\")=\"vn2\";", bufferedReader.readLine());
        assertEquals("VALUENOTE(\"DESTINO_ALOJAMIENTO\",\"Andalucía\")=\"da1\";", bufferedReader.readLine());
        assertEquals("VALUENOTE(\"CATEGORIA_ALOJAMIENTO\",\"1, 2 y 3 estrellas\")=\"ca1#ca3\";", bufferedReader.readLine());
        assertEquals("VALUENOTE(\"CATEGORIA_ALOJAMIENTO\",\"4 y 5 estrellas\")=\"ca2#ca4#ca5\";", bufferedReader.readLine());
        assertEquals("VALUENOTE(\"INDICADORES\",\"Índice de ocupación de plazas\")=\"ioA_1\";", bufferedReader.readLine());
        assertEquals("CELLNOTE(\"*\",\"*\",\"Andalucía\",\"Año 2012\")=\"cnA_1\";", bufferedReader.readLine());
        assertEquals("CELLNOTE(\"*\",\"*\",\"Andalucía\",\"Año 2013\")=\"cnA_2\";", bufferedReader.readLine());
        assertEquals("CELLNOTE(\"*\",\"*\",\"Aragón\",\"Año 2012\")=\"cnA_3\";", bufferedReader.readLine());
        assertEquals("CELLNOTE(\"*\",\"*\",\"Aragón\",\"Año 2013\")=\"cnA_4\";", bufferedReader.readLine());
        assertEquals("CELLNOTE(\"1, 2 y 3 estrellas\",\"*\",\"Andalucía\",\"Año 2012\")=\"cnB_1#cnC_1\";", bufferedReader.readLine());
        assertEquals("CELLNOTE(\"1, 2 y 3 estrellas\",\"*\",\"Andalucía\",\"Año 2013\")=\"cnB_3\";", bufferedReader.readLine());
        assertEquals("CELLNOTE(\"1, 2 y 3 estrellas\",\"*\",\"Aragón\",\"Año 2012\")=\"cnB_5\";", bufferedReader.readLine());
        assertEquals("CELLNOTE(\"1, 2 y 3 estrellas\",\"*\",\"Aragón\",\"Año 2013\")=\"cnB_7\";", bufferedReader.readLine());
        assertEquals("CELLNOTE(\"1, 2 y 3 estrellas\",\"Índice de ocupación de plazas\",\"Andalucía\",\"Año 2012\")=\"b1#d1#e1\";", bufferedReader.readLine());
        assertEquals("CELLNOTE(\"1, 2 y 3 estrellas\",\"Índice de ocupación de plazas\",\"Andalucía\",\"Año 2013\")=\"b3#d3#e3\";", bufferedReader.readLine());
        assertEquals("CELLNOTE(\"1, 2 y 3 estrellas\",\"Índice de ocupación de plazas\",\"Aragón\",\"Año 2012\")=\"b5#d5#e5\";", bufferedReader.readLine());
        assertEquals("CELLNOTE(\"1, 2 y 3 estrellas\",\"Índice de ocupación de plazas\",\"Aragón\",\"Año 2013\")=\"b7#d7#e7\";", bufferedReader.readLine());
        assertEquals("CELLNOTE(\"4 y 5 estrellas\",\"*\",\"Andalucía\",\"Año 2012\")=\"cnB_2#cnC_2\";", bufferedReader.readLine());
        assertEquals("CELLNOTE(\"4 y 5 estrellas\",\"*\",\"Aragón\",\"Año 2012\")=\"cnB_6#cnC_6\";", bufferedReader.readLine());
        assertEquals("CELLNOTE(\"4 y 5 estrellas\",\"*\",\"Aragón\",\"Año 2013\")=\"cnB_8\";", bufferedReader.readLine());
        assertEquals("CELLNOTE(\"4 y 5 estrellas\",\"Índice de ocupación de plazas\",\"Andalucía\",\"Año 2012\")=\"b2#d2#e2\";", bufferedReader.readLine());
        assertEquals("CELLNOTE(\"4 y 5 estrellas\",\"Índice de ocupación de plazas\",\"Andalucía\",\"Año 2013\")=\"d4#e4\";", bufferedReader.readLine());
        assertEquals("CELLNOTE(\"4 y 5 estrellas\",\"Índice de ocupación de plazas\",\"Aragón\",\"Año 2012\")=\"b6#d6#e6\";", bufferedReader.readLine());
        assertEquals("CELLNOTE(\"4 y 5 estrellas\",\"Índice de ocupación de plazas\",\"Aragón\",\"Año 2013\")=\"b8#d8#e8\";", bufferedReader.readLine());

        assertEquals("DATA=", bufferedReader.readLine());
        assertEquals("1.1 2 3 4 5 6 \".\" 8; ", bufferedReader.readLine());

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

    private Dataset buildDatasetToExport() {
        //@formatter:off
        return DatasetMockBuilder.create()
                .dimension("DESTINO_ALOJAMIENTO", "Destino de alojamiento").heading().dimensionValue("ANDALUCIA", "Andalucía").dimensionValue("ARAGON", "Aragón")
                .dimension("TIME_PERIOD").heading().dimensionValue("2012", "Año 2012").dimensionValue("2013", "Año 2013")
                .dimension("CATEGORIA_ALOJAMIENTO").stub().dimensionValue("1_2_3_ESTRELLAS", "1, 2 y 3 estrellas").dimensionValue("4_5_ESTRELLAS", "4 y 5 estrellas")
                .dimension("INDICADORES").stub().dimensionValue("INDICE_OCUPACION_PLAZAS", "Índice de ocupación de plazas")
                .attribute("ATTRIBUTE_A", "Attribute A", AttributeAttachmentLevelType.DATASET)
                .attribute("ATTRIBUTE_A2", "Attribute A2", AttributeAttachmentLevelType.DATASET)
                        .attributeValue("a2", "Attribute a2")
                .attribute("NOTEX", "Attribute Notex", AttributeAttachmentLevelType.DATASET)
                        .attributeValue("a3", "Notex a3")
                .attribute("VALUENOTEX", "ValueNotex01", AttributeAttachmentLevelType.DIMENSION).dimensionsAttached("DESTINO_ALOJAMIENTO")
                .attribute("ATTRIBUTE_DESTINO_ALOJAMIENTO_01", "AttrDestinoAlojamiento01", AttributeAttachmentLevelType.DIMENSION).dimensionsAttached("DESTINO_ALOJAMIENTO")
                        .attributeValue("da1", "Destino 1")
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01", "AttrCategoriaAlojamiento01", AttributeAttachmentLevelType.DIMENSION).dimensionsAttached("CATEGORIA_ALOJAMIENTO")
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02", "AttrCategoriaAlojamiento02", AttributeAttachmentLevelType.DIMENSION).dimensionsAttached("CATEGORIA_ALOJAMIENTO")
                .attribute("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03", "AttrCategoriaAlojamiento03", AttributeAttachmentLevelType.DIMENSION).dimensionsAttached("CATEGORIA_ALOJAMIENTO")
                        .attributeValue("ca5", "Categoría 5")
                .attribute("INDICADORES_A", "Attribute Indicadores A", AttributeAttachmentLevelType.DIMENSION).dimensionsAttached("INDICADORES")
                .attribute("CELLNOTE_A", "Attribute CellNote A", AttributeAttachmentLevelType.DIMENSION).dimensionsAttached("DESTINO_ALOJAMIENTO", "TIME_PERIOD")
                .attribute("CELLNOTE_B", "Attribute CellNote B", AttributeAttachmentLevelType.DIMENSION).dimensionsAttached("DESTINO_ALOJAMIENTO", "TIME_PERIOD", "CATEGORIA_ALOJAMIENTO")
                .attribute("CELLNOTE_C", "Attribute CellNote C", AttributeAttachmentLevelType.DIMENSION).dimensionsAttached("TIME_PERIOD", "CATEGORIA_ALOJAMIENTO", "DESTINO_ALOJAMIENTO") // unordered in attribute definition
                           .attributeValue("cnC_1", "Cell C1").attributeValue("cnC_2", "Cell C2").attributeValue("cnC_6", "Cell C6")
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
                .observations("1.1 | 2 | 3 | 4 | 5 | 6 |  | 8")
                .attributeData("ATTRIBUTE_A", "a1")
                .attributeData("ATTRIBUTE_A2", "a2")
                .attributeData("NOTEX", "a3")
                .attributeData("VALUENOTEX", "vn1 | vn2")
                .attributeData("ATTRIBUTE_DESTINO_ALOJAMIENTO_01", "da1 | ")
                .attributeData("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_01", "ca1 | ca2")
                .attributeData("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_02", "ca3 | ca4")
                .attributeData("ATTRIBUTE_CATEGORIA_ALOJAMIENTO_03", " | ca5")
                .attributeData("INDICADORES_A", "ioA_1")
                .attributeData("CELLNOTE_A", "cnA_1 | cnA_2 | cnA_3 | cnA_4")
                .attributeData("CELLNOTE_B", "cnB_1 | cnB_2 | cnB_3 |  | cnB_5 | cnB_6 | cnB_7 | cnB_8")
                .attributeData("CELLNOTE_C", "cnC_1 | cnC_2 |  |  |  | cnC_6 |  | ")
                .attributeData("ATTRIBUTE_B", "b1 | b2 | b3 |  | b5 | b6 | b7 | b8")
                .attributeData("ATTRIBUTE_D", "d1 | d2 | d3 | d4 | d5 | d6 | d7 | d8")
                .attributeData("ATTRIBUTE_E", "e1 | e2 | e3 | e4 | e5 | e6 | e7 | e8")
                .build();
        //@formatter:on
    }

    private BufferedReader createBufferedReader(File file) throws Exception {
        return createBufferedReader(file, "UTF8");
    }

    private BufferedReader createBufferedReader(File file, String encoding) throws Exception {
        return new BufferedReader(new InputStreamReader(new FileInputStream(file), encoding));
    }

}