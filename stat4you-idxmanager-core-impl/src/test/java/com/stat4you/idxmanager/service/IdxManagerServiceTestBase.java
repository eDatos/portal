package com.stat4you.idxmanager.service;

public interface IdxManagerServiceTestBase {

	public abstract void testIndexJob() throws Exception;
	
	public abstract void testIndexDataset() throws Exception;
	
	public abstract void testIndexDatasetStemming() throws Exception;
	
	public abstract void testDeleteIndexedDataset() throws Exception;
	
	public abstract void testReindexDataset() throws Exception;

	public abstract void testIndexPublishedDatasets() throws Exception;

	public abstract void testIndexProvider() throws Exception;
	
	public abstract void testDeleteIndexedProvider() throws Exception;

	public abstract void testIndexProviders() throws Exception;
	
}