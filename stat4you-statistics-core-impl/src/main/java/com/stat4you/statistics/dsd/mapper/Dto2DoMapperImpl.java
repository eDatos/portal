package com.stat4you.statistics.dsd.mapper;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.springframework.beans.factory.annotation.Autowired;

import com.stat4you.common.dto.InternationalStringDto;
import com.stat4you.common.dto.LocalisedStringDto;
import com.stat4you.statistics.dsd.Constants;
import com.stat4you.statistics.dsd.domain.AttributeAttachmentLevelEnum;
import com.stat4you.statistics.dsd.domain.AttributeDefinitionEntity;
import com.stat4you.statistics.dsd.domain.CodeDimensionEntity;
import com.stat4you.statistics.dsd.domain.DatasetEntity;
import com.stat4you.statistics.dsd.domain.DatasetVersionEntity;
import com.stat4you.statistics.dsd.domain.DimensionEntity;
import com.stat4you.statistics.dsd.domain.DsdExceptionCodeEnum;
import com.stat4you.statistics.dsd.domain.InternationalStringEntity;
import com.stat4you.statistics.dsd.domain.InternationalStringRepository;
import com.stat4you.statistics.dsd.domain.LocalisedStringEntity;
import com.stat4you.statistics.dsd.domain.PrimaryMeasureEntity;
import com.stat4you.statistics.dsd.domain.ProviderEntity;
import com.stat4you.statistics.dsd.dto.AttributeDefinitionDto;
import com.stat4you.statistics.dsd.dto.CodeDimensionDto;
import com.stat4you.statistics.dsd.dto.DatasetBasicDto;
import com.stat4you.statistics.dsd.dto.DatasetDto;
import com.stat4you.statistics.dsd.dto.DimensionDto;
import com.stat4you.statistics.dsd.dto.PrimaryMeasureDto;
import com.stat4you.statistics.dsd.dto.ProviderDto;
import com.stat4you.statistics.dsd.dto.ResourceIdentierDto;

/**
 * IMPORTANT!
 * Do not use Dozer because can copy non modifiable attributes from Dto to Do
 * by "update" method. Example: createdBy, removedDate, state
 * publishingDate... These attributes must be modified by
 * specific operation.
 */
public class Dto2DoMapperImpl implements Dto2DoMapper {
	
    @Autowired
    private InternationalStringRepository internationalStringRepository;
    
	public ProviderEntity providerDtoToDo(ProviderDto source) {
		ProviderEntity target = new ProviderEntity();
		providerDtoToDo(source, target);
		return target;
	}

	public void providerDtoToDo(ProviderDto source, ProviderEntity target) {
		target.setAcronym(source.getAcronym());
		target.setName(source.getName());
		target.setLicense(internationalStringToEntity(source.getLicense(), target.getLicense()));
		target.setLicenseUrl(source.getLicenseUrl());
		target.setUrl(source.getUrl());
		target.setLanguage(source.getLanguage());
		target.setLogo(source.getLogo());
		target.setDescription(internationalStringToEntity(source.getDescription(), target.getDescription()));
        target.setCitation(source.getCitation());
	}
	
	public DatasetVersionEntity datasetDtoToDo(DatasetDto source) throws ApplicationException {
		DatasetVersionEntity target = new DatasetVersionEntity();
		datasetDtoToDo(source, target);
		return target;
	}

	public void datasetDtoToDo(DatasetDto source, DatasetVersionEntity target) throws ApplicationException {

	    // Basic properties
	    datasetDtoToDo((DatasetBasicDto) source, target);
		
		// Dimensions
		for (DimensionDto dimensionDto : source.getDimensions()) {
			DimensionEntity dimensionEntity = dimensionDtoToDo(dimensionDto);
			target.addDimension(dimensionEntity);
		}
		
		// Primary measure
		PrimaryMeasureEntity primaryMeasureEntity = primaryMeasureDtoToDo(source.getPrimaryMeasure());
		primaryMeasureEntity.setDatasetVersion(target);
		target.setPrimaryMeasure(primaryMeasureEntity);
		
		// Definitions of attributes
        for (AttributeDefinitionDto attributeDefinitionDto : source.getAttributeDefinitions()) {
            AttributeDefinitionEntity attributeDefinitionEntity = attributeDefinitionDtoToDo(attributeDefinitionDto, target.getDimensions());
            target.addAttributeDefinition(attributeDefinitionEntity);
        }		
	}

	@Override
	public DatasetVersionEntity datasetDtoToDo(DatasetBasicDto source) {
		DatasetVersionEntity target = new DatasetVersionEntity();
		datasetDtoToDo(source, target);
		return target;
	}

	@Override
	public void datasetDtoToDo(DatasetBasicDto source, DatasetVersionEntity target) {
        target.setSource(source.getSource());
		target.setTitle(internationalStringToEntity(source.getTitle(), target.getTitle()));
        target.setDescription(internationalStringToEntity(source.getDescription(), target.getDescription()));
		target.setUrl(source.getUrl());
		target.setProviderPublishingDate(source.getProviderPublishingDate());
		target.setLanguage(source.getLanguage());
		target.setLanguages(dtoListToDoString(source.getLanguages()));
        target.setFrequency(source.getFrequency());
	}

   @Override
    public void datasetDtoToDo(DatasetBasicDto source, DatasetEntity target) {
       if (target.getId() == null) {
           // these attributes can not be modified
           target.setIdentifier(source.getIdentifier()); 
           target.setProviderReleaseDate(source.getProviderReleaseDate());
       }
       target.setCategories(dtoListToDoString(source.getCategories()));
    }

