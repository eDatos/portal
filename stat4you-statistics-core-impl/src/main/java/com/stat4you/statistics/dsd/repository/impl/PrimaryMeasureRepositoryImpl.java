package com.stat4you.statistics.dsd.repository.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.stat4you.statistics.dsd.domain.PrimaryMeasureEntity;
import com.stat4you.statistics.dsd.domain.PrimaryMeasureEntityProperties;

/**
 * Repository implementation for Primary Measure
 */
@Repository("primaryMeasureRepository")
public class PrimaryMeasureRepositoryImpl extends PrimaryMeasureRepositoryBase {
    public PrimaryMeasureRepositoryImpl() {
    }

	public PrimaryMeasureEntity findPrimaryMeasureByUuid(String uuid) {
		
		Map<String, Object> parameters = new HashMap<String, Object>();
		parameters.put(PrimaryMeasureEntityProperties.uuid().getName(), uuid);
		List<PrimaryMeasureEntity> result = findByQuery("from PrimaryMeasureEntity d where d.uuid = :uuid", parameters);
		if (result == null || result.isEmpty()) {
			return null;
		} else {
			return result.get(0);
		}
	}
}
