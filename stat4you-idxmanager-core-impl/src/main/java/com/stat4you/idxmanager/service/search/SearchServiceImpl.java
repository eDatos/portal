package com.stat4you.idxmanager.service.search;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrQuery.ORDER;
import org.apache.solr.client.solrj.response.FacetField;
import org.apache.solr.client.solrj.response.FacetField.Count;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stat4you.common.dto.InternationalStringDto;
import com.stat4you.common.dto.LocalisedStringDto;
import com.stat4you.idxmanager.domain.DatasetBasicIdx;
import com.stat4you.idxmanager.domain.IndexationFieldsEnum;
import com.stat4you.idxmanager.domain.ResourceTypeEnum;
import com.stat4you.idxmanager.domain.SortOperationTypeEnum;
import com.stat4you.idxmanager.exception.IdxManagerException;
import com.stat4you.idxmanager.exception.IdxManagerExceptionType;
import com.stat4you.idxmanager.service.solr.SolR;

@Service
public class SearchServiceImpl implements SearchService {
	
	private static Logger logger = LoggerFactory.getLogger(SearchService.class);
	
	@Autowired
    private SolR solr = null;
	
	public SearchResult runQuery(SearchQuery searchQuery, int resultByPage) throws IdxManagerException {
		try {
			SolrQuery solrQuery = new SolrQuery();
			addQueryAvanzado(searchQuery, solrQuery);

			solrQuery.setStart(searchQuery.getStartResult() * resultByPage);
			solrQuery.setRows(resultByPage);
			
			solrQuery.setTimeAllowed(10000);
			QueryResponse response = solr.runQuery(solrQuery);
			SearchResult result = processResult(searchQuery,response);
			return result;
		}
		catch (Exception e) {
			logger.error("Exception in runQuery: " + e.getLocalizedMessage(),e);
			throw new IdxManagerException(IdxManagerExceptionType.SERVICE_SEARCH_GENERAL,e);
		}
	}
	
	public List<DatasetBasicIdx> findLastPublishedDatasets(int maxResult) throws IdxManagerException {
	    SearchQuery query = new SearchQuery();
	    //Just datasets
	    FilteredField filterType = new FilteredField(IndexationFieldsEnum.TYPE);
	    filterType.addConstraint(ResourceTypeEnum.DSET.getType());
	    query.addFilteredField(filterType);
	    //Sort
	    SortedField publishDateSort = new SortedField(IndexationFieldsEnum.DS_PROV_PUB_DATE);
	    publishDateSort.setSortMethod(SortOperationTypeEnum.DESC);
	    query.addSortedField(publishDateSort);
	    
	    query.setFaceted(false);
	    SearchResult result = runQuery(query, maxResult);
	    return processResultDocumentsToDatasetBasic(result.getResults());
	}
	
	public List<DatasetBasicIdx> findLastPublishedDatasetsByProvider(String providerAcronym, int maxResult) throws IdxManagerException {
	    SearchQuery query = new SearchQuery();
	    //Just datasets
	    FilteredField filterType = new FilteredField(IndexationFieldsEnum.TYPE);
	    filterType.addConstraint(ResourceTypeEnum.DSET.getType());
	    FilteredField filterProvider = new FilteredField(IndexationFieldsEnum.DS_PROV_ACRONYM);
	    filterProvider.addConstraint(providerAcronym);
	    query.addFilteredField(filterProvider);
	    query.addFilteredField(filterType);
	    //Sort
	    SortedField publishDateSort = new SortedField(IndexationFieldsEnum.DS_PROV_PUB_DATE);
	    publishDateSort.setSortMethod(SortOperationTypeEnum.DESC);
	    query.addSortedField(publishDateSort);
	    
	    query.setFaceted(false);
	    SearchResult result = runQuery(query, maxResult);
	    return processResultDocumentsToDatasetBasic(result.getResults());
	}
	

	/**************************************************************************
	 *  PRIVADOS
	 **************************************************************************/
	private List<DatasetBasicIdx> processResultDocumentsToDatasetBasic(List<ResultDocument> documents) {
	    List<DatasetBasicIdx> datasets = new ArrayList<DatasetBasicIdx>();
	    
	    for (ResultDocument doc : documents) {
	        if (ResourceTypeEnum.DSET.getType().equals(doc.getStringField(IndexationFieldsEnum.TYPE))) {
    	        DatasetBasicIdx dataset = new DatasetBasicIdx();
    	        //Publishing date
    	        Date publishingDate = doc.getDateField(IndexationFieldsEnum.DS_PUB_DATE);
    	        if (publishingDate != null) {
    	            dataset.setPublishingDate(new DateTime(publishingDate));
    	        }
    	        //Provider publishing date
    	        Date providerPublishingDate = doc.getDateField(IndexationFieldsEnum.DS_PROV_PUB_DATE);
    	        if (providerPublishingDate != null) {
    	            dataset.setProviderPublishingDate(new DateTime(providerPublishingDate));
    	        }
    	        
    	        //Title
    	        InternationalStringDto nameInt = new InternationalStringDto();
    	        for (String locale : IndexationFieldsEnum.getIndexationLanguages()) {
    	            LocalisedStringDto localised = new LocalisedStringDto();
    	            localised.setLocale(locale);
    	            localised.setLabel(doc.getStringField(IndexationFieldsEnum.DS_NAME, locale));
    	            nameInt.addText(localised);
    	        }
    	        dataset.setTitle(nameInt);
    	        
    	        //URI
    	        dataset.setUri(doc.getStringField(IndexationFieldsEnum.ID));

    	        //IDENTIFIER
    	        dataset.setIdentifier(doc.getStringField(IndexationFieldsEnum.DS_IDENTIFIER));

                //Provider acronym
                dataset.setProviderAcronym(doc.getStringField(IndexationFieldsEnum.DS_PROV_ACRONYM));

    	        datasets.add(dataset);
	        }
	    }
	    return datasets;
	}
	
