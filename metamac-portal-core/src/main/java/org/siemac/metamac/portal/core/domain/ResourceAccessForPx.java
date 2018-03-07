package org.siemac.metamac.portal.core.domain;

import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Query;

public class ResourceAccessForPx extends ResourceAccess {

    public ResourceAccessForPx(Dataset dataset, String lang, String langAlternative) throws MetamacException {
        super(dataset, null, lang, langAlternative);
    }

    public ResourceAccessForPx(Query query, Dataset relatedDataset, String lang, String langAlternative) throws MetamacException {
        super(query, relatedDataset, null, lang, langAlternative);
    }
}
