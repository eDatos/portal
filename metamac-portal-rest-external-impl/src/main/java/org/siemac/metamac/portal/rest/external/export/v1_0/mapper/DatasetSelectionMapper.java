package org.siemac.metamac.portal.rest.external.export.v1_0.mapper;

import static org.siemac.metamac.portal.core.domain.DatasetSelection.FIXED_DIMENSIONS_START_POSITION;
import static org.siemac.metamac.portal.core.domain.DatasetSelection.LEFT_DIMENSIONS_START_POSITION;
import static org.siemac.metamac.portal.core.domain.DatasetSelection.TOP_DIMENSIONS_START_POSITION;
import static org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum.CODE_AND_LABEL;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.ws.rs.core.Response.Status;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.domain.DatasetSelectionAttribute;
import org.siemac.metamac.portal.core.domain.DatasetSelectionDimension;
import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;
import org.siemac.metamac.portal.rest.external.exception.RestServiceExceptionType;
import org.siemac.metamac.rest.exception.RestException;
import org.siemac.metamac.rest.exception.utils.RestExceptionUtils;
import org.siemac.metamac.rest.export.v1_0.domain.LabelVisualisationMode;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Attribute;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Attributes;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DataStructureDefinition;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dimension;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionValues;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dimensions;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.EnumeratedDimensionValue;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.EnumeratedDimensionValues;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.NonEnumeratedDimensionValue;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.NonEnumeratedDimensionValues;

public class DatasetSelectionMapper {
    
    private static final int MAX_SIZE_URL = 2000;

    public static DatasetSelection toDatasetSelection(org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection source) throws Exception {
        List<DatasetSelectionDimension> dimensions = toDatasetSelectionDimensions(source);
        List<DatasetSelectionAttribute> attributes = toDatasetSelectionAttributes(source);
        return new DatasetSelection(dimensions, attributes);
    }

    public static String toStatisticalResourcesApiDimsParameter(List<DatasetSelectionDimension> dimensions) {
        if (CollectionUtils.isEmpty(dimensions)) {
            return null;
        }
        StringBuilder sb = new StringBuilder();
        for (DatasetSelectionDimension dimension : dimensions) {
            sb.append(dimension.getId());
            sb.append(":");
            sb.append(StringUtils.join(dimension.getSelectedDimensionValues(), "|"));
            sb.append(":");
        }
        sb.deleteCharAt(sb.length() - 1); // delete last :
        
        if (sb.length() > MAX_SIZE_URL) {
            return null;
        }
        
        return sb.toString();
    }

