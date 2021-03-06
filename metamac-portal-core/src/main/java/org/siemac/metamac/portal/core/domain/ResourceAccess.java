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
import java.util.ListIterator;
import java.util.Map;

import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;
import org.siemac.metamac.portal.core.exporters.PxExporter;
import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Attribute;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.AttributeAttachmentLevelType;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.AttributeDimension;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Attributes;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.CodeRepresentation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.ComponentType;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Data;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DataAttribute;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DataStructureDefinition;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DatasetMetadata;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dimension;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionRepresentation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionType;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dimensions;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Query;

public class ResourceAccess {

    private String                                        lang;
    private String                                        langAlternative;

    private Data                                          data;
    private Dimensions                                    dimensions;
    private Attributes                                    attributes;

    private InternationalString                           name;
    private DatasetMetadata                               metadata;
    private DataStructureDefinition                       relatedDsd;
    private String                                        urn;
    private String                                        id;
    private String                                        uniqueId;
    private InternationalString                           description;

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
    
    private Dataset dataset;
    
    private final Map<String, Integer>           multipliers         = new HashMap<String, Integer>();
    private final Map<String, Map<String, Long>> representationIndex = new HashMap<String, Map<String, Long>>(); // Map<Dimension, Map<Code, Index>

    public ResourceAccess(Dataset dataset, DatasetSelection datasetSelection, String lang, String langAlternative) throws MetamacException {
        data = dataset.getData();
        dimensions = dataset.getMetadata().getDimensions();
        attributes = dataset.getMetadata().getAttributes();

        uniqueId = dataset.getId();
        if (datasetSelection != null && datasetSelection.isUserSelection()) {
            uniqueId = PxExporter.generateMatrixFromString(dataset.getId());
        }
        
        name = dataset.getName();
        id = dataset.getId();
        urn = dataset.getUrn();
        description = dataset.getDescription();
        relatedDsd = dataset.getMetadata().getRelatedDsd();

        this.dataset = dataset;
        metadata = dataset.getMetadata();

        initialize(data, dimensions, attributes, datasetSelection, lang, langAlternative);
    }

    public ResourceAccess(Query query, Dataset relatedDataset, DatasetSelection datasetSelection, String lang, String langAlternative) throws MetamacException {
        data = query.getData();
        dimensions = query.getMetadata().getDimensions();
        attributes = query.getMetadata().getAttributes();

        // Query id can be too long for PX Matrix
        uniqueId = PxExporter.generateMatrixFromString(query.getId());
        
        name = query.getName();
        id = query.getId();
        urn = query.getUrn();
        description = query.getDescription();
        relatedDsd = query.getMetadata().getRelatedDsd();

        if (relatedDataset != null) {
            dataset = relatedDataset;
            metadata = relatedDataset.getMetadata();
        }

        initialize(data, dimensions, attributes, datasetSelection, lang, langAlternative);
    }

    private void initialize(Data data, Dimensions dimensions, Attributes attributes, DatasetSelection datasetSelection, String lang, String langAlternative) throws MetamacException {
        this.lang = lang;
        this.langAlternative = langAlternative;

        initializeDimensions(dimensions, datasetSelection);
        initializeAttributes(data, attributes, datasetSelection);
        initializeObservations(data);
        initializeDimensionsForData(data);
        initializeMultipliers();
        initializeIndex();
    }

    public Data getData() {
        return data;
    }

    public Dimensions getDimensions() {
        return dimensions;
    }

    public Attributes getAttributes() {
        return attributes;
    }

    public InternationalString getName() {
        return name;
    }
    
    public Dataset getDataset() {
        return dataset;
    }

    public DatasetMetadata getMetadata() {
        return metadata;
    }

    public DataStructureDefinition getRelatedDsd() {
        return relatedDsd;
    }
    
    public String getUniqueId() {
        return uniqueId;
    }

    public String getId() {
        return id;
    }

    public String getUrn() {
        return urn;
    }

    public InternationalString getDescription() {
        return description;
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
    private void initializeDimensions(Dimensions dimensions, DatasetSelection datasetSelection) throws MetamacException {
        dimensionsMetadata = dimensions.getDimensions();

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
                measureDimension = dimension;
            }
        }

