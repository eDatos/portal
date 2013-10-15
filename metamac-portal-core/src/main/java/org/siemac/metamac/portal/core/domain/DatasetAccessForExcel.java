package org.siemac.metamac.portal.core.domain;

import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;

import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.CodeRepresentation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionRepresentation;

public class DatasetAccessForExcel extends DatasetAccess {

    private final Map<String, Integer>           multipliers         = new HashMap<String, Integer>();
    private final Map<String, Map<String, Long>> representationIndex = new HashMap<String, Map<String, Long>>();

    public DatasetAccessForExcel(Dataset dataset, DatasetSelectionForExcel datasetSelection, String lang, String langAlternative) throws MetamacException {
        super(dataset, datasetSelection, lang, langAlternative);
        initializeMultipliers();
        initializeIndex();
    }

    public String observationAtPermutation(Map<String, String> permutation) {
        int offset = 0;
        for (Map.Entry<String, String> permutationEntry : permutation.entrySet()) {
            String dimensionId = permutationEntry.getKey();
            String representationId = permutationEntry.getValue();

            long index = representationIndex.get(dimensionId).get(representationId);
            int multiplier = multipliers.get(dimensionId);
            offset += index * multiplier;
        }

        String observation = getObservations()[offset];
        if (!observation.trim().isEmpty()) {
            // return Double.valueOf(observation); // TODO se deja como String, ¿si no hay decimales o es un "."?
            return observation;
        } else {
            return null;
        }
    }

    private void initializeMultipliers() {
        List<DimensionRepresentation> dimensions = getDataset().getData().getDimensions().getDimensions();
        ListIterator<DimensionRepresentation> li = dimensions.listIterator(dimensions.size());
        int ac = 1;
        while (li.hasPrevious()) {
            DimensionRepresentation dimension = li.previous();
            multipliers.put(dimension.getDimensionId(), ac);
            ac *= dimension.getRepresentations().getRepresentations().size();
        }
    }

    private void initializeIndex() {
        List<DimensionRepresentation> dimensions = getDataset().getData().getDimensions().getDimensions();
        for (DimensionRepresentation dimension : dimensions) {
            Map<String, Long> representationIndexMap = new HashMap<String, Long>();
            List<CodeRepresentation> representations = dimension.getRepresentations().getRepresentations();
            for (CodeRepresentation representation : representations) {
                representationIndexMap.put(representation.getCode(), representation.getIndex());
            }
            representationIndex.put(dimension.getDimensionId(), representationIndexMap);
        }
    }
}
