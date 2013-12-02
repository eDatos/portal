import org.apache.cxf.jaxrs.client.JAXRSClientFactory;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Collection;
import org.siemac.metamac.statistical_resources.rest.external.v1_0.service.StatisticalResourcesV1_0;

import java.util.Arrays;
import java.util.List;

public class ApiRequestMain {

    public static void main(String[] args) {
        String statisticalResourcesEndpoint = "http://estadisticas.arte-consultores.com/metamac-statistical-resources-external-web/apis/statistical-resources";
        StatisticalResourcesV1_0 statisticalResourcesV1_0 = JAXRSClientFactory.create(statisticalResourcesEndpoint, StatisticalResourcesV1_0.class, null, true);
        String agencyId = "ISTAC";
        String resourceId = "C00031A_000001";
        List<String> lang = Arrays.asList("es");
        String fields = "";
        Collection collection = statisticalResourcesV1_0.retrieveCollection(agencyId, resourceId, lang, fields);
        String id = collection.getId();
        System.out.println(id);
    }
}
