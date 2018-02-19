package org.siemac.metamac.portal.core.invocation;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import es.gobcan.istac.indicators.rest.types.DataType;
import es.gobcan.istac.indicators.rest.types.IndicatorInstanceType;

@Component("indicatorsRestExternalFacadeImpl")
public class IndicatorsSystemsRestExternalFacadeImpl implements IndicatorsSystemsRestExternalFacade {

    private final Logger       logger       = LoggerFactory.getLogger(IndicatorsSystemsRestExternalFacadeImpl.class);

    RestTemplate               restTemplate = new RestTemplate();

    @Autowired
    @Qualifier("metamacApisLocatorRestExternal")
    private MetamacApisLocator restApiLocator;

    @Override
    public IndicatorInstanceType retrieveIndicatorInstanceByCode(String idIndicatorSystem, String idIndicatorInstance) {
        try {
            return restTemplate.getForObject(getIndicatorInstanceRequest(idIndicatorSystem, idIndicatorInstance).toString(), IndicatorInstanceType.class);
        } catch (Exception e) {
            logger.error("Error obteniendo el Indicador", e);
        }
        return null;
    }

    @Override
    public DataType retrieveIndicatorInstanceDataByCode(String idIndicatorSystem, String idIndicatorInstance, String selectedRepresentations) {
        try {
            StringBuilder indicatorDataRequest = getIndicatorInstanceRequest(idIndicatorSystem, idIndicatorInstance).append("/data");

            if (!StringUtils.EMPTY.equals(selectedRepresentations)) {
                indicatorDataRequest.append("?").append("representation=").append(selectedRepresentations);
            }

            return restTemplate.getForObject(indicatorDataRequest.toString(), DataType.class);
        } catch (Exception e) {
            logger.error("Error obteniendo el Indicador", e);
        }
        return null;
    }

    private StringBuilder getIndicatorInstanceRequest(String idIndicatorSystem, String idIndicatorInstance) {
        return getIndicatorInstanceBaseRequest().append("/").append(idIndicatorSystem).append("/indicatorsInstances").append("/").append(idIndicatorInstance);
    }

    private StringBuilder getIndicatorInstanceBaseRequest() {
        StringBuilder indicatorInstanceBaseRequest = new StringBuilder();
        return indicatorInstanceBaseRequest.append(restApiLocator.getIndicatorsRestExternalFacadeEndpoint()).append("/v1.0").append("/indicatorsSystems");
    }
}
