package com.stat4you.statistics.dsd.repository.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.stat4you.statistics.dsd.domain.ProviderEntity;
import com.stat4you.statistics.dsd.domain.ProviderEntityProperties;

/**
 * Repository implementation for Provider
 */
@Repository("providerRepository")
public class ProviderRepositoryImpl extends ProviderRepositoryBase {

    public ProviderRepositoryImpl() {
    }

    @Override
    public List<ProviderEntity> findAllProviders() {
        List<ProviderEntity> result = findByQuery("select distinct p from ProviderEntity p left join fetch p.license license left join fetch license.texts", null);
        return result;
    }

    public ProviderEntity findProviderByUuid(String uuid) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put(ProviderEntityProperties.uuid().getName(), uuid);
        List<ProviderEntity> result = findByQuery("select distinct p from ProviderEntity p left join fetch p.license license left join fetch license.texts where p.uuid = :uuid", parameters);
        if (result == null || result.isEmpty()) {
            return null;
        } else {
            return result.get(0);
        }
    }

    public ProviderEntity findProviderByAcronym(String acronym) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put(ProviderEntityProperties.acronym().getName(), acronym);
        List<ProviderEntity> result = findByQuery("from ProviderEntity p left join fetch p.license license left join fetch license.texts where upper(p.acronym) = upper(:acronym)", parameters);
        if (result == null || result.isEmpty()) {
            return null;
        } else {
            return result.get(0);
        }
    }
}
