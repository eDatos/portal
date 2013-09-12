package org.siemac.metamac.portal.core.serviceapi.utils;

import java.util.List;

import org.siemac.metamac.rest.statistical_resources.v1_0.domain.CodeRepresentation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.CodeRepresentations;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Data;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionRepresentation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionRepresentations;

public class DatasetDataMockBuilder {

    private final Data               data;
    private List<CodeRepresentation> codeRepresentationList;

    public static DatasetDataMockBuilder create() {
        return new DatasetDataMockBuilder();
    }

    private DatasetDataMockBuilder() {
        data = new Data();
        data.setDimensions(new DimensionRepresentations());
    }

    public DatasetDataMockBuilder dimension(String dimensionId) {
        CodeRepresentations codeRepresentations = new CodeRepresentations();
        codeRepresentationList = codeRepresentations.getRepresentations();

        DimensionRepresentation dimensionRepresentation = new DimensionRepresentation();
        dimensionRepresentation.setDimensionId(dimensionId);
        dimensionRepresentation.setRepresentations(codeRepresentations);

        data.getDimensions().getDimensions().add(dimensionRepresentation);

        return this;
    }

    public DatasetDataMockBuilder representation(String... representationCodes) {
        if (codeRepresentationList == null) {
            throw new IllegalArgumentException("Define a dimension before it representation");
        }

        for (String representationCode : representationCodes) {
            CodeRepresentation representation = new CodeRepresentation();
            representation.setCode(representationCode);
            representation.setIndex(codeRepresentationList.size());
            codeRepresentationList.add(representation);
        }

        return this;
    }

    public DatasetDataMockBuilder observations(String observations) {
        data.setObservations(observations);
        return this;
    }

    public Data build() {
        return data;
    }

}
