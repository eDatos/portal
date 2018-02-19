package org.siemac.metamac.portal.core.invocation;

import es.gobcan.istac.indicators.rest.types.DataType;
import es.gobcan.istac.indicators.rest.types.IndicatorInstanceType;

public interface IndicatorsSystemsRestExternalFacade {

    IndicatorInstanceType retrieveIndicatorInstanceByCode(final String idIndicatorSystem, final String idIndicatorInstance);
    DataType retrieveIndicatorInstanceDataByCode(final String idIndicatorSystem, final String idIndicatorInstance, String selectedRepresentations);
}
