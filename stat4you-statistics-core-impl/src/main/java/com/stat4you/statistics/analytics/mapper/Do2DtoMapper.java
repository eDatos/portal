package com.stat4you.statistics.analytics.mapper;

import com.stat4you.statistics.analytics.domain.DatasetMostVisitedEntity;
import com.stat4you.statistics.analytics.dto.DatasetMostVisitedDto;

public interface Do2DtoMapper {

	public DatasetMostVisitedDto datasetMostVisitedDtoDoToDto(DatasetMostVisitedEntity source);
}
