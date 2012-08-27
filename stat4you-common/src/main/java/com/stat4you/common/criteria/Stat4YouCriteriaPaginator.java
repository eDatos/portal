package com.stat4you.common.criteria;

import java.io.Serializable;

public final class Stat4YouCriteriaPaginator implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    
    private Boolean countTotalResults = Boolean.FALSE;
    private Integer firstResult       = null;
    private Integer maximumResultSize = null;
    
    public Boolean getCountTotalResults() {
        return countTotalResults;
    }
    
    public void setCountTotalResults(Boolean countTotalResults) {
        this.countTotalResults = countTotalResults;
    }
    
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
}