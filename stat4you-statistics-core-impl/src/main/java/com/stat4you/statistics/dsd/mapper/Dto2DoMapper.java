package com.stat4you.statistics.dsd.mapper;

import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;

import com.stat4you.statistics.dsd.domain.DatasetEntity;
import com.stat4you.statistics.dsd.domain.DatasetVersionEntity;
import com.stat4you.statistics.dsd.domain.DimensionEntity;
import com.stat4you.statistics.dsd.domain.PrimaryMeasureEntity;
import com.stat4you.statistics.dsd.domain.ProviderEntity;
import com.stat4you.statistics.dsd.dto.DatasetBasicDto;
import com.stat4you.statistics.dsd.dto.DatasetDto;
import com.stat4you.statistics.dsd.dto.DimensionDto;
import com.stat4you.statistics.dsd.dto.PrimaryMeasureDto;
import com.stat4you.statistics.dsd.dto.ProviderDto;

public interface Dto2DoMapper {
	
	public ProviderEntity providerDtoToDo(ProviderDto providerDto);
	public void providerDtoToDo(ProviderDto providerDto, ProviderEntity providerEntity);
	
	public DatasetVersionEntity datasetDtoToDo(DatasetDto datasetDto) throws ApplicationException;
	public DatasetVersionEntity datasetDtoToDo(DatasetBasicDto datasetBasicDto);
	public void datasetDtoToDo(DatasetBasicDto datasetBasicDto, DatasetVersionEntity datasetVersionEntity);
	public void datasetDtoToDo(DatasetBasicDto datasetBasicDto, DatasetEntity datasetEntity);
	public void dimensionDtoToDo(DimensionDto dimensionDto, DimensionEntity dimensionEntity);
	public void primaryMeasureDtoToDo(PrimaryMeasureDto primaryMeasureDto, PrimaryMeasureEntity primaryMeasureEntity);
}
