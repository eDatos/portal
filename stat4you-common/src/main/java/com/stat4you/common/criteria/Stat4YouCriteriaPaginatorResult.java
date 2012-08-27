package com.stat4you.common.criteria;

import java.io.Serializable;

public final class Stat4YouCriteriaPaginatorResult implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    
    /**
     * The first retrieved result.
     */
    private Integer firstResult       = null;

    /**
     * The maximum size of the result set.
     */
    private Integer maximumResultSize = null;

    /**
     * The total retrieved result.
     */
    private Integer totalResults      = null;
    
    
    public Integer getFirstResult() {
        return firstResult;
    }
    
    public void setFirstResult(Integer firstResult) {
        this.firstResult = firstResult;
    }
    
    public Integer getMaximumResultSize() {
        return maximumResultSize;
    }
    
    public void setMaximumResultSize(Integer maximumResultSize) {
        this.maximumResultSize = maximumResultSize;
    }
    
    public Integer getTotalResults() {
        return totalResults;
    }
    
    public void setTotalResults(Integer totalResults) {
        this.totalResults = totalResults;
    }
}