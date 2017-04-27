package org.siemac.metamac.portal.dto;

public class PermalinkContent {

    protected QueryParams queryParams;
    protected String      hash;

    public QueryParams getQueryParams() {
        return queryParams;
    }

    public void setQueryParams(QueryParams queryParams) {
        this.queryParams = queryParams;
    }

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

}
