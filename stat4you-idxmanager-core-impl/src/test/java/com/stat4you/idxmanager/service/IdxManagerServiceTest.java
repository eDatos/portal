package com.stat4you.idxmanager.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Matchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.stat4you.common.Stat4YouConstants;
import com.stat4you.common.criteria.Stat4YouCriteria;
import com.stat4you.statistics.dsd.dto.DatasetBasicDto;
import com.stat4you.statistics.dsd.dto.ProviderDto;
import com.stat4you.statistics.dsd.service.DsdService;
import com.stat4you.idxmanager.domain.IndexationFieldsEnum;
import com.stat4you.idxmanager.domain.ResourceTypeEnum;
import com.stat4you.idxmanager.mocks.DsdServiceMock;
import com.stat4you.idxmanager.service.indexation.IdxManagerJob;
import com.stat4you.idxmanager.service.indexation.IdxManagerService;
import com.stat4you.idxmanager.service.solr.SolR;
import com.stat4you.normalizedvalues.dto.CategoryDto;
import com.stat4you.normalizedvalues.service.NormalizedValuesService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:/spring/mockito.xml", "classpath:/spring/idxmanager-applicationContext-test.xml"})
public class IdxManagerServiceTest implements IdxManagerServiceTestBase {

    private final ServiceContext    serviceContext = new ServiceContext("junit", "junit", "app");

    @Autowired
    private DsdService              dsdService;

    @Autowired
    private NormalizedValuesService normalizedValuesService;

    @Autowired
    private IdxManagerService       idxManagerService;

    @Autowired
    private SolR                    solr;
    
    @BeforeClass
    public static void setUpClass() {
        System.setProperty(Stat4YouConstants.PROP_DATA_URL, "./data");
    }

    @Before
    public void setUp() throws Exception {
        idxManagerService.clearIndex();
        when(dsdService.retrieveDatasetPublished((ServiceContext) Matchers.anyObject(), Matchers.eq(DsdServiceMock.DATASET_1_PROVIDER_1))).thenReturn(
                DsdServiceMock.retrieveDataset(DsdServiceMock.DATASET_1_PROVIDER_1));
        when(dsdService.retrieveDatasetPublished((ServiceContext) Matchers.anyObject(), Matchers.eq(DsdServiceMock.DATASET_3_PROVIDER_1))).thenReturn(
                DsdServiceMock.retrieveDataset(DsdServiceMock.DATASET_3_PROVIDER_1));
        when(dsdService.retrieveProvider((ServiceContext) Matchers.anyObject(), Matchers.eq(DsdServiceMock.PROVIDER_1))).thenReturn(DsdServiceMock.retrieveProvider(DsdServiceMock.PROVIDER_1));

        when(dsdService.findDatasetsPublished((ServiceContext) Matchers.anyObject(), (Stat4YouCriteria) Matchers.anyObject())).thenReturn(DsdServiceMock.findPublishedDatasets());
        when(dsdService.retrieveProviders((ServiceContext) Matchers.anyObject())).thenReturn(DsdServiceMock.listProviders());

        when(normalizedValuesService.retrieveCategory((ServiceContext) Matchers.anyObject(), (String) Matchers.anyObject())).thenReturn(new CategoryDto());
    }

    @Override
    @Test
    public void testIndexJob() throws Exception {
        IdxManagerJob idxManagerJob = new IdxManagerJob();
        idxManagerJob.execute(null);

        SolrQuery solrQuery = new SolrQuery();
        solrQuery.setQuery("consumismo");
        QueryResponse response = solr.runQuery(solrQuery);
        assertNotNull(response);
        SolrDocumentList results = response.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());
        SolrDocument document = results.get(0);
        assertEquals(ResourceTypeEnum.DSET.getType(), document.getFieldValue(IndexationFieldsEnum.TYPE.getField()));

