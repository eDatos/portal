package com.stat4you.idxmanager.service.indexation;

import java.util.ArrayList; 
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.collections.CollectionUtils;
import org.apache.solr.common.SolrInputDocument;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stat4you.common.criteria.Stat4YouCriteria;
import com.stat4you.common.criteria.Stat4YouCriteriaPaginator;
import com.stat4you.common.criteria.Stat4YouCriteriaResult;
import com.stat4you.common.dto.InternationalStringDto;
import com.stat4you.common.dto.LocalisedStringDto;
import com.stat4you.common.uri.UriData;
import com.stat4you.common.uri.UriFactory;
import com.stat4you.statistics.dsd.domain.DimensionTypeEnum;
import com.stat4you.statistics.dsd.dto.CodeDimensionDto;
import com.stat4you.statistics.dsd.dto.DatasetBasicDto;
import com.stat4you.statistics.dsd.dto.DimensionDto;
import com.stat4you.statistics.dsd.dto.ProviderDto;
import com.stat4you.statistics.dsd.service.DsdService;
import com.stat4you.idxmanager.domain.IndexationFieldsEnum;
import com.stat4you.idxmanager.domain.ResourceTypeEnum;
import com.stat4you.idxmanager.exception.IdxManagerException;
import com.stat4you.idxmanager.exception.IdxManagerExceptionType;
import com.stat4you.idxmanager.exception.SolrServiceException;
import com.stat4you.idxmanager.service.solr.SolR;
import com.stat4you.normalizedvalues.dto.CategoryDto;
import com.stat4you.normalizedvalues.service.NormalizedValuesService;

@Service("idxManagerService")
public class IdxManagerServiceImpl implements IdxManagerService {
	private final Logger logger = LoggerFactory.getLogger(getClass());
	private final Pattern YEAR_REGEXP = Pattern.compile("\\d\\d\\d\\d");
	
	@Autowired
	private DsdService dsdService;
	
	@Autowired
	private NormalizedValuesService normalizedValuesService;
	
	@Autowired
	private SolR solr;
	
	@Override
	public void indexDatasetPublished(String datasetUri) throws IdxManagerException {
		try {
			DatasetBasicDto dataset = dsdService.retrieveDatasetPublished(getServiceContext(), datasetUri);
			List<DimensionDto> dimensions = dsdService.retrieveDatasetDimensions(getServiceContext(), datasetUri);
			SolrInputDocument doc = getSolrDocumentFromDataSet(dataset, dimensions);
			solr.insertDoc(doc);
			solr.commitAndOptimize();
			logger.info("Dataset "+dataset.getUri()+" has been indexed");
		} catch (Exception e) {
			logger.error("Exception indexing dataset "+e.getLocalizedMessage(),e);
			throw new IdxManagerException(IdxManagerExceptionType.SERVICE_INDEX_GENERAL,e);
		}
	}
	
	@Override
	public void indexProvider(String providerUri) throws IdxManagerException {
		try {
			ProviderDto provider = dsdService.retrieveProvider(getServiceContext(), providerUri);
			
			SolrInputDocument doc = getSolrDocumentFromProvider(provider);
			solr.insertDoc(doc);
			solr.commitAndOptimize();
			logger.info("Provider "+provider.getUri()+" has been indexed");
		} catch (Exception e) {
			logger.error("Exception indexing provider "+e.getLocalizedMessage(),e);
			throw new IdxManagerException(IdxManagerExceptionType.SERVICE_INDEX_GENERAL,e);
		}
	}
	
	@Override
	//TODO: ServiceContext
	public void indexDatasetsPublished(boolean commitAfter) throws IdxManagerException {
		try {
		    Stat4YouCriteria criteria = new Stat4YouCriteria();
		    criteria.setPaginator(new Stat4YouCriteriaPaginator());
		    criteria.getPaginator().setFirstResult(Integer.valueOf(0));
		    criteria.getPaginator().setCountTotalResults(Boolean.FALSE);
		    criteria.getPaginator().setMaximumResultSize(Integer.valueOf(200)); // TODO cuál sería el número óptimo?
		    
		    Stat4YouCriteriaResult<DatasetBasicDto> criteriaResult = null;
		    do {
    			criteriaResult = dsdService.findDatasetsPublished(getServiceContext(), criteria);
    			if (!CollectionUtils.isEmpty(criteriaResult.getResults())) {
    	            for (DatasetBasicDto dataset : criteriaResult.getResults()) {
    	                List<DimensionDto> dimensions = dsdService.retrieveDatasetDimensions(getServiceContext(), dataset.getUri());
    	                SolrInputDocument solrDoc = getSolrDocumentFromDataSet(dataset,dimensions);
    	                solr.insertDoc(solrDoc);
    	            }
    			} else {
    			    break;
    			}
    			criteria.getPaginator().setFirstResult(criteria.getPaginator().getFirstResult() + criteriaResult.getPaginatorResult().getMaximumResultSize());
		    } while (criteriaResult.getResults().size() == criteriaResult.getPaginatorResult().getMaximumResultSize());
		    
			if (commitAfter) {
				solr.commitAndOptimize();
			}
			logger.info("Published Datasets have been indexed");
		} catch (Exception e) {
			logger.error("Exception indexing Published datasets "+e.getLocalizedMessage(),e);
			throw new IdxManagerException(IdxManagerExceptionType.SERVICE_INDEX_GENERAL,e);
		}
	}
	
