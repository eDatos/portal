package com.stat4you.statistics.dsd.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.UUID;

import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
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
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.stat4you.common.Stat4YouConstants;
import com.stat4you.common.configuration.Stat4YouConfiguration;
import com.stat4you.common.criteria.Stat4YouCriteria;
import com.stat4you.common.criteria.Stat4YouCriteriaConjunctionRestriction;
import com.stat4you.common.criteria.Stat4YouCriteriaOrder;
import com.stat4you.common.criteria.Stat4YouCriteriaOrder.OrderTypeEnum;
import com.stat4you.common.criteria.Stat4YouCriteriaPaginator;
import com.stat4you.common.criteria.Stat4YouCriteriaPropertyRestriction;
import com.stat4you.common.criteria.Stat4YouCriteriaPropertyRestriction.OperationType;
import com.stat4you.common.criteria.Stat4YouCriteriaResult;
import com.stat4you.common.dto.InternationalStringDto;
import com.stat4you.common.dto.LocalisedStringDto;
import com.stat4you.common.test.Stat4YouBaseTests;
import com.stat4you.statistics.data.service.DataService;
import com.stat4you.statistics.dsd.Constants;
import com.stat4you.statistics.dsd.criteria.DatasetCriteriaOrderEnum;
import com.stat4you.statistics.dsd.criteria.DatasetCriteriaPropertyEnum;
import com.stat4you.statistics.dsd.domain.AttributeAttachmentLevelEnum;
import com.stat4you.statistics.dsd.domain.DatasetSourceEnum;
import com.stat4you.statistics.dsd.domain.DatasetStateEnum;
import com.stat4you.statistics.dsd.domain.DimensionTypeEnum;
import com.stat4you.statistics.dsd.domain.DsdExceptionCodeEnum;
import com.stat4you.statistics.dsd.dto.AttributeDefinitionDto;
import com.stat4you.statistics.dsd.dto.CodeDimensionDto;
import com.stat4you.statistics.dsd.dto.DatasetBasicDto;
import com.stat4you.statistics.dsd.dto.DatasetDto;
import com.stat4you.statistics.dsd.dto.DimensionBasicDto;
import com.stat4you.statistics.dsd.dto.DimensionDto;
import com.stat4you.statistics.dsd.dto.PrimaryMeasureDto;
import com.stat4you.statistics.dsd.dto.ProviderDto;
import com.stat4you.statistics.dsd.dto.ResourceIdentierDto;

