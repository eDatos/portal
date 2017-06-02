package org.siemac.metamac.portal.core.invocation;

import java.util.List;

import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;

public interface StatisticalResourcesRestExternalFacade {

    public Dataset retrieveDataset(String agencyID, String resourceID, String version, List<String> lang, String fields, String dimensionSelection);
}
