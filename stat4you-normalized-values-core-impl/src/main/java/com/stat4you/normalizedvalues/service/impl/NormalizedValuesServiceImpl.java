package com.stat4you.normalizedvalues.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.springframework.stereotype.Service;

import com.stat4you.normalizedvalues.domain.CategoryEntity;
import com.stat4you.normalizedvalues.domain.LanguageEntity;
import com.stat4you.normalizedvalues.domain.NormalizedValuesExceptionCodeEnum;
import com.stat4you.normalizedvalues.dto.CategoryDto;
import com.stat4you.normalizedvalues.dto.LanguageDto;
import com.stat4you.normalizedvalues.mapper.Do2DtoMapper;
import com.stat4you.normalizedvalues.service.util.InvocationValidator;

/**
 * Implementation of NormalizedValuesService.
 */
@Service("normalizedValuesService")
public class NormalizedValuesServiceImpl extends NormalizedValuesServiceImplBase {
    
    @Resource(name="do2DtoMapperNormalizedValues")
    private Do2DtoMapper do2DtoMapper;
    
    public NormalizedValuesServiceImpl() {
    }

    public List<LanguageDto> retrieveLanguages(ServiceContext ctx) throws ApplicationException {
        
        // Retrieve
        List<LanguageEntity> languageEntities = getLanguageRepository().findAll();
        
        // Transform
        List<LanguageDto> languageDtos = new ArrayList<LanguageDto>();
        for (LanguageEntity languageEntity : languageEntities) {
            languageDtos.add(do2DtoMapper.languageDoToDto(languageEntity));
        }

        // Response
        return languageDtos;
    }
    
    @Override
    public LanguageDto retrieveLanguage(ServiceContext ctx, String code) throws ApplicationException {
        
        // Validation
        InvocationValidator.validateRetrieveLanguage(code);

        // Retrieve
        LanguageEntity languageEntity = getLanguageRepository().findLanguageByCode(code);
        if (languageEntity == null) {
            throw new ApplicationException(NormalizedValuesExceptionCodeEnum.LANGUAGE_NOT_EXISTS.getName(), "Language not exists with code " + code);
        }
        
        // Transform
        LanguageDto languageDto = do2DtoMapper.languageDoToDto(languageEntity);
        return languageDto;   
    }    
    
    public List<CategoryDto> retrieveCategories(ServiceContext ctx) throws ApplicationException {
        
        // Retrieve
        List<CategoryEntity> categoryEntities = getCategoryRepository().findCategories();
        
        // Transform
        List<CategoryDto> categoryDtos = new ArrayList<CategoryDto>();
        for (CategoryEntity categoryEntity : categoryEntities) {
            categoryDtos.add(do2DtoMapper.categoryDoToDto(categoryEntity));
        }

        // Response
        return categoryDtos;
    }

    @Override
    public CategoryDto retrieveCategory(ServiceContext ctx, String code) throws ApplicationException {
        
        // Validation
        InvocationValidator.validateRetrieveCategory(code);

        // Retrieve
        CategoryEntity categoryEntity = getCategoryRepository().findCategoryByCode(code);
        if (categoryEntity == null) {
            throw new ApplicationException(NormalizedValuesExceptionCodeEnum.CATEGORY_NOT_EXISTS.getName(), "Category not exists with code " + code);
        }
        
        // Transform
        CategoryDto categoryDto = do2DtoMapper.categoryDoToDto(categoryEntity);
        return categoryDto;   
    }
}
