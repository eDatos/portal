package com.stat4you.statistics.dsd.repository.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.stat4you.statistics.dsd.domain.AttributeDefinitionEntity;
import com.stat4you.statistics.dsd.domain.AttributeDefinitionEntityProperties;

/**
 * Repository implementation for AttributeDefinition
 */
@Repository("attributeDefinitionRepository")
public class AttributeDefinitionRepositoryImpl
    extends AttributeDefinitionRepositoryBase {
    public AttributeDefinitionRepositoryImpl() {
    }

    public AttributeDefinitionEntity findAttributeDefinitionByUuid(String uuid) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put(AttributeDefinitionEntityProperties.uuid().getName(), uuid);
        List<AttributeDefinitionEntity> result = findByQuery("from AttributeDefinitionEntity d where d.uuid = :uuid", parameters);
        if (result == null || result.isEmpty()) {
            return null;
        } else {
            return result.get(0);
        }
    }
}
