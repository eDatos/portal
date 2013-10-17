package org.siemac.metamac.portal.core.serviceapi.utils;

import org.joda.time.DateTime;
import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;
import org.siemac.metamac.rest.common.v1_0.domain.LocalisedString;
import org.siemac.metamac.rest.common.v1_0.domain.Resource;
import org.siemac.metamac.rest.common.v1_0.domain.Resources;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Attribute;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.AttributeAttachmentLevelType;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.AttributeDimension;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.AttributeDimensions;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Attributes;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.CodeRepresentation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.CodeRepresentations;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Data;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DataAttribute;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DataAttributes;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DataStructureDefinition;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DatasetMetadata;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dimension;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionRepresentation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionRepresentations;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dimensions;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionsId;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.EnumeratedAttributeValue;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.EnumeratedAttributeValues;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.EnumeratedDimensionValue;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.EnumeratedDimensionValues;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.NonEnumeratedAttributeValue;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.NonEnumeratedAttributeValues;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.NonEnumeratedDimensionValue;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.NonEnumeratedDimensionValues;

public class DatasetMockBuilder {

    private final Dataset           dataset;
    private Dimension               lastDimensionMetadata;
    private DimensionRepresentation lastDimensionData;

    private Attribute               lastAttributeMetadata;

    public static DatasetMockBuilder create() {
        return new DatasetMockBuilder();
    }

    private DatasetMockBuilder() {
        dataset = new Dataset();
        dataset.setName(internationalString("title"));
        dataset.setDescription(internationalString("description"));
        dataset.setMetadata(new DatasetMetadata());
        dataset.getMetadata().setLanguages(new Resources());
        dataset.getMetadata().getLanguages().getResources().add(mockResource("es"));
        dataset.getMetadata().getLanguages().getResources().add(mockResource("en"));
        dataset.getMetadata().setCreatedDate(new DateTime(2013, 1, 2, 13, 15, 12, 0).toDate());
        dataset.getMetadata().setLastUpdate(new DateTime(2013, 1, 2, 9, 0, 0, 0).toDate());
        dataset.getMetadata().setDateNextUpdate(new DateTime(2013, 1, 3, 9, 0, 0, 0).toDate());
        dataset.getMetadata().setUpdateFrequency(mockResource("updateFrequency"));
        dataset.getMetadata().setRelatedDsd(mockDataStructureDefinition());
        dataset.getMetadata().setDimensions(new Dimensions());
        dataset.setData(new Data());
        dataset.getData().setDimensions(new DimensionRepresentations());
    }

    public DatasetMockBuilder dimension(String dimensionId) {
        return dimension(dimensionId, dimensionId);
    }

    public DatasetMockBuilder dimension(String dimensionId, String dimensionLabel) {
        // Metadata
        Dimension dimension = new Dimension();
        dimension.setId(dimensionId);
        dimension.setName(internationalString(dimensionLabel));
        dimension.setDimensionValues(new NonEnumeratedDimensionValues());
        dataset.getMetadata().getDimensions().getDimensions().add(dimension);
        lastDimensionMetadata = dimension;

        // Data
        DimensionRepresentation dimensionRepresentation = new DimensionRepresentation();
        dimensionRepresentation.setDimensionId(dimensionId);
        dimensionRepresentation.setRepresentations(new CodeRepresentations());
        dataset.getData().getDimensions().getDimensions().add(dimensionRepresentation);
        lastDimensionData = dimensionRepresentation;

        return this;
    }

    public DatasetMockBuilder stub() {
        if (lastDimensionMetadata == null || lastDimensionData == null) {
            throw new IllegalArgumentException("Define a dimension previously");
        }
        dataset.getMetadata().getRelatedDsd().getStub().getDimensionIds().add(lastDimensionMetadata.getId());
        return this;
    }

    public DatasetMockBuilder heading() {
        if (lastDimensionMetadata == null || lastDimensionData == null) {
            throw new IllegalArgumentException("Define a dimension previously");
        }
        dataset.getMetadata().getRelatedDsd().getHeading().getDimensionIds().add(lastDimensionMetadata.getId());
        return this;
    }

    public DatasetMockBuilder attribute(String attributeId, AttributeAttachmentLevelType attachementLevel) {
        return attribute(attributeId, attributeId, attachementLevel);
    }

    public DatasetMockBuilder dimensionValue(String representationId) {
        return dimensionValue(representationId, representationId);
    }

