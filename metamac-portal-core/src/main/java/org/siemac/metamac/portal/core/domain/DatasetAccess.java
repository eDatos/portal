package org.siemac.metamac.portal.core.domain;

import static org.siemac.metamac.portal.core.utils.PortalUtils.buildMapAttributesLabelVisualisationMode;
import static org.siemac.metamac.portal.core.utils.PortalUtils.buildMapAttributesLabels;
import static org.siemac.metamac.portal.core.utils.PortalUtils.buildMapAttributesValuesLabels;
import static org.siemac.metamac.portal.core.utils.PortalUtils.buildMapAttributesValuesLocalisedLabels;
import static org.siemac.metamac.portal.core.utils.PortalUtils.buildMapDimensionLabel;
import static org.siemac.metamac.portal.core.utils.PortalUtils.buildMapDimensionToMapDimensionsLabelVisualisationMode;
import static org.siemac.metamac.portal.core.utils.PortalUtils.buildMapDimensionsValuesLabels;
import static org.siemac.metamac.portal.core.utils.PortalUtils.buildMapDimensionsValuesLocalisedLabels;
import static org.siemac.metamac.portal.core.utils.PortalUtils.dataToDataArray;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;
import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Attribute;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.AttributeAttachmentLevelType;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.AttributeDimension;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.CodeRepresentation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.ComponentType;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DataAttribute;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dimension;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionRepresentation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionType;

public abstract class DatasetAccess {

    private final String                                  lang;
    private final String                                  langAlternative;

    private final Dataset                                 dataset;

    // Metadata
    private List<Dimension>                               dimensionsMetadata;
    private Map<String, Dimension>                        dimensionsMetadataMap;
    private Dimension                                     measureDimension;
    private Map<String, String>                           dimensionLabels;
    private Map<String, Map<String, String>>              dimensionsValuesCurrentLocaleLabels;
    private Map<String, Map<String, InternationalString>> dimensionsValuesLabels;
    private Map<String, LabelVisualisationModeEnum>       dimensionsLabelVisualisationMode;

    private List<Attribute>                               attributesMetadata;
    private Map<String, Attribute>                        attributesMetadataMap;
    private Attribute                                     measureAttribute;
    private Map<String, String>                           attributesLabels;
    private Map<String, Map<String, String>>              attributesValuesCurrentLocaleLabels;
    private Map<String, Map<String, InternationalString>> attributesValuesLabels;
    private Map<String, LabelVisualisationModeEnum>       attributesLabelVisualisationMode;

    // Data
    private String[]                                      observations;
    private Map<String, String[]>                         attributesValuesByAttributeId;
    private List<String>                                  dimensionsOrderedForData;
    private Map<String, List<String>>                     dimensionValuesOrderedForDataByDimensionId;

    public DatasetAccess(Dataset dataset, DatasetSelection datasetSelection, String lang, String langAlternative) throws MetamacException {
        this.dataset = dataset;
        this.lang = lang;
        this.langAlternative = langAlternative;

        initializeDimensions(dataset, datasetSelection);
        initializeAttributes(dataset, datasetSelection);
        initializeObservations(dataset);
        initializeDimensionsForData(dataset);
    }

    public Dataset getDataset() {
        return dataset;
    }

    public String getLang() {
        return lang;
    }

    public String getLangAlternative() {
        return langAlternative;
    }

    public String getLangEffective() {
        return lang != null ? lang : langAlternative;
    }

    public List<Dimension> getDimensionsMetadata() {
        return dimensionsMetadata;
    }

    public Map<String, Dimension> getDimensionsMetadataMap() {
        return dimensionsMetadataMap;
    }

    public List<Attribute> getAttributesMetadata() {
        return attributesMetadata;
    }

    public Map<String, Attribute> getAttributesMetadataMap() {
        return attributesMetadataMap;
    }

    public Attribute getMeasureAttribute() {
        return measureAttribute;
    }

    public Dimension getMeasureDimension() {
        return measureDimension;
    }

    public String getDimensionLabel(String dimensionId) {
        return dimensionLabels.get(dimensionId);
    }

    public String getDimensionValueLabelCurrentLocale(String dimensionId, String dimensionValueId) {
        return dimensionsValuesCurrentLocaleLabels.get(dimensionId).get(dimensionValueId);
    }

    public InternationalString getDimensionValueLabel(String dimensionId, String dimensionValueId) {
        return dimensionsValuesLabels.get(dimensionId).get(dimensionValueId);
    }

    public String getAttributeLabel(String attributeId) {
        return attributesLabels.get(attributeId);
    }

    public String getAttributeValueLabelCurrentLocale(String attributeId, String attributeValue) {
        return attributesValuesCurrentLocaleLabels.get(attributeId).get(attributeValue);
    }

