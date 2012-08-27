package com.stat4you.statistics.dsd.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.stat4you.common.dto.InternationalStringDto;
import com.stat4you.common.dto.LocalisedStringDto;
import com.stat4you.statistics.dsd.Constants;
import com.stat4you.statistics.dsd.domain.AttributeDefinitionEntity;
import com.stat4you.statistics.dsd.domain.CodeDimensionEntity;
import com.stat4you.statistics.dsd.domain.DatasetVersionEntity;
import com.stat4you.statistics.dsd.domain.DimensionEntity;
import com.stat4you.statistics.dsd.domain.InternationalStringEntity;
import com.stat4you.statistics.dsd.domain.LocalisedStringEntity;
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
import com.stat4you.statistics.dsd.dto.ResourceIdentierDto;
import com.stat4you.statistics.dsd.service.util.DsdUtils;
import com.stat4you.statistics.dsd.service.util.UriDataUtils;

/**
 * IMPORTANT!
 * Do not use Dozer because can copy non modifiable attributes from Dto to Do
 * by "update" method. Example: createdBy, removedDate, state
 * publishingDate... These attributes must be modified by
 * specific operation.
 */
public class Do2DtoMapperImpl implements Do2DtoMapper {
	
    @Override
	public ProviderDto providerDoToDto(ProviderEntity source) {
		ProviderDto target = new ProviderDto();
		target.setUri(UriDataUtils.createUriProvider(source.getUuid()));
		target.setAcronym(source.getAcronym());
		target.setName(source.getName());
		target.setUrl(source.getUrl());
		target.setLicense(internationalStringToDto(source.getLicense()));
		target.setLicenseUrl(source.getLicenseUrl());
		target.setLanguage(source.getLanguage());
		target.setLogo(source.getLogo());
		target.setDescription(internationalStringToDto(source.getDescription()));
        target.setCitation(source.getCitation());

		target.setRemovedDate(source.getRemovedDate());
		target.setCreatedBy(source.getCreatedBy());
		target.setCreatedDate(source.getCreatedDate());
		target.setLastUpdatedBy(source.getLastUpdatedBy());
		target.setLastUpdated(source.getLastUpdated());
		
		return target;
	}

    @Override
    public DatasetDto datasetVersionDoToDto(DatasetVersionEntity source) {
        
        // Dataset
        DatasetDto target = new DatasetDto();
        datasetVersionToDto(source, target);
        
        // Primary measure
        target.setPrimaryMeasure(primaryMeasureDoToDto(source.getPrimaryMeasure()));
        
        // Dimensions
        for (DimensionEntity dimensionEntity : source.getDimensions()) {
            DimensionDto dimensionDto = dimensionDoToDto(dimensionEntity);
            target.addDimension(dimensionDto);
        }
        
        // Attribute definitions
        for (AttributeDefinitionEntity attributeDefinitionEntity : source.getAttributeDefinitions()) {
            AttributeDefinitionDto attributeDefinitionDto = attributeDefinitionDoToDto(attributeDefinitionEntity);
            target.addAttributeDefinition(attributeDefinitionDto);
        }
        return target;
    }

	@Override
	public DatasetBasicDto datasetVersionDoToBasicDto(DatasetVersionEntity source) {
	    DatasetBasicDto target = new DatasetBasicDto();
	    datasetVersionToDto(source, target);
		return target;
	}
	
	@Override
	public DimensionBasicDto dimensionDoToBasicDto(DimensionEntity source) {
	    DimensionBasicDto target = new DimensionBasicDto();
	    dimensionDoToBasicDto(source, target);
	    return target;
	}
	
	@Override
	public DimensionDto dimensionDoToDto(DimensionEntity source) {
		DimensionDto target = new DimensionDto();
		dimensionDoToBasicDto(source, target);
		
		for (CodeDimensionEntity codeDimensionEntity : source.getCodes()) {
		    target.getCodes().add(codeDimensionDoToDto(codeDimensionEntity));
	    }
		return target;
	}
	
	private void dimensionDoToBasicDto(DimensionEntity source, DimensionBasicDto target) {
        target.setIdentifier(source.getIdentifier());
        target.setUri(UriDataUtils.createUriDimension(source.getUuid()));
        target.setTitle(internationalStringToDto(source.getTitle()));
        target.setType(source.getType());
        
        target.setCreatedBy(source.getCreatedBy());
        target.setCreatedDate(source.getCreatedDate());
        target.setLastUpdatedBy(source.getLastUpdatedBy());
        target.setLastUpdated(source.getLastUpdated());	    
	}
	
	@Override
	public CodeDimensionDto codeDimensionDoToDto(CodeDimensionEntity source) {
		CodeDimensionDto target = new CodeDimensionDto();
		target.setIdentifier(source.getIdentifier());
		target.setTitle(internationalStringToDto(source.getTitle()));
		for (CodeDimensionEntity codeDimensionEntityChildren : source.getSubcodes()) {
			target.getSubcodes().add(codeDimensionDoToDto(codeDimensionEntityChildren));
		}
		return target;
	}
	
