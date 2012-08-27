package com.stat4you.idxmanager.service.search;

import java.util.ArrayList;
import java.util.List;

import com.stat4you.idxmanager.domain.IndexationFieldsEnum;
import com.stat4you.idxmanager.domain.OperationTypeEnum;
import com.stat4you.idxmanager.domain.SortOperationTypeEnum;

public class SortedField {
	private IndexationFieldsEnum field;
	private String locale;
	private SortOperationTypeEnum sortMethod;
	
	public SortedField(IndexationFieldsEnum field, String locale) {
		this.field = field;
		this.locale = locale;
		this.sortMethod = SortOperationTypeEnum.ASC;
	}
	
	public SortedField(IndexationFieldsEnum field) {
		this.field = field;
		this.locale = null;
		this.sortMethod = SortOperationTypeEnum.ASC;
	}
	
	public IndexationFieldsEnum getField() {
		return field;
	}
	
	public String getFieldName() {
	    if (field.isLocalized() && locale != null) {
	        return field.getField(locale);
	    } else {
	        return field.getField();
	    }
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
	
	public SortOperationTypeEnum getSortMethod() {
		return sortMethod;
	}
	
	public void setSortMethod(SortOperationTypeEnum sortMethod) {
		this.sortMethod = sortMethod;
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
	
	public String getSortQuery() {
		/*if (hasSelectedConstraints()) {
			String field_locale = locale == null? this.field.getField() : this.field.getField(locale);
			StringBuffer strBuf = new StringBuffer(field_locale+":(");
			for (int i = 0 ; i < constraints.size(); i++){
				if (i > 0 && sortMethod != null) {
					strBuf.append(sortMethod.name());
				}
				strBuf.append("\"").append(constraints.get(i)).append("\"");
			}
			strBuf.append(")");
			return strBuf.toString();
		} */
		return "";
	}
}
