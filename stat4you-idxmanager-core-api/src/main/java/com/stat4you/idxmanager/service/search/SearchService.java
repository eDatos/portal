package com.stat4you.idxmanager.service.search;

import java.util.List;

import com.stat4you.idxmanager.domain.DatasetBasicIdx;
import com.stat4you.idxmanager.exception.IdxManagerException;

public interface SearchService {

	public SearchResult runQuery(SearchQuery searchQuey, int resultByPage) throws IdxManagerException;

	public List<DatasetBasicIdx> findLastPublishedDatasets(int maxResult) throws IdxManagerException;
	
	public List<DatasetBasicIdx> findLastPublishedDatasetsByProvider(String providerAcronym, int maxResult) throws IdxManagerException;
	
}