	private SearchResult processResult(SearchQuery query, QueryResponse response) {
		SearchResult result = new SearchResult();

        if (response.getResults() != null) {
			List<ResultDocument> results = new ArrayList<ResultDocument>();
			for (SolrDocument doc : response.getResults()) {
				ResultDocument resultDoc = new ResultDocument(doc);
				results.add(resultDoc);
			}
			result.setResults(results);
            result.setNumFound(response.getResults().getNumFound());
		}
        
		if (response.getFacetFields() != null) {
			FacetSet facetSet = new FacetSet();
			for (FacetField facetField : response.getFacetFields()) {
			    IndexationFieldsEnum fieldEnum = IndexationFieldsEnum.get(facetField.getName());
			    String locale = detectLocale(facetField.getName());
			    FilteredField ffield = query.getFilteredField(fieldEnum, locale);
			    
				if (facetField.getValues() != null) { //Facet has value in current results
					if (fieldEnum != null) {
						Facet facet = new Facet(fieldEnum,locale);
						
						for (Count count : facetField.getValues()) {
						    String constraintName = count.getName();
							FacetConstraint fconst = new FacetConstraint(constraintName);
							fconst.setCount(count.getCount());
							if (ffield != null && ffield.hasConstraint(constraintName)) {
							    fconst.setSelected(true);
							}
							facet.addConstraint(fconst);
						}
						facetSet.addFacet(facet);
					} else {
						logger.warn("Solr has returned an unknown facet "+facetField.getName());
					}
				} else if (ffield != null){ //Current facet has no values in current results, but has been selected before
                    Facet facet = new Facet(fieldEnum,locale);
                    for (String constraint : ffield.getConstraints()) {
                        FacetConstraint fconst = new FacetConstraint(constraint);
                        fconst.setCount(0);
                        fconst.setSelected(true);
                        facet.addConstraint(fconst);
                    }
                    facetSet.addFacet(facet);
				}
			}
			
			result.setFacets(facetSet);
		}
		return result;
	}
	
	private String detectLocale(String fieldName) {
		Pattern pat = Pattern.compile("_(\\w\\w)\\b");
		Matcher match = pat.matcher(fieldName);
		if (match.find()) {
			return match.group(1);
		}
		return null;
	}
	
	
	private void addQueryAvanzado(SearchQuery busqueda, SolrQuery solrQuery) {
		StringBuilder str = new StringBuilder(128);
		
		// Query
		if (StringUtils.isNotEmpty(busqueda.getUserQuery())) {
			str.append(busqueda.getUserQuery());
		}
		
		//Ask fields only in selected locale
		if (busqueda.getLocale() != null) {
		    List<String> fields = new ArrayList<String>();
		    for (IndexationFieldsEnum field: IndexationFieldsEnum.values()) {
		        if (!field.isFacet()) {
		            if (field.isLocalized()) {
		                fields.add(field.getField(busqueda.getLocale()));
		            } else {
		                fields.add(field.getField());
		            }
		        }
		    }
		    String[] fieldsNames = new String[fields.size()]; 
		    fieldsNames = fields.toArray(fieldsNames);
		    solrQuery.setFields(fieldsNames);
		}
		
		if (busqueda.hasSortedFields()) {
		    for (SortedField sortedField : busqueda.getSortedFields()) {
		        ORDER order = getSolrOrderFromSortedField(sortedField);
		        solrQuery.addSortField(sortedField.getFieldName(), order);
		    }
		}

		if (busqueda.isFaceted()) {
			buildFacets(busqueda,solrQuery);
			solrQuery.setFacetLimit(busqueda.getFacetLimit());
		}
		
		//Filter fields
	    for (FilteredField ffield : busqueda.getFilteredFields()) {
	        solrQuery.addFilterQuery(ffield.getFilterQuery());
	    }
		
		solrQuery.setQuery(str.toString());
	}
	
	private ORDER getSolrOrderFromSortedField(SortedField sortedField) {
	    if (SortOperationTypeEnum.ASC.equals(sortedField.getSortMethod())) {
	        return ORDER.asc;
	    } else if (SortOperationTypeEnum.DESC.equals(sortedField.getSortMethod())) {
	        return ORDER.desc;
	    } else {
	        return null;
	    }
	}

	private void buildFacets(SearchQuery busqueda, SolrQuery solrQuery) {
		solrQuery.setFacet(true);
		solrQuery.setFacetMinCount(1);
		String locale = busqueda.getLocale();
		
	    for (IndexationFieldsEnum field : IndexationFieldsEnum.values()) {
	        if (field.isFacet()) {
	            if (field.isLocalized()) {
	                if (locale == null) {
	                    for (String lang : IndexationFieldsEnum.getIndexationLanguages()) {
	                        solrQuery.addFacetField(field.getField(lang));
	                    }
	                } else {
	                    if (IndexationFieldsEnum.getIndexationLanguages().contains(locale)) {
	                        solrQuery.addFacetField(field.getField(locale));
	                    }
	                }
	            } else {
	                solrQuery.addFacetField(field.getField());
	            }
	        }
	    }
		
	}
	
}
