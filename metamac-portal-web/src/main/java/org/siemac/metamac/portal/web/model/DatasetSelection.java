package org.siemac.metamac.portal.web.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DatasetSelection {

    private List<DatasetSelectionDimension> dimensions = new ArrayList<DatasetSelectionDimension>();
    private Map<String, DatasetSelectionDimension> dimensionsMap = new HashMap<String, DatasetSelectionDimension>();

    public void addDimension(DatasetSelectionDimension dimension) {
        dimensions.add(dimension);
        dimensionsMap.put(dimension.getId(), dimension);
    }

    public DatasetSelectionDimension getDimension(String dimensionId) {
        return dimensionsMap.get(dimensionId);
    }

    public List<DatasetSelectionDimension> getDimensions() {
        return new ArrayList<DatasetSelectionDimension>(dimensions);
    }

}
