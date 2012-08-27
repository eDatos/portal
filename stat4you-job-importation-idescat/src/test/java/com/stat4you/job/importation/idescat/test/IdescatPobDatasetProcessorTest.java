package com.stat4you.job.importation.idescat.test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.http.localserver.LocalTestServer;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.arte.statistic.dataset.repository.dto.ObservationExtendedDto;
import com.stat4you.job.importation.idescat.processor.IdescatPobDatasetProcessor;
import com.stat4you.job.importation.idescat.test.http.IdescatHttpRequestHandler;
import com.stat4you.job.importation.idescat.test.http.LocalHttpServerSingleton;
import com.stat4you.statistics.dsd.domain.DimensionTypeEnum;
import com.stat4you.statistics.dsd.dto.CodeDimensionDto;
import com.stat4you.statistics.dsd.dto.DatasetDto;
import com.stat4you.statistics.dsd.dto.DimensionDto;

public class IdescatPobDatasetProcessorTest {

    private static Logger              LOG                        = LoggerFactory.getLogger(IdescatPobDatasetProcessorTest.class);

    private IdescatPobDatasetProcessor idescatPobDatasetProcessor = null;

    @Before
    public void setUpTest() throws Exception {
        LocalTestServer localHttpServer = LocalHttpServerSingleton.getLocalHttpServer();
        localHttpServer.register("/pob/v1/*", new IdescatHttpRequestHandler());
        localHttpServer.start();
        String feedUrl = "http://" + localHttpServer.getServiceAddress().getHostName() + ":" + localHttpServer.getServiceAddress().getPort() + "/pob/v1/cerca.xml";
        String providerUri = "PROVIDER_URI";
        idescatPobDatasetProcessor = new IdescatPobDatasetProcessor(feedUrl, providerUri);
        
        LOG.info("Started Http Server in: {}", localHttpServer.getServiceAddress());
    }

    @After
    public void tearDownTest() throws Exception {
        LocalHttpServerSingleton.getLocalHttpServer().stop();        
        LocalHttpServerSingleton.clearLocalHttpServer();
        
        LOG.info("Stoped Http Server");
    }

    @Test
    public void processDatasetAndObservations() throws Exception {

        IdescatPobDatasetProcessor.IdescatPobDatasetCallback callbackDataset = new IdescatPobDatasetProcessor.IdescatPobDatasetCallback();
        IdescatPobDatasetProcessor.IdescatPobObservationExtendedDtoCallback observationCallback = new IdescatPobDatasetProcessor.IdescatPobObservationExtendedDtoCallback();
        IdescatPobDatasetProcessor.IdescatPobAttributeDtoCallback attributesCallback = new IdescatPobDatasetProcessor.IdescatPobAttributeDtoCallback();

        // DATASET
        idescatPobDatasetProcessor.processDataset(callbackDataset);

        DatasetDto datasetDto = callbackDataset.getDataset();
        assertEquals(3, datasetDto.getTitle().getTexts().size());
        assertEquals(4, datasetDto.getDimensions().size());
        assertEquals(IdescatPobDatasetProcessor.DIM_SEX, datasetDto.getDimensions().get(0).getIdentifier());
        assertEquals(3, datasetDto.getDimensions().get(0).getCodes().size());
        assertEquals(IdescatPobDatasetProcessor.DIM_TIME_PERIOD, datasetDto.getDimensions().get(1).getIdentifier());
        assertEquals(DimensionTypeEnum.TIME_DIMENSION, datasetDto.getDimensions().get(1).getType());
        assertEquals(1, datasetDto.getDimensions().get(1).getCodes().size());
        assertEquals(IdescatPobDatasetProcessor.DIM_FREQ, datasetDto.getDimensions().get(2).getIdentifier());
        assertEquals(1, datasetDto.getDimensions().get(2).getCodes().size());
        assertEquals(IdescatPobDatasetProcessor.DIM_AREA, datasetDto.getDimensions().get(3).getIdentifier());
        assertEquals(DimensionTypeEnum.GEOGRAPHIC_DIMENSION, datasetDto.getDimensions().get(3).getType());
        assertEquals(61, datasetDto.getDimensions().get(3).getCodes().size());

        for (DimensionDto dimension : datasetDto.getDimensions()) {
            Set<String> codes = new HashSet<String>();
            for (CodeDimensionDto codeDimensionDto : dimension.getCodes()) {
                assertFalse(codeDimensionDto.getIdentifier() + " + must not be already included", codes.contains(codeDimensionDto.getIdentifier()));
                codes.add(codeDimensionDto.getIdentifier());
            }
        }
        
        assertEquals(3, datasetDto.getAttributeDefinitions().size());

        // OBSERVATIONS
        idescatPobDatasetProcessor.processObservations(observationCallback);
        
        List<ObservationExtendedDto> observations = observationCallback.getObservationsExtendeds();
        assertEquals(183, observations.size());
        
        List<String> dims = Arrays.asList(IdescatPobDatasetProcessor.DIM_SEX,
                                          IdescatPobDatasetProcessor.DIM_AREA,
                                          IdescatPobDatasetProcessor.DIM_FREQ,
                                          IdescatPobDatasetProcessor.DIM_TIME_PERIOD);

        for (ObservationExtendedDto observation : observations) {
            assertNotNull(observation.getPrimaryMeasure());
            assertEquals(4, observation.getCodesDimension().size());

            // CODE DIMENSION
            Set<String> dimsCodes = new HashSet<String>();
            for (com.arte.statistic.dataset.repository.dto.CodeDimensionDto codeDimensionDto : observation.getCodesDimension()) {
                assertTrue(dims.contains(codeDimensionDto.getDimensionId()));
                assertFalse(codeDimensionDto.getDimensionId() + " + must not be already included", dimsCodes.contains(codeDimensionDto.getDimensionId()));
                assertNotNull(codeDimensionDto.getCodeDimensionId());
                
                dimsCodes.add(codeDimensionDto.getDimensionId());
                
            }
            
            // OBSERVATION ATTRIBUTES
            assertEquals(1, observation.getAttributes().size());
        }
        
        
        // ATTRIBUTES
        idescatPobDatasetProcessor.processAttributes(attributesCallback);
        
        assertEquals(2, attributesCallback.getAttributes().size());

    }
}