        solrQuery = new SolrQuery();
        solrQuery.setQuery("consumption");
        response = solr.runQuery(solrQuery);
        assertNotNull(response);
        results = response.getResults();
        assertNotNull(results);
        assertEquals(0, results.size());
    }

    @Test
    public void testIndexDatasetTilde() throws Exception {
        DatasetBasicDto datasetCreated = dsdService.retrieveDatasetPublished(serviceContext, DsdServiceMock.DATASET_1_PROVIDER_1);
        String uri = datasetCreated.getUri();
        idxManagerService.indexDatasetPublished(uri);

        SolrQuery solrQuery = new SolrQuery();
        solrQuery.setQuery("autonómica");
        QueryResponse response = solr.runQuery(solrQuery);
        assertNotNull(response);
        SolrDocumentList results = response.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());
        SolrDocument document = results.get(0);
        assertEquals(uri, document.getFieldValue(IndexationFieldsEnum.ID.getField()));
        assertEquals(datasetCreated.getIdentifier(), document.getFieldValue(IndexationFieldsEnum.DS_IDENTIFIER.getField()));
        assertEquals(ResourceTypeEnum.DSET.getType(), document.getFieldValue(IndexationFieldsEnum.TYPE.getField()));

        solrQuery.setQuery("consumer");
        response = solr.runQuery(solrQuery);
        assertNotNull(response);
        results = response.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());
        document = results.get(0);
        assertEquals(uri, document.getFieldValue(IndexationFieldsEnum.ID.getField()));
        assertEquals(datasetCreated.getIdentifier(), document.getFieldValue(IndexationFieldsEnum.DS_IDENTIFIER.getField()));
        assertEquals(ResourceTypeEnum.DSET.getType(), document.getFieldValue(IndexationFieldsEnum.TYPE.getField()));

        solrQuery.setQuery("price");
        response = solr.runQuery(solrQuery);
        assertNotNull(response);
        results = response.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());
        document = results.get(0);
        assertEquals(uri, document.getFieldValue(IndexationFieldsEnum.ID.getField()));
        assertEquals(datasetCreated.getIdentifier(), document.getFieldValue(IndexationFieldsEnum.DS_IDENTIFIER.getField()));
        assertEquals(ResourceTypeEnum.DSET.getType(), document.getFieldValue(IndexationFieldsEnum.TYPE.getField()));

        solrQuery.setQuery("sinresultados");
        response = solr.runQuery(solrQuery);
        assertNotNull(response);
        results = response.getResults();
        assertNotNull(results);
        assertEquals(0, results.size());
    }

    @Override
    @Test
    public void testIndexDataset() throws Exception {
        DatasetBasicDto datasetCreated = dsdService.retrieveDatasetPublished(serviceContext, DsdServiceMock.DATASET_1_PROVIDER_1);
        String uri = datasetCreated.getUri();
        idxManagerService.indexDatasetPublished(uri);

        SolrQuery solrQuery = new SolrQuery();
        solrQuery.setQuery("consumo");
        QueryResponse response = solr.runQuery(solrQuery);
        assertNotNull(response);
        SolrDocumentList results = response.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());
        SolrDocument document = results.get(0);
        assertEquals(uri, document.getFieldValue(IndexationFieldsEnum.ID.getField()));
        assertEquals(datasetCreated.getIdentifier(), document.getFieldValue(IndexationFieldsEnum.DS_IDENTIFIER.getField()));
        assertEquals(ResourceTypeEnum.DSET.getType(), document.getFieldValue(IndexationFieldsEnum.TYPE.getField()));

        solrQuery.setQuery("consumer");
        response = solr.runQuery(solrQuery);
        assertNotNull(response);
        results = response.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());
        document = results.get(0);
        assertEquals(uri, document.getFieldValue(IndexationFieldsEnum.ID.getField()));
        assertEquals(datasetCreated.getIdentifier(), document.getFieldValue(IndexationFieldsEnum.DS_IDENTIFIER.getField()));
        assertEquals(ResourceTypeEnum.DSET.getType(), document.getFieldValue(IndexationFieldsEnum.TYPE.getField()));

        solrQuery.setQuery("price");
        response = solr.runQuery(solrQuery);
        assertNotNull(response);
        results = response.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());
        document = results.get(0);
        assertEquals(uri, document.getFieldValue(IndexationFieldsEnum.ID.getField()));
        assertEquals(datasetCreated.getIdentifier(), document.getFieldValue(IndexationFieldsEnum.DS_IDENTIFIER.getField()));
        assertEquals(ResourceTypeEnum.DSET.getType(), document.getFieldValue(IndexationFieldsEnum.TYPE.getField()));

        solrQuery.setQuery("sinresultados");
        response = solr.runQuery(solrQuery);
        assertNotNull(response);
        results = response.getResults();
        assertNotNull(results);
        assertEquals(0, results.size());
    }

    @Test
    public void testIndexDatasetIgnoreUnknownLanguage() throws Exception {
        DatasetBasicDto datasetCreated = dsdService.retrieveDatasetPublished(serviceContext, DsdServiceMock.DATASET_3_PROVIDER_1);
        String uri = datasetCreated.getUri();
        idxManagerService.indexDatasetPublished(uri);

        SolrQuery solrQuery = new SolrQuery();
        solrQuery.setQuery("consumo");
        QueryResponse response = solr.runQuery(solrQuery);
        assertNotNull(response);
        SolrDocumentList results = response.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());
        SolrDocument document = results.get(0);
        assertEquals(uri, document.getFieldValue(IndexationFieldsEnum.ID.getField()));
        assertEquals(datasetCreated.getIdentifier(), document.getFieldValue(IndexationFieldsEnum.DS_IDENTIFIER.getField()));
        assertEquals(ResourceTypeEnum.DSET.getType(), document.getFieldValue(IndexationFieldsEnum.TYPE.getField()));

        solrQuery.setQuery("consumer");
        response = solr.runQuery(solrQuery);
        assertNotNull(response);
        results = response.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());
        document = results.get(0);
        assertEquals(uri, document.getFieldValue(IndexationFieldsEnum.ID.getField()));
        assertEquals(datasetCreated.getIdentifier(), document.getFieldValue(IndexationFieldsEnum.DS_IDENTIFIER.getField()));
        assertEquals(ResourceTypeEnum.DSET.getType(), document.getFieldValue(IndexationFieldsEnum.TYPE.getField()));

        solrQuery.setQuery("price");
        response = solr.runQuery(solrQuery);
        assertNotNull(response);
        results = response.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());
        document = results.get(0);
        assertEquals(uri, document.getFieldValue(IndexationFieldsEnum.ID.getField()));
        assertEquals(datasetCreated.getIdentifier(), document.getFieldValue(IndexationFieldsEnum.DS_IDENTIFIER.getField()));
        assertEquals(ResourceTypeEnum.DSET.getType(), document.getFieldValue(IndexationFieldsEnum.TYPE.getField()));

        solrQuery.setQuery("sinresultados");
        response = solr.runQuery(solrQuery);
        assertNotNull(response);
        results = response.getResults();
        assertNotNull(results);
        assertEquals(0, results.size());
    }

    @Override
    @Test
    public void testIndexDatasetStemming() throws Exception {
        DatasetBasicDto datasetCreated = dsdService.retrieveDatasetPublished(serviceContext, DsdServiceMock.DATASET_1_PROVIDER_1);
        String uri = datasetCreated.getUri();
        idxManagerService.indexDatasetPublished(uri);

        SolrQuery solrQuery = new SolrQuery();
        solrQuery.setQuery("consumismo");
        QueryResponse response = solr.runQuery(solrQuery);
        assertNotNull(response);
        SolrDocumentList results = response.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());
        SolrDocument document = results.get(0);
        assertEquals(uri, document.getFieldValue(IndexationFieldsEnum.ID.getField()));
        assertEquals(datasetCreated.getIdentifier(), document.getFieldValue(IndexationFieldsEnum.DS_IDENTIFIER.getField()));
        assertEquals(ResourceTypeEnum.DSET.getType(), document.getFieldValue(IndexationFieldsEnum.TYPE.getField()));

        solrQuery = new SolrQuery();
        solrQuery.setQuery("consumption");
        response = solr.runQuery(solrQuery);
        assertNotNull(response);
        results = response.getResults();
        assertNotNull(results);
        assertEquals(0, results.size());
    }

    @Override
    @Test
    public void testDeleteIndexedDataset() throws Exception {
        DatasetBasicDto datasetCreated = dsdService.retrieveDatasetPublished(serviceContext, DsdServiceMock.DATASET_1_PROVIDER_1);
        String uri = datasetCreated.getUri();
        idxManagerService.indexDatasetPublished(uri);

        SolrQuery solrQuery = new SolrQuery();
        solrQuery.setQuery("consumo");
        QueryResponse response = solr.runQuery(solrQuery);
        assertNotNull(response);
        SolrDocumentList results = response.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());
        SolrDocument document = results.get(0);
        assertEquals(uri, document.getFieldValue(IndexationFieldsEnum.ID.getField()));
        assertEquals(datasetCreated.getIdentifier(), document.getFieldValue(IndexationFieldsEnum.DS_IDENTIFIER.getField()));
        assertEquals(ResourceTypeEnum.DSET.getType(), document.getFieldValue(IndexationFieldsEnum.TYPE.getField()));

        idxManagerService.removeDataset(uri);

        solrQuery = new SolrQuery();
        solrQuery.setQuery("consumo");
        response = solr.runQuery(solrQuery);
        assertNotNull(response);
        results = response.getResults();
        assertNotNull(results);
        assertEquals(0, results.size());
    }
    
    @Override
    @Test
    public void testReindexDataset() throws Exception {
        DatasetBasicDto datasetCreated = dsdService.retrieveDatasetPublished(serviceContext, DsdServiceMock.DATASET_1_PROVIDER_1);
        String uri = datasetCreated.getUri();
        idxManagerService.indexDatasetPublished(uri);

        SolrQuery solrQuery = new SolrQuery();
        solrQuery.setQuery("consumo");
        QueryResponse response = solr.runQuery(solrQuery);
        assertNotNull(response);
        SolrDocumentList results = response.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());
        SolrDocument document = results.get(0);
        assertEquals(uri, document.getFieldValue(IndexationFieldsEnum.ID.getField()));
        assertEquals(datasetCreated.getIdentifier(), document.getFieldValue(IndexationFieldsEnum.DS_IDENTIFIER.getField()));
        assertEquals(ResourceTypeEnum.DSET.getType(), document.getFieldValue(IndexationFieldsEnum.TYPE.getField()));

        idxManagerService.indexDatasetPublished(uri);

        solrQuery = new SolrQuery();
        solrQuery.setQuery("consumo");
        response = solr.runQuery(solrQuery);
        assertNotNull(response);
        results = response.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());
        document = results.get(0);
        assertEquals(uri, document.getFieldValue(IndexationFieldsEnum.ID.getField()));
        assertEquals(datasetCreated.getIdentifier(), document.getFieldValue(IndexationFieldsEnum.DS_IDENTIFIER.getField()));
        assertEquals(ResourceTypeEnum.DSET.getType(), document.getFieldValue(IndexationFieldsEnum.TYPE.getField()));
    }

    @Override
    @Test
    public void testIndexPublishedDatasets() throws Exception {
        idxManagerService.indexDatasetsPublished(true);

        SolrQuery solrQuery = new SolrQuery();
        solrQuery.setQuery("consumo");
        QueryResponse response = solr.runQuery(solrQuery);
        assertNotNull(response);
        SolrDocumentList results = response.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());
        SolrDocument document = results.get(0);
        assertEquals(DsdServiceMock.DATASET_1_PROVIDER_1, document.getFieldValue(IndexationFieldsEnum.ID.getField()));
        assertEquals(ResourceTypeEnum.DSET.getType(), document.getFieldValue(IndexationFieldsEnum.TYPE.getField()));

        solrQuery.setQuery("consumer");
        response = solr.runQuery(solrQuery);
        assertNotNull(response);
        results = response.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());
        document = results.get(0);
        assertEquals(DsdServiceMock.DATASET_1_PROVIDER_1, document.getFieldValue("id"));
        assertEquals(ResourceTypeEnum.DSET.getType(), document.getFieldValue(IndexationFieldsEnum.TYPE.getField()));

        solrQuery.setQuery("vivienda");
        response = solr.runQuery(solrQuery);
        assertNotNull(response);
        results = response.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());
        document = results.get(0);
        assertEquals(DsdServiceMock.DATASET_1_PROVIDER_4, document.getFieldValue("id"));
        assertEquals(ResourceTypeEnum.DSET.getType(), document.getFieldValue(IndexationFieldsEnum.TYPE.getField()));

        solrQuery.setQuery("housing");
        response = solr.runQuery(solrQuery);
        assertNotNull(response);
        results = response.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());
        document = results.get(0);
        assertEquals(DsdServiceMock.DATASET_1_PROVIDER_4, document.getFieldValue("id"));
        assertEquals(ResourceTypeEnum.DSET.getType(), document.getFieldValue(IndexationFieldsEnum.TYPE.getField()));

        solrQuery.setQuery("sinresultados");
        response = solr.runQuery(solrQuery);
        assertNotNull(response);
        results = response.getResults();
        assertNotNull(results);
        assertEquals(0, results.size());
    }

    @Override
    @Test
    public void testIndexProvider() throws Exception {
        ProviderDto provider = dsdService.retrieveProvider(serviceContext, DsdServiceMock.PROVIDER_1);
        String uri = provider.getUri();
        idxManagerService.indexProvider(uri);

        SolrQuery solrQuery = new SolrQuery();
        solrQuery.setQuery("Instituto");
        QueryResponse response = solr.runQuery(solrQuery);
        assertNotNull(response);
        SolrDocumentList results = response.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());
        SolrDocument document = results.get(0);
        assertEquals(uri, document.getFieldValue(IndexationFieldsEnum.ID.getField()));
        assertEquals(ResourceTypeEnum.PROV.getType(), document.getFieldValue(IndexationFieldsEnum.TYPE.getField()));

        solrQuery = new SolrQuery();
        solrQuery.setQuery("Estadística");
        response = solr.runQuery(solrQuery);
        assertNotNull(response);
        results = response.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());
        document = results.get(0);
        assertEquals(uri, document.getFieldValue(IndexationFieldsEnum.ID.getField()));
        assertEquals(ResourceTypeEnum.PROV.getType(), document.getFieldValue(IndexationFieldsEnum.TYPE.getField()));

        solrQuery.setQuery("sinresultados");
        response = solr.runQuery(solrQuery);
        assertNotNull(response);
        results = response.getResults();
        assertNotNull(results);
        assertEquals(0, results.size());
    }

    @Override
    @Test
    public void testDeleteIndexedProvider() throws Exception {
        ProviderDto provider = dsdService.retrieveProvider(serviceContext, DsdServiceMock.PROVIDER_1);
        String uri = provider.getUri();
        idxManagerService.indexProvider(uri);

        SolrQuery solrQuery = new SolrQuery();
        solrQuery.setQuery("Instituto");
        QueryResponse response = solr.runQuery(solrQuery);
        assertNotNull(response);
        SolrDocumentList results = response.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());
        SolrDocument document = results.get(0);
        assertEquals(uri, document.getFieldValue(IndexationFieldsEnum.ID.getField()));

        idxManagerService.removeProvider(uri);

        solrQuery.setQuery("Instituto");
        response = solr.runQuery(solrQuery);
        assertNotNull(response);
        results = response.getResults();
        assertNotNull(results);
        assertEquals(0, results.size());
    }

    @Override
    @Test
    public void testIndexProviders() throws Exception {
        idxManagerService.indexProviders(true);

        SolrQuery solrQuery = new SolrQuery();
        solrQuery.setQuery("Instituto");
        QueryResponse response = solr.runQuery(solrQuery);
        assertNotNull(response);
        SolrDocumentList results = response.getResults();
        assertNotNull(results);
        assertEquals(3, results.size());
        List<String> providersCase1 = new ArrayList<String>(Arrays.asList(new String[]{DsdServiceMock.PROVIDER_1, DsdServiceMock.PROVIDER_2, DsdServiceMock.PROVIDER_3}));
        for (int i = 0; i < results.size(); i++) {
            SolrDocument document = results.get(i);
            String uri = (String) document.getFieldValue(IndexationFieldsEnum.ID.getField());
            assertTrue(providersCase1.contains(uri));
            providersCase1.remove(uri);
        }
        assertEquals(0, providersCase1.size());

        solrQuery.setQuery("Provider");
        response = solr.runQuery(solrQuery);
        assertNotNull(response);
        results = response.getResults();
        assertNotNull(results);
        assertEquals(2, results.size());
        List<String> providersCase2 = new ArrayList<String>(Arrays.asList(new String[]{DsdServiceMock.PROVIDER_4, DsdServiceMock.PROVIDER_5}));
        for (int i = 0; i < results.size(); i++) {
            SolrDocument document = results.get(i);
            String uri = (String) document.getFieldValue(IndexationFieldsEnum.ID.getField());
            assertTrue(providersCase2.contains(uri));
            providersCase2.remove(uri);
        }
        assertEquals(0, providersCase2.size());

        solrQuery.setQuery("sinresultados");
        response = solr.runQuery(solrQuery);
        assertNotNull(response);
        results = response.getResults();
        assertNotNull(results);
        assertEquals(0, results.size());
    }

}
