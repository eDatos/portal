package org.siemac.metamac.portal.core.invocation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import es.gobcan.istac.indicators.rest.types.IndicatorType;

@Component("indicatorsRestExternalFacade")
public class IndicatorsRestExternalFacadeImpl implements IndicatorsRestExternalFacade {

    private final Logger       logger       = LoggerFactory.getLogger(IndicatorsRestExternalFacadeImpl.class);

    RestTemplate               restTemplate = new RestTemplate();

    @Autowired
    @Qualifier("metamacApisLocatorRestExternal")
    private MetamacApisLocator restApiLocator;

    @Override
    public IndicatorType getIndicator(String resourceId) {
        try {
            return restTemplate.getForObject(restApiLocator.getIndicatorsRestExternalFacadeEndpoint() + "/v1.0/indicators/" + resourceId, IndicatorType.class);
        } catch (Exception e) {
            logger.error("Error obteniendo el Indicador", e);
        }
        return null;
    }

}
