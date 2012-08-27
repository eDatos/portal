package com.stat4you.statistics.dsd.mapper;

import org.fornax.cartridges.sculptor.framework.domain.PagedResult;

import com.stat4you.common.criteria.Stat4YouCriteriaResult;
import com.stat4you.statistics.dsd.domain.DatasetVersionEntity;
import com.stat4you.statistics.dsd.dto.DatasetBasicDto;

public interface SculptorCriteria2Stat4YouCriteriaMapper {

    Stat4YouCriteriaResult<DatasetBasicDto> pageResultToStat4YouCriteriaResultDatasetBasic(PagedResult<DatasetVersionEntity> source, Integer pageSize);
}