	@Override
	public void indexProviders(boolean commitAfter) throws IdxManagerException {
		try {
			List<ProviderDto> results = dsdService.retrieveProviders(getServiceContext());
			for (ProviderDto provider : results) {
			    if (provider.getRemovedDate() == null) {
    				SolrInputDocument solrDoc = getSolrDocumentFromProvider(provider);
    				solr.insertDoc(solrDoc);
			    }
			}
			if (commitAfter && results.size() > 0) {
				solr.commitAndOptimize();
			}
			logger.info("Providers have been indexed");
		} catch (Exception e) {
			logger.error("Exception indexing Published datasets "+e.getLocalizedMessage(),e);
			throw new IdxManagerException(IdxManagerExceptionType.SERVICE_INDEX_GENERAL,e);
		}
	}
	
	@Override
	public void removeDataset(String datasetUri) throws IdxManagerException {
		try {
			solr.deleteDoc(datasetUri);
			solr.commitAndOptimize();
			logger.info("Dataset "+datasetUri+" has been removed from index");
		} catch (SolrServiceException e) {
			throw new IdxManagerException(IdxManagerExceptionType.SERVICE_INDEX_GENERAL,e);
		}
	}
	
	@Override
	public void removeProvider(String providerUri) throws IdxManagerException {
		 try {
			 solr.deleteDoc(providerUri);
			 solr.commitAndOptimize();
			 logger.info("Provider "+providerUri+" has been removed from index");
		 } catch (SolrServiceException e) {
			 throw new IdxManagerException(IdxManagerExceptionType.SERVICE_INDEX_GENERAL,e);
		 }
	}
	
	@Override
	public void clearIndex() throws IdxManagerException {
		try {
			solr.deleteAllAndCommit();
			logger.info("Index has been cleared");
		} catch (SolrServiceException e) {
			throw new IdxManagerException(IdxManagerExceptionType.SERVICE_INDEX_GENERAL,e);
		}
	}
	
	@Override
	public void clearIndexNoCommit() throws IdxManagerException {
	    try {
	        solr.deleteWithoutCommit("*:*");
	        logger.info("Index has been cleared but not committed");
	    } catch (SolrServiceException e) {
	        throw new IdxManagerException(IdxManagerExceptionType.SERVICE_INDEX_GENERAL,e);
	    }
	}
	
	@Override
	public void reloadIndex() throws IdxManagerException {
	    try {
	        clearIndexNoCommit();
	        logger.info("Index has been cleared but not committed");
	        indexDatasetsPublished(false); //No partial commit
	        indexProviders(false);
	        solr.commitAndOptimize();
	    } catch (SolrServiceException e) {
	        throw new IdxManagerException(IdxManagerExceptionType.SERVICE_INDEX_GENERAL,e);
	    }
	}
	
	
	/* Transforms to SolrDocument*/
	private SolrInputDocument getSolrDocumentFromDataSet(DatasetBasicDto dataset, List<DimensionDto> dimensions) {
		SolrInputDocument doc = new SolrInputDocument();
		String cleanUri = getUriWithoutVersion(dataset.getUri()); 
		doc.addField(IndexationFieldsEnum.ID.getField(), cleanUri);
		doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.DSET.getType());
		doc.addField(IndexationFieldsEnum.DS_IDENTIFIER.getField(), dataset.getIdentifier());
		
		doc = addInternationalStringToDocField(doc, IndexationFieldsEnum.DS_NAME, dataset.getTitle());
		
		if (dataset.getProviderPublishingDate() != null) {
			doc.addField(IndexationFieldsEnum.DS_PROV_PUB_DATE.getField(), dataset.getProviderPublishingDate().toDate());
		}
		
		if (dataset.getPublishingDate() != null) {
		    doc.addField(IndexationFieldsEnum.DS_PUB_DATE.getField(), dataset.getPublishingDate().toDate());
		}
		
		if (dataset.getCategories() != null) {
		    for (String categoryCode : dataset.getCategories()) {
    			try {
    				CategoryDto category = normalizedValuesService.retrieveCategory(getServiceContext(), categoryCode);
    				doc = addInternationalStringToDocField(doc, IndexationFieldsEnum.DS_CATEGORY, category.getValue());
    			} catch (ApplicationException e) {
    				logger.warn("Error al obtener la categoria del dataset en indexación Dataset:["+dataset.getIdentifier()+"]",e);
    			}
		    }
		}
		
