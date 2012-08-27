package com.stat4you.idxmanager.service.search;

import java.util.List;

public class SearchResult {

	private List<ResultDocument> results;
	private FacetSet facets;
    private long numFound = 0;

	public List<ResultDocument> getResults() {
		return results;
	}
	
	public void setResults(List<ResultDocument> results) {
		this.results = results;
	}
	
	public FacetSet getFacets() {
		return facets;
	}
	
	public void setFacets(FacetSet facets) {
		this.facets = facets;
	}

    public long getNumFound() {
        return numFound;
    }

    public void setNumFound(long numFound) {
        this.numFound = numFound;
    }
}
