package org.siemac.metamac.portal.core.domain;

import java.util.HashMap;
import java.util.Map;

import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;

public class ExportPersonalisation {

    private final Map<String, LabelVisualisationModeEnum> dimensionsLabelVisualisationsMode = new HashMap<String, LabelVisualisationModeEnum>();
    private final Map<String, LabelVisualisationModeEnum> attributesLabelVisualisationsMode = new HashMap<String, LabelVisualisationModeEnum>();

    public Map<String, LabelVisualisationModeEnum> getDimensionsLabelVisualisationsMode() {
        return dimensionsLabelVisualisationsMode;
    }

    public Map<String, LabelVisualisationModeEnum> getAttributesLabelVisualisationsMode() {
        return attributesLabelVisualisationsMode;
    }

}
