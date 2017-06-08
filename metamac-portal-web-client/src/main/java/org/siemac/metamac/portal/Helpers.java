package org.siemac.metamac.portal;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.cxf.helpers.IOUtils;
import org.apache.cxf.jaxrs.client.JAXRSClientFactory;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.DeserializationConfig.Feature;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
import org.siemac.metamac.portal.dto.Chapter;
import org.siemac.metamac.portal.dto.Collection;
import org.siemac.metamac.portal.dto.CollectionNode;
import org.siemac.metamac.portal.dto.Dataset;
import org.siemac.metamac.portal.dto.Indicator;
import org.siemac.metamac.portal.dto.IndicatorInstance;
import org.siemac.metamac.portal.dto.Permalink;
import org.siemac.metamac.portal.dto.PermalinkContent;
import org.siemac.metamac.portal.dto.Query;
import org.siemac.metamac.portal.dto.QueryParams;
import org.siemac.metamac.portal.dto.Table;
import org.siemac.metamac.portal.mapper.Collection2DtoMapper;
import org.siemac.metamac.portal.mapper.Dataset2DtoMapper;
import org.siemac.metamac.portal.mapper.Query2DtoMapper;
import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;
import org.siemac.metamac.rest.common.v1_0.domain.LocalisedString;
import org.springframework.web.client.RestTemplate;

public class Helpers {

    private String language;
    private String DEFAULT_KEY = "__default__";

    public Helpers(String language) {
        if (language.isEmpty()) {
            this.language = "es";
        } else {
            this.language = language;
        }
    }

    public static String getPackageVersion() {
        Package packageInfo = Package.getPackage("org.siemac.metamac.portal");
        return packageInfo.getImplementationVersion();
    }

    public static Collection getCollection(String apiUrlStatisticalResources, Boolean internalPortal, String agencyId, String resourceId) {
        Collection collection = null;
        Collection2DtoMapper collection2DtoMapper = new Collection2DtoMapper();
        try {

            // "http://estadisticas.arte-consultores.com/statistical-resources/apis/statistical-resources";
            List<String> lang = new ArrayList<String>();
            String fields = "";

            if (internalPortal) {
                collection = collection2DtoMapper.collectionInternalToDto(Helpers.getInternalJAXRSClient(apiUrlStatisticalResources).retrieveCollection(agencyId, resourceId, lang, fields));
            } else {
                collection = collection2DtoMapper.collectionExternalToDto(Helpers.getExternalJAXRSClient(apiUrlStatisticalResources).retrieveCollection(agencyId, resourceId, lang, fields));
            }

        } catch (Exception e) {

        }
        return collection;
    }

