package com.stat4you.importation.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.UUID;

import org.apache.commons.lang3.RandomStringUtils;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.joda.time.DateTime;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.quartz.Scheduler;
import org.quartz.SchedulerFactory;
import org.quartz.impl.SchedulerRepository;
import org.quartz.impl.StdSchedulerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.datasource.SingleConnectionDataSource;
import org.springframework.mock.jndi.SimpleNamingContextBuilder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.arte.statistic.dataset.repository.dto.ObservationExtendedDto;
import com.stat4you.common.Stat4YouConstants;
import com.stat4you.common.configuration.Stat4YouConfiguration;
import com.stat4you.common.dto.InternationalStringDto;
import com.stat4you.common.dto.LocalisedStringDto;
import com.stat4you.common.test.utils.Stat4YouAsserts;
import com.stat4you.common.uri.UriData;
import com.stat4you.common.uri.UriFactory;
import com.stat4you.importation.service.processor.StatisticDtoProcessor;
import com.stat4you.statistics.data.service.DataService;
import com.stat4you.statistics.dsd.Constants;
import com.stat4you.statistics.dsd.domain.AttributeAttachmentLevelEnum;
import com.stat4you.statistics.dsd.domain.DatasetSourceEnum;
import com.stat4you.statistics.dsd.domain.DimensionTypeEnum;
import com.stat4you.statistics.dsd.domain.DsdExceptionCodeEnum;
import com.stat4you.statistics.dsd.dto.AttributeDefinitionDto;
import com.stat4you.statistics.dsd.dto.DatasetBasicDto;
import com.stat4you.statistics.dsd.dto.DatasetDto;
import com.stat4you.statistics.dsd.dto.DimensionDto;
import com.stat4you.statistics.dsd.dto.PrimaryMeasureDto;
import com.stat4you.statistics.dsd.dto.ProviderDto;
import com.stat4you.statistics.dsd.dto.ResourceIdentierDto;
import com.stat4you.statistics.dsd.service.DsdService;
import com.stat4you.transformation.dto.DigitalAgendaEuropeCsvDto;
import com.stat4you.transformation.dto.PxImportDto;
import com.stat4you.transformation.dto.StatisticDto;
import com.stat4you.transformation.service.TransformationService;

