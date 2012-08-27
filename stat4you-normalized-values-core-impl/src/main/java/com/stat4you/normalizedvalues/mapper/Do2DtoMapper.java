package com.stat4you.normalizedvalues.mapper;

import com.stat4you.normalizedvalues.domain.CategoryEntity;
import com.stat4you.normalizedvalues.domain.LanguageEntity;
import com.stat4you.normalizedvalues.dto.CategoryDto;
import com.stat4you.normalizedvalues.dto.LanguageDto;

public interface Do2DtoMapper {

	public LanguageDto languageDoToDto(LanguageEntity languageEntity);
    public CategoryDto categoryDoToDto(CategoryEntity categoryEntity);
}