	@Override
	public PrimaryMeasureDto primaryMeasureDoToDto(PrimaryMeasureEntity source) {
		PrimaryMeasureDto target = new PrimaryMeasureDto();
		target.setUri(UriDataUtils.createUriPrimaryMeasure(source.getUuid()));
		target.setIdentifier(source.getIdentifier());
		target.setTitle(internationalStringToDto(source.getTitle()));
		
		target.setCreatedBy(source.getCreatedBy());
		target.setCreatedDate(source.getCreatedDate());
		target.setLastUpdatedBy(source.getLastUpdatedBy());
		target.setLastUpdated(source.getLastUpdated());
		
		return target;
	}
	
    @Override
    public AttributeDefinitionDto attributeDefinitionDoToDto(AttributeDefinitionEntity source) {
        AttributeDefinitionDto target = new AttributeDefinitionDto();
        target.setUri(UriDataUtils.createUriAttributeDefinition(source.getUuid()));
        target.setIdentifier(source.getIdentifier());
        target.setTitle(internationalStringToDto(source.getTitle()));
        target.setAttachmentLevel(source.getAttachmentLevel());
        for (DimensionEntity dimensionEntity : source.getAttachmentDimensions()) {
            ResourceIdentierDto resourceIdentierDto = new ResourceIdentierDto();
            resourceIdentierDto.setUri(UriDataUtils.createUriDimension(dimensionEntity.getUuid()));
            resourceIdentierDto.setIdentifier(dimensionEntity.getIdentifier());
            target.getAttachmentDimensions().add(resourceIdentierDto);
        }
        
        target.setCreatedBy(source.getCreatedBy());
        target.setCreatedDate(source.getCreatedDate());
        target.setLastUpdatedBy(source.getLastUpdatedBy());
        target.setLastUpdated(source.getLastUpdated());
        
        return target;
    }
    
    /**
     * Transform basic information of dataset
     */
    private void datasetVersionToDto(DatasetVersionEntity source, DatasetBasicDto target) {
        target.setUri(UriDataUtils.createUriDataset(source.getDataset().getUuid(), source.getVersionNumber()));
        target.setIdentifier(source.getDataset().getIdentifier());
        target.setSource(source.getSource());
        target.setTitle(internationalStringToDto(source.getTitle()));
        target.setDescription(internationalStringToDto(source.getDescription()));
        target.setState(source.getState());
        target.setProviderUri(UriDataUtils.createUriProvider(source.getDataset().getProvider().getUuid()));
        target.setPublisher(Constants.PUBLISHER_FOR_ALL_DATASETS);
        target.setUrl(source.getUrl());
        target.setFrequency(source.getFrequency());
        target.setLanguage(source.getLanguage());
        target.setLanguages(DsdUtils.doStringToDtoList(source.getLanguages()));
        target.setCategories(DsdUtils.doStringToDtoList(source.getDataset().getCategories()));
        if (source.getDataset().getDraftVersion() != null) {
            target.setDraftUri(UriDataUtils.createUriDataset(source.getDataset().getUuid(), source.getDataset().getDraftVersion().getVersionNumber()));
        }
        if (source.getDataset().getPublishedVersion() != null) {
            target.setPublishedUri(UriDataUtils.createUriDataset(source.getDataset().getUuid(), source.getDataset().getPublishedVersion().getVersionNumber()));
        }

        target.setProviderReleaseDate(source.getDataset().getProviderReleaseDate());
        target.setProviderPublishingDate(source.getProviderPublishingDate());
        target.setReleaseDate(source.getDataset().getReleaseDate());
        target.setPublishingDate(source.getPublishingDate());
        target.setUnpublishingDate(source.getUnpublishingDate());
        target.setCreatedBy(source.getCreatedBy());
        target.setCreatedDate(source.getCreatedDate());
        target.setLastUpdatedBy(source.getLastUpdatedBy());
        target.setLastUpdated(source.getLastUpdated());
    }
    
	private InternationalStringDto internationalStringToDto(InternationalStringEntity source) {
	    if (source == null) {
	        return null;
	    }
	    
		InternationalStringDto target = new InternationalStringDto();
		target.getTexts().addAll(localisedStringDoToDto(source.getTexts()));
    	return target;
	}

	private List<LocalisedStringDto> localisedStringDoToDto(Set<LocalisedStringEntity> sources) {
		List<LocalisedStringDto> targets = new ArrayList<LocalisedStringDto>();
		for (LocalisedStringEntity source : sources) {
    		LocalisedStringDto target = new LocalisedStringDto();
    		target.setLabel(source.getLabel());
    		target.setLocale(source.getLocale());
    		targets.add(target);
    	}
		return targets;
	}	
}