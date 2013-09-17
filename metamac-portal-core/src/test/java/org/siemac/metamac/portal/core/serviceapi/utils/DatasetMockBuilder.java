package org.siemac.metamac.portal.core.serviceapi.utils;

import java.util.List;

import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;
import org.siemac.metamac.rest.common.v1_0.domain.LocalisedString;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Attribute;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.AttributeAttachmentLevelType;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Attributes;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.CodeRepresentation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.CodeRepresentations;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Data;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DataAttribute;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DataAttributes;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DatasetMetadata;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dimension;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionRepresentation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionRepresentations;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dimensions;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.NonEnumeratedDimensionValue;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.NonEnumeratedDimensionValues;

public class DatasetMockBuilder {

    private final Dataset                     dataset;
    private List<CodeRepresentation>          codeRepresentationList;
    private List<NonEnumeratedDimensionValue> dimensionValuesList;

    public static DatasetMockBuilder create() {
        return new DatasetMockBuilder();
    }

    private DatasetMockBuilder() {
        dataset = new Dataset();
        dataset.setData(new Data());
        dataset.getData().setDimensions(new DimensionRepresentations());
        dataset.setMetadata(new DatasetMetadata());
        dataset.getMetadata().setDimensions(new Dimensions());
    }

    public DatasetMockBuilder dimension(String dimensionId) {
        return dimension(dimensionId, dimensionId);
    }

    public DatasetMockBuilder dimension(String dimensionId, String dimensionLabel) {
        CodeRepresentations codeRepresentations = new CodeRepresentations();
        codeRepresentationList = codeRepresentations.getRepresentations();

        DimensionRepresentation dimensionRepresentation = new DimensionRepresentation();
        dimensionRepresentation.setDimensionId(dimensionId);
        dimensionRepresentation.setRepresentations(codeRepresentations);

        dataset.getData().getDimensions().getDimensions().add(dimensionRepresentation);

        Dimension dimension = new Dimension();
        dimension.setId(dimensionId);
        dimension.setName(internationalString(dimensionLabel));
        dataset.getMetadata().getDimensions().getDimensions().add(dimension);

        NonEnumeratedDimensionValues dimensionValues = new NonEnumeratedDimensionValues();
        dimensionValuesList = dimensionValues.getValues();
        dimension.setDimensionValues(dimensionValues);
        return this;
    }

    public DatasetMockBuilder attribute(String attributeId, AttributeAttachmentLevelType attachementLevel) {
        return attribute(attributeId, attributeId, attachementLevel);
    }

    public DatasetMockBuilder attribute(String attributeId, String attributeLabel, AttributeAttachmentLevelType attachementLevel) {
        if (dataset.getMetadata().getAttributes() == null) {
            dataset.getMetadata().setAttributes(new Attributes());
        }
        Attribute attribute = new Attribute();
        attribute.setId(attributeId);
        attribute.setName(internationalString(attributeLabel));
        attribute.setAttachmentLevel(attachementLevel);
        dataset.getMetadata().getAttributes().getAttributes().add(attribute);
        return this;
    }

    private InternationalString internationalString(String label) {
        LocalisedString localisedString = new LocalisedString();
        localisedString.setLang("es");
        localisedString.setValue(label);

        InternationalString internationalString = new InternationalString();
        internationalString.getTexts().add(localisedString);
        return internationalString;
    }

    public DatasetMockBuilder representation(String representationId) {
        return representation(representationId, representationId);
    }

    public DatasetMockBuilder representation(String representationId, String representationLabel) {
        if (codeRepresentationList == null) {
            throw new IllegalArgumentException("Define a dimension before it representation");
        }

        CodeRepresentation representation = new CodeRepresentation();
        representation.setCode(representationId);
        representation.setIndex(codeRepresentationList.size());
        codeRepresentationList.add(representation);

        NonEnumeratedDimensionValue dimensionValue = new NonEnumeratedDimensionValue();
        dimensionValue.setId(representationId);
        dimensionValue.setName(internationalString(representationLabel));
        dimensionValuesList.add(dimensionValue);

        return this;
    }

    public DatasetMockBuilder observations(String observations) {
        dataset.getData().setObservations(observations);
        return this;
    }

    public DatasetMockBuilder attributeValues(String attributeId, String value) {
        if (dataset.getData().getAttributes() == null) {
            dataset.getData().setAttributes(new DataAttributes());
        }
        DataAttribute dataAttribute = new DataAttribute();
        dataAttribute.setId(attributeId);
        dataAttribute.setValue(value);
        dataset.getData().getAttributes().getAttributes().add(dataAttribute);
        return this;
    }

    public Dataset build() {
        return dataset;
    }

}
