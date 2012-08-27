package com.stat4you.statistics.dsd.repository.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.stat4you.statistics.dsd.domain.DatasetEntity;
import com.stat4you.statistics.dsd.domain.DatasetEntityProperties;

/**
 * Repository implementation for Dataset
 */
@Repository("datasetRepository")
public class DatasetRepositoryImpl extends DatasetRepositoryBase {
    public DatasetRepositoryImpl() {
    }

	public DatasetEntity findDatasetByUuid(String uuid) {
		Map<String, Object> parameters = new HashMap<String, Object>();
		parameters.put(DatasetEntityProperties.uuid().getName(), uuid);
		List<DatasetEntity> result = findByQuery("from DatasetEntity d where d.uuid = :uuid", parameters, 1);
		if (result == null || result.isEmpty()) {
			return null;
		} else {
			return result.get(0);
		}
	}

    @Override
    public DatasetEntity findDatasetByIdentifierAndProviderUuid(String providerUuid, String identifier) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put(DatasetEntityProperties.identifier().getName(), identifier);
        parameters.put("providerUuid", providerUuid);
        List<DatasetEntity> result = findByQuery("from DatasetEntity d where upper(d.identifier) = upper(:identifier) and d.provider.uuid = :providerUuid", parameters, 1);
        if (result == null || result.isEmpty()) {
            return null;
        } else {
            return result.get(0);
        }
    }
    
    @Override
    public List<DatasetEntity> findDatasets(String uuidProvider) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        List<DatasetEntity> result = null;
        if (uuidProvider != null) {
            parameters.put("uuidProvider", uuidProvider);
            result = findByQuery("select d from DatasetEntity d join d.provider p where p.uuid = :uuidProvider", parameters);
        } else {
            result = findByQuery("select d from DatasetEntity d", parameters);
        }
        return result;
    }
}
