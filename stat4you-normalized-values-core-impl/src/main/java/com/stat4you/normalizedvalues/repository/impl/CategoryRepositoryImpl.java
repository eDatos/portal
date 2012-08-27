package com.stat4you.normalizedvalues.repository.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.stat4you.normalizedvalues.domain.CategoryEntity;
import com.stat4you.normalizedvalues.domain.CategoryEntityProperties;

/**
 * Repository implementation for Category
 */
@Repository("categoryRepository")
public class CategoryRepositoryImpl extends CategoryRepositoryBase {
    public CategoryRepositoryImpl() {
    }

    public List<CategoryEntity> findCategories() {
        List<CategoryEntity> result = findByQuery("from CategoryEntity d where d.parent is null", null);
        return result;

        // Also can be...
//      javax.persistence.Query query = getEntityManager().createNativeQuery("select * from TBL_CATEGORIES c where c.PARENT_FK is null", CategoryEntity.class);
//      List<CategoryEntity> result = query.getResultList();
              
    }

    @Override
    public CategoryEntity findCategoryByCode(String code) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put(CategoryEntityProperties.code().getName(), code);
        List<CategoryEntity> result = findByQuery("from CategoryEntity c where c.code = :code", parameters);
        if (result == null || result.isEmpty()) {
            return null;
        } else {
            return result.get(0);
        }
    }
}
