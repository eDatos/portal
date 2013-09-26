package org.siemac.metamac.portal.rest.external.export.v1_0.mapper;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.domain.DatasetSelectionDimension;

public class DatasetSelectionMapper {

    public static DatasetSelection toDatasetSelection(org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection source) throws Exception {
        List<DatasetSelectionDimension> dimensions = new ArrayList<DatasetSelectionDimension>(source.getDimensions().getDimensions().size());
        for (Iterator<org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimension> iterator = source.getDimensions().getDimensions().iterator(); iterator.hasNext();) {
            org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimension dimensionSource = iterator.next();
            DatasetSelectionDimension target = toDatasetSelectionDimension(dimensionSource);
            dimensions.add(target);
        }
        return new DatasetSelection(dimensions);
    }

    public static String toStatisticalResourcesApiDimsParameter(DatasetSelection datasetSelection) {
        StringBuilder sb = new StringBuilder();
        for (DatasetSelectionDimension dimension : datasetSelection.getDimensions()) {
            sb.append(dimension.getId());
            sb.append(":");
            sb.append(StringUtils.join(dimension.getSelectedDimensionValues(), "|"));
            sb.append(":");
        }
        sb.deleteCharAt(sb.length() - 1); // delete last :
        return sb.toString();
    }

    private static DatasetSelectionDimension toDatasetSelectionDimension(org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimension source) throws Exception {
        DatasetSelectionDimension target = new DatasetSelectionDimension(source.getDimensionId(), source.getPosition());
        target.setSelectedDimensionValues(source.getDimensionValues().getDimensionValues());
        return target;
    }
}