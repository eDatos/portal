package com.stat4you.statistics.data.service.impl;

import java.util.List;
import java.util.Map;

import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.arte.statistic.dataset.repository.dto.AttributeDto;
import com.arte.statistic.dataset.repository.dto.ConditionDimensionDto;
import com.arte.statistic.dataset.repository.dto.DatasetRepositoryDto;
import com.arte.statistic.dataset.repository.dto.ObservationDto;
import com.arte.statistic.dataset.repository.dto.ObservationExtendedDto;
import com.arte.statistic.dataset.repository.service.DatasetRepositoriesServiceFacade;
import com.stat4you.statistics.data.service.impl.DataServiceImplBase;

/**
 * Implementation of DataService.
 */
@Service("dataService")
public class DataServiceImpl extends DataServiceImplBase {

    @Autowired
    private DatasetRepositoriesServiceFacade datasetRepositoriesServiceFacade;

    public DataServiceImpl() {
    }

    @Override
    public String createDatasetRepository(ServiceContext ctx, DatasetRepositoryDto datasetRepositoryDto) throws ApplicationException {
        datasetRepositoryDto = datasetRepositoriesServiceFacade.createDatasetRepository(datasetRepositoryDto);
        return datasetRepositoryDto.getDatasetId();
    }

    @Override
    public void deleteDatasetRepository(ServiceContext ctx, String datasetUri) throws ApplicationException {
        datasetRepositoriesServiceFacade.deleteDatasetRepository(datasetUri);
    }

    @Override
    public void createObservationsExtended(ServiceContext ctx, String datasetUri, List<ObservationExtendedDto> observationsExtended) throws ApplicationException {
        datasetRepositoriesServiceFacade.createObservationsExtended(datasetUri, observationsExtended);
    }

    @Override
    public void createAttributes(ServiceContext ctx, String datasetUri, List<AttributeDto> attributes) throws ApplicationException {
        datasetRepositoriesServiceFacade.createAttributes(datasetUri, attributes);
    }

    @Override
    public List<AttributeDto> findAttributes(ServiceContext ctx, String datasetUri) throws ApplicationException {
        return datasetRepositoriesServiceFacade.findAttributes(datasetUri);
    }

    @Override
    public Map<String, ObservationDto> findObservationsByDimensions(ServiceContext ctx, String datasetUri, List<ConditionDimensionDto> conditionsDimensions) throws ApplicationException {
        return datasetRepositoriesServiceFacade.findObservationsByDimensions(datasetUri, conditionsDimensions);
    }

    @Override
    public Map<String, ObservationExtendedDto> findObservationsExtendedByDimensions(ServiceContext ctx, String datasetUri, List<ConditionDimensionDto> conditionsDimensions) throws ApplicationException {
        return datasetRepositoriesServiceFacade.findObservationsExtendedByDimensions(datasetUri, conditionsDimensions);
    }
}