/**
 * Test for ImportationService
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring/importation-applicationContext-test.xml"})
public class ImportationServiceTest {

    @Autowired
    private ImportationService    importationService             = null;

    @Autowired
    private DsdService            dsdService                     = null;

    @Autowired
    private DataService           dataService                    = null;

    @Autowired
    private TransformationService transformationService          = null;

    private ServiceContext        ctx                            = new ServiceContext("importation", "importation", "importation");
    private ProviderDto           providerDto                    = null;
    private String                CATEGORY                       = "3";

    // Database configuration
    private static String         DB_DATASET_REPOSITORY_URL      = "stat4you.importation.dataset-repository.db.url";
    private static String         DB_DATASET_REPOSITORY_USERNAME = "stat4you.importation.dataset-repository.db.username";
    private static String         DB_DATASET_REPOSITORY_PASSWORD = "stat4you.importation.dataset-repository.db.password";
    private static String         DB_STATISTICS_URL              = "stat4you.importation.statistics.db.url";
    private static String         DB_STATISTICS_USERNAME         = "stat4you.importation.statistics.db.username";
    private static String         DB_STATISTICS_PASSWORD         = "stat4you.importation.statistics.db.password";

    @BeforeClass
    public static void setUpBeforeClass() throws Exception {
        // Data
        System.setProperty(Stat4YouConstants.PROP_DATA_URL, ImportationServiceTest.class.getResource("/data").getFile());

        // Configure access to databases
        configureJndi();

        // Quartz: start scheduler
        if (SchedulerRepository.getInstance().lookup(Stat4YouConstants.JOB_SCHEDULER) == null) {
            Properties quartzProperties = Stat4YouConfiguration.instance().getProperties();
            SchedulerFactory sf = new StdSchedulerFactory(quartzProperties);
            Scheduler sched = sf.getScheduler();
            sched.start();
        }
    }

    @AfterClass
    public static void tearDownAfterClass() throws Exception {
    }

    @Before
    public void setUp() throws Exception {

        // Create provider and retrieve
        providerDto = new ProviderDto();
        providerDto.setAcronym(RandomStringUtils.random(20, "abcdefghijklmnopqrstuvwxyz"));
        providerDto.setName("12345678");
        providerDto.setLanguage("es");
        String providerUri = dsdService.createProvider(ctx, providerDto);
        providerDto = dsdService.retrieveProvider(ctx, providerUri);
    }

    @Test
    public void testImportPxMetadatas() throws Exception {

        String pxFileName = "/px/E16028B_0008-attributes.px";
        String pxUrl = UUID.randomUUID().toString();

        // Import creating new dataset
        PxImportDto pxImportDto = new PxImportDto();
        pxImportDto.setContent(ImportationServiceTest.class.getResourceAsStream(pxFileName));
        pxImportDto.setProviderUri(providerDto.getUri());
        pxImportDto.setPxUrl(pxUrl);
        pxImportDto.setCategory(CATEGORY);

        String datasetUri = importationService.importPx(ctx, pxImportDto);
        assertNotNull(datasetUri);

        // Validate
        DatasetBasicDto datasetDto = dsdService.retrieveDataset(ctx, datasetUri);
        assertEquals(datasetUri, datasetDto.getUri());

        assertEquals("TURISTAS_MOTIVOS_ESTANCIA_LUGARES_RESIDENCIA_ISLAS", datasetDto.getIdentifier());
        assertEquals(pxImportDto.getProviderUri(), datasetDto.getProviderUri());
        assertEquals(Constants.PUBLISHER_FOR_ALL_DATASETS, datasetDto.getPublisher());
        assertEquals(2, datasetDto.getTitle().getTexts().size());
        assertEquals(
                "Turistas según motivos de la estancia y lugares de residencia e islas de destino principal y periodos. FRONTUR-Canarias: Resultados mensuales de entrada de turistas. Enero 2011",
                datasetDto.getTitle().getLocalisedLabel("es"));
        assertEquals("Reason for stay, Principal destination, Periods", datasetDto.getTitle().getLocalisedLabel("en"));
        assertEquals(1, datasetDto.getDescription().getTexts().size());
        assertEquals("Turistas según motivos de la estancia y lugares de residencia e islas de destino principal y periodos. Descripción", datasetDto.getDescription().getLocalisedLabel("es"));;
        assertEquals(pxImportDto.getPxUrl(), datasetDto.getUrl());
        assertEquals("(M) Actualización mensual", datasetDto.getFrequency());
        assertEquals(2, datasetDto.getLanguages().size());
        assertEquals("es", datasetDto.getLanguages().get(0));
        assertEquals("en", datasetDto.getLanguages().get(1));
        assertEquals(1, datasetDto.getCategories().size());
        assertEquals(pxImportDto.getCategory(), datasetDto.getCategories().get(0));
        Stat4YouAsserts.assertEqualsDay(new DateTime(), datasetDto.getReleaseDate());
        Stat4YouAsserts.assertEqualsDate(new DateTime(2009, 11, 23, 0, 0, 0, 0), datasetDto.getProviderReleaseDate(), "yyyyMMdd HH:mm");
        Stat4YouAsserts.assertEqualsDay(new DateTime(), datasetDto.getPublishingDate());
        assertNull(datasetDto.getUnpublishingDate());
        Stat4YouAsserts.assertEqualsDate(new DateTime(2011, 9, 22, 12, 0, 0, 0), datasetDto.getProviderPublishingDate(), "yyyyMMdd HH:mm");
        assertEquals(DatasetSourceEnum.PX, datasetDto.getSource());

        // Primary measure
        PrimaryMeasureDto primaryMeasureDto = dsdService.retrieveDatasetPrimaryMeasure(ctx, datasetUri);
        assertEquals("OBS_VALUE", primaryMeasureDto.getIdentifier());
        assertEquals(2, primaryMeasureDto.getTitle().getTexts().size());
        assertEquals("Valor de la observación", primaryMeasureDto.getTitle().getLocalisedLabel("es"));
        assertEquals("Observation value", primaryMeasureDto.getTitle().getLocalisedLabel("en"));

        // Dimensions
        List<DimensionDto> dimensions = dsdService.retrieveDatasetDimensions(ctx, datasetUri);
        assertEquals(3, dimensions.size());
        {
            DimensionDto dimensionDto = dimensions.get(0);
            assertEquals("MOTIVOS_ESTANCIA", dimensionDto.getIdentifier());
            assertEquals(DimensionTypeEnum.MEASURE_DIMENSION, dimensionDto.getType());
            assertEquals("Motivos de la estancia", dimensionDto.getTitle().getLocalisedLabel("es"));
            assertEquals("Reason for stay", dimensionDto.getTitle().getLocalisedLabel("en"));
            assertEquals(5, dimensionDto.getCodes().size());
            assertEquals("000", dimensionDto.getCodes().get(0).getIdentifier());
            assertEquals("TOTAL MOTIVOS", dimensionDto.getCodes().get(0).getTitle().getLocalisedLabel("es"));
            assertEquals("TOTAL", dimensionDto.getCodes().get(0).getTitle().getLocalisedLabel("en"));
            assertEquals("001", dimensionDto.getCodes().get(1).getIdentifier());
            assertEquals("Ocio o vacaciones", dimensionDto.getCodes().get(1).getTitle().getLocalisedLabel("es"));
            assertEquals("Holidays", dimensionDto.getCodes().get(1).getTitle().getLocalisedLabel("en"));
            assertEquals("002", dimensionDto.getCodes().get(2).getIdentifier());
            assertEquals("Trabajo o negocios", dimensionDto.getCodes().get(2).getTitle().getLocalisedLabel("es"));
            assertEquals("Work", dimensionDto.getCodes().get(2).getTitle().getLocalisedLabel("en"));
            assertEquals("003", dimensionDto.getCodes().get(3).getIdentifier());
            assertEquals("Personal", dimensionDto.getCodes().get(3).getTitle().getLocalisedLabel("es"));
            assertEquals("Personal", dimensionDto.getCodes().get(3).getTitle().getLocalisedLabel("en"));
            assertEquals("004", dimensionDto.getCodes().get(4).getIdentifier());
            assertEquals("Otros motivos", dimensionDto.getCodes().get(4).getTitle().getLocalisedLabel("es"));
            assertEquals("Other", dimensionDto.getCodes().get(4).getTitle().getLocalisedLabel("en"));
        }
        {
            DimensionDto dimensionDto = dimensions.get(1);
            assertEquals("ISLAS", dimensionDto.getIdentifier());
            assertEquals(DimensionTypeEnum.GEOGRAPHIC_DIMENSION, dimensionDto.getType());
            assertEquals("Islas", dimensionDto.getTitle().getLocalisedLabel("es"));
            assertEquals("Principal destination", dimensionDto.getTitle().getLocalisedLabel("en"));
            assertEquals(6, dimensionDto.getCodes().size());
            assertEquals("ES70", dimensionDto.getCodes().get(0).getIdentifier());
            assertEquals("CANARIAS", dimensionDto.getCodes().get(0).getTitle().getLocalisedLabel("es"));
            assertEquals("CANARY ISLANDS", dimensionDto.getCodes().get(0).getTitle().getLocalisedLabel("en"));
            assertEquals("ES708", dimensionDto.getCodes().get(1).getIdentifier());
            assertEquals("Lanzarote", dimensionDto.getCodes().get(1).getTitle().getLocalisedLabel("es"));
            assertEquals("Lanzarote EN", dimensionDto.getCodes().get(1).getTitle().getLocalisedLabel("en"));
            assertEquals("ES704", dimensionDto.getCodes().get(2).getIdentifier());
            assertEquals("Fuerteventura", dimensionDto.getCodes().get(2).getTitle().getLocalisedLabel("es"));
            assertEquals("Fuerteventura EN", dimensionDto.getCodes().get(2).getTitle().getLocalisedLabel("en"));
            assertEquals("ES705", dimensionDto.getCodes().get(3).getIdentifier());
            assertEquals("Gran Canaria", dimensionDto.getCodes().get(3).getTitle().getLocalisedLabel("es"));
            assertEquals("Gran Canaria EN", dimensionDto.getCodes().get(3).getTitle().getLocalisedLabel("en"));
            assertEquals("ES709", dimensionDto.getCodes().get(4).getIdentifier());
            assertEquals("Tenerife", dimensionDto.getCodes().get(4).getTitle().getLocalisedLabel("es"));
            assertEquals("Tenerife EN", dimensionDto.getCodes().get(4).getTitle().getLocalisedLabel("en"));
            assertEquals("ES707", dimensionDto.getCodes().get(5).getIdentifier());
            assertEquals("La Palma", dimensionDto.getCodes().get(5).getTitle().getLocalisedLabel("es"));
            assertEquals("La Palma EN", dimensionDto.getCodes().get(5).getTitle().getLocalisedLabel("en"));
        }
        {
            DimensionDto dimensionDto = dimensions.get(2);
            assertEquals("PERIODOS", dimensionDto.getIdentifier());
            assertEquals(DimensionTypeEnum.TIME_DIMENSION, dimensionDto.getType());
            assertEquals("Periodos", dimensionDto.getTitle().getLocalisedLabel("es"));
            assertEquals("Periods", dimensionDto.getTitle().getLocalisedLabel("en"));
            assertEquals(24, dimensionDto.getCodes().size());
            assertEquals("2009M09", dimensionDto.getCodes().get(0).getIdentifier());
            assertEquals("2009 Septiembre (p)", dimensionDto.getCodes().get(0).getTitle().getLocalisedLabel("es"));
            assertEquals("2009 Septiembre (p)", dimensionDto.getCodes().get(0).getTitle().getLocalisedLabel("en"));
            // ...
        }

        // Attributes definitions
        List<AttributeDefinitionDto> attributeDefinitions = dsdService.retrieveDatasetAttributeDefinitions(ctx, datasetUri);
        assertEquals(12, attributeDefinitions.size());
        int j = -1;

        // NOTEX="Los datos corresponden a turistas entrados por vía aérea.";
        assertEquals("NOTEX_1", attributeDefinitions.get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DATASET, attributeDefinitions.get(j).getAttachmentLevel());
        assertEqualsAttachmentDimensions(attributeDefinitions.get(j), null);
        // NOTE="En las estimaciones para el total de Canarias se incluyen los turistas de...";
        assertEquals("NOTE_1", attributeDefinitions.get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DATASET, attributeDefinitions.get(j).getAttachmentLevel());
        assertEqualsAttachmentDimensions(attributeDefinitions.get(j), null);
        // CELLNOTEX("*","*","*")="Nota para todas las observaciones";
        assertEquals("NOTEX_2", attributeDefinitions.get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DATASET, attributeDefinitions.get(j).getAttachmentLevel());
        assertEqualsAttachmentDimensions(attributeDefinitions.get(j), null);

        // VALUENOTE("Motivos de la estancia","Ocio o vacaciones")="Value note 1 ocio";
        // VALUENOTE("Motivos de la estancia","Personal")="Value note 1 personal";
        // VALUENOTE[en]("Reason for stay","Work")="Value note Reason form stay - Work english";
        assertEquals("VALUENOTE_1", attributeDefinitions.get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DIMENSION, attributeDefinitions.get(j).getAttachmentLevel());
        assertEqualsAttachmentDimensions(attributeDefinitions.get(j), new String[]{"MOTIVOS_ESTANCIA"});
        // VALUENOTE("Islas","CANARIAS")="Value note Canarias";
        assertEquals("VALUENOTE_2", attributeDefinitions.get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DIMENSION, attributeDefinitions.get(j).getAttachmentLevel());
        assertEqualsAttachmentDimensions(attributeDefinitions.get(j), new String[]{"ISLAS"});

        // VALUENOTEX("Motivos de la estancia","Ocio o vacaciones")="Value notex 1 ocio";
        // VALUENOTEX("Motivos de la estancia","TOTAL MOTIVOS")="Value notex 1";
        // VALUENOTEX[en]("Reason for stay","TOTAL")="Value notex 1 English";
        // VALUENOTEX("Motivos de la estancia","Trabajo o negocios")="Value notex 2";
        // VALUENOTEX[en]("Principal destination","CANARY ISLANDS")="Value notex Canary Islands";
        assertEquals("VALUENOTEX_1", attributeDefinitions.get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DIMENSION, attributeDefinitions.get(j).getAttachmentLevel());
        assertEqualsAttachmentDimensions(attributeDefinitions.get(j), new String[]{"MOTIVOS_ESTANCIA"});
        // VALUENOTEX("Islas","CANARIAS")="Value notex Canarias";
        // VALUENOTEX("Islas","Lanzarote")="Value notex Lanzarote";
        assertEquals("VALUENOTEX_2", attributeDefinitions.get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DIMENSION, attributeDefinitions.get(j).getAttachmentLevel());
        assertEqualsAttachmentDimensions(attributeDefinitions.get(j), new String[]{"ISLAS"});
        // CELLNOTEX("Trabajo o negocios","*","*")="Cellnotex para Trabajo o negocios";
        // CELLNOTEX("Personal","*","*")="Cellnotex para Personal";
        assertEquals("VALUENOTEX_3", attributeDefinitions.get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DIMENSION, attributeDefinitions.get(j).getAttachmentLevel());
        assertEqualsAttachmentDimensions(attributeDefinitions.get(j), new String[]{"MOTIVOS_ESTANCIA"});
        // CELLNOTEX("Trabajo o negocios","*","2010 Septiembre (p)")="Trabajo o negocios, todas las islas en 2010 Septiembre";
        // CELLNOTEX[en]("Work","*","2010 Septiembre (p)")="EN Trabajo o negocios, todas las islas en 2010 Septiembre";
        assertEquals("VALUENOTEX_4", attributeDefinitions.get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DIMENSION, attributeDefinitions.get(j).getAttachmentLevel());
        assertEqualsAttachmentDimensions(attributeDefinitions.get(j), new String[]{"MOTIVOS_ESTANCIA", "PERIODOS"});
        // CELLNOTEX("Ocio o vacaciones","La Palma","*")="Ocio o vacaciones en La Palma";
        // CELLNOTEX("Ocio o vacaciones","Lanzarote","*")="Ocio o vacaciones en Lanzarote";
        assertEquals("VALUENOTEX_5", attributeDefinitions.get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DIMENSION, attributeDefinitions.get(j).getAttachmentLevel());
        assertEqualsAttachmentDimensions(attributeDefinitions.get(j), new String[]{"MOTIVOS_ESTANCIA", "ISLAS"});

        // CELLNOTEX("Trabajo o negocios","Lanzarote","2010 Septiembre (p)")="Cell notex 1";
        assertEquals("CELLNOTEX_1", attributeDefinitions.get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.OBSERVATION, attributeDefinitions.get(j).getAttachmentLevel());
        assertEqualsAttachmentDimensions(attributeDefinitions.get(j), null);
        // CELLNOTE("Trabajo o negocios","Lanzarote","2010 Septiembre (p)")="Trabajo o negocios en Lanzarote en 2010 Septiembre";
        // CELLNOTE[en]("Work","Lanzarote EN","2010 Septiembre (p)")="Work Lanzarote 2010 September";
        assertEquals("CELLNOTE_1", attributeDefinitions.get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.OBSERVATION, attributeDefinitions.get(j).getAttachmentLevel());
        assertEqualsAttachmentDimensions(attributeDefinitions.get(j), null);

        assertEquals(attributeDefinitions.size(), ++j);

        // Remove dataset (table of data)
        dataService.deleteDatasetRepository(ctx, datasetUri);
    }

    @Test
    public void testImportPxAndThenUpdate() throws Exception {

        String pxFileName = "/px/I101003_0201.px";
        String pxUrl = UUID.randomUUID().toString();

        String datasetUriV1 = null;
        String datasetUriV2 = null;

        // Import creating new dataset
        {
            PxImportDto pxImportDto = new PxImportDto();
            pxImportDto.setContent(ImportationServiceTest.class.getResourceAsStream(pxFileName));
            pxImportDto.setProviderUri(providerDto.getUri());
            pxImportDto.setPxUrl(pxUrl);
            pxImportDto.setCategory(CATEGORY);

            datasetUriV1 = importationService.importPx(ctx, pxImportDto);

            // Retrieve V1
            DatasetBasicDto datasetBasicDtoV1 = dsdService.retrieveDataset(ctx, datasetUriV1);
            assertEquals(pxUrl, datasetBasicDtoV1.getUrl());
            assertTrue(datasetUriV1.endsWith(":1"));
        }

        // Import again
        {
            PxImportDto pxImportDto = new PxImportDto();
            pxImportDto.setContent(ImportationServiceTest.class.getResourceAsStream(pxFileName));
            pxImportDto.setProviderUri(providerDto.getUri());
            pxImportDto.setPxUrl(pxUrl);
            pxImportDto.setCategory(CATEGORY);

            datasetUriV2 = importationService.importPx(ctx, pxImportDto);

            // Retrieve V1: not exists
            try {
                dsdService.retrieveDataset(ctx, datasetUriV1);
            } catch (ApplicationException e) {
                assertEquals(DsdExceptionCodeEnum.DATASET_NOT_EXISTS.getName(), e.getErrorCode());
            }

            // Retrieve V2
            DatasetBasicDto datasetBasicDtoV2 = dsdService.retrieveDataset(ctx, datasetUriV2);
            assertEquals(pxUrl, datasetBasicDtoV2.getUrl());
            assertTrue(datasetUriV2.endsWith(":2"));

            // Checks datasets uris
            UriData uriImport1 = UriFactory.getUriData(datasetUriV1);
            UriData uriImport2 = UriFactory.getUriData(datasetUriV2);
            assertTrue(uriImport1.getUuid().equals(uriImport2.getUuid()));

            // Remove dataset (table of data)
            dataService.deleteDatasetRepository(ctx, datasetUriV2);
        }
    }

    @Test
    public void testImportPxUpdatingInDraft() throws Exception {

        String pxFileName = "/px/I101003_0201.px";
        String pxUrl = UUID.randomUUID().toString();

        String datasetUriV1 = null;
        String datasetUriV2 = null;
        DatasetBasicDto datasetBasicDtoV1 = null;
        String identifier = null;

        // Import creating new dataset
        {
            PxImportDto pxImportDto = new PxImportDto();
            pxImportDto.setContent(ImportationServiceTest.class.getResourceAsStream(pxFileName));
            pxImportDto.setProviderUri(providerDto.getUri());
            pxImportDto.setPxUrl(pxUrl);
            pxImportDto.setCategory(CATEGORY);

            datasetUriV1 = importationService.importPx(ctx, pxImportDto);

            // Retrieve V1
            datasetBasicDtoV1 = dsdService.retrieveDataset(ctx, datasetUriV1);
            assertEquals(pxUrl, datasetBasicDtoV1.getUrl());
            assertTrue(datasetUriV1.endsWith(":1"));
            identifier = datasetBasicDtoV1.getIdentifier();
        }

        // Create new version, without publishing
        String datasetV2ToDiscardCreatedDate = null;
        {
            DatasetDto datasetDtoV1 = dsdService.retrieveDatasetByIdentifier(ctx, providerDto.getAcronym(), identifier);
            String newFrequency = UUID.randomUUID().toString();
            datasetDtoV1.setFrequency(newFrequency);
            datasetUriV2 = dsdService.updateDatasetPublished(ctx, datasetUriV1, datasetDtoV1);

            // Retrieve V2
            DatasetBasicDto datasetBasicDtoV2 = dsdService.retrieveDataset(ctx, datasetUriV2);
            assertEquals(pxUrl, datasetBasicDtoV2.getUrl());
            assertEquals(newFrequency, datasetBasicDtoV2.getFrequency());
            assertTrue(datasetUriV2.endsWith(":2"));
            datasetV2ToDiscardCreatedDate = datasetBasicDtoV2.getCreatedDate().toString();
        }
        // Import (v2 will be discarted, and created again)
        {
            PxImportDto pxImportDto = new PxImportDto();
            pxImportDto.setContent(ImportationServiceTest.class.getResourceAsStream(pxFileName));
            pxImportDto.setProviderUri(providerDto.getUri());
            pxImportDto.setPxUrl(pxUrl);
            pxImportDto.setCategory(CATEGORY);

            datasetUriV2 = importationService.importPx(ctx, pxImportDto);
        }

        // Retrieve V2
        DatasetBasicDto datasetBasicDtoV2 = dsdService.retrieveDataset(ctx, datasetUriV2);
        assertEquals(pxUrl, datasetBasicDtoV2.getUrl());
        assertEquals(datasetBasicDtoV1.getFrequency(), datasetBasicDtoV2.getFrequency());
        assertTrue(datasetUriV2.endsWith(":2"));
        assertFalse(datasetBasicDtoV2.getCreatedDate().toString().equals(datasetV2ToDiscardCreatedDate));

        // Retrieve V1: not exists
        try {
            dsdService.retrieveDataset(ctx, datasetUriV1);
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_NOT_EXISTS.getName(), e.getErrorCode());
        }

        // Checks datasets uris
        UriData uriImport1 = UriFactory.getUriData(datasetUriV1);
        UriData uriImport2 = UriFactory.getUriData(datasetUriV2);
        assertTrue(uriImport1.getUuid().equals(uriImport2.getUuid()));

        // Remove dataset (table of data)
        dataService.deleteDatasetRepository(ctx, datasetUriV2);
    }

    @Test
    public void testImportPxWithDimensionsChanged() throws Exception {

        String pxUrl = UUID.randomUUID().toString();
        String identifier = "POBLACION_EDAD_ISLA_RESIDENCIA_SEXO_CENSOS_POBLACI";
        String datasetUriImport1 = null;
        String datasetUriImport2 = null;
        String datasetUriImport3 = null;

        // Import creating new dataset
        {
            PxImportDto pxImportDto = new PxImportDto();
            pxImportDto.setContent(ImportationServiceTest.class.getResourceAsStream("/px/I101003_0201.px"));
            pxImportDto.setProviderUri(providerDto.getUri());
            pxImportDto.setPxUrl(pxUrl);
            pxImportDto.setCategory(CATEGORY);

            datasetUriImport1 = importationService.importPx(ctx, pxImportDto);

            // Retrieve V1
            DatasetBasicDto datasetBasicDtoImport1 = dsdService.retrieveDataset(ctx, datasetUriImport1);
            assertEquals(pxUrl, datasetBasicDtoImport1.getUrl());
            assertEquals(identifier, datasetBasicDtoImport1.getIdentifier());
            assertTrue(datasetUriImport1.endsWith(":1"));
        }

        // Import again, changing dimensions
        {
            PxImportDto pxImportDto = new PxImportDto();
            pxImportDto.setContent(ImportationServiceTest.class.getResourceAsStream("/px/I101003_0201_dimensions_changed.px"));
            pxImportDto.setProviderUri(providerDto.getUri());
            pxImportDto.setPxUrl(pxUrl);
            pxImportDto.setCategory(CATEGORY);

            datasetUriImport2 = importationService.importPx(ctx, pxImportDto);

            // Retrieve Importation 1: already exists, with version 1 and without draft
            DatasetBasicDto datasetBasicDtoImport1 = dsdService.retrieveDatasetPublished(ctx, datasetUriImport1);
            assertEquals(datasetUriImport1, datasetBasicDtoImport1.getPublishedUri());
            assertNull(datasetBasicDtoImport1.getDraftUri());

            // Retrieve Importation 2
            DatasetBasicDto datasetBasicDtoImport2 = dsdService.retrieveDataset(ctx, datasetUriImport2);
            assertEquals(pxUrl, datasetBasicDtoImport2.getUrl());
            assertEquals(identifier + "_2", datasetBasicDtoImport2.getIdentifier());
            assertTrue(datasetUriImport2.endsWith(":1"));

            // They are different dataset
            UriData uriImport1 = UriFactory.getUriData(datasetUriImport1);
            UriData uriImport2 = UriFactory.getUriData(datasetUriImport2);
            assertFalse(uriImport1.getUuid().equals(uriImport2.getUuid()));
        }

        // Import again, to check update last
        {
            PxImportDto pxImportDto = new PxImportDto();
            pxImportDto.setContent(ImportationServiceTest.class.getResourceAsStream("/px/I101003_0201_dimensions_changed.px"));
            pxImportDto.setProviderUri(providerDto.getUri());
            pxImportDto.setPxUrl(pxUrl);
            pxImportDto.setCategory(CATEGORY);

            datasetUriImport3 = importationService.importPx(ctx, pxImportDto);

            // Retrieve Importation 3
            DatasetBasicDto datasetBasicDtoImport3 = dsdService.retrieveDataset(ctx, datasetUriImport3);
            assertEquals(pxUrl, datasetBasicDtoImport3.getUrl());
            assertEquals(identifier + "_2", datasetBasicDtoImport3.getIdentifier());
            assertTrue(datasetUriImport3.endsWith(":2"));

            // Checks datasets uris
            UriData uriImport1 = UriFactory.getUriData(datasetUriImport1);
            UriData uriImport2 = UriFactory.getUriData(datasetUriImport2);
            UriData uriImport3 = UriFactory.getUriData(datasetUriImport3);
            assertFalse(uriImport1.getUuid().equals(uriImport2.getUuid()));
            assertTrue(uriImport2.getUuid().equals(uriImport3.getUuid()));
        }

        // Remove dataset (table of data)
        dataService.deleteDatasetRepository(ctx, datasetUriImport1);
        dataService.deleteDatasetRepository(ctx, datasetUriImport3);
    }

    @Test
    public void testImportPxData() throws Exception {

        String pxFileName = "/px/E16028B_0008-attributes.px";
        String pxUrl = UUID.randomUUID().toString();

        // Import creating new dataset
        PxImportDto pxImportDto = new PxImportDto();
        pxImportDto.setContent(ImportationServiceTest.class.getResourceAsStream(pxFileName));
        pxImportDto.setProviderUri(providerDto.getUri());
        pxImportDto.setPxUrl(pxUrl);
        pxImportDto.setCategory(CATEGORY);

        String datasetUri = importationService.importPx(ctx, pxImportDto);
        assertNotNull(datasetUri);

        // Validate observations
        Map<String, ObservationExtendedDto> observations = dataService.findObservationsExtendedByDimensions(ctx, datasetUri, null);
        assertEquals(720, observations.size());

        // Some observations
        assertEquals("6911", observations.get("002#ES709#2009M10").getPrimaryMeasure());
        assertEquals("9532", observations.get("002#ES709#2009M12").getPrimaryMeasure());

        assertEquals(2, observations.get("002#ES708#2010M09").getAttributes().size());
        assertEquals("CELLNOTEX_1", observations.get("002#ES708#2010M09").getAttributes().get(0).getAttributeId());
        assertEquals("Cell notex 1", observations.get("002#ES708#2010M09").getAttributes().get(0).getValue().getLocalisedLabel("es"));
        assertEquals("CELLNOTE_1", observations.get("002#ES708#2010M09").getAttributes().get(1).getAttributeId());
        assertEquals("Trabajo o negocios en Lanzarote en 2010 Septiembre", observations.get("002#ES708#2010M09").getAttributes().get(1).getValue().getLocalisedLabel("es"));
    }

    @Test
    public void testImportCsvDigitalAgendaEuropeToDataset() throws Exception {

        InputStream dataStream = ImportationServiceTest.class.getResourceAsStream("/csv/data.csv");
        InputStream indicatorsStream = ImportationServiceTest.class.getResourceAsStream("/csv/indicators.csv");
        InputStream sourcesStream = ImportationServiceTest.class.getResourceAsStream("/csv/sources.csv");

        DigitalAgendaEuropeCsvDto csv = new DigitalAgendaEuropeCsvDto();
        csv.setData(dataStream);
        csv.setIndicators(indicatorsStream);
        csv.setSources(sourcesStream);
        // Dataset information
        csv.setProviderUri(providerDto.getUri());
        csv.setUrl("http://scoreboard.lod2.eu/data/digital_scoreboard_19_april_2012.xls");
        csv.setLanguage("en");
        csv.getLanguages().add("en");
        csv.getLanguages().add("es");
        csv.setProviderReleaseDate(new DateTime(2012, 4, 19, 0, 0, 0, 0));
        csv.setProviderPublishingDate(new DateTime(2012, 4, 19, 0, 0, 0, 0));
        csv.setIdentifier("SCOREBOARD_INDICATORS");
        InternationalStringDto title = new InternationalStringDto();
        title.addText(new LocalisedStringDto("en", "Digital Agenda Scoreboard Indicators"));
        title.addText(new LocalisedStringDto("es", "Cuadro de Indicadores de la Agenda Digital"));
        csv.setTitle(title);
        InternationalStringDto description = new InternationalStringDto();
        description
                .addText(new LocalisedStringDto(
                        "en",
                        "European Commission services selected around 60 indicators, divided into thematic groups, which illustrate some key dimensions of the European information society. These indicators allow a comparison of progress across countries as well as over time"));
        description
                .addText(new LocalisedStringDto(
                        "es",
                        "Los servicios de la Comisión Europea han seleccionado alrededor de 60 indicadores, divididos en grupos temáticos, que ilustran algunas de las dimensiones clave de la sociedad de la información. Estos indicadores permiten una comparación del progreso en todos los países, así como el paso del tiempo"));
        csv.setDescription(description);
        csv.setCategory("3.3.3");

        // Transform
        String datasetUri = importationService.importDigitalAgendaEuropeCsv(ctx, csv);

        // Validate
        DatasetBasicDto datasetDto = dsdService.retrieveDataset(ctx, datasetUri);
        assertEquals(datasetUri, datasetDto.getUri());
        assertEquals("SCOREBOARD_INDICATORS", datasetDto.getIdentifier());

        // Dimensions
        List<DimensionDto> dimensions = dsdService.retrieveDatasetDimensions(ctx, datasetUri);
        assertEquals(3, dimensions.size());
        {
            DimensionDto dimensionDto = dimensions.get(0);
            assertEquals("Year", dimensionDto.getIdentifier());
        }
        {
            DimensionDto dimensionDto = dimensions.get(1);
            assertEquals("Country", dimensionDto.getIdentifier());
        }
        {
            DimensionDto dimensionDto = dimensions.get(2);
            assertEquals("Indicator", dimensionDto.getIdentifier());
        }
        // Remove dataset (table of data)
        dataService.deleteDatasetRepository(ctx, datasetUri);

    }

    @Test
    public void testImportWithStatisticProcessor() throws Exception {

        String pxFileName = "/px/E16028B_0008-attributes.px";
        String pxUrl = UUID.randomUUID().toString();

        // Import creating new dataset
        PxImportDto pxImportDto = new PxImportDto();
        pxImportDto.setContent(ImportationServiceTest.class.getResourceAsStream(pxFileName));
        pxImportDto.setProviderUri(providerDto.getUri());
        pxImportDto.setPxUrl(pxUrl);
        pxImportDto.setCategory(CATEGORY);

        StatisticDto statisticDto = transformationService.transformPxToStatistic(ctx, pxImportDto);
        StatisticDtoProcessor processor = new StatisticDtoProcessor(pxUrl, statisticDto);

        String datasetUri = importationService.importStatistic(ctx, processor);
        assertNotNull(datasetUri);
        
        // Validate only same attributes
        DatasetBasicDto datasetDto = dsdService.retrieveDataset(ctx, datasetUri);
        assertEquals(datasetUri, datasetDto.getUri());

        assertEquals("TURISTAS_MOTIVOS_ESTANCIA_LUGARES_RESIDENCIA_ISLAS", datasetDto.getIdentifier());
        assertEquals(pxImportDto.getProviderUri(), datasetDto.getProviderUri());
        assertEquals(Constants.PUBLISHER_FOR_ALL_DATASETS, datasetDto.getPublisher());
    }

    /**
     * Create JNDI out of server context
     */
    private static void configureJndi() throws Exception {

        SimpleNamingContextBuilder builder = SimpleNamingContextBuilder.emptyActivatedContextBuilder();

        // Statistic dataset repository
        String datasetRepositoryDbUrl = Stat4YouConfiguration.instance().getProperty(DB_DATASET_REPOSITORY_URL);
        String datasetRepositoryDbUsername = Stat4YouConfiguration.instance().getProperty(DB_DATASET_REPOSITORY_USERNAME);
        String datasetRepositoryDbPassword = Stat4YouConfiguration.instance().getProperty(DB_DATASET_REPOSITORY_PASSWORD);
        SingleConnectionDataSource datasetRepositoryDatasource = getDatasource(datasetRepositoryDbUrl, datasetRepositoryDbUsername, datasetRepositoryDbPassword);
        builder.bind("java:comp/env/jdbc/StatisticDatasetDS", datasetRepositoryDatasource);

        // Statistics
        String statisticsDbUrl = Stat4YouConfiguration.instance().getProperty(DB_STATISTICS_URL);
        String statisticsDbUsername = Stat4YouConfiguration.instance().getProperty(DB_STATISTICS_USERNAME);
        String statisticsDbPassword = Stat4YouConfiguration.instance().getProperty(DB_STATISTICS_PASSWORD);
        SingleConnectionDataSource dsdDatasource = getDatasource(statisticsDbUrl, statisticsDbUsername, statisticsDbPassword);
        builder.bind("java:comp/env/jdbc/Stat4YouStatisticsDS", dsdDatasource);
    }

    private static SingleConnectionDataSource getDatasource(String url, String username, String password) {
        SingleConnectionDataSource dsDatasetRepository = new SingleConnectionDataSource();
        dsDatasetRepository.setUrl(url);
        dsDatasetRepository.setUsername(username);
        dsDatasetRepository.setPassword(password);
        dsDatasetRepository.setSuppressClose(true);
        return dsDatasetRepository;
    }

    private void assertEqualsAttachmentDimensions(AttributeDefinitionDto attributeDefinitionDto, String[] dimensions) {
        if (dimensions == null) {
            assertTrue(attributeDefinitionDto.getAttachmentDimensions().size() == 0);
            return;
        }
        assertEquals(dimensions.length, attributeDefinitionDto.getAttachmentDimensions().size());
        for (int i = 0; i < dimensions.length; i++) {
            String dimension = dimensions[i];
            boolean contains = false;
            for (ResourceIdentierDto resourceIdentierDto : attributeDefinitionDto.getAttachmentDimensions()) {
                if (dimension.equals(resourceIdentierDto.getIdentifier())) {
                    contains = true;
                    break;
                }
            }
            assertTrue(contains);
        }
    }
}