        this.dimensionsMetadataMap = dimensionsMetadataMap;
        dimensionsLabelVisualisationMode = labelVisualisationsMode;
        this.dimensionsValuesCurrentLocaleLabels = dimensionsValuesCurrentLocaleLabels;
        this.dimensionsValuesLabels = dimensionsValuesLabels;
        dimensionLabels = dimensionsLabels;
    }

    /**
     * Init definitions and values of attributes
     *
     * @param attributes
     */
    private void initializeAttributes(Data data, Attributes attributes, DatasetSelection datasetSelection) throws MetamacException {
        if (attributes == null) {
            attributesMetadata = new ArrayList<Attribute>();
        } else {
            attributesMetadata = attributes.getAttributes();
        }

        Map<String, Attribute> attributesMetadataMap = new HashMap<String, Attribute>(attributesMetadata.size());

        // Attribute Instances
        attributesValuesByAttributeId = new HashMap<String, String[]>(attributesMetadata.size());
        for (Attribute attribute : attributesMetadata) {
            if (data.getAttributes() != null) {
                for (DataAttribute dataAttribute : data.getAttributes().getAttributes()) {
                    if (dataAttribute.getId().equals(attribute.getId())) {
                        attributesValuesByAttributeId.put(attribute.getId(), dataToDataArray(dataAttribute.getValue()));
                    }
                }
            }

            // Measure Attribute
            if (ComponentType.MEASURE.equals(attribute.getType())) {
                measureAttribute = attribute;
            }

            // Attributes Metadata Map
            attributesMetadataMap.put(attribute.getId(), attribute);
        }

        this.attributesMetadataMap = attributesMetadataMap;
        attributesLabelVisualisationMode = buildMapAttributesLabelVisualisationMode(datasetSelection, attributesMetadata);
        attributesValuesCurrentLocaleLabels = buildMapAttributesValuesLabels(attributesMetadata, lang, langAlternative);
        attributesValuesLabels = buildMapAttributesValuesLocalisedLabels(attributesMetadata);
        attributesLabels = buildMapAttributesLabels(attributesMetadata, lang, langAlternative);
    }

    /**
     * Init observations values
     */
    private void initializeObservations(Data data) {
        observations = dataToDataArray(data.getObservations());
    }

    /**
     * Init dimensions and dimensions values. Builds a map with dimensions values to get order provided in DATA, because observations are retrieved in API with this order
     */
    private void initializeDimensionsForData(Data data) throws MetamacException {
        List<DimensionRepresentation> dimensionRepresentations = data.getDimensions().getDimensions();
        dimensionsOrderedForData = new ArrayList<String>(dimensionRepresentations.size());
        dimensionValuesOrderedForDataByDimensionId = new HashMap<String, List<String>>(dimensionRepresentations.size());
        for (DimensionRepresentation dimensionRepresentation : dimensionRepresentations) {
            String dimensionId = dimensionRepresentation.getDimensionId();
            dimensionsOrderedForData.add(dimensionId);

            List<CodeRepresentation> codesRepresentations = dimensionRepresentation.getRepresentations().getRepresentations();
            dimensionValuesOrderedForDataByDimensionId.put(dimensionId, new ArrayList<String>(codesRepresentations.size()));
            for (CodeRepresentation codeRepresentation : codesRepresentations) {
                dimensionValuesOrderedForDataByDimensionId.get(dimensionId).add(codeRepresentation.getCode());
            }
        }
    }

    public String applyLabelVisualizationModeForAttributeValue(String attributeId, String attributeValue) {
        // Visualisation mode
        LabelVisualisationModeEnum labelVisualisation = getAttributeLabelVisualisationMode(attributeId);
        switch (labelVisualisation) {
            case CODE:
                // no extra action
                break;
            case LABEL: {
                String attributeValueLabel = getAttributeValueLabelCurrentLocale(attributeId, attributeValue);
                if (attributeValueLabel != null) {
                    attributeValue = attributeValueLabel;
                }
            }
                break;
            case CODE_AND_LABEL: {
                String attributeValueLabel = getAttributeValueLabelCurrentLocale(attributeId, attributeValue);
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
   
   public String measureAttributeValueAtPermutation(String attributeId, Map<String, String> permutation) {
       int offset = calculateOffsetAtPermutation(permutation);
       String[] attributeValues = getAttributeValues(attributeId);
       String attributeValue = null;
       if (attributeValues != null) {
           attributeValue = attributeValues[offset];
       }
       return attributeValue;
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
           attributeValue = applyLabelVisualizationModeForAttributeValue(attributeId, attributeValue);
       }
       return attributeValue;
   }

   public String applyLabelVisualizationModeForAttribute(String attributeId) {
       // Visualisation mode
       LabelVisualisationModeEnum labelVisualisation = getAttributeLabelVisualisationMode(attributeId);
       String resultText = null;
       switch (labelVisualisation) {
           case CODE:
               resultText = attributeId;
               break;
           case LABEL: {
               String attributeLabel = getAttributeLabel(attributeId);
               if (attributeLabel != null) {
                   resultText = attributeLabel;
               }
           }
               break;
           case CODE_AND_LABEL: {
               String attributeLabel = getAttributeLabel(attributeId);
               if (attributeLabel != null) {
                   resultText = attributeLabel + " (" + attributeId + ")";
               }
           }
               break;
           default:
               break;
       }
       return resultText;
   }

   public String applyLabelVisualizationModeForDimension(String dimensionId) {
       LabelVisualisationModeEnum labelVisualisation = getDimensionLabelVisualisationMode(dimensionId);
       String resultText = null;
       switch (labelVisualisation) {
           case CODE:
               resultText = dimensionId;
               break;
           case LABEL: {
               String dimensionValueLabel = getDimensionLabel(dimensionId);
               if (dimensionValueLabel != null) {
                   resultText = dimensionValueLabel;
               }
           }
               break;
           case CODE_AND_LABEL: {
               String dimensionValueLabel = getDimensionLabel(dimensionId);
               if (dimensionValueLabel != null) {
                   resultText = dimensionValueLabel + " (" + dimensionId + ")";
               }
           }
               break;
           default:
               break;
       }
       return resultText;
   }

   public String applyLabelVisualizationModeForDimensionValue(String dimensionId, String dimensionValueId) {
       LabelVisualisationModeEnum labelVisualisation = getDimensionLabelVisualisationMode(dimensionId);
       switch (labelVisualisation) {
           case CODE:
               // no extra action
               break;
           case LABEL: {
               String dimensionValueLabel = getDimensionValueLabelCurrentLocale(dimensionId, dimensionValueId);
               if (dimensionValueLabel != null) {
                   dimensionValueId = dimensionValueLabel;
               }
           }
               break;
           case CODE_AND_LABEL: {
               String dimensionValueLabel = getDimensionValueLabelCurrentLocale(dimensionId, dimensionValueId);
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
       List<DimensionRepresentation> dimensions = getData().getDimensions().getDimensions();
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
       List<DimensionRepresentation> dimensions = getData().getDimensions().getDimensions();
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