    public DatasetMockBuilder dimensionValue(String dimensionValueId, String dimensionValueLabel) {
        if (lastDimensionMetadata == null || lastDimensionData == null) {
            throw new IllegalArgumentException("Define a dimension previously");
        }

        // Metadata
        if (lastDimensionMetadata.getDimensionValues() instanceof EnumeratedDimensionValues) {
            EnumeratedDimensionValue dimensionValue = new EnumeratedDimensionValue();
            dimensionValue.setId(dimensionValueId);
            dimensionValue.setName(internationalString(dimensionValueLabel));
            ((EnumeratedDimensionValues) lastDimensionMetadata.getDimensionValues()).getValues().add(dimensionValue);
        } else if (lastDimensionMetadata.getDimensionValues() instanceof NonEnumeratedDimensionValues) {
            NonEnumeratedDimensionValue dimensionValue = new NonEnumeratedDimensionValue();
            dimensionValue.setId(dimensionValueId);
            dimensionValue.setName(internationalString(dimensionValueLabel));
            ((NonEnumeratedDimensionValues) lastDimensionMetadata.getDimensionValues()).getValues().add(dimensionValue);
        } else {
            throw new IllegalArgumentException("Inizialice attribute values");
        }

        // Data
        DimensionRepresentation dimensionRepresentation = lastDimensionData;
        CodeRepresentation representation = new CodeRepresentation();
        representation.setCode(dimensionValueId);
        representation.setIndex(dimensionRepresentation.getRepresentations().getRepresentations().size());
        dimensionRepresentation.getRepresentations().getRepresentations().add(representation);

        return this;
    }

    public DatasetMockBuilder attribute(String attributeId, String attributeLabel, AttributeAttachmentLevelType attachementLevel) {
        if (dataset.getMetadata().getAttributes() == null) {
            dataset.getMetadata().setAttributes(new Attributes());
        }
        Attribute attribute = new Attribute();
        attribute.setId(attributeId);
        attribute.setName(internationalString(attributeLabel));
        attribute.setAttachmentLevel(attachementLevel);
        attribute.setAttributeValues(new NonEnumeratedAttributeValues());
        dataset.getMetadata().getAttributes().getAttributes().add(attribute);
        lastAttributeMetadata = attribute;
        return this;
    }

    public DatasetMockBuilder dimensionsAttached(String... dimensionsId) {
        if (lastAttributeMetadata == null) {
            throw new IllegalArgumentException("Define a attribute previously");
        }
        if (!AttributeAttachmentLevelType.DIMENSION.equals(lastAttributeMetadata.getAttachmentLevel())) {
            throw new IllegalArgumentException("Attribute is not with dimension attachment level");
        }
        lastAttributeMetadata.setDimensions(new AttributeDimensions());
        for (int i = 0; i < dimensionsId.length; i++) {
            String dimensionId = dimensionsId[i];
            AttributeDimension attributeDimension = new AttributeDimension();
            attributeDimension.setDimensionId(dimensionId);
            lastAttributeMetadata.getDimensions().getDimensions().add(attributeDimension);
        }
        return this;
    }

    public DatasetMockBuilder attributeValue(String attributeValueId, String attributeValueLabel) {
        if (lastAttributeMetadata == null) {
            throw new IllegalArgumentException("Define a attribute previously");
        }

        // Metadata
        if (lastAttributeMetadata.getAttributeValues() instanceof EnumeratedAttributeValues) {
            EnumeratedAttributeValue attributeValue = new EnumeratedAttributeValue();
            attributeValue.setId(attributeValueId);
            attributeValue.setName(internationalString(attributeValueLabel));
            ((EnumeratedAttributeValues) lastAttributeMetadata.getAttributeValues()).getValues().add(attributeValue);
        } else if (lastAttributeMetadata.getAttributeValues() instanceof NonEnumeratedAttributeValues) {
            NonEnumeratedAttributeValue attributeValue = new NonEnumeratedAttributeValue();
            attributeValue.setId(attributeValueId);
            attributeValue.setName(internationalString(attributeValueLabel));
            ((NonEnumeratedAttributeValues) lastAttributeMetadata.getAttributeValues()).getValues().add(attributeValue);
        } else {
            throw new IllegalArgumentException("Inizialice attribute values");
        }

        return this;
    }

    public DatasetMockBuilder attributeData(String attributeId, String value) {
        if (dataset.getData().getAttributes() == null) {
            dataset.getData().setAttributes(new DataAttributes());
        }
        DataAttribute dataAttribute = new DataAttribute();
        dataAttribute.setId(attributeId);
        dataAttribute.setValue(value);
        dataset.getData().getAttributes().getAttributes().add(dataAttribute);
        return this;
    }

    public DatasetMockBuilder observations(String observations) {
        dataset.getData().setObservations(observations);
        return this;
    }

    private DataStructureDefinition mockDataStructureDefinition() {
        DataStructureDefinition dataStructureDefinition = new DataStructureDefinition();
        dataStructureDefinition.setShowDecimals(Integer.valueOf(2));
        dataStructureDefinition.setAutoOpen(Boolean.FALSE);
        dataStructureDefinition.setStub(new DimensionsId());
        dataStructureDefinition.setHeading(new DimensionsId());
        return dataStructureDefinition;
    }

    public Dataset build() {
        return dataset;
    }

    private InternationalString internationalString(String label) {
        InternationalString internationalString = new InternationalString();
        {
            LocalisedString localisedString = new LocalisedString();
            localisedString.setLang("es");
            localisedString.setValue(label);
            internationalString.getTexts().add(localisedString);
        }
        {
            LocalisedString localisedString = new LocalisedString();
            localisedString.setLang("en");
            localisedString.setValue(label + " (en)");
            internationalString.getTexts().add(localisedString);
        }
        return internationalString;
    }

    private Resource mockResource(String id) {
        Resource resource = new Resource();
        resource.setId(id);
        resource.setName(internationalString("Label " + id));
        return resource;
    }
}
