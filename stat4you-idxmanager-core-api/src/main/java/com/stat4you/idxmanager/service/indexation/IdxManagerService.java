package com.stat4you.idxmanager.service.indexation;

import com.stat4you.idxmanager.exception.IdxManagerException;

public interface IdxManagerService {

	public abstract void indexDatasetPublished(String datasetUri) throws IdxManagerException;
	public abstract void indexProvider(String providerUri) throws IdxManagerException;

	public abstract void indexDatasetsPublished(boolean canCommit) throws IdxManagerException;
	public abstract void indexProviders(boolean canCommit) throws IdxManagerException;

	public abstract void removeDataset(String datasetUri) throws IdxManagerException;
	public abstract void removeProvider(String providerUri) throws IdxManagerException;

	//Index Administration
	public abstract void clearIndex() throws IdxManagerException;
    public abstract void clearIndexNoCommit() throws IdxManagerException;
    public abstract void reloadIndex() throws IdxManagerException;
}