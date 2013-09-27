package org.siemac.metamac.portal.core.domain;

import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;

public class DatasetSelectionAttribute {

    private final String               id;
    private LabelVisualisationModeEnum labelVisualisationMode;

    public DatasetSelectionAttribute(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public LabelVisualisationModeEnum getLabelVisualisationMode() {
        return labelVisualisationMode;
    }

    public void setLabelVisualisationMode(LabelVisualisationModeEnum labelVisualisationMode) {
        this.labelVisualisationMode = labelVisualisationMode;
    }
}
