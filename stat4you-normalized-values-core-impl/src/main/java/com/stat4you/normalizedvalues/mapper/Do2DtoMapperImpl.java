package com.stat4you.normalizedvalues.mapper;

import java.util.ArrayList;
import java.util.List;

import com.stat4you.common.dto.InternationalStringDto;
import com.stat4you.common.dto.LocalisedStringDto;
import com.stat4you.normalizedvalues.domain.CategoryEntity;
import com.stat4you.normalizedvalues.domain.InternationalStringEntity;
import com.stat4you.normalizedvalues.domain.LanguageEntity;
import com.stat4you.normalizedvalues.domain.LocalisedStringEntity;
import com.stat4you.normalizedvalues.dto.CategoryDto;
import com.stat4you.normalizedvalues.dto.LanguageDto;

/**
 * IMPORTANT!
 * Do not use Dozer because can copy non modifiable attributes from Dto to Do
 * by "update" method. Example: createdBy, removedDate, state
 * publishingDate... These attributes must be modified by
 * specific operation.
 */
public class Do2DtoMapperImpl implements Do2DtoMapper {
	
	public LanguageDto languageDoToDto(LanguageEntity source) {
		LanguageDto target = new LanguageDto();
		target.setCode(source.getCode());
		target.setValue(internationalStringToDto(source.getValue()));
		return target;
	}
	
	public CategoryDto categoryDoToDto(CategoryEntity source) {
        CategoryDto target = new CategoryDto();
        target.setCode(source.getCode());
        target.setValue(internationalStringToDto(source.getValue()));
        for (CategoryEntity categoryEntityChild : source.getSubcategories()) {
            target.getSubcategories().add(categoryDoToDto(categoryEntityChild));
        }
        return target;
    }
	
	private InternationalStringDto internationalStringToDto(InternationalStringEntity source) {
	    if (source == null) {
	        return null;
	    }
	    
		InternationalStringDto target = new InternationalStringDto();
		target.getTexts().addAll(localisedStringDoToDto(source.getTexts()));
    	return target;
	}

	private List<LocalisedStringDto> localisedStringDoToDto(List<LocalisedStringEntity> sources) {
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