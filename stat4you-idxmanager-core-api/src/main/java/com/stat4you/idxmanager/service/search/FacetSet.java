package com.stat4you.idxmanager.service.search;

import java.util.ArrayList;
import java.util.List;

import com.stat4you.idxmanager.domain.IndexationFieldsEnum;

public class FacetSet {
	private List<Facet> facets;
	
	public FacetSet() {
		facets = new ArrayList<Facet>();
	}
	
	public List<Facet> getFacets() {
		return facets;
	}
	
	public void addFacet(Facet facet) {
		facets.add(facet);
	}
	
	public List<Facet> getFacetsByField(IndexationFieldsEnum field) {
		List<Facet> listFacets = new ArrayList<Facet>();
		for (Facet facet : facets) {
			if (field.equals(facet.getField())) {
				listFacets.add(facet);
			}
		}
		return listFacets;
	}
	
	public Facet getFacetByField(IndexationFieldsEnum field, String locale) {
		for (Facet facet : facets) {
			if (field.equals(facet.getField())) {
				if (locale != null && locale.equals(facet.getLocale())) {
					return facet;
				} else if (locale == null && facet.getLocale() == null) {
					return facet;
				}
			}
		}
		return null;
	}
	
	/* Only use for known unlocalized fields*/
	public Facet getFacetByField(IndexationFieldsEnum field) {
		for (Facet facet : facets) {
			if (field.equals(facet.getField())) {
				return facet;
			}
		}
		return null;
	}
	
}
