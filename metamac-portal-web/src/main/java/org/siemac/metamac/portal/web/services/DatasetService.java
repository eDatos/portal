package org.siemac.metamac.portal.web.services;

import com.google.common.base.Joiner;
import org.siemac.metamac.portal.web.model.DatasetSelection;
import org.siemac.metamac.portal.web.model.DatasetSelectionDimension;
import org.siemac.metamac.portal.web.ws.MetamacApisLocator;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.statistical_resources.rest.external.v1_0.service.StatisticalResourcesV1_0;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class DatasetService {

    @Autowired
    private MetamacApisLocator metamacApisLocator;

    public Dataset retrieve(String agencyID, String resourceID, String version, DatasetSelection datasetSelection) {
        StatisticalResourcesV1_0 statisticalResourcesV1_0 = metamacApisLocator.getStatisticalResourcesV1_0();
        List<String> languages = Arrays.asList("es");
        String fields = "";
        String dims = getDimsParameter(datasetSelection);
        return statisticalResourcesV1_0.retrieveDataset(agencyID, resourceID, version, languages, fields, dims);
    }

    private String getDimsParameter(DatasetSelection datasetSelection) {
        StringBuilder sb = new StringBuilder();
        Joiner joiner = Joiner.on("|");

        for(DatasetSelectionDimension dimension : datasetSelection.getDimensions()) {
            sb.append(dimension.getId());
            sb.append(":");
            sb.append(joiner.join(dimension.getSelectedCategories()));
            sb.append(":");
        }
        sb.deleteCharAt(sb.length() - 1); //delete last :
        return sb.toString();
    }

}
