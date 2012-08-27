package com.stat4you.statistics.dsd.mapper;

import com.stat4you.statistics.dsd.domain.AttributeDefinitionEntity;
import com.stat4you.statistics.dsd.domain.CodeDimensionEntity;
import com.stat4you.statistics.dsd.domain.DatasetVersionEntity;
import com.stat4you.statistics.dsd.domain.DimensionEntity;
import com.stat4you.statistics.dsd.domain.PrimaryMeasureEntity;
import com.stat4you.statistics.dsd.domain.ProviderEntity;
import com.stat4you.statistics.dsd.dto.AttributeDefinitionDto;
import com.stat4you.statistics.dsd.dto.CodeDimensionDto;
import com.stat4you.statistics.dsd.dto.DatasetBasicDto;
import com.stat4you.statistics.dsd.dto.DatasetDto;
import com.stat4you.statistics.dsd.dto.DimensionBasicDto;
import com.stat4you.statistics.dsd.dto.DimensionDto;
import com.stat4you.statistics.dsd.dto.PrimaryMeasureDto;
import com.stat4you.statistics.dsd.dto.ProviderDto;

public interface Do2DtoMapper {

	public ProviderDto providerDoToDto(ProviderEntity providerEntity);
	public DatasetBasicDto datasetVersionDoToBasicDto(DatasetVersionEntity datasetEntity);
	public DatasetDto datasetVersionDoToDto(DatasetVersionEntity datasetEntity);
	public DimensionDto dimensionDoToDto(DimensionEntity dimensionEntity);
	public DimensionBasicDto dimensionDoToBasicDto(DimensionEntity dimensionEntity);
	public CodeDimensionDto codeDimensionDoToDto(CodeDimensionEntity codeDimensionEntity);
	public PrimaryMeasureDto primaryMeasureDoToDto(PrimaryMeasureEntity primaryMeasureEntity);
    public AttributeDefinitionDto attributeDefinitionDoToDto(AttributeDefinitionEntity attributeDefinitionEntity);
}
