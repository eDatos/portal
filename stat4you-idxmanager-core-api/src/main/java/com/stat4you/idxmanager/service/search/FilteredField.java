package com.stat4you.idxmanager.service.search;

import java.util.ArrayList;
import java.util.List;

import com.stat4you.idxmanager.domain.IndexationFieldsEnum;
import com.stat4you.idxmanager.domain.OperationTypeEnum;

public class FilteredField {
	private IndexationFieldsEnum field;
	private String locale;
	private OperationTypeEnum operation;
	private List<String> constraints;
	
	public FilteredField(IndexationFieldsEnum field, String locale) {
		this.field = field;
		this.locale = locale;
		this.operation = OperationTypeEnum.AND;
		this.constraints = new ArrayList<String>();
	}
	public FilteredField(IndexationFieldsEnum field) {
		this.field = field;
		this.locale = null;
		this.operation = OperationTypeEnum.AND;
		this.constraints = new ArrayList<String>();
	}
	
	public IndexationFieldsEnum getField() {
		return field;
	}
	
	public void setField(IndexationFieldsEnum field) {
		this.field = field;
	}
	
	public String getLocale() {
		return locale;
	}
	
	public void setLocale(String locale) {
		this.locale = locale;
	}
	
	public OperationTypeEnum getOperation() {
		return operation;
	}
	
	public void setOperation(OperationTypeEnum operation) {
		this.operation = operation;
	}

	public List<String> getConstraints() {
		return constraints;
	}

	public void addConstraint(String code) {
		constraints.add(code);
	}
	
	public boolean hasSelectedConstraints() {
		return constraints.size() > 0;
	}
	
	public boolean hasConstraint(String constr) {
	    return constraints.contains(constr);
	}
	
	public boolean isSameField(IndexationFieldsEnum field, String locale) {
	    if (this.field.equals(field)) {
	        if (this.locale == null && locale == null) {
	            return true;
	        } else if (this.locale != null && this.locale.equals(locale)) {
	            return true;
	        }
	    }
	    return false;
	}
	
	public String getFilterQuery() {
		if (hasSelectedConstraints()) {
			String field_locale = locale == null? this.field.getField() : this.field.getField(locale);
			StringBuffer strBuf = new StringBuffer(field_locale+":(");
			for (int i = 0 ; i < constraints.size(); i++){
				if (i > 0 && operation != null) {
					strBuf.append(operation.name());
				}
				strBuf.append("\"").append(constraints.get(i)).append("\"");
			}
			strBuf.append(")");
			return strBuf.toString();
		} 
		return "";
	}
}
