package org.siemac.metamac.portal;

import org.apache.cxf.jaxrs.client.JAXRSClientFactory;
import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;
import org.siemac.metamac.rest.common.v1_0.domain.LocalisedString;
import org.siemac.metamac.portal.dto.Chapter;
import org.siemac.metamac.portal.dto.Collection;
import org.siemac.metamac.portal.dto.CollectionNode;
import org.siemac.metamac.portal.dto.Dataset;
import org.siemac.metamac.portal.dto.Query;
import org.siemac.metamac.portal.dto.Table;
import org.siemac.metamac.portal.mapper.Collection2DtoMapper;
import org.siemac.metamac.portal.mapper.Dataset2DtoMapper;
import org.siemac.metamac.portal.mapper.Query2DtoMapper;

import java.util.ArrayList;
import java.util.List;

public class Helpers {    

    public static Collection getCollection(String apiUrlStatisticalResources, Boolean internalPortal, String agencyId, String resourceId) {
        Collection collection = null;
        Collection2DtoMapper collection2DtoMapper = new Collection2DtoMapper();
        try {
            //String statisticalResourcesEndpoint = "http://estadisticas.arte-consultores.com/statistical-resources/apis/statistical-resources";
            String statisticalResourcesEndpoint = apiUrlStatisticalResources;                            

            List<String> lang = new ArrayList<String>();
            String fields = "";
            
            if (internalPortal) {                               
                collection = collection2DtoMapper.collectionInternalToDto(Helpers.getInternalJAXRSClient(statisticalResourcesEndpoint).retrieveCollection(agencyId, resourceId, lang, fields));                
            } else {                             
                collection = collection2DtoMapper.collectionExternalToDto(Helpers.getExternalJAXRSClient(statisticalResourcesEndpoint).retrieveCollection(agencyId, resourceId, lang, fields));                
            }            

        } catch (Exception e) {

        }
        return collection;
    }
    
    public static Dataset getDataset(String apiUrlStatisticalResources, Boolean internalPortal, String agencyId, String resourceId, String version) {
        Dataset dataset = null;
        Dataset2DtoMapper dataset2DtoMapper = new Dataset2DtoMapper();
        try {
            //String statisticalResourcesEndpoint = "http://estadisticas.arte-consultores.com/statistical-resources/apis/statistical-resources";
            String statisticalResourcesEndpoint = apiUrlStatisticalResources;                            

            List<String> lang = new ArrayList<String>();
            String fields = "";
            if (version == null) { version = "~latest"; }
            
            if (internalPortal) {                               
                dataset = dataset2DtoMapper.datasetInternalToDto(Helpers.getInternalJAXRSClient(statisticalResourcesEndpoint).retrieveDataset(agencyId, resourceId, version, lang, fields, null));                
            } else {                             
                dataset = dataset2DtoMapper.datasetExternalToDto(Helpers.getExternalJAXRSClient(statisticalResourcesEndpoint).retrieveDataset(agencyId, resourceId, version, lang, fields, null));                
            }            

        } catch (Exception e) {

        }
        return dataset;
    }
    
    public static Query getQuery(String apiUrlStatisticalResources, Boolean internalPortal, String agencyId, String resourceId) {
        Query query = null;
        Query2DtoMapper query2DtoMapper = new Query2DtoMapper();
        try {
            //String statisticalResourcesEndpoint = "http://estadisticas.arte-consultores.com/statistical-resources/apis/statistical-resources";
            String statisticalResourcesEndpoint = apiUrlStatisticalResources;                            

            List<String> lang = new ArrayList<String>();
            String fields = "";
            
            if (internalPortal) {                               
                query = query2DtoMapper.queryInternalToDto(Helpers.getInternalJAXRSClient(statisticalResourcesEndpoint).retrieveQuery(agencyId, resourceId, lang, fields));                
            } else {                             
                query = query2DtoMapper.queryExternalToDto(Helpers.getExternalJAXRSClient(statisticalResourcesEndpoint).retrieveQuery(agencyId, resourceId, lang, fields));                
            }            

        } catch (Exception e) {

        }
        return query;
    }
    
    private static org.siemac.metamac.statistical_resources.rest.internal.v1_0.service.StatisticalResourcesV1_0 getInternalJAXRSClient(String statisticalResourcesEndpoint) {        
        return JAXRSClientFactory.create(statisticalResourcesEndpoint, org.siemac.metamac.statistical_resources.rest.internal.v1_0.service.StatisticalResourcesV1_0.class, null, true);
    }
    
    private static org.siemac.metamac.statistical_resources.rest.external.v1_0.service.StatisticalResourcesV1_0 getExternalJAXRSClient(String statisticalResourcesEndpoint) {
        return JAXRSClientFactory.create(statisticalResourcesEndpoint, org.siemac.metamac.statistical_resources.rest.external.v1_0.service.StatisticalResourcesV1_0.class, null, true);
    }
    
    // TODO Still have some problems with
    public static String html2text(String html) {
        //return Jsoup.parse(html).text();
        return html.replaceAll("\\<.*?>","");
    }
    
    public static int numberOfFixedDigitsInNumeration(Collection collection) {
        Integer totalIndicatorInstances = countIndicatorInstances(collection.getData().getNodes().getNodes());
        int fixedDigits = totalIndicatorInstances.toString().length();
        if (fixedDigits < 2) {
            fixedDigits = 2;
        }
        return fixedDigits;
    }

    public static int countIndicatorInstances(List<CollectionNode> nodes) {
        int total = 0;
        if (nodes != null) {
            for(CollectionNode node : nodes){
                if (node instanceof Chapter) {
                    Chapter chapter = (Chapter) node;
                    if (chapter.getNodes() != null) {
                        total += countIndicatorInstances(chapter.getNodes().getNodes());
                    }
                } else {
                    total += 1;
                }
            }
        }
        return total;
    }

    public static String localizeText(InternationalString internationalString) {
        if (internationalString != null) {
            for (LocalisedString text : internationalString.getTexts()) {
                if (text.getLang().equals("es")) {
                    return text.getValue();
                }
            }
            return internationalString.getTexts().get(0).getValue();
        } else {
            return "";
        }
    }

    public static String reverseIndex(String[] arr, int i) {
        return arr[arr.length - i - 1];
    }

    public static String tableViewUrl(Table table) {
        if (table.getQuery() != null) {
            String[] hrefParts = table.getQuery().getSelfLink().getHref().split("/");
            String agency = reverseIndex(hrefParts, 1);
            String identifier = reverseIndex(hrefParts, 0);
            return "view.html#queries/" + agency + "/" + identifier;
        } else if (table.getDataset() != null) {
            String[] hrefParts = table.getDataset().getSelfLink().getHref().split("/");
            String agency = reverseIndex(hrefParts, 2);
            String identifier = reverseIndex(hrefParts, 1);
            String version = reverseIndex(hrefParts, 0);
            return "view.html#datasets/" + agency + "/" + identifier + "/" + version;
        }
        return "#";
    }

}
