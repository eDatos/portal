package com.stat4you.idxmanager.service.search;

import java.util.ArrayList;
import java.util.List;

import com.stat4you.idxmanager.domain.IndexationFieldsEnum;

public class Facet {
	private IndexationFieldsEnum field;
	private String locale;
	private List<FacetConstraint> constraints;
	
	public Facet(IndexationFieldsEnum field, String locale) {
		this.field = field;
		this.locale = locale;
		this.constraints = new ArrayList<FacetConstraint>();
	}
	
	public Facet(IndexationFieldsEnum field) {
		this.field = field;
		this.locale = null;
		this.constraints = new ArrayList<FacetConstraint>();
	}

	public IndexationFieldsEnum getField() {
		return field;
	}
	
	public void setField(IndexationFieldsEnum field) {
		this.field = field;
	}
	
	public String getFieldName() {
		if (field.isLocalized()) {
			return field.getField(locale);
		} else {
			return field.getField();
		}
	}
	
	public String getLocale() {
		return locale;
	}
	
	public void setLocale(String locale) {
		this.locale = locale;
	}

	public List<FacetConstraint> getConstraints() {
		return constraints;
	}

	public void addConstraint(FacetConstraint constraint) {
		constraints.add(constraint);
	}
	
	public boolean hasSelectedConstraints() {
		return getSelectedConstraints().size() > 0;
	}
	
	public List<FacetConstraint> getSelectedConstraints() {
		List<FacetConstraint> list = new ArrayList<FacetConstraint>();
		for (FacetConstraint fc : constraints) {
			if (fc.isSelected()) {
				list.add(fc);
			}
		}
		return list;
	}
	
	public String getFilterQuery() {
		if (hasSelectedConstraints()) {
			String field_locale = locale == null? this.field.getField() : this.field.getField(locale);
			StringBuffer strBuf = new StringBuffer(field_locale+":(");
			for (FacetConstraint fc : constraints) {
				if (fc.isSelected()) {
					strBuf.append("\"").append(fc.getCode()).append("\"");
				}
			}
			strBuf.append(")");
			return strBuf.toString();
		} 
		return "";
	}
}
