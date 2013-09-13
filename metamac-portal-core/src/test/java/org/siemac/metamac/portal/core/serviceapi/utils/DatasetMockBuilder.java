package org.siemac.metamac.portal.core.serviceapi.utils;

import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;
import org.siemac.metamac.rest.common.v1_0.domain.LocalisedString;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.*;

import java.util.List;

public class DatasetMockBuilder {

    private final Dataset dataset;
    private List<CodeRepresentation> codeRepresentationList;
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

        InternationalString internationalString = internationalString(dimensionLabel);

        dimension.setName(internationalString);
        dataset.getMetadata().getDimensions().getDimensions().add(dimension);

        NonEnumeratedDimensionValues dimensionValues = new NonEnumeratedDimensionValues();
        dimensionValuesList = dimensionValues.getValues();
        dimension.setDimensionValues(dimensionValues);
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

    public Dataset build() {
        return dataset;
    }

}
