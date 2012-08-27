package com.stat4you.statistics.dsd.mapper;

import java.util.ArrayList;

import org.fornax.cartridges.sculptor.framework.domain.PagedResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.stat4you.common.criteria.Stat4YouCriteriaResult;
import com.stat4you.common.criteria.mapper.SculptorCriteria2Stat4YouCriteria;
import com.stat4you.statistics.dsd.domain.DatasetVersionEntity;
import com.stat4you.statistics.dsd.dto.DatasetBasicDto;

@Component
public class SculptorCriteria2Stat4YouCriteriaMapperImpl implements SculptorCriteria2Stat4YouCriteriaMapper {

    @Autowired
    private Do2DtoMapper do2DtoMapper;

    @Override
    public Stat4YouCriteriaResult<DatasetBasicDto> pageResultToStat4YouCriteriaResultDatasetBasic(PagedResult<DatasetVersionEntity> source, Integer pageSize) {
        Stat4YouCriteriaResult<DatasetBasicDto> target = new Stat4YouCriteriaResult<DatasetBasicDto>();
        target.setPaginatorResult(SculptorCriteria2Stat4YouCriteria.sculptorResultToStat4YouCriteriaResult(source, pageSize));
        if (source.getValues() != null) {
            target.setResults(new ArrayList<DatasetBasicDto>());
            for (DatasetVersionEntity datasetVersion : source.getValues()) {
                target.getResults().add(do2DtoMapper.datasetVersionDoToBasicDto(datasetVersion));
            }
        }
        return target;
    }
}
