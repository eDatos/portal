package org.siemac.metamac.portal.rest.external.invocation;

import javax.annotation.PostConstruct;

import org.apache.cxf.jaxrs.client.JAXRSClientFactory;
import org.apache.cxf.jaxrs.client.WebClient;
import org.siemac.metamac.core.common.conf.ConfigurationService;
import org.siemac.metamac.statistical_resources.rest.external.v1_0.service.StatisticalResourcesV1_0;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("metamacApisLocatorRestExternal")
public class MetamacApisLocator {

    @Autowired
    private ConfigurationService     configurationService;

    private StatisticalResourcesV1_0 statisticalResourcesV1_0;

    @PostConstruct
    public void init() throws Exception {
        String statisticalResourcesEndpoint = configurationService.retrieveStatisticalResourcesExternalApiUrlBase();
        statisticalResourcesV1_0 = JAXRSClientFactory.create(statisticalResourcesEndpoint, StatisticalResourcesV1_0.class, null, true);
    }

    public StatisticalResourcesV1_0 getStatisticalResourcesV1_0() {
        // reset thread context
        WebClient.client(statisticalResourcesV1_0).reset();
        WebClient.client(statisticalResourcesV1_0).accept("application/xml");

        return statisticalResourcesV1_0;
    }
}
