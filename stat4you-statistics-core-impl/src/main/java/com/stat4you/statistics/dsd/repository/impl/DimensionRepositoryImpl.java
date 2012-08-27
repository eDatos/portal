package com.stat4you.statistics.dsd.repository.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.stat4you.statistics.dsd.domain.DimensionEntity;
import com.stat4you.statistics.dsd.domain.DimensionEntityProperties;

/**
 * Repository implementation for Dimension
 */
@Repository("dimensionRepository")
public class DimensionRepositoryImpl extends DimensionRepositoryBase {
    public DimensionRepositoryImpl() {
    }

	public DimensionEntity findDimensionByUuid(String uuid) {
		
		Map<String, Object> parameters = new HashMap<String, Object>();
		parameters.put(DimensionEntityProperties.uuid().getName(), uuid);
		List<DimensionEntity> result = findByQuery("from DimensionEntity d where d.uuid = :uuid", parameters);
		if (result == null || result.isEmpty()) {
			return null;
		} else {
			return result.get(0);
		}
	}
}
