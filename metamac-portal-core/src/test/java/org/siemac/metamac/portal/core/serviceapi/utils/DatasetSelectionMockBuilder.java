package org.siemac.metamac.portal.core.serviceapi.utils;

import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.domain.DatasetSelectionDimension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class DatasetSelectionMockBuilder {

    public static DatasetSelectionMockBuilder create() {
        return new DatasetSelectionMockBuilder();
    }

    private List<DatasetSelectionDimension> dimensions = new ArrayList<DatasetSelectionDimension>();
    private DatasetSelectionDimension lastDimension;

    private DatasetSelectionMockBuilder() {

    }

    public DatasetSelectionMockBuilder dimension(String dimensionId, int position) {
        DatasetSelectionDimension dimension = new DatasetSelectionDimension(dimensionId, position);
        lastDimension = dimension;
        dimensions.add(dimension);
        return this;
    }

    public DatasetSelectionMockBuilder categories(String... categoriesId) {
        lastDimension.setSelectedCategories(Arrays.asList(categoriesId));
        return this;
    }

    public DatasetSelection build() {
        return new DatasetSelection(dimensions);
    }

}
