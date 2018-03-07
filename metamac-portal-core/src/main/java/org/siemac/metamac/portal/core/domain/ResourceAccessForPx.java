package org.siemac.metamac.portal.core.domain;

import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;

public class DatasetAccessForPx extends DatasetAccess {

    public DatasetAccessForPx(Dataset dataset, String lang, String langAlternative) throws MetamacException {
        super(dataset, null, lang, langAlternative);
    }
}
