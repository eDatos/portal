package com.stat4you.idxmanager.domain;

import java.util.Arrays;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public enum IndexationFieldsEnum {
	
	ID("id", false, false), //uri
	TYPE("type", false, false),
	
	/* Datos de los recursos*/
	PROV_NAME("prov_name", false, false),
	
	DS_NAME("ds_name", true, false),
	DS_IDENTIFIER("ds_identifier", false, false), //semantic identifier
	DS_PROV_PUB_DATE("ds_prov_publishing_date", false, false),
	DS_CATEGORY("ds_category",true, false),
	DS_PUB_DATE("ds_publishing_date", false, false),
	DS_PROV_ACRONYM("ds_prov_acronym", false, false),
	
	/*Facets*/
	FF_DS_PROV_ACRONYM("ff_ds_prov_acronym",false, true),
	FF_TEMPORAL_YEARS("ff_temporal_years",false, true),
	FF_SPATIAL_CODEDIMS("ff_spatial_codedims",true, true),
	FF_CATEGORY("ff_category",true, true),
	//FF_FREQ_CODEDIMS("ff_frequent_codedims",true, true),
	FF_DIMENSIONS("ff_dimensions",true, true);
	
	public static final String UNKNOWN_LOCALE = "gen"; 
	private String field;
	private boolean localized;
	private boolean facet;
	private static final List<String> solrLanguages = Arrays.asList("es","en","ca","eu");

	private static final Map<String, IndexationFieldsEnum> lookup = new HashMap<String, IndexationFieldsEnum>();

	static {
	    for(IndexationFieldsEnum s : EnumSet.allOf(IndexationFieldsEnum.class)) {
	         lookup.put(s.getField(), s);
	    }
	}
	
	public String getField() {
		return field;
	}
	
	public String getField(String locale) {
		return field+"_"+locale;
	}
	
	public boolean isLocalized() {
		return localized;
	}
	
    public boolean isFacet() {
        return facet;
    }
	
	public static IndexationFieldsEnum get(String field) { 
        IndexationFieldsEnum fieldEnum = lookup.get(field);
        //We try with localized fields
        if (fieldEnum == null) {
        	int index = field.lastIndexOf('_');
        	if (index == field.length()-"_es".length()) {
        		field = field.substring(0,index);
        		return lookup.get(field);
        	}
        } else {
        	return fieldEnum;
        }
        return null;
   }

	public static List<String> getIndexationLanguages() {
		return solrLanguages;
	}

	private IndexationFieldsEnum(String field, boolean localized, boolean facet) {
		this.field = field;
		this.localized = localized;
		this.facet = facet;
	}
}
