package org.siemac.metamac.portal.core.domain;

import java.util.List;

public class DatasetSelectionDimension {

    private final String id;
    private final int    position;
    private List<String> selectedDimensionValues;

    public DatasetSelectionDimension(String id, int position) {
        this.id = id;
        this.position = position;
    }

    public String getId() {
        return id;
    }

    public int getPosition() {
        return position;
    }

    public List<String> getSelectedDimensionValues() {
        return selectedDimensionValues;
    }

    public void setSelectedDimensionValues(List<String> selectedDimensionValues) {
        this.selectedDimensionValues = selectedDimensionValues;
    }

}
