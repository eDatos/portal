package com.stat4you.statistics.analytics.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.springframework.stereotype.Service;

import com.stat4you.statistics.analytics.domain.DatasetMostVisitedEntity;
import com.stat4you.statistics.analytics.domain.DatasetVisitedEntity;
import com.stat4you.statistics.analytics.dto.DatasetMostVisitedDto;
import com.stat4you.statistics.analytics.dto.DatasetVisitedDto;
import com.stat4you.statistics.analytics.mapper.Do2DtoMapper;
import com.stat4you.statistics.analytics.mapper.Dto2DoMapper;
import com.stat4you.statistics.analytics.service.util.InvocationValidator;

/**
 * Implementation of AnalyticsService.
 */
@Service("analyticsService")
public class AnalyticsServiceImpl extends AnalyticsServiceImplBase {

    @Resource(name = "dto2DoMapperAnalytics")
    private Dto2DoMapper dto2DoMapper;

    @Resource(name = "do2DtoMapperAnalytics")
    private Do2DtoMapper do2DtoMapper;

    public AnalyticsServiceImpl() {
    }

    @Override
    public void addDatasetVisited(ServiceContext ctx, DatasetVisitedDto datasetVisitedDto) throws ApplicationException {

        // Validation
        InvocationValidator.validateAddDatasetVisited(datasetVisitedDto);

        // Transform
        DatasetVisitedEntity datasetVisitedEntity = dto2DoMapper.datasetVisitedDtoToDo(datasetVisitedDto);

        // Create
        getDatasetVisitedRepository().save(datasetVisitedEntity);

    }

    @Override
    public List<DatasetMostVisitedDto> retrieveDatasetsMostVisited(ServiceContext ctx) throws ApplicationException {

        // Validation
        InvocationValidator.validateRetrieveDatasetsMostVisited();

        // Retrieve
        List<DatasetMostVisitedEntity> datasetMostVisitedEntities = getDatasetMostVisitedRepository().findAll();

        // Transform
        List<DatasetMostVisitedDto> datasetMostVisitedDtos = new ArrayList<DatasetMostVisitedDto>();
        for (DatasetMostVisitedEntity datasetMostVisitedEntity : datasetMostVisitedEntities) {
            datasetMostVisitedDtos.add(do2DtoMapper.datasetMostVisitedDtoDoToDto(datasetMostVisitedEntity));
        }
        return datasetMostVisitedDtos;
    }
}
