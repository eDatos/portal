package com.stat4you.idxmanager.service.search;

import java.util.ArrayList;
import java.util.List;

import com.stat4you.idxmanager.domain.IndexationFieldsEnum;


public class SearchQuery {
    private static final int UNLIMITED_FACETS = -1;
    
	private String userQuery;
	private int startResult;
	private boolean faceted;
	private String locale;
	private int facetLimit;
	private List<FilteredField> filteredFields;
	private List<SortedField> sortedFields;
	
	
	/**************************************************************************
	 *  GETTERS/SETTERS
	 *************************************************************************/
	
	public SearchQuery() {
		startResult = 0;
		faceted = false;
		facetLimit = 100;
		locale = null;
		filteredFields = new ArrayList<FilteredField>();
		sortedFields = new ArrayList<SortedField>();
	}
	
    public void setLocale(String locale) {
        this.locale = locale;
    }
    
    public String getLocale() {
        return locale;
    }
	
    public void setFacetLimit(int facetLimit) {
        this.facetLimit = facetLimit;
    }
    
    public int getFacetLimit() {
        return facetLimit;
    }
    
    public void setUnlimitedFacets() {
        this.facetLimit = UNLIMITED_FACETS;
    }
    
    public boolean hasUnlimitedFacets() {
        return facetLimit == UNLIMITED_FACETS;
    }
	
	public String getUserQuery() {
		return userQuery;
	}

	public void setUserQuery(String userQuery) {
		this.userQuery = userQuery;
	}

	public int getStartResult() {
		return startResult;
	}

	public void setStartResult(int startResult) {
		this.startResult = startResult;
	}
	
	public boolean isFaceted() {
		return faceted;
	}
	
	public void setFaceted(boolean faceted) {
		this.faceted = faceted;
	}
	
	public FilteredField getFilteredField(IndexationFieldsEnum field, String locale) {
	    for (FilteredField ffield : filteredFields) {
	        if (ffield.isSameField(field, locale)) {
	            return ffield;
	        }
	    }
	    return null;
	}
	
	public List<FilteredField> getFilteredFields() {
		return filteredFields;
	}
	
	public void addFilteredField(FilteredField ffield) {
		this.filteredFields.add(ffield);
	}
	
	public boolean hasSortedFields() {
	    return sortedFields != null && sortedFields.size() > 0;
	}
	
    public List<SortedField> getSortedFields() {
        return sortedFields;
    }
    
    public void addSortedField(SortedField sortedField) {
        sortedFields.add(sortedField);
    }
	
}