package com.stat4you.statistics.analytics.mapper;

import com.stat4you.statistics.analytics.domain.DatasetMostVisitedEntity;
import com.stat4you.statistics.analytics.dto.DatasetMostVisitedDto;

/**
 * IMPORTANT!
 * Do not use Dozer because can copy non modifiable attributes from Dto to Do
 * by "update" method. Example: createdBy, removedDate, state
 * publishingDate... These attributes must be modified by
 * specific operation.
 */
public class Do2DtoMapperImpl implements Do2DtoMapper {

    @Override
    public DatasetMostVisitedDto datasetMostVisitedDtoDoToDto(DatasetMostVisitedEntity source) {
        DatasetMostVisitedDto target = new DatasetMostVisitedDto();
        target.setProviderAcronym(source.getProviderAcronym());
        target.setDatasetIdentifier(source.getDatasetIdentifier());
        return target;
    }	
}