package com.stat4you.idxmanager.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.apache.solr.common.SolrInputDocument;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.ibm.icu.util.Calendar;
import com.stat4you.common.Stat4YouConstants;
import com.stat4you.idxmanager.domain.DatasetBasicIdx;
import com.stat4you.idxmanager.domain.IndexationFieldsEnum;
import com.stat4you.idxmanager.domain.ResourceTypeEnum;
import com.stat4you.idxmanager.service.search.Facet;
import com.stat4you.idxmanager.service.search.FacetSet;
import com.stat4you.idxmanager.service.search.FilteredField;
import com.stat4you.idxmanager.service.search.ResultDocument;
import com.stat4you.idxmanager.service.search.SearchQuery;
import com.stat4you.idxmanager.service.search.SearchResult;
import com.stat4you.idxmanager.service.search.SearchService;
import com.stat4you.idxmanager.service.solr.SolR;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:/spring/mockito.xml", "classpath:/spring/idxmanager-applicationContext-test.xml"})
public class SearchServiceTest implements SearchServiceTestBase {

    @Autowired
    private SearchService searchService;

    @Autowired
    private SolR          solr;

    @BeforeClass
    public static void setUpClass() throws Exception {
        System.setProperty(Stat4YouConstants.PROP_DATA_URL, "./data/");
    }

    @Before
    public void before() throws Exception {
        solr.deleteAllAndCommit();
    }

