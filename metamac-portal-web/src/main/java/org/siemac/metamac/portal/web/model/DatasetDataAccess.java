package org.siemac.metamac.portal.web.model;

import com.google.common.base.Splitter;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.CodeRepresentation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionRepresentation;

import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;

public class DatasetDataAccess {

    private Dataset dataset;
    private Map<String, Integer> multipliers = new HashMap<String, Integer>();
    private Map<String, Map<String, Long>> representationIndex = new HashMap<String, Map<String, Long>>();
    private List<String> observations;

    public DatasetDataAccess(Dataset dataset) {
        this.dataset = dataset;
        initializeMultipliers();
        initializerIndex();
        observations = Splitter.on(" | ").splitToList(dataset.getData().getObservations());
    }

    private void initializeMultipliers() {
        List<DimensionRepresentation> dimensions = dataset.getData().getDimensions().getDimensions();
        ListIterator<DimensionRepresentation> li = dimensions.listIterator(dimensions.size());
        int ac = 1;
        while (li.hasPrevious()) {
            DimensionRepresentation dimension = li.previous();
            multipliers.put(dimension.getDimensionId(), ac);
            ac *= dimension.getRepresentations().getRepresentations().size();
        }
    }

    public void initializerIndex() {
        List<DimensionRepresentation> dimensions = dataset.getData().getDimensions().getDimensions();
        for (DimensionRepresentation dimension : dimensions) {
            Map<String, Long> representationIndexMap = new HashMap<String, Long>();
            List<CodeRepresentation> representations = dimension.getRepresentations().getRepresentations();
            for (CodeRepresentation representation : representations) {
                representationIndexMap.put(representation.getCode(), representation.getIndex());
            }
            representationIndex.put(dimension.getDimensionId(), representationIndexMap);
        }
    }

    public Double observationAtPermutation(Map<String, String> permutation) {
        int offset = 0;
        for (Map.Entry<String, String> permutationEntry : permutation.entrySet()) {
            String dimensionId = permutationEntry.getKey();
            String representationId = permutationEntry.getValue();

            long index = representationIndex.get(dimensionId).get(representationId);
            int multiplier = multipliers.get(dimensionId);
            offset += index * multiplier;
        }
        System.out.println(offset);
        String observation = observations.get(offset);
        if (!observation.trim().isEmpty()) {
            return Double.valueOf(observation);
        } else {
            return null;
        }
    }

}
