package com.stat4you.statistics.dsd.repository.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.fornax.cartridges.sculptor.framework.accessapi.ConditionalCriteria;
import org.fornax.cartridges.sculptor.framework.domain.PagedResult;
import org.fornax.cartridges.sculptor.framework.domain.PagingParameter;
import org.springframework.stereotype.Repository;

import com.stat4you.statistics.dsd.domain.DatasetEntityProperties;
import com.stat4you.statistics.dsd.domain.DatasetStateEnum;
import com.stat4you.statistics.dsd.domain.DatasetVersionEntity;
import com.stat4you.statistics.dsd.domain.DatasetVersionEntityProperties;

/**
 * Repository implementation for DatasetVersion
 */
@Repository("datasetVersionRepository")
public class DatasetVersionRepositoryImpl extends DatasetVersionRepositoryBase {

    public DatasetVersionRepositoryImpl() {
    }

    public DatasetVersionEntity retrieveDatasetVersion(String uuid, Integer version) {

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put(DatasetEntityProperties.uuid().getName(), uuid);
        parameters.put(DatasetEntityProperties.version().getName(), version);
        List<DatasetVersionEntity> result = findByQuery("from DatasetVersionEntity dv where dv.dataset.uuid = :uuid and dv.versionNumber = :version", parameters, 1);
        if (result == null || result.isEmpty()) {
            return null;
        } else {
            return result.get(0);
        }
    }

    @Override
    public List<DatasetVersionEntity> findDatasetsPublished(String uuidProvider) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        if (uuidProvider != null) {
            parameters.put("uuidProvider", uuidProvider);
        }
        parameters.put("state", DatasetStateEnum.PUBLISHED);

        String query = null;
        if (uuidProvider != null) {
            query = "select dv from DatasetVersionEntity dv join dv.dataset d join d.provider p where p.uuid = :uuidProvider and dv.state = :state";
        } else {
            query = "select dv from DatasetVersionEntity dv where dv.state = :state";
        }
        List<DatasetVersionEntity> result = findByQuery(query, parameters);
        return result;
    }

    @Override
    public List<DatasetVersionEntity> findDatasetsLastVersions(String uuidProvider) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        if (uuidProvider != null) {
            parameters.put("uuidProvider", uuidProvider);
        }
        parameters.put("isLastVersion", Boolean.TRUE);

        String query = null;
        if (uuidProvider != null) {
            query = "select dv from DatasetVersionEntity dv join dv.dataset d join d.provider p where p.uuid = :uuidProvider and dv.isLastVersion = :isLastVersion";
        } else {
            query = "select dv from DatasetVersionEntity dv where dv.isLastVersion = :isLastVersion";
        }
        List<DatasetVersionEntity> result = findByQuery(query, parameters);
        return result;
    }

    public List<DatasetVersionEntity> findDatasetsLastPublished(Integer count) {

        // 1) First option to execute query: HQL
        // Following has a bug in sql generated: order by PUBLISHING_DATE, PUBLISHING_DATE_TZ desc. In this sql, "desc" is not applied to two columns, so PUBLISHING_DATE will be ordered "asc" by
        // default.
        // List<DatasetVersionEntity> result = findByQuery("from DatasetVersionEntity dv where dv.publishingDate is not null and dv.unpublishingDate is null order by dv.publishingDate desc", null,
        // count);

        // 2) Second option to execute query: Criteria
        ConditionalCriteria criteriaAnd = ConditionalCriteria.and(ConditionalCriteria.isNotNull(DatasetVersionEntityProperties.publishingDate()),
                ConditionalCriteria.isNull(DatasetVersionEntityProperties.unpublishingDate()));
        ConditionalCriteria criteriaOrder = ConditionalCriteria.orderDesc(DatasetVersionEntityProperties.publishingDate());
        List<ConditionalCriteria> conditions = new ArrayList<ConditionalCriteria>();
        conditions.add(criteriaAnd);
        conditions.add(criteriaOrder);
        PagingParameter pagingParameter = PagingParameter.pageAccess(count); // max results
        PagedResult<DatasetVersionEntity> result = findByCondition(conditions, pagingParameter);
        return result.getValues();

        // 3) Third option to execute query: Native query. Note: ignoring timezone
        // Query query = getEntityManager().createNativeQuery("SELECT * FROM TBL_DATASETS_VERSIONS where PUBLISHING_DATE is not null and UNPUBLISHING_DATE is null order by PUBLISHING_DATE desc",
        // DatasetVersionEntity.class);
        // query.setMaxResults(count);
        // List<DatasetVersionEntity> result = query.getResultList();
        // return result;

    }

    // IMPORTANTE!!! Si se realizara la consulta no lazy de dimensiones, primary measure... habría que crear otro método, ya que el retrieveDatasetBasic del servicio también llama a este método
    @Override
    public DatasetVersionEntity retrieveDatasetByIdentifier(String providerAcronym, String identifier, Boolean published) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("acronym", providerAcronym);
        parameters.put("identifier", identifier);
        
        StringBuilder query = new StringBuilder();
        query.append("select distinct dv from DatasetVersionEntity dv left join fetch dv.title dvTitle left join fetch dvTitle.texts left join fetch dv.description dvDescription left join fetch dvDescription.texts left join fetch dv.dataset dataset left join fetch dataset.provider provider left join fetch provider.license license left join fetch license.texts");
        query.append(" where upper(dataset.identifier) = upper(:identifier) and provider.acronym = :acronym and ");
        if (published) {
            query.append("dv.state = '");
            query.append(DatasetStateEnum.PUBLISHED.getName());
            query.append("'");
        } else {
            query.append("dv.isLastVersion = true");
        }
        
        List<DatasetVersionEntity> result = findByQuery(query.toString(), parameters);
        if (result == null || result.isEmpty()) {
            return null;
        } else {
            return result.get(0);
        }
    }
}
