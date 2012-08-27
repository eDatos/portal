package com.stat4you.common.criteria;

import java.util.List;

/**
 */
public class Stat4YouCriteriaResult<T> {

    /**
     * Pagination of results
     */
    private Stat4YouCriteriaPaginatorResult paginatorResult;

    /**
     * List of results
     */
    private List<T> results           = null;

    
    public Stat4YouCriteriaPaginatorResult getPaginatorResult() {
        return paginatorResult;
    }
    
    public void setPaginatorResult(Stat4YouCriteriaPaginatorResult paginatorResult) {
        this.paginatorResult = paginatorResult;
    }

    public List<T> getResults() {
        return this.results;
    }

    public void setResults(List<T> results) {
        this.results = results;
    }
}