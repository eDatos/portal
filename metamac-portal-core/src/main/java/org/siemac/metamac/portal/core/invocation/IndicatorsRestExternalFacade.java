package org.siemac.metamac.portal.core.invocation;

import java.util.List;
import java.util.Map;

import es.gobcan.istac.indicators.rest.types.DataType;
import es.gobcan.istac.indicators.rest.types.IndicatorBaseType;
import es.gobcan.istac.indicators.rest.types.IndicatorType;
import es.gobcan.istac.indicators.rest.types.PagedResultType;
import es.gobcan.istac.indicators.rest.types.RestCriteriaPaginator;

public interface IndicatorsRestExternalFacade {

    IndicatorType retrieveIndicator(final String indicatorCode);
    DataType retrieveIndicatorData(final String indicatorCode, String dimensionSelection);
}
