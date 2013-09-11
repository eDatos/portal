package org.siemac.metamac.portal.web.model;

import java.util.List;

public class DatasetSelectionDimension {

    private String id;
    private int position;
    private List<String> selectedCategories;

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

    public List<String> getSelectedCategories() {
        return selectedCategories;
    }

    public void setSelectedCategories(List<String> selectedCategories) {
        this.selectedCategories = selectedCategories;
    }

}
