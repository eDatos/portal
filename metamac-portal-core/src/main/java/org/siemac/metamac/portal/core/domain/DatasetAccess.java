package org.siemac.metamac.portal.core.domain;

import static org.siemac.metamac.portal.core.utils.PortalUtils.buildMapAttributesLabelVisualisationMode;
import static org.siemac.metamac.portal.core.utils.PortalUtils.buildMapAttributesValuesLabels;
import static org.siemac.metamac.portal.core.utils.PortalUtils.buildMapDimensionsLabelVisualisationMode;
import static org.siemac.metamac.portal.core.utils.PortalUtils.buildMapDimensionsValuesLabels;
import static org.siemac.metamac.portal.core.utils.PortalUtils.dataToDataArray;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Attribute;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DataAttribute;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dimension;

public abstract class DatasetAccess {

    private final String                            lang;
    private final String                            langAlternative;

    private final Dataset                           dataset;

    // Metadata
    private List<Dimension>                         dimensionsMetadata;
    private List<Attribute>                         attributesMetadata;

    private Map<String, Map<String, String>>        dimensionsValuesLabels;
    private Map<String, LabelVisualisationModeEnum> dimensionsLabelVisualisationMode;
    private Map<String, Map<String, String>>        attributesValuesLabels;
    private Map<String, LabelVisualisationModeEnum> attributesLabelVisualisationMode;

    // Data
    private String[]                                observations;
    private Map<String, String[]>                   attributesValuesByAttributeId;

    public DatasetAccess(Dataset dataset, DatasetSelection datasetSelection, String lang, String langAlternative) throws MetamacException {
        this.dataset = dataset;
        this.lang = lang;
        this.langAlternative = langAlternative;

        initializeDimensions(dataset, datasetSelection);
        initializeAttributes(dataset, datasetSelection);
        initializeObservations(dataset);
    }

    public Dataset getDataset() {
        return dataset;
    }

    public List<Dimension> getDimensionsMetadata() {
        return dimensionsMetadata;
    }

    public List<Attribute> getAttributesMetadata() {
        return attributesMetadata;
    }

    public String getDimensionValueLabel(String dimensionId, String dimensionValueId) {
        return dimensionsValuesLabels.get(dimensionId).get(dimensionValueId);
    }

    public String getAttributeValueLabel(String attributeId, String attributeValue) {
        return attributesValuesLabels.get(attributeId).get(attributeValue);
    }

    public LabelVisualisationModeEnum getDimensionLabelVisualisationMode(String dimensionId) {
        return dimensionsLabelVisualisationMode.get(dimensionId);
    }

    public LabelVisualisationModeEnum getAttributeLabelVisualisationMode(String attributeId) {
        return attributesLabelVisualisationMode.get(attributeId);
    }

    public String[] getObservations() {
        return observations;
    }

    public String[] getAttributeValues(String attributeId) {
        return attributesValuesByAttributeId.get(attributeId);
    }

    /**
     * Inits dimensions and dimensions values
     */
    private void initializeDimensions(Dataset dataset, DatasetSelection datasetSelection) throws MetamacException {
        this.dimensionsMetadata = dataset.getMetadata().getDimensions().getDimensions();
        this.dimensionsLabelVisualisationMode = buildMapDimensionsLabelVisualisationMode(datasetSelection, this.dimensionsMetadata);
        this.dimensionsValuesLabels = buildMapDimensionsValuesLabels(this.dimensionsMetadata, lang, langAlternative);
    }

    /**
     * Init definitions and values of attributes
     */
    private void initializeAttributes(Dataset dataset, DatasetSelection datasetSelection) throws MetamacException {
        if (dataset.getMetadata().getAttributes() == null) {
            this.attributesMetadata = new ArrayList<Attribute>();
        } else {
            this.attributesMetadata = dataset.getMetadata().getAttributes().getAttributes();
        }
        this.attributesValuesByAttributeId = new HashMap<String, String[]>(this.attributesMetadata.size());
        for (Attribute attribute : this.attributesMetadata) {
            if (dataset.getData().getAttributes() != null) {
                for (DataAttribute dataAttribute : dataset.getData().getAttributes().getAttributes()) {
                    if (dataAttribute.getId().equals(attribute.getId())) {
                        attributesValuesByAttributeId.put(attribute.getId(), dataToDataArray(dataAttribute.getValue()));
                    }
                }
            }
        }
        this.attributesLabelVisualisationMode = buildMapAttributesLabelVisualisationMode(datasetSelection, this.attributesMetadata);
        this.attributesValuesLabels = buildMapAttributesValuesLabels(this.attributesMetadata, lang, langAlternative);
    }

    /**
     * Init observations values
     */
    private void initializeObservations(Dataset dataset) {
        this.observations = dataToDataArray(dataset.getData().getObservations());
    }
}