	public void dimensionDtoToDo(DimensionDto source, DimensionEntity target) {
	    target.setIdentifier(source.getIdentifier());
		target.setTitle(internationalStringToEntity(source.getTitle(), target.getTitle()));
		target.setType(source.getType());
		target.getCodes().clear();
		for (CodeDimensionDto codeDimensionDto : source.getCodes()) {
			target.getCodes().add(codeDimensionDtoToDo(codeDimensionDto));
		}
	}

	public void primaryMeasureDtoToDo(PrimaryMeasureDto source, PrimaryMeasureEntity target) {
	    target.setIdentifier(source.getIdentifier());
		target.setTitle(internationalStringToEntity(source.getTitle(), target.getTitle()));
	}
	
	private InternationalStringEntity internationalStringToEntity(InternationalStringDto source, InternationalStringEntity target) {
		if (source == null) {
		    if (target != null) {
		        // delete previous entity
		        getInternationalStringRepository().delete(target);
		    }
		    return null;
		}
	    
	    if (target == null) {
			target =  new InternationalStringEntity();	
		}
	    
	    Set<LocalisedStringEntity> localisedStringEntities = localisedStringDtoToDo(source.getTexts(), target.getTexts());
	    target.getTexts().clear();
	    target.getTexts().addAll(localisedStringEntities);
		
		return target;
	}

	/**
	 * Transform LocalisedString, reusing existing locales
	 */
	private Set<LocalisedStringEntity> localisedStringDtoToDo(List<LocalisedStringDto> sources, Set<LocalisedStringEntity> targets) {
        
	    Set<LocalisedStringEntity> targetsBefore = targets;
        targets = new HashSet<LocalisedStringEntity>();
        
	    for (LocalisedStringDto source : sources) {
            boolean existsBefore = false;
            for (LocalisedStringEntity target : targetsBefore) {
                if (source.getLocale().equals(target.getLocale())) {
                    targets.add(localisedStringDtoToDo(source, target));
                    existsBefore = true;
                    break;
                }
            }
            if (!existsBefore) {
                targets.add(localisedStringDtoToDo(source));
            }
        }
        return targets;
	}
	
	private LocalisedStringEntity localisedStringDtoToDo(LocalisedStringDto source) {
	    LocalisedStringEntity target = new LocalisedStringEntity();
        target.setLabel(source.getLabel());
        target.setLocale(source.getLocale());
        return target;
    }
	
	private LocalisedStringEntity localisedStringDtoToDo(LocalisedStringDto source, LocalisedStringEntity target) {
        target.setLabel(source.getLabel());
        target.setLocale(source.getLocale());
        return target;
    }
	
    private static String dtoListToDoString(List<String> source) {
        if (source == null || source.size() == 0) {
            return null;
        }
        String joined = StringUtils.join(source, Constants.SEPARATOR_TO_LIST_IN_DO);
        StringBuilder target = new StringBuilder();
        target.append(Constants.SEPARATOR_TO_LIST_IN_DO);
        target.append(joined);
        target.append(Constants.SEPARATOR_TO_LIST_IN_DO);
        
        return target.toString();
    }

    private PrimaryMeasureEntity primaryMeasureDtoToDo(PrimaryMeasureDto source) {
        PrimaryMeasureEntity target = new PrimaryMeasureEntity();
        primaryMeasureDtoToDo(source, target);
        return target;
    }

    private DimensionEntity dimensionDtoToDo(DimensionDto source) {
        DimensionEntity target = new DimensionEntity();
        dimensionDtoToDo(source, target);
        return target;
    }

    private CodeDimensionEntity codeDimensionDtoToDo(CodeDimensionDto source) {
        CodeDimensionEntity target = new CodeDimensionEntity();
        target.setIdentifier(source.getIdentifier());
        target.setTitle(internationalStringToEntity(source.getTitle(), null));
        target.getSubcodes().clear();
        for (CodeDimensionDto codeDimensionDtoChildren : source.getSubcodes()) {
            target.getSubcodes().add(codeDimensionDtoToDo(codeDimensionDtoChildren));
        }
        return target;
    }
    
    private AttributeDefinitionEntity attributeDefinitionDtoToDo(AttributeDefinitionDto source, List<DimensionEntity> dimensionsOfDataset) throws ApplicationException {
        AttributeDefinitionEntity target = new AttributeDefinitionEntity();
        attributeDefinitionDtoToDo(source, target, dimensionsOfDataset);
        return target;
    }

    private void attributeDefinitionDtoToDo(AttributeDefinitionDto source, AttributeDefinitionEntity target, List<DimensionEntity> dimensionsOfDataset) throws ApplicationException {
        target.setIdentifier(source.getIdentifier());
        target.setTitle(internationalStringToEntity(source.getTitle(), target.getTitle()));
        target.setAttachmentLevel(source.getAttachmentLevel());
        if (AttributeAttachmentLevelEnum.DIMENSION.equals(target.getAttachmentLevel())) {
            target.getAttachmentDimensions().clear();
            for (ResourceIdentierDto dimensionResourceIdentifier : source.getAttachmentDimensions()) {
                DimensionEntity dimensionAttatchmentEntity = null;
                for (DimensionEntity dimensionEntity : dimensionsOfDataset) {
                    if (dimensionEntity.getIdentifier().equals(dimensionResourceIdentifier.getIdentifier())) {
                        dimensionAttatchmentEntity = dimensionEntity;
                        break;
                    }
                }
                if (dimensionAttatchmentEntity == null) {
                    throw new ApplicationException(DsdExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), "Attachment dimension not found with identifier " + dimensionResourceIdentifier.getIdentifier());   
                }
                dimensionAttatchmentEntity.addAttributeDefinition(target);
                target.addAttachmentDimension(dimensionAttatchmentEntity);
            }
        }
    }   
    
    private InternationalStringRepository getInternationalStringRepository() {
        return internationalStringRepository;
    }
}