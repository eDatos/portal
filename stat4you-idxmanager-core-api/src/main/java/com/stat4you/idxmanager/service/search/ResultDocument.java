package com.stat4you.idxmanager.service.search;

import java.util.Date;

import org.apache.solr.common.SolrDocument;

import com.stat4you.idxmanager.domain.IndexationFieldsEnum;

public class ResultDocument {

	private SolrDocument solrDoc;
	
	public ResultDocument(SolrDocument solrdocument) {
		this.solrDoc = solrdocument;
	}
	
	public Date getDateField(IndexationFieldsEnum field) {
		Object value = solrDoc.getFieldValue(field.getField());
		if (value instanceof Date) {
			return (Date)value;
		}
		return null;
	}
	
	public String getStringField(IndexationFieldsEnum field) {
		return getStringFieldOpt(field, null);
	}
	
	public String getStringField(IndexationFieldsEnum field, String locale) {
		return getStringFieldOpt(field, locale);
	}
	
	private String getStringFieldOpt(IndexationFieldsEnum field, String locale) {
		Object value;
		value = locale == null ? solrDoc.getFieldValue(field.getField()) : solrDoc.getFieldValue(field.getField(locale));
		if (value instanceof String) {
			return (String)value;
		}
		return null;
	}
}
