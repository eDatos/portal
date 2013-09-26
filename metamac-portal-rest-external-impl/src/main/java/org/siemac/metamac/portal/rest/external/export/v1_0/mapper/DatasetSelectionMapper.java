package org.siemac.metamac.portal.rest.external.export.v1_0.mapper;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang.StringUtils;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.domain.DatasetSelectionDimension;
import org.siemac.metamac.portal.core.domain.DatasetSelectionForExcel;
import org.siemac.metamac.portal.core.domain.DatasetSelectionForTsv;
import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;
import org.siemac.metamac.portal.rest.external.exception.RestServiceExceptionType;
import org.siemac.metamac.rest.exception.RestException;
import org.siemac.metamac.rest.exception.utils.RestExceptionUtils;
import org.siemac.metamac.rest.export.v1_0.domain.LabelVisualisationMode;

public class DatasetSelectionMapper {

    public static DatasetSelectionForExcel toDatasetSelectionForExcel(org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection source) throws Exception {
        List<DatasetSelectionDimension> dimensions = toDatasetSelectionDimensions(source);
        if (dimensions == null) {
            return null;
        }
        return new DatasetSelectionForExcel(dimensions);
    }

    public static DatasetSelectionForTsv toDatasetSelectionForTsv(org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection source) throws Exception {
        List<DatasetSelectionDimension> dimensions = toDatasetSelectionDimensions(source);
        if (dimensions == null) {
            return null;
        }
        return new DatasetSelectionForTsv(dimensions);
    }

    public static String toStatisticalResourcesApiDimsParameter(DatasetSelection datasetSelection) {
        if (datasetSelection == null) {
            return null;
        }
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

    private static List<DatasetSelectionDimension> toDatasetSelectionDimensions(org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection source) throws Exception {
        if (source == null || source.getDimensions() == null) {
            return null;
        }
        List<DatasetSelectionDimension> dimensions = new ArrayList<DatasetSelectionDimension>(source.getDimensions().getDimensions().size());
        for (Iterator<org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimension> iterator = source.getDimensions().getDimensions().iterator(); iterator.hasNext();) {
            org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimension dimensionSource = iterator.next();
            DatasetSelectionDimension target = toDatasetSelectionDimension(dimensionSource);
            dimensions.add(target);
        }
        return dimensions;
    }

    private static DatasetSelectionDimension toDatasetSelectionDimension(org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimension source) throws Exception {
        DatasetSelectionDimension target = new DatasetSelectionDimension(source.getDimensionId());
        target.setSelectedDimensionValues(source.getDimensionValues().getDimensionValues());
        target.setPosition(source.getPosition());
        target.setLabelVisualisationMode(toLabelVisualisationMode(source.getLabelVisualisationMode()));
        return target;
    }

    private static LabelVisualisationModeEnum toLabelVisualisationMode(LabelVisualisationMode source) {
        if (source == null) {
            return null;
        }
        switch (source) {
            case LABEL:
                return LabelVisualisationModeEnum.LABEL;
            case CODE:
                return LabelVisualisationModeEnum.CODE;
            case CODE_AND_LABEL:
                return LabelVisualisationModeEnum.CODE_AND_LABEL;
            default:
                org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.UNKNOWN);
                throw new RestException(exception, Status.INTERNAL_SERVER_ERROR);
        }
    }
}