    public InternationalString getAttributeValue(String attributeId, String attributeValue) {
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

    public List<String> getDimensionsOrderedForData() {
        return dimensionsOrderedForData;
    }

    public List<String> getDimensionValuesOrderedForData(String dimensionId) {
        return dimensionValuesOrderedForDataByDimensionId.get(dimensionId);
    }

    public List<String> getDimensionsAttributeOrderedForData(Attribute attribute) {
        List<String> allDimensionsOrderedForData = getDimensionsOrderedForData();
        if (AttributeAttachmentLevelType.DIMENSION.equals(attribute.getAttachmentLevel())) {
            List<String> dimensionsAttribute = new ArrayList<String>();
            for (AttributeDimension attributeDimension : attribute.getDimensions().getDimensions()) {
                dimensionsAttribute.add(attributeDimension.getDimensionId());
            }
            List<String> dimensionsAttributeOrdered = new ArrayList<String>(dimensionsAttribute.size());
            for (String dimensionDatasetId : getDimensionsOrderedForData()) {
                if (dimensionsAttribute.contains(dimensionDatasetId)) {
                    dimensionsAttributeOrdered.add(dimensionDatasetId);
                }
            }
            return dimensionsAttributeOrdered;
        } else if (AttributeAttachmentLevelType.PRIMARY_MEASURE.equals(attribute.getAttachmentLevel())) {
            return allDimensionsOrderedForData;
        } else {
            throw new IllegalArgumentException("Attribute attachement level unsupported in this operation: " + attribute.getAttachmentLevel());
        }
    }

    /**
     * Init dimensions and dimensions values
     */
    private void initializeDimensions(Dataset dataset, DatasetSelection datasetSelection) throws MetamacException {
        this.dimensionsMetadata = dataset.getMetadata().getDimensions().getDimensions();

        Map<String, Dimension> dimensionsMetadataMap = new HashMap<String, Dimension>(dimensionsMetadata.size());
        Map<String, LabelVisualisationModeEnum> labelVisualisationsMode = new HashMap<String, LabelVisualisationModeEnum>(dimensionsMetadata.size());
        Map<String, Map<String, String>> dimensionsValuesCurrentLocaleLabels = new HashMap<String, Map<String, String>>(dimensionsMetadata.size());
        Map<String, Map<String, InternationalString>> dimensionsValuesLabels = new HashMap<String, Map<String, InternationalString>>(dimensionsMetadata.size());
        Map<String, String> dimensionsLabels = new HashMap<String, String>(dimensionsMetadata.size());

        for (Dimension dimension : dimensionsMetadata) {
            String dimensionId = dimension.getId();

            dimensionsMetadataMap.put(dimensionId, dimension);
            labelVisualisationsMode.put(dimensionId, buildMapDimensionToMapDimensionsLabelVisualisationMode(datasetSelection, dimension));
            dimensionsValuesCurrentLocaleLabels.put(dimension.getId(), buildMapDimensionsValuesLabels(dimension, lang, langAlternative));
            dimensionsValuesLabels.put(dimension.getId(), buildMapDimensionsValuesLocalisedLabels(dimension));
            dimensionsLabels.put(dimensionId, buildMapDimensionLabel(dimension, lang, langAlternative));

            if (DimensionType.MEASURE_DIMENSION.equals(dimension.getType())) {
                this.measureDimension = dimension;
            }
        }

        this.dimensionsMetadataMap = dimensionsMetadataMap;
        this.dimensionsLabelVisualisationMode = labelVisualisationsMode;
        this.dimensionsValuesCurrentLocaleLabels = dimensionsValuesCurrentLocaleLabels;
        this.dimensionsValuesLabels = dimensionsValuesLabels;
        this.dimensionLabels = dimensionsLabels;
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

        Map<String, Attribute> attributesMetadataMap = new HashMap<String, Attribute>(attributesMetadata.size());

        // Attribute Instances
        this.attributesValuesByAttributeId = new HashMap<String, String[]>(this.attributesMetadata.size());
        for (Attribute attribute : this.attributesMetadata) {
            if (dataset.getData().getAttributes() != null) {
                for (DataAttribute dataAttribute : dataset.getData().getAttributes().getAttributes()) {
                    if (dataAttribute.getId().equals(attribute.getId())) {
                        attributesValuesByAttributeId.put(attribute.getId(), dataToDataArray(dataAttribute.getValue()));
                    }
                }
            }

            // Measure Attribute
            if (ComponentType.MEASURE.equals(attribute.getType())) {
                this.measureAttribute = attribute;
            }

            // Attributes Metadata Map
            attributesMetadataMap.put(attribute.getId(), attribute);
        }

        this.attributesMetadataMap = attributesMetadataMap;
        this.attributesLabelVisualisationMode = buildMapAttributesLabelVisualisationMode(datasetSelection, this.attributesMetadata);
        this.attributesValuesCurrentLocaleLabels = buildMapAttributesValuesLabels(this.attributesMetadata, lang, langAlternative);
        this.attributesValuesLabels = buildMapAttributesValuesLocalisedLabels(this.attributesMetadata);
        this.attributesLabels = buildMapAttributesLabels(this.attributesMetadata, lang, langAlternative);
    }

    /**
     * Init observations values
     */
    private void initializeObservations(Dataset dataset) {
        this.observations = dataToDataArray(dataset.getData().getObservations());
    }

    /**
     * Init dimensions and dimensions values. Builds a map with dimensions values to get order provided in DATA, because observations are retrieved in API with this order
     */
    private void initializeDimensionsForData(Dataset dataset) throws MetamacException {
        List<DimensionRepresentation> dimensionRepresentations = dataset.getData().getDimensions().getDimensions();
        this.dimensionsOrderedForData = new ArrayList<String>(dimensionRepresentations.size());
        this.dimensionValuesOrderedForDataByDimensionId = new HashMap<String, List<String>>(dimensionRepresentations.size());
        for (DimensionRepresentation dimensionRepresentation : dimensionRepresentations) {
            String dimensionId = dimensionRepresentation.getDimensionId();
            this.dimensionsOrderedForData.add(dimensionId);

            List<CodeRepresentation> codesRepresentations = dimensionRepresentation.getRepresentations().getRepresentations();
            this.dimensionValuesOrderedForDataByDimensionId.put(dimensionId, new ArrayList<String>(codesRepresentations.size()));
            for (CodeRepresentation codeRepresentation : codesRepresentations) {
                this.dimensionValuesOrderedForDataByDimensionId.get(dimensionId).add(codeRepresentation.getCode());
            }
        }
    }
}
