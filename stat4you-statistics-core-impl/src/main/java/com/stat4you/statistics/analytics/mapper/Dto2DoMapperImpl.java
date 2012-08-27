package com.stat4you.statistics.analytics.mapper;

import org.joda.time.DateTime;

import com.stat4you.statistics.analytics.domain.DatasetVisitedEntity;
import com.stat4you.statistics.analytics.dto.DatasetVisitedDto;

/**
 * IMPORTANT!
 * Do not use Dozer because can copy non modifiable attributes from Dto to Do
 * by "update" method. Example: createdBy, removedDate, state
 * publishingDate... These attributes must be modified by
 * specific operation.
 */
public class Dto2DoMapperImpl implements Dto2DoMapper {
    
	public DatasetVisitedEntity datasetVisitedDtoToDo(DatasetVisitedDto source) {
	    DatasetVisitedEntity target = new DatasetVisitedEntity();
	    target.setProviderAcronym(source.getProviderAcronym());
	    target.setDatasetIdentifier(source.getDatasetIdentifier());
	    target.setUser(source.getUser());
	    target.setIp(source.getIp());
	    target.setDate(new DateTime());
		return target;
	}
}