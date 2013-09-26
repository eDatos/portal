package org.siemac.metamac.portal.core.domain;

import static org.siemac.metamac.portal.core.utils.PortalUtils.dataToDataArray;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Attribute;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.AttributeAttachmentLevelType;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.CodeRepresentation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DataAttribute;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionRepresentation;

public class DatasetAccessForTsv extends DatasetAccess {

    // Metadata
    private List<String>              attributesIdObservationLevelAttachment;

    // Data
    private List<String>              dimensionsOrderedForData;
    private Map<String, List<String>> dimensionValuesOrderedForDataByDimensionId;
    private Map<String, String[]>     attributesValuesByAttributeId;

    public DatasetAccessForTsv(Dataset dataset, String lang, String langAlternative) throws MetamacException {
        super(dataset, lang, langAlternative);

        initializeDimensionsForData(dataset);
        initializeAttributesWithObservationAttachmentLevel(dataset);

    }

    public List<String> getDimensionsOrderedForData() {
        return dimensionsOrderedForData;
    }

    public List<String> getDimensionValuesOrderedForData(String dimensionId) {
        return dimensionValuesOrderedForDataByDimensionId.get(dimensionId);
    }

    public List<String> getAttributesIdObservationLevelAttachment() {
        return attributesIdObservationLevelAttachment;
    }

    public String[] getAttributeValues(String attributeId) {
        return attributesValuesByAttributeId.get(attributeId);
    }

    /**
     * Inits dimensions and dimensions values. Builds a map with dimensions values to get order provided in DATA, because observations are retrieved in API with this order
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

    /**
     * Init definitions and values of attributes with observation attachment level
     */
    private void initializeAttributesWithObservationAttachmentLevel(Dataset dataset) {
        this.attributesIdObservationLevelAttachment = new ArrayList<String>();
        this.attributesValuesByAttributeId = new HashMap<String, String[]>(attributesIdObservationLevelAttachment.size());
        if (dataset.getMetadata().getAttributes() == null) {
            return;
        }

        // Definition
        for (Attribute attribute : dataset.getMetadata().getAttributes().getAttributes()) {
            if (AttributeAttachmentLevelType.PRIMARY_MEASURE.equals(attribute.getAttachmentLevel())) {
                this.attributesIdObservationLevelAttachment.add(attribute.getId());
            }
        }
        // Data
        for (String attributeId : attributesIdObservationLevelAttachment) {
            if (dataset.getData().getAttributes() != null) {
                for (DataAttribute dataAttribute : dataset.getData().getAttributes().getAttributes()) {
                    if (dataAttribute.getId().equals(attributeId)) {
                        attributesValuesByAttributeId.put(attributeId, dataToDataArray(dataAttribute.getValue()));
                    }
                }
            }
        }
    }
}
