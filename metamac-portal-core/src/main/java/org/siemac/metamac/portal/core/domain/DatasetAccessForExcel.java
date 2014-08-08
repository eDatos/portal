package org.siemac.metamac.portal.core.domain;

import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;

import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Attribute;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.AttributeAttachmentLevelType;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.CodeRepresentation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionRepresentation;

public class DatasetAccessForExcel extends DatasetAccess {

    private final Map<String, Integer>           multipliers         = new HashMap<String, Integer>();
    private final Map<String, Map<String, Long>> representationIndex = new HashMap<String, Map<String, Long>>(); // Map<Dimension, Map<Code, Index>

    public DatasetAccessForExcel(Dataset dataset, DatasetSelectionForExcel datasetSelection, String lang, String langAlternative) throws MetamacException {
        super(dataset, datasetSelection, lang, langAlternative);
        initializeMultipliers();
        initializeIndex();
    }

    /**
     * Retrieve the observation for a specific key <param>permutation</param>
     * 
     * @param observation at permutation key
     * @return
     */
    public String observationAtPermutation(Map<String, String> permutation) {
        int offset = calculateOffsetAtPermutation(permutation);

        String observation = getObservations()[offset];
        if (!observation.trim().isEmpty()) {
            return observation;
        } else {
            return null;
        }
    }

    public CellCommentDetails observationAttributesAtPermutation(Map<String, String> permutation) {
        CellCommentDetails cellCommentDetails = new CellCommentDetails();
        for (Attribute attribute : getAttributesMetadata()) {
            if (!AttributeAttachmentLevelType.PRIMARY_MEASURE.equals(attribute.getAttachmentLevel())) {
                continue; // only observation attachment level
            }
            String attributeId = attribute.getId();
            int offset = calculateOffsetAtPermutation(permutation);

            String attributeValue = obtainAttributeValue(attributeId, offset);
            cellCommentDetails.addCommentLine(attributeValue);
        }

        return cellCommentDetails;
    }

    public String obtainAttributeValue(String attributeId, int offset) {
        String[] attributeValues = getAttributeValues(attributeId);
        String attributeValue = null;
        if (attributeValues != null) {
            attributeValue = attributeValues[offset];
            attributeValue = applyLabelVisualizationModeForAttribute(attributeId, attributeValue);
        }
        return attributeValue;
    }

    public String applyLabelVisualizationModeForAttribute(String attributeId, String attributeValue) {
        // Visualisation mode
        LabelVisualisationModeEnum labelVisualisation = getAttributeLabelVisualisationMode(attributeId);
        switch (labelVisualisation) {
            case CODE:
                // no extra action
                break;
            case LABEL: {
                String attributeValueLabel = getAttributeValueLabel(attributeId, attributeValue);
                if (attributeValueLabel != null) {
                    attributeValue = attributeValueLabel;
                }
            }
                break;
            case CODE_AND_LABEL: {
                String attributeValueLabel = getAttributeValueLabel(attributeId, attributeValue);
                if (attributeValueLabel != null) {
                    attributeValue = attributeValueLabel + " (" + attributeValue + ")";
                }
            }
                break;
            default:
                break;
        }
        return attributeValue;
    }

    public String applyLabelVisualizationModeForDimension(String dimensionId, String dimensionValueId) {
        LabelVisualisationModeEnum labelVisualisation = getDimensionLabelVisualisationMode(dimensionId);
        switch (labelVisualisation) {
            case CODE:
                // no extra action
                break;
            case LABEL: {
                String dimensionValueLabel = getDimensionValueLabel(dimensionId, dimensionValueId);
                if (dimensionValueLabel != null) {
                    dimensionValueId = dimensionValueLabel;
                }
            }
                break;
            case CODE_AND_LABEL: {
                String dimensionValueLabel = getDimensionValueLabel(dimensionId, dimensionValueId);
                if (dimensionValueLabel != null) {
                    dimensionValueId = dimensionValueLabel + " (" + dimensionValueId + ")";
                }
            }
                break;
            default:
                break;
        }
        return dimensionValueId;
    }

    private void initializeMultipliers() {
        List<DimensionRepresentation> dimensions = getDataset().getData().getDimensions().getDimensions();
        ListIterator<DimensionRepresentation> dimensionsListIterator = dimensions.listIterator(dimensions.size());
        int incrementCounter = 1;

        // Iterate the list in reverse order: right to left or down to up in the display table for calculate cell spacing
        while (dimensionsListIterator.hasPrevious()) {
            DimensionRepresentation dimension = dimensionsListIterator.previous();
            multipliers.put(dimension.getDimensionId(), incrementCounter);
            incrementCounter *= dimension.getRepresentations().getRepresentations().size();
        }
    }

    /**
     * Calculate a map indexed by dimension with map as value. The value map is indexed by code and its value is a index.
     */
    private void initializeIndex() {
        List<DimensionRepresentation> dimensions = getDataset().getData().getDimensions().getDimensions();
        for (DimensionRepresentation dimension : dimensions) {
            Map<String, Long> representationIndexMap = new HashMap<String, Long>();
            List<CodeRepresentation> representations = dimension.getRepresentations().getRepresentations();
            for (CodeRepresentation representation : representations) {
                representationIndexMap.put(representation.getCode(), representation.getIndex());
            }
            representationIndex.put(dimension.getDimensionId(), representationIndexMap);
        }
    }

    private int calculateOffsetAtPermutation(Map<String, String> permutation) {
        int offset = 0;
        for (Map.Entry<String, String> permutationEntry : permutation.entrySet()) {
            String dimensionId = permutationEntry.getKey();
            String representationId = permutationEntry.getValue();

            long index = representationIndex.get(dimensionId).get(representationId);
            int multiplier = multipliers.get(dimensionId);
            offset += index * multiplier;
        }
        return offset;
    }
}
