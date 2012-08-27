package com.stat4you.idxmanager.service;

import org.junit.Test;

public interface SearchServiceTestBase {

	@Test
	public abstract void testSearchDataset() throws Exception;
	@Test
	public abstract void testSearchProvider() throws Exception;
	@Test
	public abstract void testSearchFacetCategory() throws Exception;
	@Test
	public abstract void testSearchFacetMultiCategory() throws Exception;
	@Test
	public abstract void testSearchFacetSpatial() throws Exception;
	@Test
	public abstract void testSearchFacetYear() throws Exception;

}