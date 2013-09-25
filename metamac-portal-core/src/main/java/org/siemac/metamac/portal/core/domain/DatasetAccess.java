package org.siemac.metamac.portal.core.domain;

import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.siemac.metamac.portal.core.utils.PortalUtils;
import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.CodeRepresentation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dimension;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionRepresentation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionValues;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.EnumeratedDimensionValue;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.EnumeratedDimensionValues;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.NonEnumeratedDimensionValue;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.NonEnumeratedDimensionValues;
import org.siemac.metamac.statistical_resources.rest.common.StatisticalResourcesRestConstants;

public class DatasetAccess {

    private final Dataset                          dataset;
    private final Map<String, Integer>             multipliers          = new HashMap<String, Integer>();
    private final Map<String, Map<String, Long>>   representationIndex  = new HashMap<String, Map<String, Long>>();
    private final String[]                         observations;
    private final Map<String, Map<String, String>> representationLabels = new HashMap<String, Map<String, String>>();

    public DatasetAccess(Dataset dataset, String lang) {
        this.dataset = dataset;
        initializeMultipliers();
        initializerIndex();
        initializeRepresentationLabels(lang);

        observations = StringUtils.splitByWholeSeparatorPreserveAllTokens(dataset.getData().getObservations(), StatisticalResourcesRestConstants.DATA_SEPARATOR);
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

    private void initializerIndex() {
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

    private void initializeRepresentationLabels(String lang) {
        List<Dimension> dimensions = dataset.getMetadata().getDimensions().getDimensions();
        for (Dimension dimension : dimensions) {
            Map<String, String> labels = new HashMap<String, String>();

            DimensionValues dimensionValues = dimension.getDimensionValues();
            if (dimensionValues instanceof NonEnumeratedDimensionValues) {
                NonEnumeratedDimensionValues nonEnumeratedDimensionValues = (NonEnumeratedDimensionValues) dimensionValues;
                for (NonEnumeratedDimensionValue dimensionValue : nonEnumeratedDimensionValues.getValues()) {
                    String representationId = dimensionValue.getId();
                    String representationLabel = getLabel(dimensionValue.getName(), lang);
                    labels.put(representationId, representationLabel);
                }
            } else if (dimensionValues instanceof EnumeratedDimensionValues) {
                EnumeratedDimensionValues enumeratedDimensionValues = (EnumeratedDimensionValues) dimensionValues;
                for (EnumeratedDimensionValue dimensionValue : enumeratedDimensionValues.getValues()) {
                    String representationId = dimensionValue.getId();
                    String representationLabel = getLabel(dimensionValue.getName(), lang);
                    labels.put(representationId, representationLabel);
                }
            }

            representationLabels.put(dimension.getId(), labels);
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

        String observation = observations[offset];
        if (!observation.trim().isEmpty()) {
            return Double.valueOf(observation);
        } else {
            return null;
        }
    }

    public String representationLabel(String dimensionId, String representationId) {
        if (representationLabels.get(dimensionId) != null) {
            return representationLabels.get(dimensionId).get(representationId);
        }
        return null;
    }

    private String getLabel(InternationalString internationalString, String lang) {
        return PortalUtils.getLabel(internationalString, lang, null); // TODO langAlternative, pasar el default
    }
}
