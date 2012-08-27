package com.stat4you.web.search;

import com.stat4you.idxmanager.service.search.Facet;
import com.stat4you.idxmanager.service.search.FacetSet;

import java.util.ArrayList;
import java.util.List;

/**
 */
public class SearchResult {
    private final String query;
    private List<SearchDatasetResult> results;
    private boolean faceted = true;
    private List<Facet> facets;
    private final String locale;
    private long numFound = 0;

    public SearchResult(String query, String locale) {
        this.query = query;
        this.locale = locale;
        this.results = new ArrayList<SearchDatasetResult>();
        this.facets = new ArrayList<Facet>();
    }

    public String getQuery() {
        return query;
    }

    public List<SearchDatasetResult> getResults() {
        return results;
    }

    public void setResults(List<SearchDatasetResult> results) {
        this.results = results;
    }

    public List<Facet> getFacets() {
        return facets;
    }

    public void setFacets(FacetSet facetSet) {
        facets = new ArrayList<Facet>();

        //Only facet for current locale
        for(Facet facet : facetSet.getFacets()){
            if(facet.getLocale() == null || facet.getLocale().equals(this.locale)){
                facets.add(facet);
            }
        }
    }

    public String getLocale() {
        return locale;
    }

    public long getNumFound() {
        return numFound;
    }

    public void setNumFound(long numFound) {
        this.numFound = numFound;
    }

    public boolean isFaceted() {
        return faceted;
    }
    
    public void setFaceted(boolean faceted) {
        this.faceted = faceted;
    }
}
