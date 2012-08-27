package com.stat4you.web.search;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.ArrayUtils;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.view.RedirectView;

import com.stat4you.idxmanager.domain.IndexationFieldsEnum;
import com.stat4you.idxmanager.domain.ResourceTypeEnum;
import com.stat4you.idxmanager.exception.IdxManagerException;
import com.stat4you.idxmanager.service.indexation.IdxManagerService;
import com.stat4you.idxmanager.service.search.FilteredField;
import com.stat4you.idxmanager.service.search.ResultDocument;
import com.stat4you.idxmanager.service.search.SearchQuery;
import com.stat4you.idxmanager.service.search.SearchService;
import com.stat4you.web.BaseController;
import com.stat4you.web.WebConstants;

@Controller
public class SearchController extends BaseController {

    private static Logger     LOG = LoggerFactory.getLogger(SearchController.class);

    @Autowired
    private IdxManagerService idxManagerService;

    @Autowired
    private SearchService     searchService;

    // @Autowired
    // private DsdService dsdService;

    @RequestMapping(value = "/api/NOMBRE_API/v1.0/search", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<SearchResult> apiSearch(@RequestParam(value = "page", required = false) Integer page,
                                                  @RequestParam(value = "limit", required = false) Integer limit,
                                                  @RequestParam(value = "faceted", required = false, defaultValue = "true") boolean faceted,
                                                  HttpServletRequest request) throws ApplicationException {

        LOG.debug("Query: {}", request.getQueryString());
        
        // TODO get the correct locale
        String locale = "es";

        SearchQuery query = createQueryFromRequest(request, locale);
        SearchResult result = new SearchResult(query.getUserQuery(), locale);
        addDatasetFilter(query);
        query.setFaceted(faceted);
        try {

            if (page != null) {
                query.setStartResult(page);
            }

            if (limit == null) {
                limit = 25;
            }

            com.stat4you.idxmanager.service.search.SearchResult runQueryResult = searchService.runQuery(query, limit);

            List<SearchDatasetResult> results = processSearchDatasetResults(runQueryResult.getResults(), locale);
            result.setResults(results);
            result.setFaceted(faceted);
            if (runQueryResult.getFacets() != null) {
                result.setFacets(runQueryResult.getFacets());
            }
            result.setNumFound(runQueryResult.getNumFound());
        } catch (IdxManagerException e) {
            // TODO error handling
        }

        return new ResponseEntity<SearchResult>(result, HttpStatus.OK);
    }

    private void addDatasetFilter(SearchQuery query) {
        FilteredField filteredField = new FilteredField(IndexationFieldsEnum.TYPE);
        filteredField.addConstraint(ResourceTypeEnum.DSET.getType());
        query.addFilteredField(filteredField);
    }

    @RequestMapping(value = "/search", method = RequestMethod.GET)
    public ModelAndView search(HttpServletRequest request) throws IOException {
        ModelAndView mav = new ModelAndView(WebConstants.VIEW_NAME_SEARCH);

        /*
         * SearchQuery query = populateQueryFromRequest(request);
         * Map<String, Object> viewVars = new HashMap<String, Object>();
         * if (query != null) {
         * try {
         * // Just datasets
         * //TODO obtain the locale
         * String locale = "es";
         * com.stat4you.idxmanager.service.search.SearchResult result = searchService.runQuery(query, 10);
         * List<SearchDatasetResult> results = processSearchDatasetResults(result.getResults(), locale);
         * WebFacetSet facets = new WebFacetSet(result.getFacets());
         * mav.addObject("query", query.getUserQuery());
         * mav.addObject("resultList", results);
         * mav.addObject("facets", facets);
         * Map<String, Object> jsonFacets = new HashMap<String, Object>();
         * Facet frequentDimFacet = facets.getFrequentDimFacet(locale);
         * jsonFacets.put("frequentDimFacet", frequentDimFacet);
         * jsonFacets.put("spatialFacet", facets.getSpatialFacet(locale));
         * jsonFacets.put("yearFacet", facets.getYearFacet());
         * jsonFacets.put("categoryFacet", facets.getCategoryFacet(locale));
         * jsonFacets.put("selectedFacetConstraints", facets.getSelectedFacetConstraints());
         * jsonFacets.put("selectedFacets", facets.getSelectedFacets());
         * jsonFacets.put("yearFacet", facets.getYearFacet());
         * viewVars.put("query", query.getUserQuery());
         * viewVars.put("resultList", results);
         * viewVars.put("facets", jsonFacets);
         * } catch (IdxManagerException e) {
         * }
         * } else {
         * mav.addObject("query", StringUtils.EMPTY);
         * viewVars.put("query", StringUtils.EMPTY);
         * }
         * ObjectMapper mapper = new ObjectMapper();
         * String providersJson = mapper.writeValueAsString(viewVars);
         * mav.addObject("viewVars", providersJson);
         */
        return mav;
    }

    private SearchQuery createQueryFromRequest(HttpServletRequest request, String locale) {
        String userQuery = request.getParameter("q");
        if (userQuery != null) {
            SearchQuery query = new SearchQuery();
            query.setUserQuery(userQuery);
            query.setLocale(locale);

            // Permitimos recibir todos los facets
            for (IndexationFieldsEnum field : IndexationFieldsEnum.values()) {
                if (field.isFacet()) {
                    if (field.isLocalized()) {
                        for (String lang : IndexationFieldsEnum.getIndexationLanguages()) {
                            String[] codes = request.getParameterValues(field.getField(lang));
                            if (ArrayUtils.isNotEmpty(codes)) {
                                FilteredField ffield = new FilteredField(field, lang);
                                for (String code : codes) {
                                    ffield.addConstraint(code);
                                }
                                query.addFilteredField(ffield);
                            }
                        }
                    } else {
                        String[] codes = request.getParameterValues(field.getField());
                        if (ArrayUtils.isNotEmpty(codes)) {
                            FilteredField ffield = new FilteredField(field);
                            for (String code : codes) {
                                ffield.addConstraint(code);
                            }
                            query.addFilteredField(ffield);
                        }
                    }
                }
            }
            return query;
        }
        return null;
    }

    // TODO: Solo para pruebas del buscador
    @RequestMapping(value = "search/index", method = RequestMethod.GET)
    public View index(HttpServletRequest request) throws Exception {
        idxManagerService.reloadIndex();
        View view = new RedirectView("");
        return view;
    }

    private List<SearchDatasetResult> processSearchDatasetResults(List<ResultDocument> docList, String locale) {
        List<SearchDatasetResult> results = new ArrayList<SearchDatasetResult>();
        for (ResultDocument doc : docList) {
            SearchDatasetResult single = new SearchDatasetResult();

            // Mandatory fields
            single.setUri(doc.getStringField(IndexationFieldsEnum.ID));
            single.setType(ResourceTypeEnum.DSET.getText());
            single.setUrl("datasets/" + single.getUri());

            if (!IndexationFieldsEnum.getIndexationLanguages().contains(locale)) {
                locale = IndexationFieldsEnum.getIndexationLanguages().get(0);
            }

            single.setName(doc.getStringField(IndexationFieldsEnum.DS_NAME, locale));

            // PUB DATE
            Date provPublishingDate = doc.getDateField(IndexationFieldsEnum.DS_PROV_PUB_DATE);
            if (provPublishingDate != null) {
                single.setProviderPublishingDate(provPublishingDate);
            }

            // ACRONYM
            String provAcronym = doc.getStringField(IndexationFieldsEnum.DS_PROV_ACRONYM);
            if (provAcronym != null) {
                single.setAcronym(provAcronym);
            }

            // Identifier
            String identifier = doc.getStringField(IndexationFieldsEnum.DS_IDENTIFIER);
            if (identifier != null) {
                single.setIdentifier(identifier);
            }

            results.add(single);
        }
        return results;
    }

}
