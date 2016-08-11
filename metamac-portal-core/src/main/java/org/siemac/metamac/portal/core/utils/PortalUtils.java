package org.siemac.metamac.portal.core.utils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;
import org.siemac.metamac.portal.core.error.ServiceExceptionType;
import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;
import org.siemac.metamac.rest.common.v1_0.domain.LocalisedString;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Attribute;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dimension;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.EnumeratedAttributeValue;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.EnumeratedAttributeValues;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.EnumeratedDimensionValue;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.EnumeratedDimensionValues;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.NonEnumeratedAttributeValue;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.NonEnumeratedAttributeValues;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.NonEnumeratedDimensionValue;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.NonEnumeratedDimensionValues;
import org.siemac.metamac.statistical_resources.rest.common.StatisticalResourcesRestConstants;

public class PortalUtils {

    /**
     * Returns label in locale 'lang'. If it does not exist, return label in 'langAlternative'
     */
    public static String getLabel(InternationalString internationalString, String lang, String langAlternative) {
        String label = getLabel(internationalString, lang);
        if (label != null) {
            return label;
        }
        label = getLabel(internationalString, langAlternative);
        return label;
    }

    /**
     * Returns label in locale 'lang'. Null if it does not exist
     */
    public static String getLabel(InternationalString internationalString, String lang) {
        if (internationalString == null) {
            return null;
        }
        for (LocalisedString localisedString : internationalString.getTexts()) {
            if (localisedString.getLang().equals(lang)) {
                return localisedString.getValue();
            }
        }
        return null;
    }

    /**
     * Calculate the value as name of the dimension
     */
    public static String buildMapDimensionLabel(Dimension dimension, String lang, String langAlternative) throws MetamacException {
        String dimensionLabel = getLabel(dimension.getName(), lang, langAlternative);
        return dimensionLabel;
    }

    /**
     * Builds a map indexed by dimensionId with a value as name of the dimension
     */
    public static Map<String, String> buildMapDimensionsLabels(List<Dimension> dimensions, String lang, String langAlternative) throws MetamacException {
        Map<String, String> dimensionsLabels = new HashMap<String, String>(dimensions.size());

        for (Dimension dimension : dimensions) {
            String dimensionId = dimension.getId();
            dimensionsLabels.put(dimensionId, buildMapDimensionLabel(dimension, lang, langAlternative));
        }
        return dimensionsLabels;
    }

    /**
     * Builds map indexed by dimensionValueId and value as title of the dimension value
     */
    public static Map<String, String> buildMapDimensionsValuesLabels(Dimension dimension, String lang, String langAlternative) throws MetamacException {
        Map<String, String> dimensionValuesLabels = null;
        if (dimension.getDimensionValues() instanceof EnumeratedDimensionValues) {
            EnumeratedDimensionValues dimensionValues = (EnumeratedDimensionValues) dimension.getDimensionValues();
            dimensionValuesLabels = new HashMap<String, String>(dimensionValues.getValues().size());
            for (EnumeratedDimensionValue dimensionValue : dimensionValues.getValues()) {
                String dimensionValueId = dimensionValue.getId();
                String dimensionValueLabel = getLabel(dimensionValue.getName(), lang, langAlternative);
                dimensionValuesLabels.put(dimensionValueId, dimensionValueLabel);
            }
        } else if (dimension.getDimensionValues() instanceof NonEnumeratedDimensionValues) {
            NonEnumeratedDimensionValues dimensionValues = (NonEnumeratedDimensionValues) dimension.getDimensionValues();
            dimensionValuesLabels = new HashMap<String, String>(dimensionValues.getValues().size());
            for (NonEnumeratedDimensionValue dimensionValue : dimensionValues.getValues()) {
                String dimensionValueId = dimensionValue.getId();
                String dimensionValueLabel = getLabel(dimensionValue.getName(), lang, langAlternative);
                dimensionValuesLabels.put(dimensionValueId, dimensionValueLabel);
            }
        } else {
            throw new MetamacException(ServiceExceptionType.UNKNOWN, "Dimension values unexpected: " + dimension.getDimensionValues().getClass().getCanonicalName());
        }
        return dimensionValuesLabels;
    }

    /**
     * Builds a map indexed by dimensionId with a map indexed by dimensionValueId and value as title of the dimension value
     */
    public static Map<String, Map<String, String>> buildMapDimensionsValuesLabels(List<Dimension> dimensions, String lang, String langAlternative) throws MetamacException {
        Map<String, Map<String, String>> dimensionsValuesLabels = new HashMap<String, Map<String, String>>(dimensions.size());
        for (Dimension dimension : dimensions) {
            Map<String, String> dimensionValuesLabels = buildMapDimensionsValuesLabels(dimension, lang, langAlternative);
            dimensionsValuesLabels.put(dimension.getId(), dimensionValuesLabels);
        }
        return dimensionsValuesLabels;
    }

