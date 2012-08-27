package com.stat4you.idxmanager.service.solr;

import javax.annotation.PostConstruct;

import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.request.ContentStreamUpdateRequest;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrInputDocument;
import org.apache.solr.common.util.NamedList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

import com.stat4you.idxmanager.exception.SolrServiceException;
import com.stat4you.idxmanager.exception.SolrServiceExceptionType;



public class SolrRBaseImpl implements SolR {
	
	protected static Logger logger = LoggerFactory.getLogger(SolR.class);
	
	@Autowired
	private SolrServer solrServer = null;
	
	@PostConstruct
	public void afterPropertiesSet() throws Exception {
	    Assert.notNull(solrServer);
	}

	/***************************************************************************
	 * 						METODOS DE LA INTERFAZ
	 ***************************************************************************/
	
	@Override
	public void deleteAllAndCommit() throws SolrServiceException {
		try {
			solrServer.deleteByQuery("*:*");
			solrServer.commit();
		} catch (Exception e) {
			throw new SolrServiceException(SolrServiceExceptionType.SERVICE_GENERAL, e);
		} 
	}

	@Override
	public void deleteWithoutCommit(String query) throws SolrServiceException {
		try {
			solrServer.deleteByQuery(query);
		} catch (Exception e) {
			throw new SolrServiceException(SolrServiceExceptionType.SERVICE_GENERAL, e);
		} 
	}
	
	@Override
	public void insertDoc(SolrInputDocument solrInputDocument) throws SolrServiceException {
		try {
			solrServer.add(solrInputDocument);
		} catch (Exception e) {
			throw new SolrServiceException(SolrServiceExceptionType.SERVICE_GENERAL, e);
		}
	}

	@Override
	public void commitAndOptimize()  throws SolrServiceException {
		try {
			solrServer.commit();
			solrServer.optimize();
		} catch (Exception e) {
			throw new SolrServiceException(SolrServiceExceptionType.SERVICE_GENERAL, e);
		}
	}

    @Override
	public void commit() throws SolrServiceException  {
		try {
			solrServer.commit();
		} catch (Exception e) {
			throw new SolrServiceException(SolrServiceExceptionType.SERVICE_GENERAL, e);
		}
	}
	
    @Override
	public void deleteDoc(String id) throws SolrServiceException {
		try {
			solrServer.deleteById(id);
		} catch (Exception e) {
			throw new SolrServiceException(SolrServiceExceptionType.SERVICE_GENERAL, e);
		}
	}

    @Override
	public QueryResponse runQuery(SolrQuery solrQuery) throws SolrServiceException {
		try {
			return solrServer.query(solrQuery);
		} catch (SolrServerException e) {
			throw new SolrServiceException(SolrServiceExceptionType.SERVICE_GENERAL, e);
		}
	}

    @Override
	public NamedList<Object> runContentStreamUpdateRequest(ContentStreamUpdateRequest contentStreamUpdateRequest) throws SolrServiceException {
		try {
			return solrServer.request(contentStreamUpdateRequest);
		} catch (Exception e) {
			throw new SolrServiceException(SolrServiceExceptionType.SERVICE_GENERAL, e);
		}
	}
	
	/***************************************************************************
	 * 						METODOS PROTEGIDOS
	 ***************************************************************************/

}
