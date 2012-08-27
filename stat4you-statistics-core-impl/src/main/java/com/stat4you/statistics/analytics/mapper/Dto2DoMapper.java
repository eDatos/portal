package com.stat4you.statistics.analytics.mapper;

import com.stat4you.statistics.analytics.domain.DatasetVisitedEntity;
import com.stat4you.statistics.analytics.dto.DatasetVisitedDto;

public interface Dto2DoMapper {
	
	public DatasetVisitedEntity datasetVisitedDtoToDo(DatasetVisitedDto source);
}
