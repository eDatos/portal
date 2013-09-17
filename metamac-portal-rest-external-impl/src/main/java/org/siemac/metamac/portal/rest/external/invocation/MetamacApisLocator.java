package org.siemac.metamac.portal.rest.external.invocation;

import javax.annotation.PostConstruct;

import org.apache.cxf.jaxrs.client.JAXRSClientFactory;
import org.siemac.metamac.core.common.conf.ConfigurationService;
import org.siemac.metamac.portal.core.constants.PortalConfigurationConstants;
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
        String statisticalResourcesEndpoint = configurationService.getProperty(PortalConfigurationConstants.ENDPOINT_STATISTICAL_RESOURCES_EXTERNAL_API);
        statisticalResourcesV1_0 = JAXRSClientFactory.create(statisticalResourcesEndpoint, StatisticalResourcesV1_0.class, null, true);
    }

    public StatisticalResourcesV1_0 getStatisticalResourcesV1_0() {
        return statisticalResourcesV1_0;
    }
}