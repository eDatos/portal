package com.stat4you.common.criteria;

import java.util.List;

import org.fornax.cartridges.sculptor.framework.accessapi.ConditionalCriteria;
import org.fornax.cartridges.sculptor.framework.domain.PagingParameter;

public final class SculptorCriteria {
    
    private List<ConditionalCriteria> conditions;
    private PagingParameter pagingParameter;
    private Integer pageSize;
    
    
    public SculptorCriteria(List<ConditionalCriteria> conditions, PagingParameter pagingParameter, Integer pageSize) {
        this.conditions = conditions;
        this.pagingParameter = pagingParameter;
        this.pageSize = pageSize;
    }
    
    public List<ConditionalCriteria> getConditions() {
        return conditions;
    }
    
    public PagingParameter getPagingParameter() {
        return pagingParameter;
    }
    
    public Integer getPageSize() {
        return pageSize;
    }
}