    /**
     * Builds map indexed by dimensionValueId and value as localised title of the dimension value
     */
    public static Map<String, InternationalString> buildMapDimensionsValuesLocalisedLabels(Dimension dimension) throws MetamacException {
        Map<String, InternationalString> dimensionValuesLabels = null;
        if (dimension.getDimensionValues() instanceof EnumeratedDimensionValues) {
            EnumeratedDimensionValues dimensionValues = (EnumeratedDimensionValues) dimension.getDimensionValues();
            dimensionValuesLabels = new HashMap<String, InternationalString>(dimensionValues.getValues().size());
            for (EnumeratedDimensionValue dimensionValue : dimensionValues.getValues()) {
                String dimensionValueId = dimensionValue.getId();
                dimensionValuesLabels.put(dimensionValueId, dimensionValue.getName());
            }
        } else if (dimension.getDimensionValues() instanceof NonEnumeratedDimensionValues) {
            NonEnumeratedDimensionValues dimensionValues = (NonEnumeratedDimensionValues) dimension.getDimensionValues();
            dimensionValuesLabels = new HashMap<String, InternationalString>(dimensionValues.getValues().size());
            for (NonEnumeratedDimensionValue dimensionValue : dimensionValues.getValues()) {
                String dimensionValueId = dimensionValue.getId();
                dimensionValuesLabels.put(dimensionValueId, dimensionValue.getName());
            }
        } else {
            throw new MetamacException(ServiceExceptionType.UNKNOWN, "Dimension values unexpected: " + dimension.getDimensionValues().getClass().getCanonicalName());
        }
        return dimensionValuesLabels;
    }

    /**
     * Builds a map indexed by dimensionId with a map indexed by dimensionValueId and value as localised title of the dimension value
     */
    public static Map<String, Map<String, InternationalString>> buildMapDimensionsValuesLocalisedLabels(List<Dimension> dimensions) throws MetamacException {
        Map<String, Map<String, InternationalString>> dimensionsValuesLabels = new HashMap<String, Map<String, InternationalString>>(dimensions.size());
        for (Dimension dimension : dimensions) {
            Map<String, InternationalString> dimensionValuesLabels = buildMapDimensionsValuesLocalisedLabels(dimension);
            dimensionsValuesLabels.put(dimension.getId(), dimensionValuesLabels);
        }
        return dimensionsValuesLabels;
    }

    /**
     * Builds a map indexed by dimensionId with a value as name of the dimension
     */
    public static Map<String, String> buildMapAttributesLabels(List<Attribute> attributes, String lang, String langAlternative) throws MetamacException {
        Map<String, String> attributesValuesLabels = new HashMap<String, String>(attributes.size());

        for (Attribute attribute : attributes) {
            String attributeId = attribute.getId();
            String attributeLabel = getLabel(attribute.getName(), lang, langAlternative);
            attributesValuesLabels.put(attributeId, attributeLabel);
        }

        return attributesValuesLabels;
    }

    /**
     * Builds a map indexed by attributeId with a map indexed by attributeValueId and value as title of the attribute value
     */
    public static Map<String, Map<String, String>> buildMapAttributesValuesLabels(List<Attribute> attributes, String lang, String langAlternative) throws MetamacException {
        Map<String, Map<String, String>> attributesValuesLabels = new HashMap<String, Map<String, String>>(attributes.size());
        for (Attribute attribute : attributes) {
            String attributeId = attribute.getId();
            Map<String, String> attributeValuesLabels = null;
            if (attribute.getAttributeValues() == null) {
                attributeValuesLabels = new HashMap<String, String>();
            } else if (attribute.getAttributeValues() instanceof EnumeratedAttributeValues) {
                EnumeratedAttributeValues attributeValues = (EnumeratedAttributeValues) attribute.getAttributeValues();
                attributeValuesLabels = new HashMap<String, String>(attributeValues.getValues().size());
                for (EnumeratedAttributeValue attributeValue : attributeValues.getValues()) {
                    String attributeValueId = attributeValue.getId();
                    String attributeValueLabel = getLabel(attributeValue.getName(), lang, langAlternative);
                    attributeValuesLabels.put(attributeValueId, attributeValueLabel);
                }
            } else if (attribute.getAttributeValues() instanceof NonEnumeratedAttributeValues) {
                NonEnumeratedAttributeValues attributeValues = (NonEnumeratedAttributeValues) attribute.getAttributeValues();
                attributeValuesLabels = new HashMap<String, String>(attributeValues.getValues().size());
                for (NonEnumeratedAttributeValue attributeValue : attributeValues.getValues()) {
                    String attributeValueId = attributeValue.getId();
                    String attributeValueLabel = getLabel(attributeValue.getName(), lang, langAlternative);
                    attributeValuesLabels.put(attributeValueId, attributeValueLabel);
                }
            } else {
                throw new MetamacException(ServiceExceptionType.UNKNOWN, "Attribute values unexpected: " + attribute.getAttributeValues().getClass().getCanonicalName());
            }
            attributesValuesLabels.put(attributeId, attributeValuesLabels);
        }
        return attributesValuesLabels;
    }