    public static Dataset getDataset(String apiUrlStatisticalResources, Boolean internalPortal, String agencyId, String resourceId, String version) {
        Dataset dataset = null;
        Dataset2DtoMapper dataset2DtoMapper = new Dataset2DtoMapper();
        try {
            // "http://estadisticas.arte-consultores.com/statistical-resources/apis/statistical-resources";

            List<String> lang = new ArrayList<String>();
            String fields = "";
            if (version == null) {
                version = "~latest";
            }

            if (internalPortal) {
                dataset = dataset2DtoMapper.datasetInternalToDto(Helpers.getInternalJAXRSClient(apiUrlStatisticalResources).retrieveDataset(agencyId, resourceId, version, lang, fields, null));
            } else {
                dataset = dataset2DtoMapper.datasetExternalToDto(Helpers.getExternalJAXRSClient(apiUrlStatisticalResources).retrieveDataset(agencyId, resourceId, version, lang, fields, null));
            }

        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return dataset;
    }

    public static Query getQuery(String apiUrlStatisticalResources, Boolean internalPortal, String agencyId, String resourceId) {
        Query query = null;
        Query2DtoMapper query2DtoMapper = new Query2DtoMapper();
        try {
            // String statisticalResourcesEndpoint = "http://estadisticas.arte-consultores.com/statistical-resources/apis/statistical-resources";
            String statisticalResourcesEndpoint = apiUrlStatisticalResources;

            List<String> lang = new ArrayList<String>();
            String fields = "";

            if (internalPortal) {
                query = query2DtoMapper.queryInternalToDto(Helpers.getInternalJAXRSClient(statisticalResourcesEndpoint).retrieveQuery(agencyId, resourceId, lang, fields));
            } else {
                query = query2DtoMapper.queryExternalToDto(Helpers.getExternalJAXRSClient(statisticalResourcesEndpoint).retrieveQuery(agencyId, resourceId, lang, fields));
            }

        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return query;
    }

    public static Indicator getIndicator(String apiUrlIndicators, Boolean internalPortal, String resourceId) {
        String indicatorsEndpoint = apiUrlIndicators;
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(indicatorsEndpoint + "/v1.0/indicators/" + resourceId, Indicator.class);
    }

    public static IndicatorInstance getIndicatorInstance(String apiUrlIndicators, Boolean internalPortal, String resourceId, String indicatorsSystems) {
        String indicatorsEndpoint = apiUrlIndicators;
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(indicatorsEndpoint + "/v1.0/indicatorsSystems/" + indicatorsSystems + "/indicatorsInstances/" + resourceId, IndicatorInstance.class);
    }

    public static Permalink getPermalink(String apiUrlPermalinks, String identifier) {
        Permalink permalink = new Permalink();
        try {
            permalink.setId(identifier);

            String permalinkContentString = IOUtils.toString((InputStream) Helpers.getPermalinksJAXRSClient(apiUrlPermalinks).retrievePermalinkByIdJson(identifier).getEntity());
            PermalinkContent permalinkContent = permalinkContentToDto(permalinkContentString);
            permalink.setContent(permalinkContent);
            return permalink;
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return null;
    }

    private static PermalinkContent permalinkContentToDto(String content) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.configure(Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            return objectMapper.readValue(content, PermalinkContent.class);
        } catch (JsonParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (JsonMappingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return null;
    }

    public static String buildUrl(Permalink permalink) {
        StringBuilder stringBuilder = new StringBuilder();

        QueryParams queryParams = permalink.getContent().getQueryParams();
        stringBuilder.append("?").append("resourceType").append("=").append(queryParams.getType());
        stringBuilder.append("&").append("agencyId").append("=").append(queryParams.getAgency());
        stringBuilder.append("&").append("resourceId").append("=").append(queryParams.getIdentifier());
        stringBuilder.append("&").append("version").append("=").append(queryParams.getVersion());
        stringBuilder.append("&").append("indicatorSystem").append("=").append(queryParams.getIndicatorSystem());

        // Includes #
        stringBuilder.append(permalink.getContent().getHash());
        stringBuilder.append("/").append("permalink").append("/").append(permalink.getId());

        return stringBuilder.toString();
    }

    private static org.siemac.metamac.statistical_resources.rest.internal.v1_0.service.StatisticalResourcesV1_0 getInternalJAXRSClient(String statisticalResourcesEndpoint) {
        return JAXRSClientFactory.create(statisticalResourcesEndpoint, org.siemac.metamac.statistical_resources.rest.internal.v1_0.service.StatisticalResourcesV1_0.class, null, true);
    }

    private static org.siemac.metamac.statistical_resources.rest.external.v1_0.service.StatisticalResourcesV1_0 getExternalJAXRSClient(String statisticalResourcesEndpoint) {
        return JAXRSClientFactory.create(statisticalResourcesEndpoint, org.siemac.metamac.statistical_resources.rest.external.v1_0.service.StatisticalResourcesV1_0.class, null, true);
    }

    private static org.siemac.metamac.portal.rest.external.permalink.v1_0.service.PermalinksV1_0 getPermalinksJAXRSClient(String permalinksEndpoint) {
        return JAXRSClientFactory.create(permalinksEndpoint, org.siemac.metamac.portal.rest.external.permalink.v1_0.service.PermalinksV1_0.class, null, true);
    }

    public static String html2text(String html) {
        return Jsoup.clean(html, Whitelist.none());
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
            for (CollectionNode node : nodes) {
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

    public String localizeText(InternationalString internationalString) {
        if (internationalString != null) {
            for (LocalisedString text : internationalString.getTexts()) {
                if (text.getLang().equals(language)) {
                    return text.getValue();
                }
            }
            return internationalString.getTexts().get(0).getValue();
        } else {
            return "";
        }
    }

    public String localizeText(Map<String, String> stringMap) {
        if (stringMap == null) {
            return "";
        }

        String translation = stringMap.get(language);
        if (translation != null) {
            return translation;
        }

        translation = stringMap.get(DEFAULT_KEY);
        if (translation != null) {
            return translation;
        }

        return "";
    }

    public static String reverseIndex(String[] arr, int i) {
        return arr[arr.length - i - 1];
    }

    public static String tableViewUrl(Table table) {
        if (table.getQuery() != null) {
            String[] hrefParts = table.getQuery().getSelfLink().getHref().split("/");
            String agency = reverseIndex(hrefParts, 1);
            String identifier = reverseIndex(hrefParts, 0);
            return "data.html?agencyId=" + agency + "&resourceId=" + identifier + "&resourceType=query#";
        } else if (table.getDataset() != null) {
            String[] hrefParts = table.getDataset().getSelfLink().getHref().split("/");
            String agency = reverseIndex(hrefParts, 2);
            String identifier = reverseIndex(hrefParts, 1);
            String version = reverseIndex(hrefParts, 0);
            return "data.html?agencyId=" + agency + "&resourceId=" + identifier + "&version=" + version + "&resourceType=dataset#";
        }
        return "#";
    }

}
