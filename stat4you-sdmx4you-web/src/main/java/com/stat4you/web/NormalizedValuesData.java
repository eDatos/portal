package com.stat4you.web;

import java.util.HashMap;

import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;

import com.stat4you.normalizedvalues.dto.CategoryDto;
import com.stat4you.normalizedvalues.service.NormalizedValuesService;

public class NormalizedValuesData extends BaseController {

    private NormalizedValuesService      normalizedValuesService = null;
    private HashMap<String, CategoryDto> categoriesMap           = new HashMap<String, CategoryDto>();

    public NormalizedValuesData() throws ApplicationException {
        for (CategoryDto category : normalizedValuesService.retrieveCategories(getServiceContext())) {
            categoriesMap.put(category.getCode(), category);
        }
    }

    public CategoryDto getCategory(String code) {
        return categoriesMap.get(code);
    }

}