/**
 * DsdService Tests
 * Spring based transactional test with DbUnit support.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring/mockito/data-service-mockito.xml", "classpath:spring/statistics-applicationContext-test.xml"})
public class DsdServiceTest extends Stat4YouBaseTests implements DsdServiceTestBase {

    @Autowired
    protected DsdService  dsdService;

    @Autowired
    protected DataService dataService;

    private static String PROVIDER_NOT_EXISTS                        = "stat4you:dsd:provider:9999-9999";
    private static String DATASET_NOT_EXISTS                         = "stat4you:dsd:dataset:9999-9999";
    private static String DIMENSION_NOT_EXISTS                       = "stat4you:dsd:dimension:9999-9999";
    private static String PRIMARY_MEASURE_NOT_EXISTS                 = "stat4you:dsd:primaryMeasure:9999-9999";
    // Provider 1
    private static String PROVIDER_1                                 = "stat4you:dsd:provider:P-1";
    private static String DATASET_1_PROVIDER_1                       = "stat4you:dsd:dataset:P-1-D-1";
    private static String DIMENSION1_DATASET_1_PROVIDER_1            = "stat4you:dsd:dimension:P-1-D-1-D-1";
    private static String DIMENSION2_DATASET_1_PROVIDER_1            = "stat4you:dsd:dimension:P-1-D-1-D-2";
    private static String PRIMARY_MEASURE1_DATASET_1_PROVIDER_1      = "stat4you:dsd:primaryMeasure:P-1-D-1-M-1";
    private static String ATTRIBUTE_DEFINITION1_DATASET_1_PROVIDER_1 = "stat4you:dsd:attributeDefinition:P-1-D-1-AD-1";
    private static String ATTRIBUTE_DEFINITION2_DATASET_1_PROVIDER_1 = "stat4you:dsd:attributeDefinition:P-1-D-1-AD-2";
    private static String ATTRIBUTE_DEFINITION3_DATASET_1_PROVIDER_1 = "stat4you:dsd:attributeDefinition:P-1-D-1-AD-3";
    private static String ATTRIBUTE_DEFINITION4_DATASET_1_PROVIDER_1 = "stat4you:dsd:attributeDefinition:P-1-D-1-AD-4";
    private static String DATASET_2_PROVIDER_1                       = "stat4you:dsd:dataset:P-1-D-2";
    private static String DIMENSION1_DATASET_2_PROVIDER_1            = "stat4you:dsd:dimension:P-1-D-2-D-1";
    private static String DIMENSION2_DATASET_2_PROVIDER_1            = "stat4you:dsd:dimension:P-1-D-2-D-2";
    private static String PRIMARY_MEASURE1_DATASET_2_PROVIDER_1      = "stat4you:dsd:primaryMeasure:P-1-D-2-M-1";
    // Provider 2
    private static String PROVIDER_2                                 = "stat4you:dsd:provider:P-2";
    // Provider 3
    private static String PROVIDER_3_REMOVED                         = "stat4you:dsd:provider:P-3";
    private static String DATASET_1_PROVIDER_3                       = "stat4you:dsd:dataset:P-3-D-1";
    // Provider 4
    private static String PROVIDER_4                                 = "stat4you:dsd:provider:P-4";
    private static String DATASET_1_PROVIDER_4                       = "stat4you:dsd:dataset:P-4-D-1";

    // Provider 5
    private static String PROVIDER_5                                 = "stat4you:dsd:provider:P-5";
    private static String DATASET_1_PROVIDER_5                       = "stat4you:dsd:dataset:P-5-D-1";
    private static String DATASET_2_PROVIDER_5                       = "stat4you:dsd:dataset:P-5-D-2";

    // Provider 6
    private static String PROVIDER_6                                 = "stat4you:dsd:provider:P-6";
    private static String DATASET_1_PROVIDER_6                       = "stat4you:dsd:dataset:P-6-D-1";

    @BeforeClass
    public static void setUpBeforeClass() throws Exception {
        System.setProperty(Stat4YouConstants.PROP_DATA_URL, "./data/");
        
        // Quartz: start scheduler
        if (SchedulerRepository.getInstance().lookup(Stat4YouConstants.JOB_SCHEDULER) == null) {
            Properties quartzProperties = Stat4YouConfiguration.instance().getProperties();
            SchedulerFactory sf = new StdSchedulerFactory(quartzProperties);
            Scheduler sched = sf.getScheduler();
            sched.start();
        }
    }

    @Before
    public void setUp() throws Exception {
    }

    @AfterClass
    public static void tearDownAfterClass() throws Exception {
    }

    @Test
    public void testCreateProvider() throws Exception {

        // Create
        ProviderDto providerDto = new ProviderDto();
        providerDto.setAcronym("A1234");
        providerDto.setName("456");
        providerDto.setDescription(getInternationalString("Description provider 456"));
        providerDto.setCitation(org.apache.commons.lang3.RandomStringUtils.randomAlphabetic(4000));
        providerDto.setLanguage("es");
        providerDto.setLogo("http://logoExample");
        String uri = dsdService.createProvider(getServiceContext(), providerDto);

        // Validate
        assertNotNull(uri);
        ProviderDto providerDtoCreated = dsdService.retrieveProvider(getServiceContext(), uri);
        assertEqualsProvider(providerDto, providerDtoCreated);

        // Audit
        assertEquals(getServiceContext().getUserId(), providerDtoCreated.getCreatedBy());
        assertEquals((new DateTime()).getDayOfYear(), providerDtoCreated.getCreatedDate().getDayOfYear());
        assertEquals((new DateTime()).getDayOfYear(), providerDtoCreated.getLastUpdated().getDayOfYear());
        assertEquals(getServiceContext().getUserId(), providerDtoCreated.getLastUpdatedBy());
    }

    @Test
    public void testCreateProviderAcronymRequired() throws Exception {

        ProviderDto providerDto = new ProviderDto();
        providerDto.setAcronym(null);
        providerDto.setName("456");
        try {
            dsdService.createProvider(getServiceContext(), providerDto);
            fail("acronym required");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.REQUIRED_ATTRIBUTE.getName(), e.getErrorCode());
            assertTrue(e.getMessage().contains("acronym"));
        }
    }

    @Test
    public void testCreateProviderAcronymDuplicated() throws Exception {

        ProviderDto providerDto = new ProviderDto();
        providerDto.setAcronym("Provider1");
        providerDto.setName("456");
        try {
            dsdService.createProvider(getServiceContext(), providerDto);
            fail("acronym duplicated");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.PROVIDER_ALREADY_EXISTS.getName(), e.getErrorCode());
            assertTrue(e.getMessage().contains("acronym"));
        }
    }

    @Test
    public void testCreateProviderNameRequired() throws Exception {

        ProviderDto providerDto = new ProviderDto();
        providerDto.setAcronym(mockSemanticIdentifier());
        providerDto.setName(null);
        try {
            dsdService.createProvider(getServiceContext(), providerDto);
            fail("name required");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.REQUIRED_ATTRIBUTE.getName(), e.getErrorCode());
            assertTrue(e.getMessage().contains("name"));
        }
    }

    @Test
    public void testCreateProviderErrorAcronymDuplicated() throws Exception {

        ProviderDto providerDto = new ProviderDto();
        providerDto.setAcronym("Provider1");
        providerDto.setName("456");

        try {
            dsdService.createProvider(getServiceContext(), providerDto);
            fail("acronym duplicated");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.PROVIDER_ALREADY_EXISTS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testCreateProviderErrorCodeDuplicatedInsensitive() throws Exception {

        ProviderDto providerDto = new ProviderDto();
        providerDto.setAcronym("pROVIDER1");
        providerDto.setName("456");

        try {
            dsdService.createProvider(getServiceContext(), providerDto);
            fail("acronym duplicated");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.PROVIDER_ALREADY_EXISTS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testCreateProviderAcronymInvalidSemanticIdentifier() throws Exception {

        ProviderDto providerDto = new ProviderDto();
        providerDto.setAcronym("*aa ");
        providerDto.setName("456");
        try {
            dsdService.createProvider(getServiceContext(), providerDto);
            fail("acronym incorrect");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), e.getErrorCode());
            assertTrue(e.getMessage().contains("acronym"));
            assertTrue(e.getMessage().contains("semantic identifier"));
        }
    }

    @Test
    public void testRetrieveProvider() throws Exception {

        String uri = PROVIDER_1;
        ProviderDto providerDto = dsdService.retrieveProvider(getServiceContext(), uri);

        // Validate
        assertNotNull(providerDto);
        assertEquals(uri, providerDto.getUri());
        assertEquals("Provider1", providerDto.getAcronym());
        assertEquals("Instituto Canario de Estadística", providerDto.getName());
        assertEquals("http://Provider1Url", providerDto.getUrl());
        assertEquals("Fuente: INE", providerDto.getCitation());
        assertEqualsInternationalString(providerDto.getLicense(), "es", "Licencia de Proveedor 1", "en", "License of Provider 1");
        assertEquals("http://license1Url", providerDto.getLicenseUrl());
        assertEquals("es", providerDto.getLanguage());
        assertEquals("http://logo1Url", providerDto.getLogo());
        assertEqualsInternationalString(providerDto.getDescription(), "es", "Descripción proveedor 1", "en", "Description provider 1");

        assertEquals("user1", providerDto.getCreatedBy());
        assertEquals("user2", providerDto.getLastUpdatedBy());

        assertEquals(22, providerDto.getCreatedDate().dayOfMonth().get());
        assertEquals(7, providerDto.getCreatedDate().monthOfYear().get());
        assertEquals(2010, providerDto.getCreatedDate().year().get());

        assertEquals(24, providerDto.getLastUpdated().dayOfMonth().get());
        assertEquals(8, providerDto.getLastUpdated().monthOfYear().get());
        assertEquals(2011, providerDto.getLastUpdated().year().get());
    }

    @Test
    public void testRetrieveProviderErrorUriIncorrect() throws Exception {

        String uri = "stat4you:dsd:dataset:1";
        try {
            dsdService.retrieveProvider(getServiceContext(), uri);
            fail("uri incorrect");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testRetrieveProviderErrorNotExists() throws Exception {
        try {
            dsdService.retrieveProvider(getServiceContext(), PROVIDER_NOT_EXISTS);
            fail("No exists");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.PROVIDER_NOT_EXISTS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testRetrieveProviderByAcronym() throws Exception {

        ProviderDto providerDto = dsdService.retrieveProviderByAcronym(getServiceContext(), "Provider1");

        // Validate
        assertNotNull(providerDto);
        assertEquals(PROVIDER_1, providerDto.getUri());
        assertEquals("Provider1", providerDto.getAcronym());
        assertEquals("Instituto Canario de Estadística", providerDto.getName());
        assertEquals("http://Provider1Url", providerDto.getUrl());
        assertEquals("Fuente: INE", providerDto.getCitation());
        assertEqualsInternationalString(providerDto.getLicense(), "es", "Licencia de Proveedor 1", "en", "License of Provider 1");
        assertEquals("http://license1Url", providerDto.getLicenseUrl());
        assertEquals("es", providerDto.getLanguage());
        assertEquals("http://logo1Url", providerDto.getLogo());
    }

    @Test
    public void testRetrieveProviderByAcronymErrorNotExists() throws Exception {
        try {
            dsdService.retrieveProviderByAcronym(getServiceContext(), PROVIDER_NOT_EXISTS);
            fail("No exists");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.PROVIDER_NOT_EXISTS_WITH_ACRONYM.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testUpdateProvider() throws Exception {

        String uri = PROVIDER_1;
        ProviderDto providerDto = dsdService.retrieveProvider(getServiceContext(), uri);
        providerDto.setName("NewName");
        providerDto.setAcronym("NewAcronym");
        providerDto.setCitation("NewCitation");
        providerDto.setLicense(getInternationalString("NewLicense"));
        providerDto.setLicenseUrl("http://NewLicenseUrl");
        providerDto.setUrl("http://newurl");

        // Update
        dsdService.updateProvider(getServiceContext(), providerDto);

        // Validation
        ProviderDto providerDtoUpdate = dsdService.retrieveProvider(getServiceContext(), uri);
        assertEqualsProvider(providerDto, providerDtoUpdate);
        assertTrue(providerDtoUpdate.getLastUpdated().isAfter(providerDtoUpdate.getCreatedDate()));
        // Datasets exist yet
        Stat4YouCriteria criteria = buildCriteriaFindByProvider(uri);
        Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasets(getServiceContext(), criteria);
        List<DatasetBasicDto> datasetsDto = result.getResults();
        assertEquals(2, datasetsDto.size());
        assertEquals(DATASET_1_PROVIDER_1 + ":1", datasetsDto.get(0).getUri());
        assertEquals(DATASET_2_PROVIDER_1 + ":1", datasetsDto.get(1).getUri());
    }

    @Test
    public void testUpdateProviderIgnoreChangeNonModifiableAttributes() throws Exception {

        // Create
        ProviderDto providerDto = new ProviderDto();
        providerDto.setAcronym("A1234");
        providerDto.setName("456");
        String uri = dsdService.createProvider(getServiceContext(), providerDto);

        // Retrieve and change unmodifiable attributes
        ProviderDto providerDtoToCompare = dsdService.retrieveProvider(getServiceContext(), uri);
        ProviderDto providerDtoToUpdate = dsdService.retrieveProvider(getServiceContext(), uri);
        providerDtoToUpdate.setCreatedBy("aa");
        providerDtoToUpdate.setCreatedDate(new DateTime());
        providerDtoToUpdate.setRemovedDate(new DateTime());

        // Update
        dsdService.updateProvider(getServiceContext(), providerDtoToUpdate);

        // Retrieve
        ProviderDto providerDtoUpdated = dsdService.retrieveProvider(getServiceContext(), uri);
        assertEquals(providerDtoToCompare.getCreatedBy(), providerDtoUpdated.getCreatedBy());
        assertEquals(providerDtoToCompare.getCreatedDate(), providerDtoUpdated.getCreatedDate());
        assertEquals(providerDtoToCompare.getRemovedDate(), providerDtoUpdated.getRemovedDate());
    }

    @Test
    public void testUpdateProviderCheckUsers() throws Exception {

        String user1 = getServiceContext().getUserId();
        String user2 = getServiceContext2().getUserId();

        // Create user 1 and validate
        ProviderDto providerDto = new ProviderDto();
        providerDto.setAcronym("A1234");
        providerDto.setName("456");
        String uri = dsdService.createProvider(getServiceContext(), providerDto);
        ProviderDto providerDtoCreated = dsdService.retrieveProvider(getServiceContext(), uri);
        assertEquals(user1, providerDtoCreated.getCreatedBy());
        assertEquals(user1, providerDtoCreated.getLastUpdatedBy());
        assertTrue(!providerDtoCreated.getCreatedDate().isAfter(providerDtoCreated.getLastUpdated()) && !providerDtoCreated.getCreatedDate().isBefore(providerDtoCreated.getLastUpdated()));

        // Update user 2 and validate
        providerDtoCreated.setCitation("newCitation"); // must update at least one attribute. If no, update into database not ocurr
        Thread.sleep(1000); // avoid createdDate and lastUpdate are equal
        dsdService.updateProvider(getServiceContext2(), providerDtoCreated);

        ProviderDto providerDtoUpdated2 = dsdService.retrieveProvider(getServiceContext(), uri);
        assertEquals(user1, providerDtoUpdated2.getCreatedBy());
        assertEquals(user2, providerDtoUpdated2.getLastUpdatedBy());
        assertTrue(providerDtoUpdated2.getLastUpdated().isAfter(providerDtoUpdated2.getCreatedDate())); // sometimes retrieve incorrectly!
    }

    @Test
    public void testUpdateProviderErrorAcronymExists() throws Exception {

        String uri = PROVIDER_1;
        ProviderDto providerDto = dsdService.retrieveProvider(getServiceContext(), uri);
        providerDto.setAcronym("Provider2");

        try {
            dsdService.updateProvider(getServiceContext(), providerDto);
            fail("acronym exists");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.PROVIDER_ALREADY_EXISTS.getName(), e.getErrorCode());
            assertTrue(e.getMessage().contains("acronym"));
        }
    }

    @Test
    public void testUpdateProviderErrorRemoved() throws Exception {

        String uri = PROVIDER_3_REMOVED;
        ProviderDto providerDto = dsdService.retrieveProvider(getServiceContext(), uri);
        assertNotNull(providerDto.getRemovedDate());

        try {
            dsdService.updateProvider(getServiceContext(), providerDto);
            fail("removed");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.PROVIDER_INCORRECT_STATUS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testUpdateProviderErrorNotExists() throws Exception {

        ProviderDto providerDto = new ProviderDto();
        providerDto.setUri(PROVIDER_NOT_EXISTS);
        providerDto.setAcronym("Provider1");
        providerDto.setName("456");

        try {
            dsdService.updateProvider(getServiceContext(), providerDto);
            fail("not exists");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.PROVIDER_NOT_EXISTS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testRemoveProvider() throws Exception {

        String uri = PROVIDER_1;
        ProviderDto providerDto = dsdService.retrieveProvider(getServiceContext(), uri);
        assertNull(providerDto.getRemovedDate());

        // Remove
        dsdService.removeProvider(getServiceContext(), uri);

        // Validation
        ProviderDto providerDtoRemoved = dsdService.retrieveProvider(getServiceContext(), uri);
        assertNotNull(providerDtoRemoved.getRemovedDate());
    }

    @Test
    public void testRemoveProviderErrorNotExists() throws Exception {
        try {
            dsdService.removeProvider(getServiceContext(), PROVIDER_NOT_EXISTS);
            fail("No exists");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.PROVIDER_NOT_EXISTS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testRemoveProviderErrorRemoved() throws Exception {
        try {
            dsdService.removeProvider(getServiceContext(), PROVIDER_3_REMOVED);
            fail("Already removed");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.PROVIDER_INCORRECT_STATUS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testRetrieveProviders() throws Exception {

        // Find all
        List<ProviderDto> providersDto = dsdService.retrieveProviders(getServiceContext());
        assertEquals(6, providersDto.size());
        assertEquals(PROVIDER_1, providersDto.get(0).getUri());
        assertEquals(PROVIDER_2, providersDto.get(1).getUri());
        assertEquals(PROVIDER_3_REMOVED, providersDto.get(2).getUri());
        assertEquals(PROVIDER_4, providersDto.get(3).getUri());
        assertEquals(PROVIDER_5, providersDto.get(4).getUri());
        assertEquals(PROVIDER_6, providersDto.get(5).getUri());
    }

    @Override
    @Test
    public void testGenerateDatasetIdentifier() throws Exception {

        // Generate new identifier for dataset in provider 1 (already exists the identifier)
        String identifierUnique1 = dsdService.generateDatasetIdentifier(getServiceContext(), PROVIDER_1, "IdentifierDataset1");
        assertEquals("IdentifierDataset1_2", identifierUnique1);

        // Generate new identifier for dataset in provider 2
        String identifierUnique2 = dsdService.generateDatasetIdentifier(getServiceContext(), PROVIDER_2, "IdentifierDataset1");
        assertEquals("IdentifierDataset1", identifierUnique2);
    }

    @Override
    @Test
    public void testCreateDataset() throws Exception {

        DatasetDto datasetDto1 = new DatasetDto();
        datasetDto1.setTitle(getInternationalString("Dataset title 1"));
        datasetDto1.setDescription(getInternationalString("Dataset description 1"));
        datasetDto1.setUrl("http://url-dataset1");
        datasetDto1.setProviderUri(PROVIDER_1);
        datasetDto1.setSource(DatasetSourceEnum.PX);
        datasetDto1.setFrequency("No se actualiza");
        datasetDto1.setLanguage("es");
        datasetDto1.getLanguages().add("es");
        datasetDto1.getLanguages().add("eng");
        datasetDto1.getCategories().add("category n1");
        datasetDto1.getCategories().add("category n2");
        datasetDto1.setProviderPublishingDate(new DateTime("2011-04-02T10:04:02Z")); // not do new DateTime() because put millis, and these are not in database
        datasetDto1.setProviderReleaseDate(new DateTime("2010-05-11T11:12:13Z"));
        datasetDto1.setIdentifier("Identifier1");

        // Dimensions
        datasetDto1.getDimensions().addAll(mockDimensions(3));
        datasetDto1.getDimensions().get(0).setIdentifier("DIMENSION_1");
        datasetDto1.getDimensions().get(1).setIdentifier("DIMENSION_2");
        datasetDto1.getDimensions().get(2).setIdentifier("DIMENSION_3");

        // Primary measure
        datasetDto1.setPrimaryMeasure(mockPrimaryMeasure());

        // Attribute definitions
        AttributeDefinitionDto attributeDefinitionDtoGlobal1 = new AttributeDefinitionDto();
        attributeDefinitionDtoGlobal1.setIdentifier("NOTE");
        attributeDefinitionDtoGlobal1.setAttachmentLevel(AttributeAttachmentLevelEnum.DATASET);
        attributeDefinitionDtoGlobal1.setTitle(getInternationalString("Note"));
        datasetDto1.addAttributeDefinition(attributeDefinitionDtoGlobal1);

        AttributeDefinitionDto attributeDefinitionDtoGlobal2 = new AttributeDefinitionDto();
        attributeDefinitionDtoGlobal2.setIdentifier("NOTEX");
        attributeDefinitionDtoGlobal2.setAttachmentLevel(AttributeAttachmentLevelEnum.DATASET);
        attributeDefinitionDtoGlobal2.setTitle(null);
        datasetDto1.addAttributeDefinition(attributeDefinitionDtoGlobal2);

        AttributeDefinitionDto attributeDefinitionDtoDimension1 = new AttributeDefinitionDto();
        attributeDefinitionDtoDimension1.setIdentifier("VALUENOTE");
        attributeDefinitionDtoDimension1.setAttachmentLevel(AttributeAttachmentLevelEnum.DIMENSION);
        attributeDefinitionDtoDimension1.setTitle(getInternationalString("Valuenote"));
        attributeDefinitionDtoDimension1.getAttachmentDimensions().add(getResourceIdentifierDto("DIMENSION_1"));
        attributeDefinitionDtoDimension1.getAttachmentDimensions().add(getResourceIdentifierDto("DIMENSION_3"));
        datasetDto1.addAttributeDefinition(attributeDefinitionDtoDimension1);

        AttributeDefinitionDto attributeDefinitionDtoDimension2 = new AttributeDefinitionDto();
        attributeDefinitionDtoDimension2.setIdentifier("VALUENOTE_2");
        attributeDefinitionDtoDimension2.setAttachmentLevel(AttributeAttachmentLevelEnum.DIMENSION);
        attributeDefinitionDtoDimension2.setTitle(getInternationalString("Valuenote"));
        attributeDefinitionDtoDimension2.getAttachmentDimensions().add(getResourceIdentifierDto("DIMENSION_1"));
        datasetDto1.addAttributeDefinition(attributeDefinitionDtoDimension2);

        AttributeDefinitionDto attributeDefinitionDtoObservation1 = new AttributeDefinitionDto();
        attributeDefinitionDtoObservation1.setIdentifier("CELLNOTE");
        attributeDefinitionDtoObservation1.setAttachmentLevel(AttributeAttachmentLevelEnum.OBSERVATION);
        attributeDefinitionDtoObservation1.setTitle(getInternationalString("Cellnote"));
        datasetDto1.addAttributeDefinition(attributeDefinitionDtoObservation1);

        AttributeDefinitionDto attributeDefinitionDtoObservation2 = new AttributeDefinitionDto();
        attributeDefinitionDtoObservation2.setIdentifier("CELLNOTEX");
        attributeDefinitionDtoObservation2.setAttachmentLevel(AttributeAttachmentLevelEnum.OBSERVATION);
        attributeDefinitionDtoObservation2.setTitle(getInternationalString("Cellnotex"));
        datasetDto1.addAttributeDefinition(attributeDefinitionDtoObservation2);

        String datasetUri1 = dsdService.createDataset(getServiceContext(), datasetDto1);

        // Retrieve and validate
        DatasetBasicDto datasetCreated = dsdService.retrieveDataset(getServiceContext(), datasetUri1);
        datasetDto1.setPublisher(Constants.PUBLISHER_FOR_ALL_DATASETS);
        assertEqualsDatasetBasic(datasetDto1, datasetCreated);
        assertEquals(DatasetStateEnum.DRAFT, datasetCreated.getState());
        assertEquals(datasetUri1, datasetCreated.getDraftUri());
        assertTrue(datasetCreated.getUri().endsWith(":1")); // version
        assertEquals(datasetCreated.getUri(), datasetCreated.getDraftUri());
        assertNull(datasetCreated.getPublishedUri());
        assertNull(datasetCreated.getReleaseDate());
        assertNull(datasetCreated.getPublishingDate());
        assertNull(datasetCreated.getUnpublishingDate());

        // Validate audit
        assertEquals(getServiceContext().getUserId(), datasetCreated.getCreatedBy());
        assertEquals((new DateTime()).getDayOfYear(), datasetCreated.getCreatedDate().getDayOfYear());
        assertEquals((new DateTime()).getDayOfYear(), datasetCreated.getLastUpdated().getDayOfYear());
        assertEquals(getServiceContext().getUserId(), datasetCreated.getLastUpdatedBy());

        // Validate dimensions
        List<DimensionDto> dimensionsDto = dsdService.retrieveDatasetDimensions(getServiceContext(), datasetUri1);
        assertEquals(3, dimensionsDto.size());
        for (int i = 0; i < datasetDto1.getDimensions().size(); i++) {
            DimensionDto dimensionDtoExpected = datasetDto1.getDimensions().get(i);
            DimensionDto dimensionDtoActual = dimensionsDto.get(i);

            assertEqualsDimension(dimensionDtoExpected, dimensionDtoActual);

            assertNotNull(dimensionDtoActual.getUri());
            assertEquals(getServiceContext().getUserId(), dimensionDtoActual.getCreatedBy());
            assertEquals((new DateTime()).getDayOfYear(), dimensionDtoActual.getCreatedDate().getDayOfYear());
            assertEquals((new DateTime()).getDayOfYear(), dimensionDtoActual.getLastUpdated().getDayOfYear());
            assertEquals(getServiceContext().getUserId(), dimensionDtoActual.getLastUpdatedBy());
        }

        // Validate primary measure
        PrimaryMeasureDto primaryMeasureDto = dsdService.retrieveDatasetPrimaryMeasure(getServiceContext(), datasetUri1);
        assertEqualsPrimaryMeasure(datasetDto1.getPrimaryMeasure(), primaryMeasureDto);
        assertNotNull(primaryMeasureDto.getUri());
        assertEquals(getServiceContext().getUserId(), primaryMeasureDto.getCreatedBy());
        assertEquals((new DateTime()).getDayOfYear(), primaryMeasureDto.getCreatedDate().getDayOfYear());
        assertEquals((new DateTime()).getDayOfYear(), primaryMeasureDto.getLastUpdated().getDayOfYear());
        assertEquals(getServiceContext().getUserId(), primaryMeasureDto.getLastUpdatedBy());

        // Validate definitions of attributes
        List<AttributeDefinitionDto> attributeDefinitionsDto = dsdService.retrieveDatasetAttributeDefinitions(getServiceContext(), datasetUri1);
        assertEquals(6, attributeDefinitionsDto.size());
        for (int i = 0; i < datasetDto1.getAttributeDefinitions().size(); i++) {
            AttributeDefinitionDto attributeDefinitionDtoExpected = datasetDto1.getAttributeDefinitions().get(i);
            AttributeDefinitionDto attributeDefinitionDtoActual = attributeDefinitionsDto.get(i);

            assertEqualsAttributeDefinition(attributeDefinitionDtoExpected, attributeDefinitionDtoActual);

            assertNotNull(attributeDefinitionDtoActual.getUri());
            assertEquals(getServiceContext().getUserId(), attributeDefinitionDtoActual.getCreatedBy());
            assertEquals((new DateTime()).getDayOfYear(), attributeDefinitionDtoActual.getCreatedDate().getDayOfYear());
            assertEquals((new DateTime()).getDayOfYear(), attributeDefinitionDtoActual.getLastUpdated().getDayOfYear());
            assertEquals(getServiceContext().getUserId(), attributeDefinitionDtoActual.getLastUpdatedBy());
        }
    }

    @Test
    public void testCreateDatasetWithIdentifierAlreadyExistsInOtherProvider() throws Exception {
        DatasetDto datasetDto1 = new DatasetDto();
        datasetDto1.setTitle(getInternationalString("Dataset NAME 1"));
        datasetDto1.setProviderUri(PROVIDER_2);
        datasetDto1.setSource(DatasetSourceEnum.PX);
        datasetDto1.setIdentifier("IdentifierDataset1");
        datasetDto1.getDimensions().addAll(mockDimensions(3));
        datasetDto1.setPrimaryMeasure(mockPrimaryMeasure());

        String datasetUri = dsdService.createDataset(getServiceContext(), datasetDto1);
        assertNotNull(datasetUri);
    }

    @Test
    public void testCreateDatasetErrorTitleRequired() throws Exception {

        DatasetDto datasetDto1 = new DatasetDto();
        datasetDto1.setProviderUri(PROVIDER_1);
        datasetDto1.setIdentifier(mockSemanticIdentifier());
        datasetDto1.setTitle(null);

        try {
            dsdService.createDataset(getServiceContext(), datasetDto1);
            fail("title required");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.REQUIRED_ATTRIBUTE.getName(), e.getErrorCode());
            assertTrue(e.getMessage().contains("datasetDto.title"));
        }
    }

    @Test
    public void testCreateDatasetErrorLabelRequired() throws Exception {

        DatasetDto datasetDto1 = new DatasetDto();
        datasetDto1.setProviderUri(PROVIDER_1);
        datasetDto1.setIdentifier(mockSemanticIdentifier());
        datasetDto1.setTitle(getInternationalString("Dataset 1"));
        datasetDto1.getTitle().getTexts().get(0).setLabel(null);

        try {
            dsdService.createDataset(getServiceContext(), datasetDto1);
            fail("label required");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.REQUIRED_ATTRIBUTE.getName(), e.getErrorCode());
            assertTrue(e.getMessage().contains("title"));
        }
    }

    @Test
    public void testCreateDatasetErrorIdentifierAlreadyExists() throws Exception {
        DatasetDto datasetDto1 = new DatasetDto();
        datasetDto1.setTitle(getInternationalString("Dataset NAME 1"));
        datasetDto1.setProviderUri(PROVIDER_1);
        datasetDto1.setSource(DatasetSourceEnum.PX);
        datasetDto1.setIdentifier("IdentifierDataset1");
        datasetDto1.getDimensions().addAll(mockDimensions(3));
        datasetDto1.setPrimaryMeasure(mockPrimaryMeasure());
        try {
            dsdService.createDataset(getServiceContext(), datasetDto1);
            fail("Identifier already exists");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_ALREADY_EXISTS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testCreateDatasetErrorDimensionIdentifierRequired() throws Exception {
        DatasetDto datasetDto1 = new DatasetDto();
        datasetDto1.setTitle(getInternationalString("Dataset NAME 1"));
        datasetDto1.setProviderUri(PROVIDER_1);
        datasetDto1.setSource(DatasetSourceEnum.PX);
        datasetDto1.setIdentifier("IdentifierDataset1");
        datasetDto1.getDimensions().addAll(mockDimensions(3));
        datasetDto1.getDimensions().get(0).setIdentifier(null);
        datasetDto1.setPrimaryMeasure(mockPrimaryMeasure());
        try {
            dsdService.createDataset(getServiceContext(), datasetDto1);
            fail("Identifier of dimension required");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.REQUIRED_ATTRIBUTE.getName(), e.getErrorCode());
            assertTrue(e.getMessage().contains("dimensionDto.identifier"));
        }
    }

    @Test
    public void testCreateDatasetErrorPrimaryMeasureIdentifierRequired() throws Exception {
        DatasetDto datasetDto1 = new DatasetDto();
        datasetDto1.setTitle(getInternationalString("Dataset NAME 1"));
        datasetDto1.setProviderUri(PROVIDER_1);
        datasetDto1.setSource(DatasetSourceEnum.PX);
        datasetDto1.setIdentifier("IdentifierDataset1");
        datasetDto1.getDimensions().addAll(mockDimensions(3));
        datasetDto1.setPrimaryMeasure(mockPrimaryMeasure());
        datasetDto1.getPrimaryMeasure().setIdentifier(null);
        try {
            dsdService.createDataset(getServiceContext(), datasetDto1);
            fail("Identifier of primary measure required");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.REQUIRED_ATTRIBUTE.getName(), e.getErrorCode());
            assertTrue(e.getMessage().contains("primaryMeasureDto.identifier"));
        }
    }

    @Test
    public void testCreateDatasetErrorDimensionIdentifierAlreadyExists() throws Exception {
        DatasetDto datasetDto1 = new DatasetDto();
        datasetDto1.setTitle(getInternationalString("Dataset NAME 1"));
        datasetDto1.setProviderUri(PROVIDER_1);
        datasetDto1.setSource(DatasetSourceEnum.PX);
        datasetDto1.setIdentifier("IdentifierDataset1");
        datasetDto1.getDimensions().addAll(mockDimensions(3));
        datasetDto1.getDimensions().get(1).setIdentifier(datasetDto1.getDimensions().get(0).getIdentifier());
        datasetDto1.setPrimaryMeasure(mockPrimaryMeasure());
        try {
            dsdService.createDataset(getServiceContext(), datasetDto1);
            fail("Identifier duplicated");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), e.getErrorCode());
            assertEquals("Identifier of dimension \"" + datasetDto1.getDimensions().get(0).getIdentifier() + "\" duplicated", e.getMessage());

        }
    }

    @Test
    public void testCreateDatasetErrorProviderNotExists() throws Exception {
        try {
            DatasetDto datasetDto1 = new DatasetDto();
            datasetDto1.setIdentifier(mockSemanticIdentifier());
            datasetDto1.setTitle(getInternationalString("Dataset name 1"));
            datasetDto1.setProviderUri(PROVIDER_NOT_EXISTS);
            datasetDto1.setSource(DatasetSourceEnum.PX);
            datasetDto1.getDimensions().addAll(mockDimensions(3));
            datasetDto1.setPrimaryMeasure(mockPrimaryMeasure());
            dsdService.createDataset(getServiceContext(), datasetDto1);
            fail("Provider not exists");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.PROVIDER_NOT_EXISTS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testCreateDatasetErrorProviderRemoved() throws Exception {
        try {
            DatasetDto datasetDto1 = new DatasetDto();
            datasetDto1.setIdentifier(mockSemanticIdentifier());
            datasetDto1.setTitle(getInternationalString("Dataset name 1"));
            datasetDto1.setProviderUri(PROVIDER_3_REMOVED);
            datasetDto1.setSource(DatasetSourceEnum.PX);
            datasetDto1.getDimensions().addAll(mockDimensions(3));
            datasetDto1.setPrimaryMeasure(mockPrimaryMeasure());
            dsdService.createDataset(getServiceContext(), datasetDto1);
            fail("Provider removed");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.PROVIDER_INCORRECT_STATUS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testCreateDatasetInvalidSemanticIdentifier() throws Exception {
        DatasetDto datasetDto1 = new DatasetDto();
        datasetDto1.setTitle(getInternationalString("Dataset title 1"));
        datasetDto1.setDescription(getInternationalString("Dataset description 1"));
        datasetDto1.setUrl("http://url-dataset1");
        datasetDto1.setProviderUri(PROVIDER_1);
        datasetDto1.setSource(DatasetSourceEnum.PX);
        datasetDto1.setFrequency("No se actualiza");
        datasetDto1.setLanguage("es");
        datasetDto1.getLanguages().add("es");
        datasetDto1.getCategories().add("category n1");
        datasetDto1.setProviderPublishingDate(new DateTime("2011-04-02T10:04:02Z")); // not do new DateTime() because put millis, and these are not in database
        datasetDto1.setProviderReleaseDate(new DateTime("2010-05-11T11:12:13Z"));
        datasetDto1.setIdentifier("a b");
        datasetDto1.getDimensions().addAll(mockDimensions(3));
        datasetDto1.setPrimaryMeasure(mockPrimaryMeasure());
        try {
            dsdService.createDataset(getServiceContext(), datasetDto1);
            fail("identifier incorrect");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), e.getErrorCode());
            assertTrue(e.getMessage().contains("datasetDto.identifier"));
            assertTrue(e.getMessage().contains("semantic identifier"));
        }
    }

    @Test
    public void testCreateDatasetInvalidSemanticIdentifierDimension() throws Exception {
        DatasetDto datasetDto1 = new DatasetDto();
        datasetDto1.setTitle(getInternationalString("Dataset title 1"));
        datasetDto1.setDescription(getInternationalString("Dataset description 1"));
        datasetDto1.setUrl("http://url-dataset1");
        datasetDto1.setProviderUri(PROVIDER_1);
        datasetDto1.setSource(DatasetSourceEnum.PX);
        datasetDto1.setFrequency("No se actualiza");
        datasetDto1.setLanguage("es");
        datasetDto1.getLanguages().add("es");
        datasetDto1.getCategories().add("category n1");
        datasetDto1.setProviderPublishingDate(new DateTime("2011-04-02T10:04:02Z")); // not do new DateTime() because put millis, and these are not in database
        datasetDto1.setProviderReleaseDate(new DateTime("2010-05-11T11:12:13Z"));
        datasetDto1.setIdentifier(mockSemanticIdentifier());
        datasetDto1.getDimensions().addAll(mockDimensions(3));
        datasetDto1.getDimensions().get(0).setIdentifier("a b");
        datasetDto1.setPrimaryMeasure(mockPrimaryMeasure());
        try {
            dsdService.createDataset(getServiceContext(), datasetDto1);
            fail("identifier incorrect");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), e.getErrorCode());
            assertTrue(e.getMessage().contains("dimensionDto.identifier"));
            assertTrue(e.getMessage().contains("semantic identifier"));
        }
    }

    @Test
    public void testCreateDatasetsInSameProvider() throws Exception {

        String providerUri = PROVIDER_2;

        DatasetDto datasetDto1 = new DatasetDto();
        datasetDto1.setTitle(getInternationalString("Dataset name 1"));
        datasetDto1.setProviderUri(providerUri);
        datasetDto1.setIdentifier("IdentifierNew1");
        datasetDto1.setSource(DatasetSourceEnum.PX);
        datasetDto1.getDimensions().addAll(mockDimensions(3));
        datasetDto1.setPrimaryMeasure(mockPrimaryMeasure());
        String datasetUri1 = dsdService.createDataset(getServiceContext(), datasetDto1);

        // Retrieve all datasets of provider
        Stat4YouCriteria criteria = buildCriteriaFindByProvider(PROVIDER_2);
        Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasets(getServiceContext(), criteria);
        List<DatasetBasicDto> datasetsDto = result.getResults();
        assertEquals(1, datasetsDto.size());
        assertEquals(datasetUri1, datasetsDto.get(0).getUri());

        // Create other
        DatasetDto datasetDto2 = new DatasetDto();
        datasetDto2.setTitle(getInternationalString("Dataset name 2"));
        datasetDto2.setProviderUri(providerUri);
        datasetDto2.setIdentifier("IdentifierNew2");
        datasetDto2.setSource(DatasetSourceEnum.PX);
        datasetDto2.getDimensions().addAll(mockDimensions(3));
        datasetDto2.setPrimaryMeasure(mockPrimaryMeasure());
        String datasetUri2 = dsdService.createDataset(getServiceContext(), datasetDto2);

        // Retrieve all datasets
        result = dsdService.findDatasets(getServiceContext(), criteria);
        datasetsDto = result.getResults();
        assertEquals(2, datasetsDto.size());
        assertEquals(datasetUri1, datasetsDto.get(0).getUri());
        assertEquals(datasetUri2, datasetsDto.get(1).getUri());
    }

    @Test
    public void testRetrieveDataset() throws Exception {
        String uri = DATASET_1_PROVIDER_1;
        DatasetBasicDto datasetDto = dsdService.retrieveDataset(getServiceContext(), uri);

        assertNotNull(datasetDto);
        assertEquals(uri + ":1", datasetDto.getUri());
        assertEquals("http://provider1.com/dataset1", datasetDto.getUrl());
        assertEquals("cada tres meses", datasetDto.getFrequency());
        assertEquals("es", datasetDto.getLanguage());
        assertEquals(1, datasetDto.getLanguages().size());
        assertEquals("es", datasetDto.getLanguages().get(0));
        assertEquals(2, datasetDto.getCategories().size());
        assertEquals("category1", datasetDto.getCategories().get(0));
        assertEquals("category2", datasetDto.getCategories().get(1));
        assertEquals(PROVIDER_1, datasetDto.getProviderUri());
        assertEquals(Constants.PUBLISHER_FOR_ALL_DATASETS, datasetDto.getPublisher());
        assertEquals(DatasetSourceEnum.PX, datasetDto.getSource());
        assertEquals(DatasetStateEnum.PUBLISHED, datasetDto.getState());
        assertNull(datasetDto.getDraftUri());
        assertEquals(datasetDto.getUri(), datasetDto.getPublishedUri());
        assertEquals("2010-01-01T12:47:22.000Z", datasetDto.getCreatedDate().toString());
        assertEquals("2010-07-23T04:05:06.000+01:00", datasetDto.getProviderReleaseDate().toString());
        assertEquals("2010-07-22T03:02:03.000+01:00", datasetDto.getProviderPublishingDate().toString());
        assertEquals("2011-08-24T01:02:03.000+01:00", datasetDto.getPublishingDate().toString());
        assertEquals("2011-08-24T01:02:03.000+01:00", datasetDto.getReleaseDate().toString());
        assertNull(datasetDto.getUnpublishingDate());
        assertEqualsInternationalString(datasetDto.getTitle(), "es", "Dataset1 1 1 Español", "en", "Dataset1 1 1 English");
        assertEquals("IdentifierDataset1", datasetDto.getIdentifier());
    }

    @Test
    public void testRetrieveDatasetWithAndWithoutVersion() throws Exception {
        String uriWithoutVersion = DATASET_1_PROVIDER_4;
        String uriWithVersion1 = DATASET_1_PROVIDER_4 + ":1";
        String uriWithVersion2 = DATASET_1_PROVIDER_4 + ":2";

        // Without version (retrieve last)
        DatasetBasicDto datasetDtoWithoutVersion = dsdService.retrieveDataset(getServiceContext(), uriWithoutVersion);
        assertEquals(uriWithVersion2, datasetDtoWithoutVersion.getUri());
        assertEquals(uriWithVersion1, datasetDtoWithoutVersion.getPublishedUri());
        assertEquals(uriWithVersion2, datasetDtoWithoutVersion.getDraftUri());

        // With version 1
        DatasetBasicDto datasetDtoWithVersion1 = dsdService.retrieveDataset(getServiceContext(), uriWithVersion1);
        assertEquals(uriWithVersion1, datasetDtoWithVersion1.getUri());
        assertEquals(uriWithVersion1, datasetDtoWithVersion1.getPublishedUri());
        assertEquals(uriWithVersion2, datasetDtoWithVersion1.getDraftUri());

        // With version 2
        DatasetBasicDto datasetDtoWithVersion2 = dsdService.retrieveDataset(getServiceContext(), uriWithVersion2);
        assertEquals(uriWithVersion2, datasetDtoWithVersion2.getUri());
        assertEquals(uriWithVersion1, datasetDtoWithVersion2.getPublishedUri());
        assertEquals(uriWithVersion2, datasetDtoWithVersion2.getDraftUri());
    }

    @Test
    @Override
    public void testRetrieveDatasetPublished() throws Exception {
        String uri = DATASET_1_PROVIDER_1;

        // Retrieve published
        DatasetBasicDto datasetDtoPublished = dsdService.retrieveDatasetPublished(getServiceContext(), uri);
        assertEquals(uri + ":1", datasetDtoPublished.getUri());
        assertEquals("http://provider1.com/dataset1", datasetDtoPublished.getUrl());
        assertEquals(DatasetStateEnum.PUBLISHED, datasetDtoPublished.getState());
    }

    @Test
    public void testRetrieveDatasetPublishedWithVersionOnDraft() throws Exception {
        String uriWithoutVersion = DATASET_1_PROVIDER_4;
        String uri = uriWithoutVersion + ":2";

        // Check uri with this version is draft
        DatasetBasicDto datasetDtoDraft = dsdService.retrieveDataset(getServiceContext(), uri);
        assertEquals(DatasetStateEnum.DRAFT, datasetDtoDraft.getState());

        // Retrieve published
        DatasetBasicDto datasetDtoPublished = dsdService.retrieveDatasetPublished(getServiceContext(), uri);
        assertEquals(uriWithoutVersion + ":1", datasetDtoPublished.getUri());
        assertEquals(DatasetStateEnum.PUBLISHED, datasetDtoPublished.getState());
    }

    @Test
    public void testRetrieveDatasetPublishedErrorOnlyDraft() throws Exception {
        String uri = DATASET_2_PROVIDER_1;

        try {
            dsdService.retrieveDatasetPublished(getServiceContext(), uri);
            fail("No published");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_INCORRECT_STATUS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testRetrieveDatasetDraftAndPublishedOfSameDataset() throws Exception {
        String uri = DATASET_1_PROVIDER_4;

        // Retrieve last (draft)
        DatasetBasicDto datasetDtoDraft = dsdService.retrieveDataset(getServiceContext(), uri);
        assertEquals(uri + ":2", datasetDtoDraft.getUri());
        assertEquals("http://provider4.com/dataset/v2", datasetDtoDraft.getUrl());
        assertEquals(DatasetStateEnum.DRAFT, datasetDtoDraft.getState());
        assertEquals(datasetDtoDraft.getUri(), datasetDtoDraft.getDraftUri());
        assertEquals(uri + ":1", datasetDtoDraft.getPublishedUri());

        // Retrieve published
        DatasetBasicDto datasetDtoPublished = dsdService.retrieveDatasetPublished(getServiceContext(), uri);
        assertEquals(uri + ":1", datasetDtoPublished.getUri());
        assertEquals("http://provider4.com/dataset/v1", datasetDtoPublished.getUrl());
        assertEquals(DatasetStateEnum.PUBLISHED, datasetDtoPublished.getState());
        assertEquals(datasetDtoPublished.getUri(), datasetDtoPublished.getPublishedUri());
        assertEquals(uri + ":2", datasetDtoPublished.getDraftUri());

        // DraftUri y published are equals
        assertEquals(datasetDtoDraft.getPublishedUri(), datasetDtoPublished.getPublishedUri());
        assertEquals(datasetDtoDraft.getDraftUri(), datasetDtoPublished.getDraftUri());
    }

    @Test
    public void testRetrieveDatasetErrorNotExists() throws Exception {
        try {
            dsdService.retrieveDataset(getServiceContext(), DATASET_NOT_EXISTS);
            fail("No exists");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_NOT_EXISTS.getName(), e.getErrorCode());
        }
    }

    @Override
    @Test
    public void testRetrieveDatasetBasicByIdentifier() throws Exception {
        String identifier = "IdentifierDuplicatedInOtherProviders";

        {
            // Provider 4
            String providerAcronym = "Provider4";
            DatasetBasicDto datasetDto = dsdService.retrieveDatasetBasicByIdentifier(getServiceContext(), providerAcronym, identifier);
            assertEquals(DATASET_1_PROVIDER_4 + ":2", datasetDto.getUri());
            assertEquals(identifier, datasetDto.getIdentifier());
            assertEquals(PROVIDER_4, datasetDto.getProviderUri());
            assertEqualsInternationalString(datasetDto.getTitle(), "es", "Estadística 23", "en", "Statistic 23");
        }
        {
            // Provider 5
            String providerAcronym = "Provider5";
            DatasetBasicDto datasetDto = dsdService.retrieveDatasetBasicByIdentifier(getServiceContext(), providerAcronym, identifier);
            assertEquals(DATASET_1_PROVIDER_5 + ":2", datasetDto.getUri());
            assertEquals(identifier, datasetDto.getIdentifier());
            assertEquals(PROVIDER_5, datasetDto.getProviderUri());
        }
    }

    @Override
    @Test
    public void testRetrieveDatasetByIdentifier() throws Exception {

        String identifier = "IdentifierDataset1";
        String providerAcronym = "Provider1";

        DatasetDto datasetDto = dsdService.retrieveDatasetByIdentifier(getServiceContext(), providerAcronym, identifier);

        // Basic information
        assertEquals("stat4you:dsd:dataset:P-1-D-1:1", datasetDto.getUri());
        assertEquals("http://provider1.com/dataset1", datasetDto.getUrl());
        assertEquals("cada tres meses", datasetDto.getFrequency());
        assertEquals("es", datasetDto.getLanguage());
        assertEquals(1, datasetDto.getLanguages().size());
        assertEquals("es", datasetDto.getLanguages().get(0));
        assertEquals(2, datasetDto.getCategories().size());
        assertEquals("category1", datasetDto.getCategories().get(0));
        assertEquals("category2", datasetDto.getCategories().get(1));
        assertEquals(PROVIDER_1, datasetDto.getProviderUri());
        assertEquals(Constants.PUBLISHER_FOR_ALL_DATASETS, datasetDto.getPublisher());
        assertEquals(DatasetSourceEnum.PX, datasetDto.getSource());
        assertEquals(DatasetStateEnum.PUBLISHED, datasetDto.getState());
        assertNull(datasetDto.getDraftUri());
        assertEquals(datasetDto.getUri(), datasetDto.getPublishedUri());
        assertEquals("2010-01-01T12:47:22.000Z", datasetDto.getCreatedDate().toString());
        assertEquals("2010-07-23T04:05:06.000+01:00", datasetDto.getProviderReleaseDate().toString());
        assertEquals("2010-07-22T03:02:03.000+01:00", datasetDto.getProviderPublishingDate().toString());
        assertEquals("2011-08-24T01:02:03.000+01:00", datasetDto.getPublishingDate().toString());
        assertEquals("2011-08-24T01:02:03.000+01:00", datasetDto.getReleaseDate().toString());
        assertNull(datasetDto.getUnpublishingDate());
        assertEqualsInternationalString(datasetDto.getTitle(), "es", "Dataset1 1 1 Español", "en", "Dataset1 1 1 English");
        assertEquals("IdentifierDataset1", datasetDto.getIdentifier());

        // Dimensions
        List<DimensionDto> dimensionsDto = datasetDto.getDimensions();
        assertEquals(2, dimensionsDto.size());
        {
            DimensionDto dimensionDto = dimensionsDto.get(0);
            assertEquals(DIMENSION1_DATASET_1_PROVIDER_1, dimensionDto.getUri());
            assertEqualsInternationalString(dimensionDto.getTitle(), "en", "Month", "es", "Mes");
        }
        {
            DimensionDto dimensionDto = dimensionsDto.get(1);
            assertEquals(DIMENSION2_DATASET_1_PROVIDER_1, dimensionDto.getUri());
            assertEqualsInternationalString(dimensionDto.getTitle(), "en", "Year", "es", "Año");
        }

        // Primary measure
        PrimaryMeasureDto primaryMeasureDto = datasetDto.getPrimaryMeasure();
        assertEquals(PRIMARY_MEASURE1_DATASET_1_PROVIDER_1, primaryMeasureDto.getUri());
        assertEquals("OBS_VALUE", primaryMeasureDto.getIdentifier());
        assertEqualsInternationalString(primaryMeasureDto.getTitle(), "es", "Porcentaje", "en", "Percentage");

        // Attribute definitions
        List<AttributeDefinitionDto> attributeDefinitionsDto = datasetDto.getAttributeDefinitions();
        assertEquals(4, attributeDefinitionsDto.size());
        {
            AttributeDefinitionDto attributeDefinitionDto = attributeDefinitionsDto.get(0);
            assertEquals(ATTRIBUTE_DEFINITION1_DATASET_1_PROVIDER_1, attributeDefinitionDto.getUri());
            assertEquals("CODE-P-1-D-1-AD-1", attributeDefinitionDto.getIdentifier());
            assertEqualsInternationalString(attributeDefinitionDto.getTitle(), "en", "Attribute of dataset 1", "es", "Atributo de dataset 1");
        }
        {
            AttributeDefinitionDto attributeDefinitionDto = attributeDefinitionsDto.get(1);
            assertEquals(ATTRIBUTE_DEFINITION2_DATASET_1_PROVIDER_1, attributeDefinitionDto.getUri());
            assertEquals("CODE-P-1-D-1-AD-2", attributeDefinitionDto.getIdentifier());
            assertEqualsInternationalString(attributeDefinitionDto.getTitle(), "en", "Attribute of observation 1", "es", "Atributo de observación 1");
        }
        {
            AttributeDefinitionDto attributeDefinitionDto = attributeDefinitionsDto.get(2);
            assertEquals(ATTRIBUTE_DEFINITION3_DATASET_1_PROVIDER_1, attributeDefinitionDto.getUri());
            assertEquals("CODE-P-1-D-1-AD-3", attributeDefinitionDto.getIdentifier());
            assertEquals(AttributeAttachmentLevelEnum.DIMENSION, attributeDefinitionDto.getAttachmentLevel());
            assertNull(attributeDefinitionDto.getTitle());
            assertEquals(1, attributeDefinitionDto.getAttachmentDimensions().size());
            assertEquals("IdentifierP-1-D-1-D-2", attributeDefinitionDto.getAttachmentDimensions().get(0).getIdentifier());
            assertEquals(DIMENSION2_DATASET_1_PROVIDER_1, attributeDefinitionDto.getAttachmentDimensions().get(0).getUri());
        }
        {
            AttributeDefinitionDto attributeDefinitionDto = attributeDefinitionsDto.get(3);
            assertEquals(ATTRIBUTE_DEFINITION4_DATASET_1_PROVIDER_1, attributeDefinitionDto.getUri());
            assertEquals("CODE-P-1-D-1-AD-4", attributeDefinitionDto.getIdentifier());
            assertEquals(AttributeAttachmentLevelEnum.DIMENSION, attributeDefinitionDto.getAttachmentLevel());
            assertNull(attributeDefinitionDto.getTitle());
            assertEquals(2, attributeDefinitionDto.getAttachmentDimensions().size());
            assertEquals("IdentifierP-1-D-1-D-2", attributeDefinitionDto.getAttachmentDimensions().get(0).getIdentifier());
            assertEquals(DIMENSION2_DATASET_1_PROVIDER_1, attributeDefinitionDto.getAttachmentDimensions().get(0).getUri());
            assertEquals("IdentifierP-1-D-1-D-1", attributeDefinitionDto.getAttachmentDimensions().get(1).getIdentifier());
            assertEquals(DIMENSION1_DATASET_1_PROVIDER_1, attributeDefinitionDto.getAttachmentDimensions().get(1).getUri());
        }
    }

    @Test
    public void testRetrieveDatasetByIdentifierErrorNotExistsInProvider() throws Exception {
        String identifier = "IdentifierDataset1";
        String providerAcronym = "Provider4";
        try {
            dsdService.retrieveDatasetByIdentifier(getServiceContext(), providerAcronym, identifier);
            fail("Dataset not exists in provider");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_NOT_EXISTS_WITH_IDENTIFIER.getName(), e.getErrorCode());
        }
    }

    @Override
    @Test
    public void testRetrieveDatasetPublishedByIdentifier() throws Exception {

        String identifier = "IdentifierDataset1";
        String providerAcronym = "Provider1";

        DatasetDto datasetDto = dsdService.retrieveDatasetPublishedByIdentifier(getServiceContext(), providerAcronym, identifier);

        // Basic information
        assertEquals("stat4you:dsd:dataset:P-1-D-1:1", datasetDto.getUri());
        assertEquals("http://provider1.com/dataset1", datasetDto.getUrl());
        assertEquals("cada tres meses", datasetDto.getFrequency());
        assertEquals("es", datasetDto.getLanguage());
        assertEquals(1, datasetDto.getLanguages().size());
        assertEquals("es", datasetDto.getLanguages().get(0));
        assertEquals(2, datasetDto.getCategories().size());
        assertEquals("category1", datasetDto.getCategories().get(0));
        assertEquals("category2", datasetDto.getCategories().get(1));
        assertEquals(PROVIDER_1, datasetDto.getProviderUri());
        assertEquals(Constants.PUBLISHER_FOR_ALL_DATASETS, datasetDto.getPublisher());
        assertEquals(DatasetSourceEnum.PX, datasetDto.getSource());
        assertEquals(DatasetStateEnum.PUBLISHED, datasetDto.getState());
        assertNull(datasetDto.getDraftUri());
        assertEquals(datasetDto.getUri(), datasetDto.getPublishedUri());
        assertEquals("2010-01-01T12:47:22.000Z", datasetDto.getCreatedDate().toString());
        assertEquals("2010-07-23T04:05:06.000+01:00", datasetDto.getProviderReleaseDate().toString());
        assertEquals("2010-07-22T03:02:03.000+01:00", datasetDto.getProviderPublishingDate().toString());
        assertEquals("2011-08-24T01:02:03.000+01:00", datasetDto.getPublishingDate().toString());
        assertEquals("2011-08-24T01:02:03.000+01:00", datasetDto.getReleaseDate().toString());
        assertNull(datasetDto.getUnpublishingDate());
        assertEqualsInternationalString(datasetDto.getTitle(), "es", "Dataset1 1 1 Español", "en", "Dataset1 1 1 English");
        assertEquals("IdentifierDataset1", datasetDto.getIdentifier());

        // Dimensions
        List<DimensionDto> dimensionsDto = datasetDto.getDimensions();
        assertEquals(2, dimensionsDto.size());
        {
            DimensionDto dimensionDto = dimensionsDto.get(0);
            assertEquals(DIMENSION1_DATASET_1_PROVIDER_1, dimensionDto.getUri());
            assertEqualsInternationalString(dimensionDto.getTitle(), "en", "Month", "es", "Mes");
        }
        {
            DimensionDto dimensionDto = dimensionsDto.get(1);
            assertEquals(DIMENSION2_DATASET_1_PROVIDER_1, dimensionDto.getUri());
            assertEqualsInternationalString(dimensionDto.getTitle(), "en", "Year", "es", "Año");
        }

        // Primary measure
        PrimaryMeasureDto primaryMeasureDto = datasetDto.getPrimaryMeasure();
        assertEquals(PRIMARY_MEASURE1_DATASET_1_PROVIDER_1, primaryMeasureDto.getUri());
        assertEquals("OBS_VALUE", primaryMeasureDto.getIdentifier());
        assertEqualsInternationalString(primaryMeasureDto.getTitle(), "es", "Porcentaje", "en", "Percentage");

        // Attribute definitions
        List<AttributeDefinitionDto> attributeDefinitionsDto = datasetDto.getAttributeDefinitions();
        assertEquals(4, attributeDefinitionsDto.size());
        {
            AttributeDefinitionDto attributeDefinitionDto = attributeDefinitionsDto.get(0);
            assertEquals(ATTRIBUTE_DEFINITION1_DATASET_1_PROVIDER_1, attributeDefinitionDto.getUri());
            assertEquals("CODE-P-1-D-1-AD-1", attributeDefinitionDto.getIdentifier());
            assertEqualsInternationalString(attributeDefinitionDto.getTitle(), "en", "Attribute of dataset 1", "es", "Atributo de dataset 1");
        }
        {
            AttributeDefinitionDto attributeDefinitionDto = attributeDefinitionsDto.get(1);
            assertEquals(ATTRIBUTE_DEFINITION2_DATASET_1_PROVIDER_1, attributeDefinitionDto.getUri());
            assertEquals("CODE-P-1-D-1-AD-2", attributeDefinitionDto.getIdentifier());
            assertEqualsInternationalString(attributeDefinitionDto.getTitle(), "en", "Attribute of observation 1", "es", "Atributo de observación 1");
        }
        {
            AttributeDefinitionDto attributeDefinitionDto = attributeDefinitionsDto.get(2);
            assertEquals(ATTRIBUTE_DEFINITION3_DATASET_1_PROVIDER_1, attributeDefinitionDto.getUri());
            assertEquals("CODE-P-1-D-1-AD-3", attributeDefinitionDto.getIdentifier());
            assertEquals(AttributeAttachmentLevelEnum.DIMENSION, attributeDefinitionDto.getAttachmentLevel());
            assertNull(attributeDefinitionDto.getTitle());
            assertEquals(1, attributeDefinitionDto.getAttachmentDimensions().size());
            assertEquals("IdentifierP-1-D-1-D-2", attributeDefinitionDto.getAttachmentDimensions().get(0).getIdentifier());
            assertEquals(DIMENSION2_DATASET_1_PROVIDER_1, attributeDefinitionDto.getAttachmentDimensions().get(0).getUri());
        }
        {
            AttributeDefinitionDto attributeDefinitionDto = attributeDefinitionsDto.get(3);
            assertEquals(ATTRIBUTE_DEFINITION4_DATASET_1_PROVIDER_1, attributeDefinitionDto.getUri());
            assertEquals("CODE-P-1-D-1-AD-4", attributeDefinitionDto.getIdentifier());
            assertEquals(AttributeAttachmentLevelEnum.DIMENSION, attributeDefinitionDto.getAttachmentLevel());
            assertNull(attributeDefinitionDto.getTitle());
            assertEquals(2, attributeDefinitionDto.getAttachmentDimensions().size());
            assertEquals("IdentifierP-1-D-1-D-2", attributeDefinitionDto.getAttachmentDimensions().get(0).getIdentifier());
            assertEquals(DIMENSION2_DATASET_1_PROVIDER_1, attributeDefinitionDto.getAttachmentDimensions().get(0).getUri());
            assertEquals("IdentifierP-1-D-1-D-1", attributeDefinitionDto.getAttachmentDimensions().get(1).getIdentifier());
            assertEquals(DIMENSION1_DATASET_1_PROVIDER_1, attributeDefinitionDto.getAttachmentDimensions().get(1).getUri());
        }
    }

    @Override
    @Test
    public void testRetrieveDatasetBasicPublishedByIdentifier() throws Exception {

        String identifier = "IdentifierDuplicatedInOtherProviders";

        {
            // Provider 4
            String providerAcronym = "Provider4";
            DatasetBasicDto datasetDto = dsdService.retrieveDatasetBasicPublishedByIdentifier(getServiceContext(), providerAcronym, identifier);
            assertEquals(DATASET_1_PROVIDER_4 + ":1", datasetDto.getUri());
            assertEquals(identifier, datasetDto.getIdentifier());
            assertEquals(PROVIDER_4, datasetDto.getProviderUri());
        }
        {
            // Provider 5
            String providerAcronym = "Provider5";
            DatasetBasicDto datasetDto = dsdService.retrieveDatasetBasicPublishedByIdentifier(getServiceContext(), providerAcronym, identifier);
            assertEquals(DATASET_1_PROVIDER_5 + ":1", datasetDto.getUri());
            assertEquals(identifier, datasetDto.getIdentifier());
            assertEquals(PROVIDER_5, datasetDto.getProviderUri());
        }
    }

    @Test
    public void testRetrieveDatasetPublishedByIdentifierErrorNotExistsInProvider() throws Exception {
        String identifier = "IdentifierDataset1";
        String providerAcronym = "Provider4";
        try {
            dsdService.retrieveDatasetBasicPublishedByIdentifier(getServiceContext(), providerAcronym, identifier);
            fail("Dataset not exists in provider");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_NOT_EXISTS_WITH_IDENTIFIER.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testRetrieveDatasetPublishedByIdentifierErrorNotPublished() throws Exception {

        String identifier = "IdentifierDataset2";
        String providerAcronym = "Provider1";

        DatasetBasicDto datasetBasicDto = dsdService.retrieveDatasetBasicByIdentifier(getServiceContext(), providerAcronym, identifier);
        assertNotNull(datasetBasicDto);

        // Not exists published
        try {
            dsdService.retrieveDatasetBasicPublishedByIdentifier(getServiceContext(), providerAcronym, identifier);
            fail("Dataset not exists published");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_NOT_EXISTS_WITH_IDENTIFIER.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testRetrieveDatasetByIdentifierPublishedAndDraftVersion() throws Exception {

        String identifier = "IdentifierDuplicatedInOtherProviders";
        String providerAcronym = "Provider4";

        // Last version
        {
            DatasetDto datasetDto = dsdService.retrieveDatasetByIdentifier(getServiceContext(), providerAcronym, identifier);

            // Basic information
            assertEquals("stat4you:dsd:dataset:P-4-D-1:2", datasetDto.getUri());
            assertEquals("http://provider4.com/dataset/v2", datasetDto.getUrl());
            assertEquals("stat4you:dsd:dataset:P-4-D-1:1", datasetDto.getPublishedUri());
            assertEquals("stat4you:dsd:dataset:P-4-D-1:2", datasetDto.getDraftUri());
        }

        // Published
        {
            DatasetDto datasetDto = dsdService.retrieveDatasetPublishedByIdentifier(getServiceContext(), providerAcronym, identifier);

            // Basic information
            assertEquals("stat4you:dsd:dataset:P-4-D-1:1", datasetDto.getUri());
            assertEquals("http://provider4.com/dataset/v1", datasetDto.getUrl());
            assertEquals("stat4you:dsd:dataset:P-4-D-1:1", datasetDto.getPublishedUri());
            assertEquals("stat4you:dsd:dataset:P-4-D-1:2", datasetDto.getDraftUri());
        }
    }

    @Test
    public void testUpdateDatasetDraft() throws Exception {

        String uri = DATASET_2_PROVIDER_1;
        DatasetBasicDto datasetDto = dsdService.retrieveDataset(getServiceContext(), uri);
        datasetDto.setTitle(getInternationalString("NewTitle"));
        datasetDto.setUrl("http://NewUrl");
        datasetDto.getLanguages().add("newLanguage");

        // Update
        dsdService.updateDatasetDraft(getServiceContext(), datasetDto);

        // Validation
        DatasetBasicDto datasetDtoUpdate = dsdService.retrieveDataset(getServiceContext(), uri);
        assertEqualsDatasetBasic(datasetDto, datasetDtoUpdate);
        assertTrue(datasetDtoUpdate.getLastUpdated().isAfter(datasetDtoUpdate.getCreatedDate()));
        // Dimensions exist yet
        List<DimensionDto> dimensionsDtoSize = dsdService.retrieveDatasetDimensions(getServiceContext(), uri);
        assertEquals(2, dimensionsDtoSize.size());
        assertEquals(DIMENSION1_DATASET_2_PROVIDER_1, dimensionsDtoSize.get(0).getUri());
        assertEquals(DIMENSION2_DATASET_2_PROVIDER_1, dimensionsDtoSize.get(1).getUri());
    }

    @Test
    public void testUpdateDatasetDraftReusingLocalisedStrings() throws Exception {

        String uri = DATASET_2_PROVIDER_1;
        DatasetBasicDto datasetDto = dsdService.retrieveDataset(getServiceContext(), uri);
        datasetDto.setTitle(getInternationalString("NewName"));
        LocalisedStringDto localisedStringDto = new LocalisedStringDto();
        localisedStringDto.setLocale("it");
        localisedStringDto.setLabel("italian");
        datasetDto.getTitle().getTexts().add(localisedStringDto);
        // Update
        dsdService.updateDatasetDraft(getServiceContext(), datasetDto);

        // Validation
        DatasetBasicDto datasetDtoUpdate = dsdService.retrieveDataset(getServiceContext(), uri);
        assertEqualsDatasetBasic(datasetDto, datasetDtoUpdate);
    }

    @Test
    public void testUpdateDatasetDraftErrorPublished() throws Exception {

        String uri = DATASET_1_PROVIDER_1;
        DatasetBasicDto datasetDto = dsdService.retrieveDataset(getServiceContext(), uri);

        try {
            dsdService.updateDatasetDraft(getServiceContext(), datasetDto);
            fail("Dataset published");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_INCORRECT_STATUS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testUpdateDatasetDraftErrorPutVersionPublishedNotVersionInDraft() throws Exception {

        String uri = DATASET_1_PROVIDER_4;
        DatasetBasicDto datasetDtoDraft = dsdService.retrieveDataset(getServiceContext(), uri + ":2");
        assertEquals(DatasetStateEnum.DRAFT, datasetDtoDraft.getState());
        datasetDtoDraft.setUri(uri + ":1"); // put published version

        try {
            dsdService.updateDatasetDraft(getServiceContext(), datasetDtoDraft);
            fail("Dataset published");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_INCORRECT_STATUS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testUpdateDatasetDraftIgnoreChangeNonModifiableAttributes() throws Exception {

        // Create
        DatasetDto datasetDto1 = new DatasetDto();
        datasetDto1.setTitle(getInternationalString("Dataset name 1"));
        datasetDto1.setUrl("http://url-dataset1");
        datasetDto1.setProviderUri(PROVIDER_1);
        datasetDto1.setIdentifier("IdentifierNew1");
        datasetDto1.setSource(DatasetSourceEnum.PX);
        datasetDto1.getDimensions().addAll(mockDimensions(3));
        datasetDto1.setPrimaryMeasure(mockPrimaryMeasure());
        String uri = dsdService.createDataset(getServiceContext(), datasetDto1);

        // Retrieve
        DatasetBasicDto datasetDtoDraftToCompare = dsdService.retrieveDataset(getServiceContext(), uri);
        DatasetBasicDto datasetDtoDraft = dsdService.retrieveDataset(getServiceContext(), uri);
        assertEquals(DatasetStateEnum.DRAFT, datasetDtoDraft.getState());
        datasetDtoDraft.setState(DatasetStateEnum.PUBLISHED);
        datasetDtoDraft.setPublishingDate(new DateTime());
        datasetDtoDraft.setUnpublishingDate(new DateTime());
        datasetDtoDraft.setCreatedBy("aa");
        datasetDtoDraft.setCreatedDate(new DateTime());
        datasetDtoDraft.setDraftUri("aaaa");
        datasetDtoDraft.setPublishedUri("aaaa");
        datasetDtoDraft.setLastUpdatedBy("bbbbb");

        // Update
        dsdService.updateDatasetDraft(getServiceContext(), datasetDtoDraft);

        // Retrieve
        DatasetBasicDto datasetDtoUpdated = dsdService.retrieveDataset(getServiceContext(), uri);
        assertEquals(DatasetStateEnum.DRAFT, datasetDtoUpdated.getState());
        assertNull(datasetDtoUpdated.getPublishingDate());
        assertNull(datasetDtoUpdated.getUnpublishingDate());
        assertEquals(datasetDtoDraftToCompare.getCreatedBy(), datasetDtoUpdated.getCreatedBy());
        assertEquals(datasetDtoDraftToCompare.getCreatedDate(), datasetDtoUpdated.getCreatedDate());
        assertEquals(datasetDtoDraftToCompare.getDraftUri(), datasetDtoUpdated.getDraftUri());
        assertEquals(datasetDtoDraftToCompare.getPublishedUri(), datasetDtoUpdated.getPublishedUri());
        assertEquals(getServiceContext().getUserId(), datasetDtoUpdated.getLastUpdatedBy());
    }

    @Test
    public void testUpdateDatasetDraftErrorNotExists() throws Exception {

        DatasetBasicDto datasetDto = new DatasetBasicDto();
        datasetDto.setUri(DATASET_NOT_EXISTS + ":1");
        datasetDto.setTitle(getInternationalString("Not exists"));
        try {
            dsdService.updateDatasetDraft(getServiceContext(), datasetDto);
            fail("not exists");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_NOT_EXISTS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testUpdateDatasetDraftErrorProviderRemoved() throws Exception {

        String uri = DATASET_1_PROVIDER_3;
        DatasetBasicDto datasetDto = dsdService.retrieveDataset(getServiceContext(), uri);
        try {
            dsdService.updateDatasetDraft(getServiceContext(), datasetDto);
            fail("Provider removed");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.PROVIDER_INCORRECT_STATUS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testUpdateDatasetDraftErrorIdentifierNonModifiable() throws Exception {

        String uri = DATASET_2_PROVIDER_1;
        DatasetBasicDto datasetDto = dsdService.retrieveDataset(getServiceContext(), uri);
        datasetDto.setIdentifier("new identifier");

        try {
            dsdService.updateDatasetDraft(getServiceContext(), datasetDto);
            fail("change identifier");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), e.getErrorCode());
            assertEquals("Attribute \"datasetDto.identifier\" can not be modified", e.getMessage());
        }
    }

    @Test
    public void testUpdateDatasetDraftErrorProviderNonModifiable() throws Exception {

        String uri = DATASET_2_PROVIDER_1;
        DatasetBasicDto datasetDto = dsdService.retrieveDataset(getServiceContext(), uri);
        datasetDto.setProviderUri(PROVIDER_2);

        try {
            dsdService.updateDatasetDraft(getServiceContext(), datasetDto);
            fail("change provider");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), e.getErrorCode());
            assertEquals("Attribute \"datasetDto.providerUri.uuid\" can not be modified", e.getMessage());
        }
    }

    @Test
    public void testDiscardDatasetDraft() throws Exception {

        String datasetUri = DATASET_2_PROVIDER_1;

        // Delete dataset
        dsdService.discardDatasetDraft(getServiceContext(), datasetUri);

        // Validation
        try {
            dsdService.retrieveDataset(getServiceContext(), datasetUri);
            fail("Dataset deleted");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_NOT_EXISTS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testDiscardDatasetDraftWithPublishedVersion() throws Exception {

        String datasetUri = DATASET_1_PROVIDER_4;

        DatasetBasicDto datasetBasicDto = dsdService.retrieveDataset(getServiceContext(), datasetUri);
        assertEquals(datasetUri + ":2", datasetBasicDto.getDraftUri());
        assertEquals(datasetUri + ":1", datasetBasicDto.getPublishedUri());

        // Discard draft
        dsdService.discardDatasetDraft(getServiceContext(), datasetUri);

        // Validation
        // Draft version deleted
        try {
            dsdService.retrieveDataset(getServiceContext(), datasetUri + ":2");
            fail("Dataset deleted");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_NOT_EXISTS.getName(), e.getErrorCode());
        }
        // Published version exists yet
        DatasetBasicDto datasetBasicDtoPublished = dsdService.retrieveDataset(getServiceContext(), datasetUri + ":1");
        assertEquals(null, datasetBasicDtoPublished.getDraftUri());
        assertEquals(datasetUri + ":1", datasetBasicDtoPublished.getPublishedUri());
        assertEquals(DatasetStateEnum.PUBLISHED, datasetBasicDtoPublished.getState());

        // Check published version is marked as last version
        Stat4YouCriteria criteria = new Stat4YouCriteria();
        criteria.setPaginator(new Stat4YouCriteriaPaginator());
        criteria.getPaginator().setMaximumResultSize(Integer.MAX_VALUE);
        Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasets(getServiceContext(), criteria);
        List<DatasetBasicDto> datasetsDto = result.getResults();
        Boolean found = Boolean.FALSE;
        for (DatasetBasicDto datasetResult : datasetsDto) {
            if (datasetResult.getUri().equals(datasetBasicDtoPublished.getUri())) {
                found = Boolean.TRUE;
                break;
            }
        }
        assertTrue(found);
    }

    @Test
    public void testDiscardDatasetDraftDeleteDimensions() throws Exception {

        String datasetUri = DATASET_2_PROVIDER_1;
        // Retrieve dimensions
        List<DimensionDto> dimensionsDto = dsdService.retrieveDatasetDimensions(getServiceContext(), datasetUri);
        assertEquals(2, dimensionsDto.size());
        assertEquals(DIMENSION1_DATASET_2_PROVIDER_1, dimensionsDto.get(0).getUri());
        assertEquals(DIMENSION2_DATASET_2_PROVIDER_1, dimensionsDto.get(1).getUri());

        // Delete dataset
        dsdService.discardDatasetDraft(getServiceContext(), datasetUri);

        // Validation
        try {
            dsdService.retrieveDataset(getServiceContext(), datasetUri);
            fail("Dataset deleted");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_NOT_EXISTS.getName(), e.getErrorCode());
        }
        // Validate delete dimensions
        try {
            dsdService.retrieveDimension(getServiceContext(), dimensionsDto.get(0).getUri());
            fail("Dimension deleted");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DIMENSION_NOT_EXISTS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testDiscardDatasetNotDeleteProviderWithOnlyOneDataset() throws Exception {

        String datasetUri = DATASET_1_PROVIDER_6;
        String providerUri = PROVIDER_6;
        DatasetBasicDto datasetDto = dsdService.retrieveDataset(getServiceContext(), datasetUri);

        // Check only one dataset
        ProviderDto providerDto = dsdService.retrieveProvider(getServiceContext(), providerUri);
        {
            Stat4YouCriteria criteria = buildCriteriaFindByProvider(providerUri);
            Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasets(getServiceContext(), criteria);
            List<DatasetBasicDto> datasetsDto = result.getResults();
            assertEquals(1, datasetsDto.size());
            assertEquals(datasetUri + ":1", datasetsDto.get(0).getUri());
        }

        // Delete dataset
        dsdService.discardDatasetDraft(getServiceContext(), datasetUri);

        // Validation
        try {
            dsdService.retrieveDataset(getServiceContext(), datasetUri);
            fail("Dataset deleted");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_NOT_EXISTS.getName(), e.getErrorCode());
        }
        // Validate provider exists
        ProviderDto providerDtoExists = dsdService.retrieveProvider(getServiceContext(), datasetDto.getProviderUri());
        assertEqualsProvider(providerDto, providerDtoExists);

        // Check zero datasets
        {
            Stat4YouCriteria criteria = buildCriteriaFindByProvider(providerUri);
            Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasets(getServiceContext(), criteria);
            List<DatasetBasicDto> datasetsDto = result.getResults();
            assertEquals(0, datasetsDto.size());
        }
    }

    @Test
    public void testDiscardDatasetDraftErrorOnlyPublished() throws Exception {

        // Validation
        try {
            dsdService.discardDatasetDraft(getServiceContext(), DATASET_1_PROVIDER_1);
            fail("Dataset published");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_INCORRECT_STATUS.getName(), e.getErrorCode());
        }
    }

    @Test
    @Override
    public void testPublishDataset() throws Exception {

        String datasetUri = DATASET_2_PROVIDER_1;
        dsdService.publishDataset(getServiceContext(), datasetUri);

        // Retrieve and validate
        DatasetBasicDto datasetRetrieved = dsdService.retrieveDataset(getServiceContext(), datasetUri);
        assertEquals(DatasetStateEnum.PUBLISHED, datasetRetrieved.getState());
        assertEquals(DATASET_2_PROVIDER_1 + ":1", datasetRetrieved.getUri());
        assertEquals(DATASET_2_PROVIDER_1 + ":1", datasetRetrieved.getPublishedUri());
        assertNull(datasetRetrieved.getDraftUri());
        assertEquals((new DateTime()).getDayOfYear(), datasetRetrieved.getPublishingDate().getDayOfYear());
        assertNull(datasetRetrieved.getUnpublishingDate());
        assertEquals(datasetRetrieved.getReleaseDate(), datasetRetrieved.getPublishingDate());
    }

    @Test
    public void testPublishDatasetSecondVersion() throws Exception {

        String datasetUri = DATASET_1_PROVIDER_4;
        DatasetBasicDto datasetRetrievedV1BeforePublish = dsdService.retrieveDataset(getServiceContext(), datasetUri + ":1");
        assertEquals(DatasetStateEnum.PUBLISHED, datasetRetrievedV1BeforePublish.getState());
        assertEquals(DATASET_1_PROVIDER_4 + ":2", datasetRetrievedV1BeforePublish.getDraftUri());
        assertEquals(DATASET_1_PROVIDER_4 + ":1", datasetRetrievedV1BeforePublish.getPublishedUri());
        assertNotNull(datasetRetrievedV1BeforePublish.getPublishingDate());

        // Publish
        dsdService.publishDataset(getServiceContext(), datasetUri + ":2");

        // Retrieve and validate
        DatasetBasicDto datasetRetrievedV2 = dsdService.retrieveDataset(getServiceContext(), datasetUri + ":2");
        assertEquals(DatasetStateEnum.PUBLISHED, datasetRetrievedV2.getState());
        assertEquals(DATASET_1_PROVIDER_4 + ":2", datasetRetrievedV2.getUri());
        assertEquals(datasetRetrievedV2.getUri(), datasetRetrievedV2.getPublishedUri());
        assertNull(datasetRetrievedV2.getDraftUri());
        // Release date doesn't change
        assertEquals(datasetRetrievedV1BeforePublish.getReleaseDate(), datasetRetrievedV2.getReleaseDate());

        // Version 1 was deleted
        try {
            dsdService.retrieveDataset(getServiceContext(), datasetUri + ":1");
            fail("No exists");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_NOT_EXISTS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testPublishDatasetErrorPublished() throws Exception {

        try {
            dsdService.publishDataset(getServiceContext(), DATASET_1_PROVIDER_1);
            fail("Dataset published");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_INCORRECT_STATUS.getName(), e.getErrorCode());
        }
    }

    @Test
    @Override
    public void testUnpublishDataset() throws Exception {

        String datasetUri = DATASET_1_PROVIDER_1;
        DatasetBasicDto datasetRetrieved = dsdService.retrieveDataset(getServiceContext(), datasetUri);
        assertEquals(DatasetStateEnum.PUBLISHED, datasetRetrieved.getState());
        dsdService.unpublishDataset(getServiceContext(), datasetUri);

        // Retrieve and validate
        datasetRetrieved = dsdService.retrieveDataset(getServiceContext(), datasetUri);
        assertEquals(DatasetStateEnum.UNPUBLISHED, datasetRetrieved.getState());
        assertEquals((new DateTime()).getDayOfYear(), datasetRetrieved.getUnpublishingDate().getDayOfYear());

        try {
            dsdService.unpublishDataset(getServiceContext(), datasetUri);
            fail("Dataset unpublished");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_INCORRECT_STATUS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testUnpublishDatasetWithOneVersionInDraft() throws Exception {

        String datasetUri = DATASET_1_PROVIDER_4;
        DatasetBasicDto datasetRetrievedDraft = dsdService.retrieveDataset(getServiceContext(), datasetUri + ":2");
        assertEquals(DatasetStateEnum.DRAFT, datasetRetrievedDraft.getState());
        DatasetBasicDto datasetRetrievedPublished = dsdService.retrieveDataset(getServiceContext(), datasetUri + ":1");
        assertEquals(DatasetStateEnum.PUBLISHED, datasetRetrievedPublished.getState());
        dsdService.unpublishDataset(getServiceContext(), datasetUri);

        // Retrieve and validate
        {
            DatasetBasicDto datasetRetrieved = dsdService.retrieveDataset(getServiceContext(), datasetUri + ":1");
            assertEquals(DatasetStateEnum.UNPUBLISHED, datasetRetrieved.getState());
            assertNotNull(datasetRetrieved.getPublishingDate());
            assertEquals((new DateTime()).getDayOfYear(), datasetRetrieved.getUnpublishingDate().getDayOfYear());
        }
        {
            DatasetBasicDto datasetRetrieved = dsdService.retrieveDataset(getServiceContext(), datasetUri + ":2");
            assertEquals(DatasetStateEnum.UNPUBLISHED, datasetRetrieved.getState());
            assertNull(datasetRetrieved.getPublishingDate());
            assertNull(datasetRetrieved.getUnpublishingDate());
        }

        try {
            dsdService.unpublishDataset(getServiceContext(), datasetUri);
            fail("Dataset unpublished");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_INCORRECT_STATUS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testUnpublishDatasetErrorNeverPublished() throws Exception {

        try {
            dsdService.unpublishDataset(getServiceContext(), DATASET_2_PROVIDER_1);
            fail("Dataset draft");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_INCORRECT_STATUS.getName(), e.getErrorCode());
        }
    }

    @Test
    @Override
    public void testUpdateDatasetPublished() throws Exception {

        String identifier = "IdentifierDataset1";
        String providerAcronym = "Provider1";
        String datasetUri = DATASET_1_PROVIDER_1;
        DatasetDto datasetRetrievedV1 = dsdService.retrieveDatasetPublishedByIdentifier(getServiceContext(), providerAcronym, identifier);
        assertEquals(DatasetStateEnum.PUBLISHED, datasetRetrievedV1.getState());
        assertNull(datasetRetrievedV1.getDraftUri());
        assertNotNull(datasetRetrievedV1.getReleaseDate());
        assertEquals(datasetUri + ":1", datasetRetrievedV1.getPublishedUri());

        String uriNewVersion = dsdService.updateDatasetPublished(getServiceContext(), datasetRetrievedV1.getUri(), datasetRetrievedV1);
        assertEquals(datasetUri + ":2", uriNewVersion);

        // Retrieve and validate
        datasetRetrievedV1 = dsdService.retrieveDatasetPublishedByIdentifier(getServiceContext(), providerAcronym, identifier);
        assertEquals(DatasetStateEnum.PUBLISHED, datasetRetrievedV1.getState());
        assertEquals(datasetUri + ":1", datasetRetrievedV1.getUri());
        assertEquals(datasetUri + ":1", datasetRetrievedV1.getPublishedUri());
        assertEquals(datasetUri + ":2", datasetRetrievedV1.getDraftUri());
        assertEquals(datasetRetrievedV1.getReleaseDate(), datasetRetrievedV1.getReleaseDate());

        DatasetDto datasetRetrievedV2 = dsdService.retrieveDatasetByIdentifier(getServiceContext(), providerAcronym, identifier);
        assertEquals(DatasetStateEnum.DRAFT, datasetRetrievedV2.getState());
        assertEquals(datasetUri + ":2", datasetRetrievedV2.getUri());
        assertEquals(datasetUri + ":1", datasetRetrievedV2.getPublishedUri());
        assertEquals(datasetUri + ":2", datasetRetrievedV2.getDraftUri());
        assertEquals(datasetRetrievedV1.getReleaseDate(), datasetRetrievedV2.getReleaseDate());

        // Compare metadatas
        assertEqualsDataset(datasetRetrievedV1, datasetRetrievedV2);

        // Check uuids are different in related entities
        assertFalse(datasetRetrievedV1.getPrimaryMeasure().getUri().equals(datasetRetrievedV2.getPrimaryMeasure().getUri()));
        assertEquals(datasetRetrievedV1.getDimensions().get(0).getIdentifier(), datasetRetrievedV2.getDimensions().get(0).getIdentifier());
        assertFalse(datasetRetrievedV1.getDimensions().get(0).getUri().equals(datasetRetrievedV2.getDimensions().get(0).getUri()));
        assertEquals(datasetRetrievedV1.getAttributeDefinitions().get(0).getIdentifier(), datasetRetrievedV2.getAttributeDefinitions().get(0).getIdentifier());
        assertFalse(datasetRetrievedV1.getAttributeDefinitions().get(0).getUri().equals(datasetRetrievedV2.getAttributeDefinitions().get(0).getUri()));

        // Check draft version is marked as last version
        Stat4YouCriteria criteria = new Stat4YouCriteria();
        criteria.setPaginator(new Stat4YouCriteriaPaginator());
        criteria.getPaginator().setMaximumResultSize(Integer.MAX_VALUE);
        Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasets(getServiceContext(), criteria);
        List<DatasetBasicDto> datasetsDto = result.getResults();
        Boolean found = Boolean.FALSE;
        for (DatasetBasicDto datasetResult : datasetsDto) {
            if (datasetResult.getUri().equals(datasetRetrievedV2.getUri())) {
                found = Boolean.TRUE;
                break;
            }
        }
        assertTrue(found);

    }

    @Test
    public void testUpdateDatasetPublishedErrorAlreadyExistsDraft() throws Exception {

        String identifier = "IdentifierDuplicatedInOtherProviders";
        String providerAcronym = "Provider4";
        DatasetDto datasetRetrieved = dsdService.retrieveDatasetByIdentifier(getServiceContext(), providerAcronym, identifier);
        assertEquals(DatasetStateEnum.DRAFT, datasetRetrieved.getState());

        try {
            dsdService.updateDatasetPublished(getServiceContext(), datasetRetrieved.getUri(), datasetRetrieved);
            fail("Dataset draft exists");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_INCORRECT_STATUS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testFindDatasets() throws Exception {

        // Retrieve last versions...

        // Find all
        {
            Stat4YouCriteria criteria = new Stat4YouCriteria();
            Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasets(getServiceContext(), criteria);
            List<DatasetBasicDto> datasetsDto = result.getResults();

            assertEquals(0, result.getPaginatorResult().getFirstResult().intValue());
            assertEquals(25, result.getPaginatorResult().getMaximumResultSize().intValue());
            assertEquals(7, result.getPaginatorResult().getTotalResults().intValue());

            assertEquals(7, datasetsDto.size());
            assertEquals(DATASET_1_PROVIDER_1 + ":1", datasetsDto.get(0).getUri());
            assertEquals(DATASET_2_PROVIDER_1 + ":1", datasetsDto.get(1).getUri());
            assertEquals(DATASET_1_PROVIDER_3 + ":1", datasetsDto.get(2).getUri());
            assertEquals(DATASET_1_PROVIDER_4 + ":2", datasetsDto.get(3).getUri());
            assertEquals(DATASET_1_PROVIDER_5 + ":2", datasetsDto.get(4).getUri());
            assertEquals(DATASET_2_PROVIDER_5 + ":1", datasetsDto.get(5).getUri());
            assertEquals(DATASET_1_PROVIDER_6 + ":1", datasetsDto.get(6).getUri());
        }

        // Find all order by creation date asc
        {
            Stat4YouCriteria criteria = new Stat4YouCriteria();
            // Order
            List<Stat4YouCriteriaOrder> ordersBy = new ArrayList<Stat4YouCriteriaOrder>();
            Stat4YouCriteriaOrder orderCreationDate = new Stat4YouCriteriaOrder();
            orderCreationDate.setPropertyName(DatasetCriteriaOrderEnum.CREATION_DATE.name());
            orderCreationDate.setType(OrderTypeEnum.ASC);
            ordersBy.add(orderCreationDate);
            criteria.setOrdersBy(ordersBy);

            Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasets(getServiceContext(), criteria);
            List<DatasetBasicDto> datasetsDto = result.getResults();

            assertEquals(0, result.getPaginatorResult().getFirstResult().intValue());
            assertEquals(25, result.getPaginatorResult().getMaximumResultSize().intValue());
            assertEquals(7, result.getPaginatorResult().getTotalResults().intValue());

            assertEquals(7, datasetsDto.size());
            assertEquals(DATASET_1_PROVIDER_1 + ":1", datasetsDto.get(0).getUri());
            assertEquals(DATASET_2_PROVIDER_1 + ":1", datasetsDto.get(1).getUri());
            assertEquals(DATASET_1_PROVIDER_3 + ":1", datasetsDto.get(2).getUri());
            assertEquals(DATASET_1_PROVIDER_4 + ":2", datasetsDto.get(3).getUri());
            assertEquals(DATASET_1_PROVIDER_5 + ":2", datasetsDto.get(4).getUri());
            assertEquals(DATASET_2_PROVIDER_5 + ":1", datasetsDto.get(5).getUri());
            assertEquals(DATASET_1_PROVIDER_6 + ":1", datasetsDto.get(6).getUri());
        }
        // Find all order by creation date desc
        {
            Stat4YouCriteria criteria = new Stat4YouCriteria();
            // Order
            List<Stat4YouCriteriaOrder> ordersBy = new ArrayList<Stat4YouCriteriaOrder>();
            Stat4YouCriteriaOrder orderCreationDate = new Stat4YouCriteriaOrder();
            orderCreationDate.setPropertyName(DatasetCriteriaOrderEnum.CREATION_DATE.name());
            orderCreationDate.setType(OrderTypeEnum.DESC);
            ordersBy.add(orderCreationDate);
            criteria.setOrdersBy(ordersBy);

            Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasets(getServiceContext(), criteria);
            List<DatasetBasicDto> datasetsDto = result.getResults();

            assertEquals(0, result.getPaginatorResult().getFirstResult().intValue());
            assertEquals(25, result.getPaginatorResult().getMaximumResultSize().intValue());
            assertEquals(7, result.getPaginatorResult().getTotalResults().intValue());

            assertEquals(7, datasetsDto.size());
            assertEquals(DATASET_1_PROVIDER_6 + ":1", datasetsDto.get(0).getUri());
            assertEquals(DATASET_2_PROVIDER_5 + ":1", datasetsDto.get(1).getUri());
            assertEquals(DATASET_1_PROVIDER_5 + ":2", datasetsDto.get(2).getUri());
            assertEquals(DATASET_1_PROVIDER_4 + ":2", datasetsDto.get(3).getUri());
            assertEquals(DATASET_1_PROVIDER_3 + ":1", datasetsDto.get(4).getUri());
            assertEquals(DATASET_2_PROVIDER_1 + ":1", datasetsDto.get(5).getUri());
            assertEquals(DATASET_1_PROVIDER_1 + ":1", datasetsDto.get(6).getUri());
        }

        // Find by provider 1
        {
            Stat4YouCriteria criteria = buildCriteriaFindByProvider(PROVIDER_1);
            Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasets(getServiceContext(), criteria);
            List<DatasetBasicDto> datasetsDto = result.getResults();

            assertEquals(0, result.getPaginatorResult().getFirstResult().intValue());
            assertEquals(25, result.getPaginatorResult().getMaximumResultSize().intValue());
            assertEquals(2, result.getPaginatorResult().getTotalResults().intValue());

            assertEquals(2, datasetsDto.size());
            assertEquals(DATASET_1_PROVIDER_1 + ":1", datasetsDto.get(0).getUri());
            assertEquals(DatasetStateEnum.PUBLISHED, datasetsDto.get(0).getState());
            assertEquals(DATASET_2_PROVIDER_1 + ":1", datasetsDto.get(1).getUri());
            assertEquals(DatasetStateEnum.DRAFT, datasetsDto.get(1).getState());
        }
        // Find by provider 1 order by creation date desc
        {
            Stat4YouCriteria criteria = buildCriteriaFindByProvider(PROVIDER_1);
            // Order
            List<Stat4YouCriteriaOrder> ordersBy = new ArrayList<Stat4YouCriteriaOrder>();
            Stat4YouCriteriaOrder orderCreationDate = new Stat4YouCriteriaOrder();
            orderCreationDate.setPropertyName(DatasetCriteriaOrderEnum.CREATION_DATE.name());
            orderCreationDate.setType(OrderTypeEnum.DESC);
            ordersBy.add(orderCreationDate);
            criteria.setOrdersBy(ordersBy);

            Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasets(getServiceContext(), criteria);
            List<DatasetBasicDto> datasetsDto = result.getResults();

            assertEquals(0, result.getPaginatorResult().getFirstResult().intValue());
            assertEquals(25, result.getPaginatorResult().getMaximumResultSize().intValue());
            assertEquals(2, result.getPaginatorResult().getTotalResults().intValue());

            assertEquals(2, datasetsDto.size());
            assertEquals(DATASET_2_PROVIDER_1 + ":1", datasetsDto.get(0).getUri());
            assertEquals(DatasetStateEnum.DRAFT, datasetsDto.get(0).getState());
            assertEquals(DATASET_1_PROVIDER_1 + ":1", datasetsDto.get(1).getUri());
            assertEquals(DatasetStateEnum.PUBLISHED, datasetsDto.get(1).getState());
        }

        // Find by provider 1 and url
        {
            Stat4YouCriteria criteria = buildCriteriaFindByProvider(PROVIDER_1);
            ((Stat4YouCriteriaConjunctionRestriction) criteria.getRestriction()).getRestrictions().add(
                    new Stat4YouCriteriaPropertyRestriction(DatasetCriteriaPropertyEnum.URL.name(), "http://provider1.com/dataset1", OperationType.EQ));
            Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasets(getServiceContext(), criteria);
            List<DatasetBasicDto> datasetsDto = result.getResults();

            assertEquals(0, result.getPaginatorResult().getFirstResult().intValue());
            assertEquals(25, result.getPaginatorResult().getMaximumResultSize().intValue());
            assertEquals(1, result.getPaginatorResult().getTotalResults().intValue());

            assertEquals(1, datasetsDto.size());
            assertEquals(DATASET_1_PROVIDER_1 + ":1", datasetsDto.get(0).getUri());
            assertEquals(DatasetStateEnum.PUBLISHED, datasetsDto.get(0).getState());
        }

        // Find by provider 2
        {
            Stat4YouCriteria criteria = buildCriteriaFindByProvider(PROVIDER_2);
            Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasets(getServiceContext(), criteria);
            List<DatasetBasicDto> datasetsDto = result.getResults();
            assertEquals(0, datasetsDto.size());
        }

        // Find by provider 3
        {
            Stat4YouCriteria criteria = buildCriteriaFindByProvider(PROVIDER_3_REMOVED);
            Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasets(getServiceContext(), criteria);
            List<DatasetBasicDto> datasetsDto = result.getResults();
            assertEquals(1, datasetsDto.size());
            assertEquals(DATASET_1_PROVIDER_3 + ":1", datasetsDto.get(0).getUri());
            assertEquals(DatasetStateEnum.DRAFT, datasetsDto.get(0).getState());
        }

        // Find by provider 4
        {
            Stat4YouCriteria criteria = buildCriteriaFindByProvider(PROVIDER_4);
            Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasets(getServiceContext(), criteria);
            List<DatasetBasicDto> datasetsDto = result.getResults();
            assertEquals(1, datasetsDto.size());
            assertEquals(DATASET_1_PROVIDER_4 + ":2", datasetsDto.get(0).getUri());
            assertEquals(DatasetStateEnum.DRAFT, datasetsDto.get(0).getState());
        }

        // Find by provider 5
        {
            Stat4YouCriteria criteria = buildCriteriaFindByProvider(PROVIDER_5);
            Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasets(getServiceContext(), criteria);
            List<DatasetBasicDto> datasetsDto = result.getResults();
            assertEquals(2, datasetsDto.size());
            assertEquals(DATASET_1_PROVIDER_5 + ":2", datasetsDto.get(0).getUri());
            assertEquals(DatasetStateEnum.DRAFT, datasetsDto.get(0).getState());
            assertEquals(DATASET_2_PROVIDER_5 + ":1", datasetsDto.get(1).getUri());
            assertEquals(DatasetStateEnum.PUBLISHED, datasetsDto.get(1).getState());
        }
    }

    @Test
    public void testFindDatasetsByCriteriaPaginated() throws Exception {

        // Retrieve last versions...

        // Find all, paginated
        {
            Stat4YouCriteria criteria = new Stat4YouCriteria();
            criteria.setPaginator(new Stat4YouCriteriaPaginator());
            criteria.getPaginator().setCountTotalResults(Boolean.TRUE);

            // Page 1
            {
                criteria.getPaginator().setFirstResult(Integer.valueOf(0));
                criteria.getPaginator().setMaximumResultSize(Integer.valueOf(3));
                Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasets(getServiceContext(), criteria);
                List<DatasetBasicDto> datasetsDto = result.getResults();

                assertEquals(0, result.getPaginatorResult().getFirstResult().intValue());
                assertEquals(3, result.getPaginatorResult().getMaximumResultSize().intValue());
                assertEquals(7, result.getPaginatorResult().getTotalResults().intValue());

                assertEquals(3, datasetsDto.size());
                assertEquals(DATASET_1_PROVIDER_1 + ":1", datasetsDto.get(0).getUri());
                assertEquals(DATASET_2_PROVIDER_1 + ":1", datasetsDto.get(1).getUri());
                assertEquals(DATASET_1_PROVIDER_3 + ":1", datasetsDto.get(2).getUri());
            }
            // Page 2
            {
                criteria.getPaginator().setFirstResult(Integer.valueOf(3));
                criteria.getPaginator().setMaximumResultSize(Integer.valueOf(3));
                Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasets(getServiceContext(), criteria);
                List<DatasetBasicDto> datasetsDto = result.getResults();

                assertEquals(3, result.getPaginatorResult().getFirstResult().intValue());
                assertEquals(3, result.getPaginatorResult().getMaximumResultSize().intValue());
                assertEquals(7, result.getPaginatorResult().getTotalResults().intValue());

                assertEquals(3, datasetsDto.size());
                assertEquals(DATASET_1_PROVIDER_4 + ":2", datasetsDto.get(0).getUri());
                assertEquals(DATASET_1_PROVIDER_5 + ":2", datasetsDto.get(1).getUri());
                assertEquals(DATASET_2_PROVIDER_5 + ":1", datasetsDto.get(2).getUri());
            }
            // Page 3
            {
                criteria.getPaginator().setFirstResult(Integer.valueOf(6));
                criteria.getPaginator().setMaximumResultSize(Integer.valueOf(3));
                Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasets(getServiceContext(), criteria);
                List<DatasetBasicDto> datasetsDto = result.getResults();

                assertEquals(6, result.getPaginatorResult().getFirstResult().intValue());
                assertEquals(3, result.getPaginatorResult().getMaximumResultSize().intValue());
                assertEquals(7, result.getPaginatorResult().getTotalResults().intValue());

                assertEquals(1, datasetsDto.size());
                assertEquals(DATASET_1_PROVIDER_6 + ":1", datasetsDto.get(0).getUri());
            }
        }
    }

    @Test
    public void testFindDatasetsPublished() throws Exception {

        // Find all published
        {
            Stat4YouCriteria criteria = new Stat4YouCriteria();
            Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasetsPublished(getServiceContext(), criteria);
            List<DatasetBasicDto> datasetsDto = result.getResults();

            assertEquals(0, result.getPaginatorResult().getFirstResult().intValue());
            assertEquals(25, result.getPaginatorResult().getMaximumResultSize().intValue());
            assertEquals(4, result.getPaginatorResult().getTotalResults().intValue());

            assertEquals(4, datasetsDto.size());
            assertEquals(DATASET_1_PROVIDER_1 + ":1", datasetsDto.get(0).getUri());
            assertEquals(DatasetStateEnum.PUBLISHED, datasetsDto.get(0).getState());
            assertEquals(DATASET_1_PROVIDER_4 + ":1", datasetsDto.get(1).getUri());
            assertEquals(DatasetStateEnum.PUBLISHED, datasetsDto.get(1).getState());
            assertEquals(DATASET_1_PROVIDER_5 + ":1", datasetsDto.get(2).getUri());
            assertEquals(DatasetStateEnum.PUBLISHED, datasetsDto.get(2).getState());
            assertEquals(DATASET_2_PROVIDER_5 + ":1", datasetsDto.get(3).getUri());
            assertEquals(DatasetStateEnum.PUBLISHED, datasetsDto.get(3).getState());
        }

        // Find by provider 1
        {
            Stat4YouCriteria criteria = buildCriteriaFindByProvider(PROVIDER_1);
            Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasetsPublished(getServiceContext(), criteria);
            List<DatasetBasicDto> datasetsDto = result.getResults();

            assertEquals(1, datasetsDto.size());
            assertEquals(DATASET_1_PROVIDER_1 + ":1", datasetsDto.get(0).getUri());
            assertEquals(DatasetStateEnum.PUBLISHED, datasetsDto.get(0).getState());
        }

        // Find by provider 2
        {
            Stat4YouCriteria criteria = buildCriteriaFindByProvider(PROVIDER_2);
            Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasetsPublished(getServiceContext(), criteria);
            List<DatasetBasicDto> datasetsDto = result.getResults();
            assertEquals(0, datasetsDto.size());
        }

        // Find by provider 3
        {
            Stat4YouCriteria criteria = buildCriteriaFindByProvider(PROVIDER_3_REMOVED);
            Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasetsPublished(getServiceContext(), criteria);
            List<DatasetBasicDto> datasetsDto = result.getResults();
            assertEquals(0, datasetsDto.size());
        }

        // Find by provider 4
        {
            Stat4YouCriteria criteria = buildCriteriaFindByProvider(PROVIDER_4);
            Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasetsPublished(getServiceContext(), criteria);
            List<DatasetBasicDto> datasetsDto = result.getResults();
            assertEquals(1, datasetsDto.size());
            assertEquals(DATASET_1_PROVIDER_4 + ":1", datasetsDto.get(0).getUri());
            assertEquals(DatasetStateEnum.PUBLISHED, datasetsDto.get(0).getState());
        }

        // Find by provider 5
        {
            Stat4YouCriteria criteria = buildCriteriaFindByProvider(PROVIDER_5);
            Stat4YouCriteriaResult<DatasetBasicDto> result = dsdService.findDatasetsPublished(getServiceContext(), criteria);
            List<DatasetBasicDto> datasetsDto = result.getResults();
            assertEquals(2, datasetsDto.size());
            assertEquals(DATASET_1_PROVIDER_5 + ":1", datasetsDto.get(0).getUri());
            assertEquals(DatasetStateEnum.PUBLISHED, datasetsDto.get(0).getState());
            assertEquals(DATASET_2_PROVIDER_5 + ":1", datasetsDto.get(1).getUri());
            assertEquals(DatasetStateEnum.PUBLISHED, datasetsDto.get(1).getState());
        }
    }

    @Test
    @Override
    public void testFindDatasetsLastPublished() throws Exception {
        {
            // Last 4
            List<DatasetBasicDto> datasetsDto = dsdService.findDatasetsLastPublished(getServiceContext(), 4);
            assertEquals(4, datasetsDto.size());
            assertEquals(DATASET_1_PROVIDER_4 + ":1", datasetsDto.get(0).getUri());
            assertEquals(DATASET_1_PROVIDER_1 + ":1", datasetsDto.get(1).getUri());
            assertEquals(DATASET_1_PROVIDER_5 + ":1", datasetsDto.get(2).getUri());
            assertEquals(DATASET_2_PROVIDER_5 + ":1", datasetsDto.get(3).getUri());
        }
        {
            // Last 5 (only there are 4)
            List<DatasetBasicDto> datasetsDto = dsdService.findDatasetsLastPublished(getServiceContext(), 5);
            assertEquals(4, datasetsDto.size());
            assertEquals(DATASET_1_PROVIDER_4 + ":1", datasetsDto.get(0).getUri());
            assertEquals(DATASET_1_PROVIDER_1 + ":1", datasetsDto.get(1).getUri());
            assertEquals(DATASET_1_PROVIDER_5 + ":1", datasetsDto.get(2).getUri());
            assertEquals(DATASET_2_PROVIDER_5 + ":1", datasetsDto.get(3).getUri());
        }
        {
            // Last 3
            List<DatasetBasicDto> datasetsDto = dsdService.findDatasetsLastPublished(getServiceContext(), 3);
            assertEquals(3, datasetsDto.size());
            assertEquals(DATASET_1_PROVIDER_4 + ":1", datasetsDto.get(0).getUri());
            assertEquals(DATASET_1_PROVIDER_1 + ":1", datasetsDto.get(1).getUri());
            assertEquals(DATASET_1_PROVIDER_5 + ":1", datasetsDto.get(2).getUri());
        }

    }

    @Test
    @Override
    public void testRetrieveDimension() throws Exception {
        String uri = DIMENSION1_DATASET_1_PROVIDER_1;
        DimensionDto dimensionDto = dsdService.retrieveDimension(getServiceContext(), uri);

        assertNotNull(dimensionDto);
        assertEquals(uri, dimensionDto.getUri());
        assertEquals("IdentifierP-1-D-1-D-1", dimensionDto.getIdentifier());
        assertEqualsInternationalString(dimensionDto.getTitle(), "en", "Month", "es", "Mes");

        // Codes
        assertEquals(2, dimensionDto.getCodes().size());

        assertEquals("CODE_DIMENSION_1", dimensionDto.getCodes().get(0).getIdentifier());
        assertEqualsInternationalString(dimensionDto.getCodes().get(0).getTitle(), "en", "People", "es", "Personas");
        assertEquals(2, dimensionDto.getCodes().get(0).getSubcodes().size());

        assertEquals("CODE_DIMENSION_1_A", dimensionDto.getCodes().get(0).getSubcodes().get(0).getIdentifier());
        assertEqualsInternationalString(dimensionDto.getCodes().get(0).getSubcodes().get(0).getTitle(), "en", "Countries", "es", "Países");
        assertEquals(0, dimensionDto.getCodes().get(0).getSubcodes().get(0).getSubcodes().size());
        assertEquals("CODE_DIMENSION_1_B", dimensionDto.getCodes().get(0).getSubcodes().get(1).getIdentifier());
        assertEqualsInternationalString(dimensionDto.getCodes().get(0).getSubcodes().get(1).getTitle(), "en", "Months", "es", "Meses");
        assertEquals(1, dimensionDto.getCodes().get(0).getSubcodes().get(1).getSubcodes().size());

        assertEquals("CODE_DIMENSION_1_B_A", dimensionDto.getCodes().get(0).getSubcodes().get(1).getSubcodes().get(0).getIdentifier());
        assertEqualsInternationalString(dimensionDto.getCodes().get(0).getSubcodes().get(1).getSubcodes().get(0).getTitle(), "en", "Days", "es", "Días");

        assertEquals("CODE_DIMENSION_2", dimensionDto.getCodes().get(1).getIdentifier());
        assertEqualsInternationalString(dimensionDto.getCodes().get(1).getTitle(), "en", "Islands", "es", "Islas");
        assertEquals(0, dimensionDto.getCodes().get(1).getSubcodes().size());
    }

    @Test
    public void testRetrieveDimensionErrorNotExists() throws Exception {
        try {
            dsdService.retrieveDimension(getServiceContext(), DIMENSION_NOT_EXISTS);
            fail("No exists");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DIMENSION_NOT_EXISTS.getName(), e.getErrorCode());
        }
    }

    @Test
    @Override
    public void testRetrieveDatasetDimensions() throws Exception {

        String datasetUri = DATASET_1_PROVIDER_1;
        List<DimensionDto> dimensionsDto = dsdService.retrieveDatasetDimensions(getServiceContext(), datasetUri);

        assertEquals(2, dimensionsDto.size());
        {
            DimensionDto dimensionDto = dimensionsDto.get(0);
            assertEquals(DIMENSION1_DATASET_1_PROVIDER_1, dimensionDto.getUri());
            assertEqualsInternationalString(dimensionDto.getTitle(), "en", "Month", "es", "Mes");
        }
        {
            DimensionDto dimensionDto = dimensionsDto.get(1);
            assertEquals(DIMENSION2_DATASET_1_PROVIDER_1, dimensionDto.getUri());
            assertEqualsInternationalString(dimensionDto.getTitle(), "en", "Year", "es", "Año");
        }
    }

    @Test
    public void testRetrieveDimensionsErrorDatasetNotExists() throws Exception {

        try {
            dsdService.retrieveDatasetDimensions(getServiceContext(), DATASET_NOT_EXISTS);
            fail("No exists");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_NOT_EXISTS.getName(), e.getErrorCode());
        }
    }
    
    @Test
    @Override
    public void testRetrieveDatasetDimensionsBasics() throws Exception {
        String datasetUri = DATASET_1_PROVIDER_1;
        List<DimensionBasicDto> dimensionsDto = dsdService.retrieveDatasetDimensionsBasics(getServiceContext(), datasetUri);

        assertEquals(2, dimensionsDto.size());
        {
            DimensionBasicDto dimensionDto = dimensionsDto.get(0);
            assertEquals(DIMENSION1_DATASET_1_PROVIDER_1, dimensionDto.getUri());
            assertEqualsInternationalString(dimensionDto.getTitle(), "en", "Month", "es", "Mes");
        }
        {
            DimensionBasicDto dimensionDto = dimensionsDto.get(1);
            assertEquals(DIMENSION2_DATASET_1_PROVIDER_1, dimensionDto.getUri());
            assertEqualsInternationalString(dimensionDto.getTitle(), "en", "Year", "es", "Año");
        }        
    }
    
    @Test
    public void testRetrieveDatasetDimensionsBasicsErrorDatasetNotExists() throws Exception {

        try {
            dsdService.retrieveDatasetDimensionsBasics(getServiceContext(), DATASET_NOT_EXISTS);
            fail("No exists");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_NOT_EXISTS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testUpdateDimension() throws Exception {

        String uri = DIMENSION1_DATASET_2_PROVIDER_1;
        DimensionDto dimensionDto = dsdService.retrieveDimension(getServiceContext(), uri);
        dimensionDto.setTitle(getInternationalString("NewName"));
        dimensionDto.getCodes().get(0).setTitle(getInternationalString("NewNameToValue"));

        // Update
        dsdService.updateDimension(getServiceContext(), dimensionDto);

        // Validation
        DimensionDto dimensionDtoUpdate = dsdService.retrieveDimension(getServiceContext(), uri);
        assertEqualsDimension(dimensionDto, dimensionDtoUpdate);
    }

    @Test
    public void testUpdateDimensionErrorChangeIdentifier() throws Exception {

        String uri = DIMENSION1_DATASET_2_PROVIDER_1;
        DimensionDto dimensionDto = dsdService.retrieveDimension(getServiceContext(), uri);
        dimensionDto.getCodes().get(0).setIdentifier("aaa");

        // Update
        try {
            dsdService.updateDimension(getServiceContext(), dimensionDto);
            fail("Code can not be changed");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.OPERATION_NOT_SUPPORTED.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testUpdateDimensionErrorNotExists() throws Exception {

        DimensionDto dimensionDto = new DimensionDto();
        dimensionDto.setUri(DIMENSION_NOT_EXISTS);
        dimensionDto.setTitle(getInternationalString("Not exists"));
        try {
            dsdService.updateDimension(getServiceContext(), dimensionDto);
            fail("not exists");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DIMENSION_NOT_EXISTS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testUpdateDimensionErrorDatasetPublished() throws Exception {
        DimensionDto dimensionDto = new DimensionDto();
        dimensionDto.setUri(DIMENSION1_DATASET_1_PROVIDER_1);
        dimensionDto.setTitle(getInternationalString("NewName"));
        try {
            dsdService.updateDimension(getServiceContext(), dimensionDto);
            fail("dataset published");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.OPERATION_NOT_SUPPORTED.getName(), e.getErrorCode());
        }
    }
    
    @Test
    @Override
    public void testRetrieveCodesDimension() throws Exception {
        List<CodeDimensionDto> codeDimensionDtos = dsdService.retrieveCodesDimension(getServiceContext(), DIMENSION1_DATASET_1_PROVIDER_1);
        assertEquals(2, codeDimensionDtos.size());        
    }

    @Test
    @Override
    public void testRetrievePrimaryMeasure() throws Exception {
        String uri = PRIMARY_MEASURE1_DATASET_1_PROVIDER_1;
        PrimaryMeasureDto primaryMeasureDto = dsdService.retrievePrimaryMeasure(getServiceContext(), uri);

        assertNotNull(primaryMeasureDto);
        assertEquals(uri, primaryMeasureDto.getUri());
        assertEquals("OBS_VALUE", primaryMeasureDto.getIdentifier());
        assertEqualsInternationalString(primaryMeasureDto.getTitle(), "es", "Porcentaje", "en", "Percentage");
    }

    @Test
    public void testRetrievePrimaryMeasureErrorNotExists() throws Exception {
        try {
            dsdService.retrievePrimaryMeasure(getServiceContext(), PRIMARY_MEASURE_NOT_EXISTS);
            fail("No exists");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.PRIMARY_MEASURE_NOT_EXISTS.getName(), e.getErrorCode());
        }
    }

    @Test
    @Override
    public void testRetrieveDatasetPrimaryMeasure() throws Exception {
        String datasetUri = DATASET_1_PROVIDER_1;
        PrimaryMeasureDto primaryMeasureDto = dsdService.retrieveDatasetPrimaryMeasure(getServiceContext(), datasetUri);

        assertEquals(PRIMARY_MEASURE1_DATASET_1_PROVIDER_1, primaryMeasureDto.getUri());
        assertEqualsInternationalString(primaryMeasureDto.getTitle(), "es", "Porcentaje", "en", "Percentage");
    }

    @Test
    public void testRetrieveMeasuresErrorDatasetNotExists() throws Exception {

        try {
            dsdService.retrieveDatasetPrimaryMeasure(getServiceContext(), DATASET_NOT_EXISTS);
            fail("No exists");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_NOT_EXISTS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testUpdatePrimaryMeasure() throws Exception {

        String uri = PRIMARY_MEASURE1_DATASET_2_PROVIDER_1;
        PrimaryMeasureDto primaryMeasureDto = dsdService.retrievePrimaryMeasure(getServiceContext(), uri);
        primaryMeasureDto.setTitle(getInternationalString("NewName"));

        // Update
        dsdService.updatePrimaryMeasure(getServiceContext(), primaryMeasureDto);

        // Validation
        PrimaryMeasureDto primaryMeasureDtoUpdate = dsdService.retrievePrimaryMeasure(getServiceContext(), uri);
        assertEqualsPrimaryMeasure(primaryMeasureDto, primaryMeasureDtoUpdate);
    }

    @Test
    public void testUpdatePrimaryMeasureErrorNotExists() throws Exception {

        PrimaryMeasureDto primaryMeasureDto = new PrimaryMeasureDto();
        primaryMeasureDto.setUri(PRIMARY_MEASURE_NOT_EXISTS);
        primaryMeasureDto.setTitle(getInternationalString("Not exists"));
        try {
            dsdService.updatePrimaryMeasure(getServiceContext(), primaryMeasureDto);
            fail("not exists");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.PRIMARY_MEASURE_NOT_EXISTS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testUpdatePrimaryMeasureErrorDatasetPublished() throws Exception {

        PrimaryMeasureDto primaryMeasureDto = new PrimaryMeasureDto();
        primaryMeasureDto.setUri(PRIMARY_MEASURE1_DATASET_1_PROVIDER_1);
        primaryMeasureDto.setTitle(getInternationalString("NewName"));
        try {
            dsdService.updatePrimaryMeasure(getServiceContext(), primaryMeasureDto);
            fail("dataset published");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_INCORRECT_STATUS.getName(), e.getErrorCode());
        }
    }

    @Test
    @Override
    public void testRetrieveDatasetAttributeDefinitions() throws Exception {

        String datasetUri = DATASET_1_PROVIDER_1;
        List<AttributeDefinitionDto> attributeDefinitionsDto = dsdService.retrieveDatasetAttributeDefinitions(getServiceContext(), datasetUri);

        assertEquals(4, attributeDefinitionsDto.size());
        {
            AttributeDefinitionDto attributeDefinitionDto = attributeDefinitionsDto.get(0);
            assertEquals(ATTRIBUTE_DEFINITION1_DATASET_1_PROVIDER_1, attributeDefinitionDto.getUri());
            assertEquals("CODE-P-1-D-1-AD-1", attributeDefinitionDto.getIdentifier());
            assertEquals(AttributeAttachmentLevelEnum.DATASET, attributeDefinitionDto.getAttachmentLevel());
            assertEqualsInternationalString(attributeDefinitionDto.getTitle(), "en", "Attribute of dataset 1", "es", "Atributo de dataset 1");
            assertTrue(attributeDefinitionDto.getAttachmentDimensions().size() == 0);
        }
        {
            AttributeDefinitionDto attributeDefinitionDto = attributeDefinitionsDto.get(1);
            assertEquals(ATTRIBUTE_DEFINITION2_DATASET_1_PROVIDER_1, attributeDefinitionDto.getUri());
            assertEquals("CODE-P-1-D-1-AD-2", attributeDefinitionDto.getIdentifier());
            assertEquals(AttributeAttachmentLevelEnum.OBSERVATION, attributeDefinitionDto.getAttachmentLevel());
            assertEqualsInternationalString(attributeDefinitionDto.getTitle(), "en", "Attribute of observation 1", "es", "Atributo de observación 1");
            assertTrue(attributeDefinitionDto.getAttachmentDimensions().size() == 0);
        }
        {
            AttributeDefinitionDto attributeDefinitionDto = attributeDefinitionsDto.get(2);
            assertEquals(ATTRIBUTE_DEFINITION3_DATASET_1_PROVIDER_1, attributeDefinitionDto.getUri());
            assertEquals("CODE-P-1-D-1-AD-3", attributeDefinitionDto.getIdentifier());
            assertEquals(AttributeAttachmentLevelEnum.DIMENSION, attributeDefinitionDto.getAttachmentLevel());
            assertNull(attributeDefinitionDto.getTitle());
            assertEquals(1, attributeDefinitionDto.getAttachmentDimensions().size());
            assertEquals("IdentifierP-1-D-1-D-2", attributeDefinitionDto.getAttachmentDimensions().get(0).getIdentifier());
            assertEquals(DIMENSION2_DATASET_1_PROVIDER_1, attributeDefinitionDto.getAttachmentDimensions().get(0).getUri());
        }
        {
            AttributeDefinitionDto attributeDefinitionDto = attributeDefinitionsDto.get(3);
            assertEquals(ATTRIBUTE_DEFINITION4_DATASET_1_PROVIDER_1, attributeDefinitionDto.getUri());
            assertEquals("CODE-P-1-D-1-AD-4", attributeDefinitionDto.getIdentifier());
            assertEquals(AttributeAttachmentLevelEnum.DIMENSION, attributeDefinitionDto.getAttachmentLevel());
            assertNull(attributeDefinitionDto.getTitle());
            assertEquals(2, attributeDefinitionDto.getAttachmentDimensions().size());
            assertEquals("IdentifierP-1-D-1-D-2", attributeDefinitionDto.getAttachmentDimensions().get(0).getIdentifier());
            assertEquals(DIMENSION2_DATASET_1_PROVIDER_1, attributeDefinitionDto.getAttachmentDimensions().get(0).getUri());
            assertEquals("IdentifierP-1-D-1-D-1", attributeDefinitionDto.getAttachmentDimensions().get(1).getIdentifier());
            assertEquals(DIMENSION1_DATASET_1_PROVIDER_1, attributeDefinitionDto.getAttachmentDimensions().get(1).getUri());
        }
    }

    @Test
    public void testRetrieveDatasetAttributeDefinitionsErrorDatasetNotExists() throws Exception {

        try {
            dsdService.retrieveDatasetAttributeDefinitions(getServiceContext(), DATASET_NOT_EXISTS);
            fail("No exists");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.DATASET_NOT_EXISTS.getName(), e.getErrorCode());
        }
    }

    private void assertEqualsProvider(ProviderDto providerDtoExpected, ProviderDto providerDtoActual) {
        assertEquals(providerDtoExpected.getAcronym(), providerDtoActual.getAcronym());
        assertEquals(providerDtoExpected.getName(), providerDtoActual.getName());
        assertEquals(providerDtoExpected.getUrl(), providerDtoActual.getUrl());
        assertEqualsInternationalString(providerDtoExpected.getLicense(), providerDtoActual.getLicense());
        assertEquals(providerDtoExpected.getLicenseUrl(), providerDtoActual.getLicenseUrl());
        assertEquals(providerDtoExpected.getLanguage(), providerDtoActual.getLanguage());
        assertEqualsInternationalString(providerDtoExpected.getDescription(), providerDtoActual.getDescription());
        assertEquals(providerDtoExpected.getCitation(), providerDtoActual.getCitation());
    }

    private void assertEqualsDataset(DatasetDto datasetDtoExpected, DatasetDto datasetDtoActual) {
        assertEqualsDatasetBasic(datasetDtoExpected, datasetDtoActual);
        assertEqualsDimensions(datasetDtoExpected.getDimensions(), datasetDtoActual.getDimensions());
        assertEqualsPrimaryMeasure(datasetDtoExpected.getPrimaryMeasure(), datasetDtoActual.getPrimaryMeasure());
        assertEqualsAttributeDefinitions(datasetDtoExpected.getAttributeDefinitions(), datasetDtoActual.getAttributeDefinitions());
    }

    private void assertEqualsDatasetBasic(DatasetBasicDto datasetDtoExpected, DatasetBasicDto datasetDtoActual) {
        assertEquals(datasetDtoExpected.getSource(), datasetDtoActual.getSource());
        assertEquals(datasetDtoExpected.getUrl(), datasetDtoActual.getUrl());
        assertEquals(datasetDtoExpected.getFrequency(), datasetDtoActual.getFrequency());
        assertEquals(datasetDtoExpected.getLanguage(), datasetDtoActual.getLanguage());
        assertEqualsList(datasetDtoExpected.getLanguages(), datasetDtoActual.getLanguages());
        assertEquals(datasetDtoExpected.getProviderPublishingDate(), datasetDtoActual.getProviderPublishingDate());
        assertEquals(datasetDtoExpected.getProviderReleaseDate(), datasetDtoActual.getProviderReleaseDate());
        assertEqualsInternationalString(datasetDtoExpected.getTitle(), datasetDtoActual.getTitle());
        assertEqualsInternationalString(datasetDtoExpected.getDescription(), datasetDtoActual.getDescription());
        assertEquals(datasetDtoExpected.getIdentifier(), datasetDtoActual.getIdentifier());
        assertEqualsList(datasetDtoExpected.getCategories(), datasetDtoActual.getCategories());
        assertEquals(datasetDtoExpected.getProviderUri(), datasetDtoActual.getProviderUri());
        assertEquals(datasetDtoExpected.getPublisher(), datasetDtoActual.getPublisher());
    }

    private void assertEqualsDimensions(List<DimensionDto> dimensionsDtoExpected, List<DimensionDto> dimensionsDtoActual) {
        assertEquals(dimensionsDtoExpected.size(), dimensionsDtoActual.size());
        for (int i = 0; i < dimensionsDtoExpected.size(); i++) {
            DimensionDto dimensionDtoExpected = dimensionsDtoExpected.get(i);
            DimensionDto dimensionDtoActual = dimensionsDtoActual.get(i);
            assertEqualsDimension(dimensionDtoExpected, dimensionDtoActual);
        }
    }

    private void assertEqualsDimension(DimensionDto dimensionDtoExpected, DimensionDto dimensionDtoActual) {
        assertEqualsInternationalString(dimensionDtoExpected.getTitle(), dimensionDtoActual.getTitle());
        assertEquals(dimensionDtoExpected.getIdentifier(), dimensionDtoActual.getIdentifier());
        assertEquals(dimensionDtoExpected.getType(), dimensionDtoActual.getType());
        // Codes
        assertEquals(dimensionDtoExpected.getCodes().size(), dimensionDtoActual.getCodes().size());
        for (int i = 0; i < dimensionDtoExpected.getCodes().size(); i++) {
            assertEqualsCodeDimension(dimensionDtoExpected.getCodes().get(i), dimensionDtoActual.getCodes().get(i));
        }
    }

    private void assertEqualsCodeDimension(CodeDimensionDto codeDimensionDtoExpected, CodeDimensionDto codeDimensionDtoActual) {
        assertEquals(codeDimensionDtoExpected.getIdentifier(), codeDimensionDtoActual.getIdentifier());
        assertEqualsInternationalString(codeDimensionDtoExpected.getTitle(), codeDimensionDtoActual.getTitle());
        for (int i = 0; i < codeDimensionDtoExpected.getSubcodes().size(); i++) {
            assertEqualsCodeDimension(codeDimensionDtoExpected.getSubcodes().get(i), codeDimensionDtoActual.getSubcodes().get(i));
        }
    }

    private void assertEqualsPrimaryMeasure(PrimaryMeasureDto measureDtoExpected, PrimaryMeasureDto measureDtoActual) {
        assertEquals(measureDtoExpected.getIdentifier(), measureDtoActual.getIdentifier());
        assertEqualsInternationalString(measureDtoExpected.getTitle(), measureDtoActual.getTitle());
    }

    private void assertEqualsAttributeDefinitions(List<AttributeDefinitionDto> attributeDefinitionsDtoExpected, List<AttributeDefinitionDto> attributeDefinitionsDtoActual) {
        assertEquals(attributeDefinitionsDtoExpected.size(), attributeDefinitionsDtoActual.size());
        for (int i = 0; i < attributeDefinitionsDtoExpected.size(); i++) {
            AttributeDefinitionDto attributeDefinitionDtoExpected = attributeDefinitionsDtoExpected.get(i);
            AttributeDefinitionDto attributeDefinitionDtoActual = attributeDefinitionsDtoActual.get(i);
            assertEqualsAttributeDefinition(attributeDefinitionDtoExpected, attributeDefinitionDtoActual);
        }
    }

    private void assertEqualsAttributeDefinition(AttributeDefinitionDto attributeDefinitionDtoExpected, AttributeDefinitionDto attributeDefinitionDtoActual) {
        assertEquals(attributeDefinitionDtoExpected.getIdentifier(), attributeDefinitionDtoActual.getIdentifier());
        assertEqualsInternationalString(attributeDefinitionDtoExpected.getTitle(), attributeDefinitionDtoActual.getTitle());
        assertEquals(attributeDefinitionDtoExpected.getAttachmentLevel(), attributeDefinitionDtoActual.getAttachmentLevel());
        if (AttributeAttachmentLevelEnum.DIMENSION.equals(attributeDefinitionDtoExpected.getAttachmentLevel())) {
            assertEquals(attributeDefinitionDtoExpected.getAttachmentDimensions().size(), attributeDefinitionDtoActual.getAttachmentDimensions().size());
            for (ResourceIdentierDto attachmentDimensionExpected : attributeDefinitionDtoExpected.getAttachmentDimensions()) {
                boolean contains = false;
                for (ResourceIdentierDto attachmentDimensionActual : attributeDefinitionDtoActual.getAttachmentDimensions()) {
                    if (attachmentDimensionExpected.getIdentifier().equals(attachmentDimensionActual.getIdentifier())) {
                        contains = true;
                        break;
                    }
                    assertNotNull(attachmentDimensionActual.getUri());
                }
                assertTrue(contains);
            }
        }
    }

    private void assertEqualsInternationalString(InternationalStringDto internationalStringDtoExpected, InternationalStringDto internationalStringDtoActual) {
        if (internationalStringDtoActual == null && internationalStringDtoExpected == null) {
            return;
        } else if ((internationalStringDtoActual != null && internationalStringDtoExpected == null) || (internationalStringDtoActual == null && internationalStringDtoExpected != null)) {
            fail();
        }

        assertEquals(internationalStringDtoExpected.getTexts().size(), internationalStringDtoActual.getTexts().size());
        for (LocalisedStringDto localisedStringDtoExpected : internationalStringDtoExpected.getTexts()) {
            assertEquals(localisedStringDtoExpected.getLabel(), internationalStringDtoActual.getLocalisedLabel(localisedStringDtoExpected.getLocale()));
        }
    }

    private InternationalStringDto getInternationalString(String baseName) {
        InternationalStringDto internationalStringDto = new InternationalStringDto();
        LocalisedStringDto es = new LocalisedStringDto();
        es.setLabel(baseName + " en Español");
        es.setLocale("es");
        LocalisedStringDto en = new LocalisedStringDto();
        en.setLabel(baseName + " in English");
        en.setLocale("en");
        internationalStringDto.addText(es);
        internationalStringDto.addText(en);

        return internationalStringDto;
    }

    private ResourceIdentierDto getResourceIdentifierDto(String identifier) {
        ResourceIdentierDto resourceIdentierDto = new ResourceIdentierDto();
        resourceIdentierDto.setIdentifier(identifier);
        return resourceIdentierDto;
    }

    private void assertEqualsInternationalString(InternationalStringDto internationalStringDto, String locale1, String label1, String locale2, String label2) {
        assertEquals(2, internationalStringDto.getTexts().size());
        assertEquals(label1, internationalStringDto.getLocalisedLabel(locale1));
        assertEquals(label2, internationalStringDto.getLocalisedLabel(locale2));
    }

    private void assertEqualsList(List<String> expected, List<String> actual) {
        if (expected == null && actual == null) {
            return;
        } else if ((expected != null && actual == null) || (expected == null && actual != null)) {
            fail();
        }
        assertEquals(expected.size(), actual.size());
        for (String string : expected) {
            assertTrue(actual.contains(string));
        }
    }

    private List<DimensionDto> mockDimensions(int number) {
        List<DimensionDto> dimensions = new ArrayList<DimensionDto>();
        for (int i = 0; i < number; i++) {
            DimensionDto dimensionDto = new DimensionDto();
            dimensionDto.setIdentifier(mockSemanticIdentifier());
            dimensionDto.setTitle(getInternationalString(String.valueOf(i)));
            dimensionDto.setType(DimensionTypeEnum.DIMENSION);
            for (int j = 0; j < number; j++) {
                CodeDimensionDto codeDimensionDto = new CodeDimensionDto();
                codeDimensionDto.setTitle(getInternationalString(String.valueOf(j)));
                codeDimensionDto.setIdentifier(mockSemanticIdentifier());
                dimensionDto.addCode(codeDimensionDto);
            }
            dimensions.add(dimensionDto);
        }
        return dimensions;
    }

    private PrimaryMeasureDto mockPrimaryMeasure() {
        PrimaryMeasureDto measureDto = new PrimaryMeasureDto();
        measureDto.setIdentifier("OBS_VALUE");
        measureDto.setTitle(getInternationalString("measure"));
        return measureDto;
    }

    private String mockSemanticIdentifier() {
        return "id" + UUID.randomUUID().toString().replace("-", "");
    }

    @Override
    protected String getDataSetFile() {
        return "dbunit/DsdServiceTest.xml";
    }

    @Override
    protected List<String> getTablesToRemoveContent() {
        List<String> tableNames = new ArrayList<String>();
        tableNames.add("TBL_ATTRIBUTES_DIMENSIONS");
        tableNames.add("TBL_CODES_DIMENSIONS");
        tableNames.add("TBL_DIMENSIONS");
        tableNames.add("TBL_PRIMARY_MEASURES");
        tableNames.add("TBL_DATASETS_VERSIONS");
        tableNames.add("TBL_DATASETS");
        tableNames.add("TBL_PROVIDERS");
        tableNames.add("TBL_ATTRIBUTES_DEFINITIONS");
        tableNames.add("TBL_LOCALISED_STRINGS");
        tableNames.add("TBL_INTERNATIONAL_STRINGS");
        return tableNames;
    }

    private Stat4YouCriteria buildCriteriaFindByProvider(String provider) throws ApplicationException {
        Stat4YouCriteria criteria = new Stat4YouCriteria();
        Stat4YouCriteriaConjunctionRestriction conjunctionRestriction = new Stat4YouCriteriaConjunctionRestriction();
        conjunctionRestriction.getRestrictions().add(new Stat4YouCriteriaPropertyRestriction(DatasetCriteriaPropertyEnum.PROVIDER_URI.name(), provider, OperationType.EQ));
        criteria.setRestriction(conjunctionRestriction);
        return criteria;
    }
}