		if (dataset.getProviderUri() != null) {
			try {
				ProviderDto provider = dsdService.retrieveProvider(getServiceContext(), dataset.getProviderUri());
				doc.addField(IndexationFieldsEnum.DS_PROV_ACRONYM.getField(), provider.getAcronym());
			} catch (ApplicationException e) {
				logger.error("Error al obtener el provider del dataset a indexar uri provider:"+dataset.getProviderUri(),e);
			}
		}

		
		/* Indexamos ciertos code dimensions sobre todo para los facets */
		for (DimensionDto dim : dimensions) {
			if (DimensionTypeEnum.GEOGRAPHIC_DIMENSION.equals(dim.getType())) {
				List<CodeDimensionDto> codes = getCodeDimensionsDeep(dim.getCodes());
				for (CodeDimensionDto code : codes) {
				    doc = addInternationalStringToDocField(doc, IndexationFieldsEnum.FF_SPATIAL_CODEDIMS, code.getTitle());
				}
			} else if (DimensionTypeEnum.TIME_DIMENSION.equals(dim.getType())) {
				List<CodeDimensionDto> codes = getCodeDimensionsDeep(dim.getCodes());
				for (CodeDimensionDto code : codes) {
					List<String> years = parseYearFromCodeDimTitle(code);
					for (String year : years) {
						doc.addField(IndexationFieldsEnum.FF_TEMPORAL_YEARS.getField(), year);
					}
				}
			}
			
			//Indexing dimension name itself
			doc = addInternationalStringToDocField(doc, IndexationFieldsEnum.FF_DIMENSIONS, dim.getTitle());
		}
		
		return doc;
	}
	
	private String getUriWithoutVersion(String uri) {
	    UriData uriData = UriFactory.getUriData(uri);
	    uriData.setVersion(null);
	    return UriFactory.getUri(uriData);
    }

    private SolrInputDocument addInternationalStringToDocField(SolrInputDocument doc, IndexationFieldsEnum field, InternationalStringDto internationalStr) {
	    List<String> unknownLocales = new ArrayList<String>();
	    for (LocalisedStringDto localized : internationalStr.getTexts()) {
            if (IndexationFieldsEnum.getIndexationLanguages().contains(localized.getLocale())) {
                doc.addField(field.getField(localized.getLocale()), localized.getLabel());
            } else {
                unknownLocales.add(localized.getLabel());
            }
        }
	    
	    for (String unknownLocale : unknownLocales) {
	        doc.addField(field.getField(IndexationFieldsEnum.UNKNOWN_LOCALE), unknownLocale);
	    }
	    return doc;
	}
	
	private List<CodeDimensionDto> getCodeDimensionsDeep(List<CodeDimensionDto> codes) {
		List<CodeDimensionDto> codesResult = new ArrayList<CodeDimensionDto>();
		for (CodeDimensionDto codeDim: codes) {
			codesResult.add(codeDim);
			if (codeDim.getSubcodes() != null) {
				codesResult.addAll(getCodeDimensionsDeep(codeDim.getSubcodes()));
			}
		}
		return codesResult;
	}
	
	private SolrInputDocument getSolrDocumentFromProvider(ProviderDto provider) {
		SolrInputDocument doc = new SolrInputDocument();
		doc.addField(IndexationFieldsEnum.ID.getField(), provider.getUri());
		doc.addField(IndexationFieldsEnum.TYPE.getField(), ResourceTypeEnum.PROV.getType());
		doc.addField(IndexationFieldsEnum.PROV_NAME.getField(), provider.getName());
		doc.addField(IndexationFieldsEnum.DS_PROV_ACRONYM.getField(), provider.getAcronym());
		return doc;
	}
	
	private List<String> parseYearFromCodeDimTitle(CodeDimensionDto code) {
		List<String> years = new ArrayList<String>();
		if (code.getTitle().getTexts().size() > 0) {
			LocalisedStringDto localStr = code.getTitle().getTexts().get(0);
			String label = localStr.getLabel();
			Matcher matcher = YEAR_REGEXP.matcher(label);
			while (matcher.find()) {
				String year = matcher.group();
				try {
					int yearInt = Integer.parseInt(year);
					if (yearInt >= 1900 && yearInt <= 2100) {
						years.add(year);
					}
				} catch (NumberFormatException e) {
					//No valid year
				}
			}
			return years;
		}
		return null;
	}
	
	//TODO: Should this be a parameter?
	private ServiceContext getServiceContext() {
		return new ServiceContext("userTODO", "sessionTODO", "appTODO");
	}

}
