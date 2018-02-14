package org.siemac.metamac.portal.core.invocation;

import org.springframework.stereotype.Component;

import es.gobcan.istac.indicators.rest.types.IndicatorType;


public interface IndicatorsRestExternalFacade {

    IndicatorType getIndicator(String resourceId);
}