    /**
     * Builds a map indexed by attributeId with a map indexed by attributeValueId and localised value as title of the attribute value
     */
    public static Map<String, Map<String, InternationalString>> buildMapAttributesValuesLocalisedLabels(List<Attribute> attributes) throws MetamacException {
        Map<String, Map<String, InternationalString>> attributesValuesLocalisedLabels = new HashMap<String, Map<String, InternationalString>>(attributes.size());
        for (Attribute attribute : attributes) {
            String attributeId = attribute.getId();
            Map<String, InternationalString> attributeValuesLabels = null;
            if (attribute.getAttributeValues() == null) {
                attributeValuesLabels = new HashMap<String, InternationalString>();
            } else if (attribute.getAttributeValues() instanceof EnumeratedAttributeValues) {
                EnumeratedAttributeValues attributeValues = (EnumeratedAttributeValues) attribute.getAttributeValues();
                attributeValuesLabels = new HashMap<String, InternationalString>(attributeValues.getValues().size());
                for (EnumeratedAttributeValue attributeValue : attributeValues.getValues()) {
                    String attributeValueId = attributeValue.getId();
                    attributeValuesLabels.put(attributeValueId, attributeValue.getName());
                }
            } else if (attribute.getAttributeValues() instanceof NonEnumeratedAttributeValues) {
                NonEnumeratedAttributeValues attributeValues = (NonEnumeratedAttributeValues) attribute.getAttributeValues();
                attributeValuesLabels = new HashMap<String, InternationalString>(attributeValues.getValues().size());
                for (NonEnumeratedAttributeValue attributeValue : attributeValues.getValues()) {
                    String attributeValueId = attributeValue.getId();
                    attributeValuesLabels.put(attributeValueId, attributeValue.getName());
                }
            } else {
                throw new MetamacException(ServiceExceptionType.UNKNOWN, "Attribute values unexpected: " + attribute.getAttributeValues().getClass().getCanonicalName());
            }
            attributesValuesLocalisedLabels.put(attributeId, attributeValuesLabels);
        }
        return attributesValuesLocalisedLabels;
    }

    /**
     * Calculate the effective label visualisation mode for a dimension.
     * If configuration does not exist for component, returns default configuration
     * 
     * @param labelVisualisationsMode map
     * @param datasetSelection
     * @param dimension
     */
    public static LabelVisualisationModeEnum buildMapDimensionToMapDimensionsLabelVisualisationMode(DatasetSelection datasetSelection, Dimension dimension) {
        String dimensionId = dimension.getId();
        LabelVisualisationModeEnum labelVisualisationMode = datasetSelection != null ? datasetSelection.getDimensionLabelVisualisationModel(dimensionId) : null;
        if (labelVisualisationMode == null) {
            // default value
            labelVisualisationMode = LabelVisualisationModeEnum.CODE_AND_LABEL;
        }
        return labelVisualisationMode;
    }

    /**
     * Builds a map indexed by dimensionId with the effective label visualisation mode.
     * If configuration does not exist for component, returns default configuration
     */
    public static Map<String, LabelVisualisationModeEnum> buildMapDimensionsLabelVisualisationMode(DatasetSelection datasetSelection, List<Dimension> dimensions) {
        Map<String, LabelVisualisationModeEnum> labelVisualisationsMode = new HashMap<String, LabelVisualisationModeEnum>(dimensions.size());
        for (Dimension dimension : dimensions) {
            LabelVisualisationModeEnum labelVisualisationMode = buildMapDimensionToMapDimensionsLabelVisualisationMode(datasetSelection, dimension);
            labelVisualisationsMode.put(dimension.getId(), labelVisualisationMode);
        }
        return labelVisualisationsMode;
    }

    /**
     * Builds a map indexed by attributeId with the effective label visualisation mode.
     * If attributes has not attributes values in metadata, returns 'only code'
     * If configuration does not exist for component, returns default configuration
     */
    public static Map<String, LabelVisualisationModeEnum> buildMapAttributesLabelVisualisationMode(DatasetSelection datasetSelection, List<Attribute> attributes) {
        Map<String, LabelVisualisationModeEnum> labelVisualisationsMode = new HashMap<String, LabelVisualisationModeEnum>(attributes.size());
        for (Attribute attribute : attributes) {
            String attributeId = attribute.getId();
            LabelVisualisationModeEnum labelVisualisationMode = null;
            if (attribute.getAttributeValues() == null) {
                // Attribute has not translation for the codes
                labelVisualisationMode = LabelVisualisationModeEnum.CODE;
            } else {
                labelVisualisationMode = datasetSelection != null ? datasetSelection.getAttributeLabelVisualisationModel(attributeId) : null;
                if (labelVisualisationMode == null) {
                    // default value
                    labelVisualisationMode = LabelVisualisationModeEnum.CODE_AND_LABEL;
                }
            }
            labelVisualisationsMode.put(attributeId, labelVisualisationMode);
        }
        return labelVisualisationsMode;
    }

    public static String[] dataToDataArray(String data) {
        return StringUtils.splitByWholeSeparatorPreserveAllTokens(data, StatisticalResourcesRestConstants.DATA_SEPARATOR);
    }

    public static boolean isDimensionWithEnumeratedRepresentation(Dimension dimension) {
        return (dimension.getDimensionValues() instanceof EnumeratedDimensionValues);
    }
}
