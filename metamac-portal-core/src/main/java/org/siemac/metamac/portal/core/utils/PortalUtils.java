package org.siemac.metamac.portal.core.utils;

import java.util.Map;

import org.siemac.metamac.portal.core.domain.ExportPersonalisation;
import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;
import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;
import org.siemac.metamac.rest.common.v1_0.domain.LocalisedString;

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
     * Calculate effective configuration to label visualisation. If configuration does not exist for dimension, returns default configuration
     */
    public static LabelVisualisationModeEnum calculateConfigurationDimensionLabelVisualisation(ExportPersonalisation exportPersonalisation, String dimensionId) {
        Map<String, LabelVisualisationModeEnum> visualisationsConfig = null;
        if (exportPersonalisation != null) {
            visualisationsConfig = exportPersonalisation.getDimensionsLabelVisualisationsMode();
        }
        return calculateConfigurationDimensionLabelVisualisation(visualisationsConfig, dimensionId);
    }

    /**
     * Calculate effective configuration to label visualisation. If configuration does not exist for attribute, returns default configuration
     */
    public static LabelVisualisationModeEnum calculateConfigurationAttributeLabelVisualisation(ExportPersonalisation exportPersonalisation, String dimensionId) {
        Map<String, LabelVisualisationModeEnum> visualisationsConfig = null;
        if (exportPersonalisation != null) {
            visualisationsConfig = exportPersonalisation.getAttributesLabelVisualisationsMode();
        }
        return calculateConfigurationDimensionLabelVisualisation(visualisationsConfig, dimensionId);
    }

    /**
     * Calculate effective configuration to label visualisation. If configuration does not exist for component, returns default configuration
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
