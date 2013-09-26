package org.siemac.metamac.portal.core.utils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.domain.ExportPersonalisation;
import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;
import org.siemac.metamac.portal.core.error.ServiceExceptionType;
import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;
import org.siemac.metamac.rest.common.v1_0.domain.LocalisedString;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dimension;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.EnumeratedDimensionValue;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.EnumeratedDimensionValues;
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
     * Calculates effective configuration to label visualisation. If configuration does not exist for dimension, returns default configuration
     */
    public static LabelVisualisationModeEnum calculateConfigurationDimensionLabelVisualisation(ExportPersonalisation exportPersonalisation, String dimensionId) {
        Map<String, LabelVisualisationModeEnum> visualisationsConfig = null;
        if (exportPersonalisation != null) {
            visualisationsConfig = exportPersonalisation.getDimensionsLabelVisualisationsMode();
        }
        return calculateConfigurationDimensionLabelVisualisation(visualisationsConfig, dimensionId);
    }

    /**
     * Calculates effective configuration to label visualisation. If configuration does not exist for attribute, returns default configuration
     */
    public static LabelVisualisationModeEnum calculateConfigurationAttributeLabelVisualisation(ExportPersonalisation exportPersonalisation, String dimensionId) {
        Map<String, LabelVisualisationModeEnum> visualisationsConfig = null;
        if (exportPersonalisation != null) {
            visualisationsConfig = exportPersonalisation.getAttributesLabelVisualisationsMode();
        }
        return calculateConfigurationDimensionLabelVisualisation(visualisationsConfig, dimensionId);
    }

    /**
     * Builds a map indexed by dimensionId with a map indexed by dimensionValueId and value as title of the dimension value.
     */
    public static Map<String, Map<String, String>> buildMapDimensionsValuesLabels(List<Dimension> dimensions, String lang, String langAlternative) throws MetamacException {
        Map<String, Map<String, String>> dimensionValuesTitles = new HashMap<String, Map<String, String>>(dimensions.size());
        for (Dimension dimension : dimensions) {
            String dimensionId = dimension.getId();
            Map<String, String> dimensionsValuesTitles = null;
            if (dimension.getDimensionValues() instanceof EnumeratedDimensionValues) {
                EnumeratedDimensionValues dimensionValues = (EnumeratedDimensionValues) dimension.getDimensionValues();
                dimensionsValuesTitles = new HashMap<String, String>(dimensionValues.getValues().size());
                for (EnumeratedDimensionValue dimensionValue : dimensionValues.getValues()) {
                    String dimensionValueId = dimensionValue.getId();
                    String dimensionValueLabel = getLabel(dimensionValue.getName(), lang, langAlternative);
                    dimensionsValuesTitles.put(dimensionValueId, dimensionValueLabel);
                }
            } else if (dimension.getDimensionValues() instanceof NonEnumeratedDimensionValues) {
                NonEnumeratedDimensionValues dimensionValues = (NonEnumeratedDimensionValues) dimension.getDimensionValues();
                dimensionsValuesTitles = new HashMap<String, String>(dimensionValues.getValues().size());
                for (NonEnumeratedDimensionValue dimensionValue : dimensionValues.getValues()) {
                    String dimensionValueId = dimensionValue.getId();
                    String dimensionValueLabel = getLabel(dimensionValue.getName(), lang, langAlternative);
                    dimensionsValuesTitles.put(dimensionValueId, dimensionValueLabel);
                }
            } else {
                throw new MetamacException(ServiceExceptionType.UNKNOWN, "Dimension values unexpected: " + dimension.getDimensionValues().getClass().getCanonicalName());
            }
            dimensionValuesTitles.put(dimensionId, dimensionsValuesTitles);
        }
        return dimensionValuesTitles;
    }

    /**
     * Builds a map indexed by dimensionId with the effective label visualisation mode
     */
    public static Map<String, LabelVisualisationModeEnum> buildMapDimensionsLabelVisualisationMode(ExportPersonalisation exportPersonalisation, List<Dimension> dimensions) {
        Map<String, LabelVisualisationModeEnum> dimensionsLabelVisualisationMode = new HashMap<String, LabelVisualisationModeEnum>(dimensions.size());
        for (Dimension dimension : dimensions) {
            String dimensionId = dimension.getId();
            LabelVisualisationModeEnum labelVisualisation = calculateConfigurationDimensionLabelVisualisation(exportPersonalisation, dimensionId);
            dimensionsLabelVisualisationMode.put(dimensionId, labelVisualisation);
        }
        return dimensionsLabelVisualisationMode;
    }

    public static String[] dataToDataArray(String data) {
        return StringUtils.splitByWholeSeparatorPreserveAllTokens(data, StatisticalResourcesRestConstants.DATA_SEPARATOR);
    }

    /**
     * Calculates effective configuration to label visualisation. If configuration does not exist for component, returns default configuration
     */
    private static LabelVisualisationModeEnum calculateConfigurationDimensionLabelVisualisation(Map<String, LabelVisualisationModeEnum> visualisationsConfig, String id) {
        LabelVisualisationModeEnum labelVisualisation = null;
        if (visualisationsConfig != null) {
            labelVisualisation = visualisationsConfig.get(id);
        }
        if (labelVisualisation == null) {
            // default value
            labelVisualisation = LabelVisualisationModeEnum.CODE_AND_LABEL;
        }
        return labelVisualisation;
    }
}
