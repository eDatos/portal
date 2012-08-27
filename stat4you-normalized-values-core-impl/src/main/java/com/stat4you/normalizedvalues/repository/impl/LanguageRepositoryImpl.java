package com.stat4you.normalizedvalues.repository.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.stat4you.normalizedvalues.domain.LanguageEntity;
import com.stat4you.normalizedvalues.domain.LanguageEntityProperties;

/**
 * Repository implementation for Language
 */
@Repository("languageRepository")
public class LanguageRepositoryImpl extends LanguageRepositoryBase {
    public LanguageRepositoryImpl() {
    }

    @Override
    public LanguageEntity findLanguageByCode(String code) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put(LanguageEntityProperties.code().getName(), code);
        List<LanguageEntity> result = findByQuery("from LanguageEntity l where l.code = :code", parameters);
        if (result == null || result.isEmpty()) {
            return null;
        } else {
            return result.get(0);
        }
    }
}
