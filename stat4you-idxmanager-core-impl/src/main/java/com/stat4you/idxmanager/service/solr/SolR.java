package com.stat4you.idxmanager.service.solr;

import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.request.ContentStreamUpdateRequest;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrInputDocument;
import org.apache.solr.common.util.NamedList;

import com.stat4you.idxmanager.exception.SolrServiceException;

public interface SolR {
	
	public void deleteAllAndCommit() throws SolrServiceException;
	
	public void deleteWithoutCommit(String query) throws SolrServiceException;
	
	public void insertDoc(SolrInputDocument solrInputDocument) throws SolrServiceException;
	
	public void commitAndOptimize() throws SolrServiceException;
	
	public void commit() throws SolrServiceException;
	
	public void deleteDoc(String id) throws SolrServiceException;
	
	public QueryResponse runQuery(SolrQuery solrQuery) throws SolrServiceException;
	
	public NamedList<Object> runContentStreamUpdateRequest(ContentStreamUpdateRequest contentStreamUpdateRequest) throws SolrServiceException;
}