    public static List<DatasetSelectionDimension> toDatasetSelectionDimensions(org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection source) throws Exception {
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

    private static List<DatasetSelectionAttribute> toDatasetSelectionAttributes(org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection source) throws Exception {
        if (source == null || source.getAttributes() == null) {
            return null;
        }
        List<DatasetSelectionAttribute> attributes = new ArrayList<DatasetSelectionAttribute>(source.getAttributes().getAttributes().size());
        for (Iterator<org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionAttribute> iterator = source.getAttributes().getAttributes().iterator(); iterator.hasNext();) {
            org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionAttribute attributeSource = iterator.next();
            DatasetSelectionAttribute target = toDatasetSelectionAttribute(attributeSource);
            attributes.add(target);
        }
        return attributes;
    }

    private static DatasetSelectionAttribute toDatasetSelectionAttribute(org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionAttribute source) throws Exception {
        DatasetSelectionAttribute target = new DatasetSelectionAttribute(source.getAttributeId());
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

    public static DatasetSelection datasetToDatasetSelection(Dimensions datasetDimensions, Attributes datasetAttributes, DataStructureDefinition relatedDsd) {
        List<DatasetSelectionDimension> dimensions = dimensionsToDatasetSelectionDimensions(datasetDimensions, relatedDsd);
        List<DatasetSelectionAttribute> attributes = attributesToDatasetSelectionAttributes(datasetAttributes);
        return new DatasetSelection(dimensions, attributes);
    }

    private static List<DatasetSelectionAttribute> attributesToDatasetSelectionAttributes(Attributes attributes) {
        if (attributes == null) {
            return null;
        }
        List<DatasetSelectionAttribute> datasetSelectionAttributes = new ArrayList<DatasetSelectionAttribute>();
        for (Attribute attribute : attributes.getAttributes()) {
            datasetSelectionAttributes.add(attributeToDatasetSelectionAttribute(attribute));
        }
        return datasetSelectionAttributes;
    }

    private static DatasetSelectionAttribute attributeToDatasetSelectionAttribute(Attribute attribute) {
        DatasetSelectionAttribute datasetSelectionAttribute = new DatasetSelectionAttribute(attribute.getId());
        datasetSelectionAttribute.setLabelVisualisationMode(CODE_AND_LABEL); // By default
        return datasetSelectionAttribute;
    }

    private static List<DatasetSelectionDimension> dimensionsToDatasetSelectionDimensions(Dimensions dimensions, DataStructureDefinition dataStructureDefinition) {
        List<DatasetSelectionDimension> datasetSelectionDimensions = new ArrayList<DatasetSelectionDimension>();
        for (Dimension dimension : dimensions.getDimensions()) {
            datasetSelectionDimensions.add(dimensionToDatasetSelectionDimension(dimension, dataStructureDefinition));
        }
        return datasetSelectionDimensions;
    }

    private static DatasetSelectionDimension dimensionToDatasetSelectionDimension(Dimension dimension, DataStructureDefinition dataStructureDefinition) {
        DatasetSelectionDimension datasetSelectionDimension = new DatasetSelectionDimension(dimension.getId());
        datasetSelectionDimension.setLabelVisualisationMode(CODE_AND_LABEL); // By default
        datasetSelectionDimension.setPosition(dataStructureDefinitionToPosition(dimension.getId(), dataStructureDefinition));
        datasetSelectionDimension.setSelectedDimensionValues(dimensionValuesToSelectedDimensionValues(dimension.getDimensionValues()));
        return datasetSelectionDimension;
    }

    private static Integer dataStructureDefinitionToPosition(String id, DataStructureDefinition dataStructureDefinition) {
        if (dataStructureDefinition.getHeading().getDimensionIds().contains(id)) {
            return TOP_DIMENSIONS_START_POSITION + dataStructureDefinition.getHeading().getDimensionIds().indexOf(id);
        } else if (dataStructureDefinition.getStub().getDimensionIds().contains(id)) {
            return LEFT_DIMENSIONS_START_POSITION + dataStructureDefinition.getStub().getDimensionIds().indexOf(id);
        } else {
            return FIXED_DIMENSIONS_START_POSITION;
        }
    }

    private static List<String> dimensionValuesToSelectedDimensionValues(DimensionValues dimensionValues) {
        if (dimensionValues instanceof EnumeratedDimensionValues) {
            return enumeratedDimensionValuesToSelectedDimensionValues((EnumeratedDimensionValues) dimensionValues);
        } else if (dimensionValues instanceof NonEnumeratedDimensionValues) {
            return nonEnumeratedDimensionValuesToSelectedDimensionValues((NonEnumeratedDimensionValues) dimensionValues);
        } else {
            org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.UNKNOWN);
            throw new RestException(exception, Status.INTERNAL_SERVER_ERROR);
        }
    }

    private static List<String> nonEnumeratedDimensionValuesToSelectedDimensionValues(NonEnumeratedDimensionValues dimensionValues) {
        List<String> nonEnumeratedDimensionValues = new ArrayList<String>();
        for (NonEnumeratedDimensionValue dimensionValue : dimensionValues.getValues()) {
            nonEnumeratedDimensionValues.add(dimensionValue.getId());
        }
        return nonEnumeratedDimensionValues;
    }

    private static List<String> enumeratedDimensionValuesToSelectedDimensionValues(EnumeratedDimensionValues dimensionValues) {
        List<String> enumeratedDimensionValues = new ArrayList<String>();
        for (EnumeratedDimensionValue dimensionValue : dimensionValues.getValues()) {
            enumeratedDimensionValues.add(dimensionValue.getId());
        }
        return enumeratedDimensionValues;
    }
}