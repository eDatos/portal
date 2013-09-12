package org.siemac.metamac.portal.web.mocks;

import org.siemac.metamac.rest.statistical_resources.v1_0.domain.*;
import sun.plugin.dom.exception.InvalidStateException;

import java.util.List;

public class DatasetDataMockFactory {

    private Data data;
    private List<CodeRepresentation> codeRepresentationList;

    public static DatasetDataMockFactory create() {
        return new DatasetDataMockFactory();
    }
    
    private DatasetDataMockFactory() {
        data = new Data();
        data.setDimensions(new DimensionRepresentations());
    }

    public DatasetDataMockFactory dimension(String dimensionId) {
        CodeRepresentations codeRepresentations = new CodeRepresentations();
        codeRepresentationList = codeRepresentations.getRepresentations();

        DimensionRepresentation dimensionRepresentation = new DimensionRepresentation();
        dimensionRepresentation.setDimensionId(dimensionId);
        dimensionRepresentation.setRepresentations(codeRepresentations);

        data.getDimensions().getDimensions().add(dimensionRepresentation);

        return this;
    }

    public DatasetDataMockFactory representation(String representationCode) {
        if (codeRepresentationList == null){
            throw new InvalidStateException("Define a dimension before it representation");
        }

        CodeRepresentation representation = new CodeRepresentation();
        representation.setCode(representationCode);
        representation.setIndex(codeRepresentationList.size());
        codeRepresentationList.add(representation);

        return this;
    }

    public DatasetDataMockFactory observations(String observations) {
        data.setObservations(observations);
        return this;
    }

    public Data build() {
        return data;
    }

}
