package com.stat4you.statistics.analytics.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.apache.commons.lang.time.DateUtils;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.joda.time.DateTime;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.stat4you.common.test.Stat4YouBaseTests;
import com.stat4you.statistics.analytics.domain.DatasetVisitedEntity;
import com.stat4you.statistics.analytics.domain.DatasetVisitedRepository;
import com.stat4you.statistics.analytics.dto.DatasetMostVisitedDto;
import com.stat4you.statistics.analytics.dto.DatasetVisitedDto;
import com.stat4you.statistics.dsd.domain.DsdExceptionCodeEnum;

/**
 * AnalyticsService Tests
 * Spring based transactional test with DbUnit support.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring/mockito/data-service-mockito.xml", "classpath:spring/statistics-applicationContext-test.xml"})
public class AnalyticsServiceTest extends Stat4YouBaseTests implements AnalyticsServiceTestBase {

    @Autowired
    protected AnalyticsService analyticsService;
    
    @Autowired
    protected DatasetVisitedRepository datasetVisitedRepository;
    
    @Test
    public void testAddDatasetVisited() throws Exception {

        DatasetVisitedDto datasetVisitedDto = new DatasetVisitedDto();
        datasetVisitedDto.setProviderAcronym("A1234");
        datasetVisitedDto.setDatasetIdentifier("id" + UUID.randomUUID().toString().replace("-", ""));
        datasetVisitedDto.setUser("user1");
        datasetVisitedDto.setIp("192.168.1.xx");

        // Create
        analyticsService.addDatasetVisited(getServiceContext(), datasetVisitedDto);

        // Validate
        List<DatasetVisitedEntity> datasetVisitedEntities = datasetVisitedRepository.findAll();
        DatasetVisitedEntity datasetVisitedEntityAdded = null;
        for (DatasetVisitedEntity datasetVisitedEntity : datasetVisitedEntities) {
            if (datasetVisitedEntity.getDatasetIdentifier().equals(datasetVisitedDto.getDatasetIdentifier())) {
                datasetVisitedEntityAdded = datasetVisitedEntity;
            }
        }
        assertNotNull(datasetVisitedEntityAdded);
        assertEquals(datasetVisitedDto.getDatasetIdentifier(), datasetVisitedEntityAdded.getDatasetIdentifier());
        assertEquals(datasetVisitedDto.getProviderAcronym(), datasetVisitedEntityAdded.getProviderAcronym());
        assertEquals(datasetVisitedDto.getUser(), datasetVisitedEntityAdded.getUser());
        assertEquals(datasetVisitedDto.getIp(), datasetVisitedEntityAdded.getIp());
        assertTrue(DateUtils.isSameDay(new DateTime().toDate(), datasetVisitedEntityAdded.getDate().toDate()));
    }

    @Test
    public void testAddDatasetVisitedErrorProviderRequired() throws Exception {

        DatasetVisitedDto datasetVisitedDto = new DatasetVisitedDto();
        datasetVisitedDto.setProviderAcronym(null);
        try {
            analyticsService.addDatasetVisited(getServiceContext(), datasetVisitedDto);
            fail("provider required");
        } catch (ApplicationException e) {
            assertEquals(DsdExceptionCodeEnum.REQUIRED_ATTRIBUTE.getName(), e.getErrorCode());
            assertTrue(e.getMessage().contains("providerAcronym"));
        }
    }

    @Test
    public void testRetrieveDatasetsMostVisited() throws Exception {
        
        // Retrieve all
        List<DatasetMostVisitedDto> datasetsMostVisitedDtos = analyticsService.retrieveDatasetsMostVisited(getServiceContext());
        
        // Validate
        assertEquals(9, datasetsMostVisitedDtos.size());
        assertEquals("INE", datasetsMostVisitedDtos.get(0).getProviderAcronym());
        assertEquals("TURISTAS_POR_ISLAS", datasetsMostVisitedDtos.get(0).getDatasetIdentifier());
        assertEquals("INE", datasetsMostVisitedDtos.get(1).getProviderAcronym());
        assertEquals("INDICE_PRECIOS_SECTOR_SERVICIOS_SECTORES_INDICE_PR_2", datasetsMostVisitedDtos.get(1).getDatasetIdentifier());
        assertEquals("INE", datasetsMostVisitedDtos.get(2).getProviderAcronym());
        assertEquals("LOCALES_PROVINCIA_ACTIVIDAD_PRINCIPAL_DIVISIONES_C", datasetsMostVisitedDtos.get(2).getDatasetIdentifier());
        assertEquals("ISTAC", datasetsMostVisitedDtos.get(3).getProviderAcronym());
        assertEquals("SUPERFICIE_CONSTRUIR_DESTINOS_COMUNIDADES_AUTONOMA", datasetsMostVisitedDtos.get(3).getDatasetIdentifier());
        assertEquals("ISTAC", datasetsMostVisitedDtos.get(4).getProviderAcronym());
        assertEquals("NUMERO_EDIFICIOS_TIPOS_OBRA_COMUNIDADES_AUTONOMAS_", datasetsMostVisitedDtos.get(4).getDatasetIdentifier());
        assertEquals("ISTAC", datasetsMostVisitedDtos.get(5).getProviderAcronym());
        assertEquals("NUMERO_VIVIENDAS_TIPOS_OBRA_COMUNIDADES_AUTONOMAS_", datasetsMostVisitedDtos.get(5).getDatasetIdentifier());
        assertEquals("IBESTAT", datasetsMostVisitedDtos.get(6).getProviderAcronym());
        assertEquals("LICENCIAS_OBRA_SUPERFICIE_CONSTRUIR_DESTINO_DESDE_", datasetsMostVisitedDtos.get(6).getDatasetIdentifier());
        assertEquals("IBESTAT", datasetsMostVisitedDtos.get(7).getProviderAcronym());
        assertEquals("LICENCIAS_OBRA_NUMERO_EDIFICIOS_TIPO_OBRA_DESDE_01", datasetsMostVisitedDtos.get(7).getDatasetIdentifier());
        assertEquals("IBESTAT", datasetsMostVisitedDtos.get(8).getProviderAcronym());
        assertEquals("LICENCIAS_OBRA_NUMERO_VIVIENDAS_TIPO_OBRA_DESDE_01", datasetsMostVisitedDtos.get(8).getDatasetIdentifier());
    }

    @Override
    protected String getDataSetFile() {
        return "dbunit/AnalyticsServiceTest.xml";
    }

    @Override
    protected List<String> getTablesToRemoveContent() {
        List<String> tableNames = new ArrayList<String>();
        tableNames.add("TBL_DATASETS_VISITED");
        tableNames.add("TBL_DATASETS_MOST_VISITED");
        tableNames.add("TBL_DATASETS_MOST_VISITED_TMP");
        return tableNames;
    }
}
