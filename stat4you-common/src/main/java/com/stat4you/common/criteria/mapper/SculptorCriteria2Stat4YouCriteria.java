package com.stat4you.common.criteria.mapper;

import org.fornax.cartridges.sculptor.framework.domain.PagedResult;

import com.stat4you.common.criteria.Stat4YouCriteriaPaginatorResult;

public class SculptorCriteria2Stat4YouCriteria {

    public static Stat4YouCriteriaPaginatorResult sculptorResultToStat4YouCriteriaResult(PagedResult<?> result, Integer pageSize) {
        Stat4YouCriteriaPaginatorResult target = new Stat4YouCriteriaPaginatorResult();
        target.setFirstResult(result.getStartRow());
        target.setMaximumResultSize(pageSize); // when PagingParameter is build as rowAccess pageSize is unknown
        if (result.isTotalCounted()) {
            target.setTotalResults(result.getTotalRows());
        }
        return target;
    }
}
