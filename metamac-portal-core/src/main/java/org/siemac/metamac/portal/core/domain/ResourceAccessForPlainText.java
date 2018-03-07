package org.siemac.metamac.portal.core.domain;

import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Query;

public class ResourceAccessForPlainText extends ResourceAccess {

    public ResourceAccessForPlainText(Dataset dataset, DatasetSelection datasetSelection, String lang, String langAlternative) throws MetamacException {
        super(dataset, datasetSelection, lang, langAlternative);
    }

    public ResourceAccessForPlainText(Query query, Dataset relatedDataset, DatasetSelection datasetSelection, String lang, String langAlternative) throws MetamacException {
        super(query, relatedDataset, datasetSelection, lang, langAlternative);
    }
}
