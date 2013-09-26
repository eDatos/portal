package org.siemac.metamac.portal.core.domain;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;

public abstract class DatasetSelection {

    private List<DatasetSelectionDimension>              dimensions    = new ArrayList<DatasetSelectionDimension>();
    private final Map<String, DatasetSelectionDimension> dimensionsMap = new HashMap<String, DatasetSelectionDimension>();

    public DatasetSelection(List<DatasetSelectionDimension> dimensions) {
        this.dimensions = new ArrayList<DatasetSelectionDimension>(dimensions);
        for (DatasetSelectionDimension dimension : dimensions) {
            dimensionsMap.put(dimension.getId(), dimension);
        }
    }

    public DatasetSelectionDimension getDimension(String dimensionId) {
        return dimensionsMap.get(dimensionId);
    }

    public List<DatasetSelectionDimension> getDimensions() {
        return new ArrayList<DatasetSelectionDimension>(dimensions);
    }

    public LabelVisualisationModeEnum getLabelVisualisationMode(String dimensionId) {
        return getDimension(dimensionId).getLabelVisualisationMode();
    }
}
