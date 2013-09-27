package org.siemac.metamac.portal.core.domain;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;

public abstract class DatasetSelection {

    private List<DatasetSelectionDimension>              dimensions    = new ArrayList<DatasetSelectionDimension>();
    private final Map<String, DatasetSelectionDimension> dimensionsMap = new HashMap<String, DatasetSelectionDimension>();

    private List<DatasetSelectionAttribute>              attributes    = new ArrayList<DatasetSelectionAttribute>();
    private final Map<String, DatasetSelectionAttribute> attributesMap = new HashMap<String, DatasetSelectionAttribute>();

    public DatasetSelection(List<DatasetSelectionDimension> dimensions, List<DatasetSelectionAttribute> attributes) {
        this.dimensions = new ArrayList<DatasetSelectionDimension>(dimensions);
        for (DatasetSelectionDimension dimension : dimensions) {
            dimensionsMap.put(dimension.getId(), dimension);
        }
        this.attributes = new ArrayList<DatasetSelectionAttribute>(attributes);
        for (DatasetSelectionAttribute attribute : attributes) {
            attributesMap.put(attribute.getId(), attribute);
        }
    }

    public DatasetSelectionDimension getDimension(String dimensionId) {
        return dimensionsMap.get(dimensionId);
    }

    public List<DatasetSelectionDimension> getDimensions() {
        return new ArrayList<DatasetSelectionDimension>(dimensions);
    }

    public LabelVisualisationModeEnum getDimensionLabelVisualisationModel(String dimensionId) {
        DatasetSelectionDimension dimension = getDimension(dimensionId);
        LabelVisualisationModeEnum labelVisualisationMode = dimension != null ? dimension.getLabelVisualisationMode() : null;
        return labelVisualisationMode;
    }

    public DatasetSelectionAttribute getAttribute(String attributeId) {
        return attributesMap.get(attributeId);
    }

    public List<DatasetSelectionAttribute> getAttributes() {
        return new ArrayList<DatasetSelectionAttribute>(attributes);
    }

    public LabelVisualisationModeEnum getAttributeLabelVisualisationModel(String attributeId) {
        DatasetSelectionAttribute attribute = getAttribute(attributeId);
        LabelVisualisationModeEnum labelVisualisationMode = attribute != null ? attribute.getLabelVisualisationMode() : null;
        return labelVisualisationMode;
    }
}