    @Override
    @Test
    public void testSearchDataset() throws Exception {
        SolrInputDocument doc = new SolrInputDocument();
        String uri = UUID.randomUUID().toString();
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("es"), "nombre en Español");
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("en"), "name in English");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
        solr.insertDoc(doc);
        solr.commit();

        SearchQuery query = new SearchQuery();
        query.setUserQuery("nombre");
        SearchResult result = searchService.runQuery(query, 10);
        assertNotNull(result);
        List<ResultDocument> results = result.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());
        ResultDocument document = results.get(0);
        assertEquals(uri, document.getStringField(IndexationFieldsEnum.ID));
        assertEquals(ResourceTypeEnum.DSET.getType(), document.getStringField(IndexationFieldsEnum.TYPE));

        query = new SearchQuery();
        query.setUserQuery("name");
        result = searchService.runQuery(query, 10);
        assertNotNull(result);
        results = result.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());
        document = results.get(0);
        assertEquals(uri, document.getStringField(IndexationFieldsEnum.ID));
        assertEquals(ResourceTypeEnum.DSET.getType(), document.getStringField(IndexationFieldsEnum.TYPE));

        query = new SearchQuery();
        query.setUserQuery("not_exists");
        result = searchService.runQuery(query, 10);
        assertNotNull(result);
        results = result.getResults();
        assertNotNull(results);
        assertEquals(0, results.size());
    }

    @Override
    @Test
    public void testSearchProvider() throws Exception {
        SolrInputDocument doc = new SolrInputDocument();
        String uri = UUID.randomUUID().toString();
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.PROV_NAME.getField(), "istac");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.PROV.getType());
        solr.insertDoc(doc);
        solr.commit();

        SearchQuery query = new SearchQuery();
        query.setUserQuery("istac");
        SearchResult result = searchService.runQuery(query, 10);
        assertNotNull(result);
        List<ResultDocument> results = result.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());
        ResultDocument document = results.get(0);
        assertEquals(uri, document.getStringField(IndexationFieldsEnum.ID));
        assertEquals(ResourceTypeEnum.PROV.getType(), document.getStringField(IndexationFieldsEnum.TYPE));

        query = new SearchQuery();
        query.setUserQuery("not_exists");
        result = searchService.runQuery(query, 10);
        assertNotNull(result);
        results = result.getResults();
        assertNotNull(results);
        assertEquals(0, results.size());
    }

    @Override
    @Test
    public void testSearchFacetCategory() throws Exception {
        SolrInputDocument doc = new SolrInputDocument();
        String uri = UUID.randomUUID().toString();
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("es"), "nombre en Español");
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("en"), "name in English");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
        doc.addField(IndexationFieldsEnum.DS_CATEGORY.getField("es"), "CAT1 es");
        doc.addField(IndexationFieldsEnum.DS_CATEGORY.getField("en"), "CAT1 en");
        solr.insertDoc(doc);
        doc = new SolrInputDocument();
        uri = UUID.randomUUID().toString();
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("es"), "nombre 2 en Español");
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("en"), "name 2 in English");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
        doc.addField(IndexationFieldsEnum.DS_CATEGORY.getField("es"), "CAT2 es");
        doc.addField(IndexationFieldsEnum.DS_CATEGORY.getField("en"), "CAT2 en");
        solr.insertDoc(doc);
        doc = new SolrInputDocument();
        uri = UUID.randomUUID().toString();
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("es"), "nombre 3 en Español");
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("en"), "name 3 in English");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
        doc.addField(IndexationFieldsEnum.DS_CATEGORY.getField("es"), "CAT1 es");
        doc.addField(IndexationFieldsEnum.DS_CATEGORY.getField("en"), "CAT1 en");
        solr.insertDoc(doc);
        solr.commit();

        SearchQuery query = new SearchQuery();
        query.setUserQuery("nombre");
        query.setFaceted(true);
        SearchResult result = searchService.runQuery(query, 10);

        assertNotNull(result);
        List<ResultDocument> results = result.getResults();
        assertNotNull(results);
        assertEquals(3, results.size());

        Facet categoryFacet = result.getFacets().getFacetByField(IndexationFieldsEnum.FF_CATEGORY, "es");
        assertNotNull(categoryFacet);
        assertNotNull(categoryFacet.getConstraints());
        assertEquals(2, categoryFacet.getConstraints().size());

        assertEquals("CAT1 es", categoryFacet.getConstraints().get(0).getCode());
        assertEquals(2, categoryFacet.getConstraints().get(0).getCount());
        assertEquals("CAT2 es", categoryFacet.getConstraints().get(1).getCode());
        assertEquals(1, categoryFacet.getConstraints().get(1).getCount());

        // NUEVA BUSQUEDA usando un facet
        // Seleccionamos Cat2
        FilteredField ffield = new FilteredField(IndexationFieldsEnum.FF_CATEGORY, "es");
        ffield.addConstraint("CAT2 es");
        query.addFilteredField(ffield);

        result = searchService.runQuery(query, 10);

        assertNotNull(result);
        results = result.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());

        Facet catFacet = result.getFacets().getFacetByField(IndexationFieldsEnum.FF_CATEGORY, "es");
        assertNotNull(catFacet);
        assertNotNull(catFacet.getConstraints());
        assertEquals(1, catFacet.getConstraints().size());

        assertEquals("CAT2 es", catFacet.getConstraints().get(0).getCode());
        assertEquals(1, catFacet.getConstraints().get(0).getCount());
    }

    

    @Override
    @Test
    public void testSearchFacetMultiCategory() throws Exception {
        SolrInputDocument doc = new SolrInputDocument();
        String uri = UUID.randomUUID().toString();
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("es"), "nombre en Español");
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("en"), "name in English");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
        doc.addField(IndexationFieldsEnum.DS_CATEGORY.getField("es"), "CAT1 es");
        doc.addField(IndexationFieldsEnum.DS_CATEGORY.getField("es"), "CAT2 es");
        doc.addField(IndexationFieldsEnum.DS_CATEGORY.getField("es"), "CAT3 es");
        doc.addField(IndexationFieldsEnum.DS_CATEGORY.getField("en"), "CAT1 en");
        doc.addField(IndexationFieldsEnum.DS_CATEGORY.getField("en"), "CAT2 en");
        doc.addField(IndexationFieldsEnum.DS_CATEGORY.getField("en"), "CAT3 en");
        solr.insertDoc(doc);
        solr.commit();

        SearchQuery query = new SearchQuery();
        query.setUserQuery("nombre");
        query.setFaceted(true);
        SearchResult result = searchService.runQuery(query, 10);

        assertNotNull(result);
        List<ResultDocument> results = result.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());

        Facet categoryFacet = result.getFacets().getFacetByField(IndexationFieldsEnum.FF_CATEGORY, "es");
        assertNotNull(categoryFacet);
        assertNotNull(categoryFacet.getConstraints());
        assertEquals(3, categoryFacet.getConstraints().size());

        assertEquals("CAT1 es", categoryFacet.getConstraints().get(0).getCode());
        assertEquals(1, categoryFacet.getConstraints().get(0).getCount());
        assertEquals("CAT2 es", categoryFacet.getConstraints().get(1).getCode());
        assertEquals(1, categoryFacet.getConstraints().get(1).getCount());
        assertEquals("CAT3 es", categoryFacet.getConstraints().get(2).getCode());
        assertEquals(1, categoryFacet.getConstraints().get(2).getCount());
    }

    @Override
    @Test
    public void testSearchFacetSpatial() throws Exception {
        SolrInputDocument doc = new SolrInputDocument();
        String uri = UUID.randomUUID().toString();
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("es"), "nombre en Español");
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("en"), "name in English");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
        doc.addField(IndexationFieldsEnum.FF_SPATIAL_CODEDIMS.getField("es"), "TFE");
        doc.addField(IndexationFieldsEnum.FF_SPATIAL_CODEDIMS.getField("es"), "ESP");
        doc.addField(IndexationFieldsEnum.FF_SPATIAL_CODEDIMS.getField("es"), "FUE");
        doc.addField(IndexationFieldsEnum.FF_SPATIAL_CODEDIMS.getField("es"), "GC");
        doc.addField(IndexationFieldsEnum.FF_SPATIAL_CODEDIMS.getField("en"), "TFE");
        doc.addField(IndexationFieldsEnum.FF_SPATIAL_CODEDIMS.getField("en"), "SPA");
        doc.addField(IndexationFieldsEnum.FF_SPATIAL_CODEDIMS.getField("en"), "FUE");
        doc.addField(IndexationFieldsEnum.FF_SPATIAL_CODEDIMS.getField("en"), "GC");
        solr.insertDoc(doc);
        doc = new SolrInputDocument();
        uri = UUID.randomUUID().toString();
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("es"), "nombre 2 en Español");
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("en"), "name 2 in English");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
        doc.addField(IndexationFieldsEnum.FF_SPATIAL_CODEDIMS.getField("es"), "LG");
        doc.addField(IndexationFieldsEnum.FF_SPATIAL_CODEDIMS.getField("es"), "ESP");
        doc.addField(IndexationFieldsEnum.FF_SPATIAL_CODEDIMS.getField("es"), "LAN");
        doc.addField(IndexationFieldsEnum.FF_SPATIAL_CODEDIMS.getField("es"), "EH");
        doc.addField(IndexationFieldsEnum.FF_SPATIAL_CODEDIMS.getField("en"), "LG");
        doc.addField(IndexationFieldsEnum.FF_SPATIAL_CODEDIMS.getField("en"), "SPA");
        doc.addField(IndexationFieldsEnum.FF_SPATIAL_CODEDIMS.getField("en"), "LAN");
        doc.addField(IndexationFieldsEnum.FF_SPATIAL_CODEDIMS.getField("en"), "EH");
        solr.insertDoc(doc);
        doc = new SolrInputDocument();
        uri = UUID.randomUUID().toString();
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("es"), "nombre 3 en Español");
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("en"), "name 3 in English");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
        doc.addField(IndexationFieldsEnum.FF_SPATIAL_CODEDIMS.getField("es"), "ESP");
        doc.addField(IndexationFieldsEnum.FF_SPATIAL_CODEDIMS.getField("es"), "GC");
        doc.addField(IndexationFieldsEnum.FF_SPATIAL_CODEDIMS.getField("en"), "SPA");
        doc.addField(IndexationFieldsEnum.FF_SPATIAL_CODEDIMS.getField("en"), "GC");
        solr.insertDoc(doc);
        solr.commit();

        SearchQuery query = new SearchQuery();
        query.setUserQuery("nombre");
        query.setFaceted(true);
        SearchResult result = searchService.runQuery(query, 10);
        assertNotNull(result);
        List<ResultDocument> results = result.getResults();
        assertNotNull(results);
        assertEquals(3, results.size());

        Facet spatialFacet = result.getFacets().getFacetByField(IndexationFieldsEnum.FF_SPATIAL_CODEDIMS, "es");
        assertNotNull(spatialFacet);
        assertNotNull(spatialFacet.getConstraints());
        assertEquals(7, spatialFacet.getConstraints().size());

        assertEquals("ESP", spatialFacet.getConstraints().get(0).getCode());
        assertEquals(3, spatialFacet.getConstraints().get(0).getCount());
        assertEquals("GC", spatialFacet.getConstraints().get(1).getCode());
        assertEquals(2, spatialFacet.getConstraints().get(1).getCount());

        // NUEVA BUSQUEDA usando un facet
        // Seleccionamos GC
        FilteredField ffield = new FilteredField(IndexationFieldsEnum.FF_SPATIAL_CODEDIMS, "es");
        ffield.addConstraint("GC");
        query.addFilteredField(ffield);

        result = searchService.runQuery(query, 10);

        assertNotNull(result);
        results = result.getResults();
        assertNotNull(results);
        assertEquals(2, results.size());

        Facet spaFacet = result.getFacets().getFacetByField(IndexationFieldsEnum.FF_SPATIAL_CODEDIMS, "es");
        assertNotNull(spaFacet);
        assertNotNull(spaFacet.getConstraints());
        assertEquals(4, spaFacet.getConstraints().size());

        assertEquals("ESP", spaFacet.getConstraints().get(0).getCode());
        assertEquals(2, spaFacet.getConstraints().get(0).getCount());
        assertEquals("GC", spaFacet.getConstraints().get(1).getCode());
        assertEquals(2, spaFacet.getConstraints().get(1).getCount());

    }

    @Override
    @Test
    public void testSearchFacetYear() throws Exception {
        SolrInputDocument doc = new SolrInputDocument();
        String uri = UUID.randomUUID().toString();
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("es"), "nombre en Español");
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("en"), "name in English");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
        doc.addField(IndexationFieldsEnum.FF_TEMPORAL_YEARS.getField(), "2010");
        doc.addField(IndexationFieldsEnum.FF_TEMPORAL_YEARS.getField(), "2009");

        solr.insertDoc(doc);
        doc = new SolrInputDocument();
        uri = UUID.randomUUID().toString();
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("es"), "nombre 2 en Español");
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("en"), "name 2 in English");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
        doc.addField(IndexationFieldsEnum.FF_TEMPORAL_YEARS.getField(), "2008");
        doc.addField(IndexationFieldsEnum.FF_TEMPORAL_YEARS.getField(), "2009");
        solr.insertDoc(doc);
        doc = new SolrInputDocument();
        uri = UUID.randomUUID().toString();
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("es"), "nombre 3 en Español");
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("en"), "name 3 in English");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
        doc.addField(IndexationFieldsEnum.FF_TEMPORAL_YEARS.getField(), "2007");
        doc.addField(IndexationFieldsEnum.FF_TEMPORAL_YEARS.getField(), "2006");
        solr.insertDoc(doc);
        solr.commit();

        SearchQuery query = new SearchQuery();
        query.setUserQuery("nombre");
        query.setFaceted(true);
        SearchResult result = searchService.runQuery(query, 10);

        assertNotNull(result);
        List<ResultDocument> results = result.getResults();
        assertNotNull(results);
        assertEquals(3, results.size());

        Facet spatialFacet = result.getFacets().getFacetByField(IndexationFieldsEnum.FF_TEMPORAL_YEARS);
        assertNotNull(spatialFacet);
        assertNotNull(spatialFacet.getConstraints());
        assertEquals(5, spatialFacet.getConstraints().size());

        assertEquals("2009", spatialFacet.getConstraints().get(0).getCode());
        assertEquals(2, spatialFacet.getConstraints().get(0).getCount());
        assertEquals("2006", spatialFacet.getConstraints().get(1).getCode());
        assertEquals(1, spatialFacet.getConstraints().get(1).getCount());

        // NUEVA BUSQUEDA usando un facet
        // Seleccionamos GC
        FilteredField ffield = new FilteredField(IndexationFieldsEnum.FF_TEMPORAL_YEARS);
        ffield.addConstraint("2009");
        query.addFilteredField(ffield);

        result = searchService.runQuery(query, 10);

        assertNotNull(result);
        results = result.getResults();
        assertNotNull(results);
        assertEquals(2, results.size());

        Facet spaFacet = result.getFacets().getFacetByField(IndexationFieldsEnum.FF_TEMPORAL_YEARS);
        assertNotNull(spaFacet);
        assertNotNull(spaFacet.getConstraints());
        assertEquals(3, spaFacet.getConstraints().size());

        assertEquals("2009", spaFacet.getConstraints().get(0).getCode());
        assertEquals(2, spaFacet.getConstraints().get(0).getCount());
        assertEquals("2008", spaFacet.getConstraints().get(1).getCode());
        assertEquals(1, spaFacet.getConstraints().get(1).getCount());
        assertEquals("2010", spaFacet.getConstraints().get(2).getCode());
        assertEquals(1, spaFacet.getConstraints().get(2).getCount());

    }

    @Test
    public void testSearchFacetNoResult() throws Exception {
        SolrInputDocument doc = new SolrInputDocument();
        String uri = UUID.randomUUID().toString();
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("es"), "nombre en Español");
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("en"), "name in English");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
        doc.addField(IndexationFieldsEnum.DS_CATEGORY.getField("es"), "CAT1 es");
        doc.addField(IndexationFieldsEnum.DS_CATEGORY.getField("es"), "CAT2 es");
        doc.addField(IndexationFieldsEnum.DS_CATEGORY.getField("es"), "CAT3 es");
        doc.addField(IndexationFieldsEnum.DS_CATEGORY.getField("en"), "CAT1 en");
        doc.addField(IndexationFieldsEnum.DS_CATEGORY.getField("en"), "CAT2 en");
        doc.addField(IndexationFieldsEnum.DS_CATEGORY.getField("en"), "CAT3 en");
        solr.insertDoc(doc);
        solr.commit();

        SearchQuery query = new SearchQuery();
        query.setUserQuery("NOTFOUND");
        query.setFaceted(true);
        FilteredField ffield = new FilteredField(IndexationFieldsEnum.FF_CATEGORY, "es");
        ffield.addConstraint("CAT1 es");
        query.addFilteredField(ffield);
        SearchResult result = searchService.runQuery(query, 10);

        assertNotNull(result);
        List<ResultDocument> results = result.getResults();
        assertNotNull(results);
        assertEquals(0, results.size());

        Facet categoryFacet = result.getFacets().getFacetByField(IndexationFieldsEnum.FF_CATEGORY, "es");
        assertNotNull(categoryFacet);
        assertNotNull(categoryFacet.getConstraints());
        assertEquals(1, categoryFacet.getConstraints().size());

        assertEquals("CAT1 es", categoryFacet.getConstraints().get(0).getCode());
        assertEquals(0, categoryFacet.getConstraints().get(0).getCount());
    }

    @Test
    public void testSearchLocale() throws Exception {
        SolrInputDocument doc = new SolrInputDocument();
        String uri = UUID.randomUUID().toString();
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("es"), "nombre en Español");
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("en"), "name in English");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
        doc.addField(IndexationFieldsEnum.DS_CATEGORY.getField("es"), "CAT1 es");
        doc.addField(IndexationFieldsEnum.DS_CATEGORY.getField("es"), "CAT2 es");
        doc.addField(IndexationFieldsEnum.DS_CATEGORY.getField("es"), "CAT3 es");
        doc.addField(IndexationFieldsEnum.DS_CATEGORY.getField("en"), "CAT1 en");
        doc.addField(IndexationFieldsEnum.DS_CATEGORY.getField("en"), "CAT2 en");
        doc.addField(IndexationFieldsEnum.DS_CATEGORY.getField("en"), "CAT3 en");
        solr.insertDoc(doc);
        solr.commit();

        SearchQuery query = new SearchQuery();
        query.setUserQuery("nombre");
        query.setFaceted(true);
        query.setLocale("es");
        SearchResult result = searchService.runQuery(query, 10);

        assertNotNull(result);
        List<ResultDocument> results = result.getResults();
        assertNotNull(results);
        assertEquals(1, results.size());

        String nameEs = results.get(0).getStringField(IndexationFieldsEnum.DS_NAME, "es");
        assertEquals("nombre en Español", nameEs);

        String nameEn = results.get(0).getStringField(IndexationFieldsEnum.DS_NAME, "en");
        assertEquals(null, nameEn);

        FacetSet facetsSet = result.getFacets();
        assertNotNull(facetsSet);
        Facet categoryFacetEs = facetsSet.getFacetByField(IndexationFieldsEnum.FF_CATEGORY, "es");
        assertNotNull(categoryFacetEs);
        assertNotNull(categoryFacetEs.getConstraints());
        assertEquals(3, categoryFacetEs.getConstraints().size());

        assertEquals("CAT1 es", categoryFacetEs.getConstraints().get(0).getCode());
        assertEquals(1, categoryFacetEs.getConstraints().get(0).getCount());
        assertEquals("CAT2 es", categoryFacetEs.getConstraints().get(1).getCode());
        assertEquals(1, categoryFacetEs.getConstraints().get(1).getCount());
        assertEquals("CAT3 es", categoryFacetEs.getConstraints().get(2).getCode());
        assertEquals(1, categoryFacetEs.getConstraints().get(2).getCount());

        // NO english facet
        Facet categoryFacetEn = facetsSet.getFacetByField(IndexationFieldsEnum.FF_CATEGORY, "en");
        assertNull(categoryFacetEn);
    }
    
    @Test
    public void testFindLastPublishedDatasets() throws Exception {
        SolrInputDocument doc = new SolrInputDocument();
        String uri = "1";
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("es"), "nombre en Español");
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("en"), "name in English");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
        doc.addField(IndexationFieldsEnum.DS_PROV_PUB_DATE.getField(), buildDate(2012, 1, 5));
        solr.insertDoc(doc);
        doc = new SolrInputDocument();
        uri = "2";
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("es"), "nombre 2 en Español");
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("en"), "name 2 in English");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
        doc.addField(IndexationFieldsEnum.DS_PROV_PUB_DATE.getField(), buildDate(2012, 1, 10));
        solr.insertDoc(doc);
        doc = new SolrInputDocument();
        uri = "3";
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("es"), "nombre 3 en Español");
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("en"), "name 3 in English");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
        doc.addField(IndexationFieldsEnum.DS_PROV_PUB_DATE.getField(), buildDate(2012, 1, 15));
        solr.insertDoc(doc);
        solr.commit();

        List<DatasetBasicIdx> datasets = searchService.findLastPublishedDatasets(10);
        assertNotNull(datasets);
        assertEquals(3, datasets.size());
        
        assertEquals("3",datasets.get(0).getUri());
        assertEquals("2",datasets.get(1).getUri());
        assertEquals("1",datasets.get(2).getUri());
    }
    
    @Test
    public void testFindLastPublishedDatasetsWithLimit() throws Exception {
        SolrInputDocument doc = new SolrInputDocument();
        String uri = "1";
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("es"), "nombre en Español");
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("en"), "name in English");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
        doc.addField(IndexationFieldsEnum.DS_PROV_PUB_DATE.getField(), buildDate(2012, 1, 5));
        solr.insertDoc(doc);
        doc = new SolrInputDocument();
        uri = "2";
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("es"), "nombre 2 en Español");
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("en"), "name 2 in English");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
        doc.addField(IndexationFieldsEnum.DS_PROV_PUB_DATE.getField(), buildDate(2012, 1, 10));
        solr.insertDoc(doc);
        doc = new SolrInputDocument();
        uri = "3";
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("es"), "nombre 3 en Español");
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("en"), "name 3 in English");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
        doc.addField(IndexationFieldsEnum.DS_PROV_PUB_DATE.getField(), buildDate(2012, 1, 15));
        solr.insertDoc(doc);
        solr.commit();

        List<DatasetBasicIdx> datasets = searchService.findLastPublishedDatasets(2);
        assertNotNull(datasets);
        assertEquals(2, datasets.size());
        
        assertEquals("3",datasets.get(0).getUri());
        assertEquals("2",datasets.get(1).getUri());
    }
    
    @Test
    public void testFindLastPublishedDatasetsByProvider() throws Exception {
        SolrInputDocument doc = new SolrInputDocument();
        String uri = "1";
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.DS_IDENTIFIER.getField(), "DS"+uri);
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("en"), "name in English");
        doc.addField(IndexationFieldsEnum.DS_PROV_ACRONYM.getField(), "INE");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
        doc.addField(IndexationFieldsEnum.DS_PROV_PUB_DATE.getField(), buildDate(2012, 1, 5));
        solr.insertDoc(doc);
        doc = new SolrInputDocument();
        uri = "2";
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.DS_IDENTIFIER.getField(), "DS"+uri);
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("en"), "name 2 in English");
        doc.addField(IndexationFieldsEnum.DS_PROV_ACRONYM.getField(), "INE");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
        doc.addField(IndexationFieldsEnum.DS_PROV_PUB_DATE.getField(), buildDate(2012, 1, 10));
        solr.insertDoc(doc);
        doc = new SolrInputDocument();
        uri = "3";
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.DS_IDENTIFIER.getField(), "DS"+uri);
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("en"), "name 3 in English");
        doc.addField(IndexationFieldsEnum.DS_PROV_ACRONYM.getField(), "ISTAC");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
        doc.addField(IndexationFieldsEnum.DS_PROV_PUB_DATE.getField(), buildDate(2012, 1, 15));
        solr.insertDoc(doc);
        solr.commit();
        doc = new SolrInputDocument();
        uri = "4";
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.DS_IDENTIFIER.getField(), "DS"+uri);
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("en"), "name 4 in English");
        doc.addField(IndexationFieldsEnum.DS_PROV_ACRONYM.getField(), "ISTAC");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
        doc.addField(IndexationFieldsEnum.DS_PROV_PUB_DATE.getField(), buildDate(2012, 1, 10));
        solr.insertDoc(doc);
        solr.commit();
        doc = new SolrInputDocument();
        uri = "5";
        doc.addField(IndexationFieldsEnum.ID.getField(), uri);
        doc.addField(IndexationFieldsEnum.DS_IDENTIFIER.getField(), "DS"+uri);
        doc.addField(IndexationFieldsEnum.DS_NAME.getField("en"), "name 5 in English");
        doc.addField(IndexationFieldsEnum.DS_PROV_ACRONYM.getField(), "ISTAC");
        doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
        doc.addField(IndexationFieldsEnum.DS_PROV_PUB_DATE.getField(), buildDate(2012, 1, 20));
        solr.insertDoc(doc);
        solr.commit();

        List<DatasetBasicIdx> datasetsINE = searchService.findLastPublishedDatasetsByProvider("INE",10);
        assertNotNull(datasetsINE);
        assertEquals(2, datasetsINE.size());
        
        assertEquals("2",datasetsINE.get(0).getUri());
        assertEquals("DS2",datasetsINE.get(0).getIdentifier());
        assertEquals("1",datasetsINE.get(1).getUri());
        assertEquals("DS1",datasetsINE.get(1).getIdentifier());
        
        List<DatasetBasicIdx> datasetsISTAC = searchService.findLastPublishedDatasetsByProvider("ISTAC",2);
        assertNotNull(datasetsISTAC);
        assertEquals(2, datasetsISTAC.size());
        
        assertEquals("5",datasetsISTAC.get(0).getUri());
        assertEquals("DS5",datasetsISTAC.get(0).getIdentifier());
        assertEquals("3",datasetsISTAC.get(1).getUri());
        assertEquals("DS3",datasetsISTAC.get(1).getIdentifier());
    }
    
    private Date buildDate(int year, int month, int day) {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.YEAR, year);
        cal.set(Calendar.MONTH, month);
        cal.set(Calendar.DAY_OF_MONTH, day);
        cal.set(Calendar.MILLISECONDS_IN_DAY, 0);
        return cal.getTime();
    }

}
