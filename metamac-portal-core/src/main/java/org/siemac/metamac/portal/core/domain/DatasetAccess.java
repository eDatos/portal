package org.siemac.metamac.portal.core.domain;

import static org.siemac.metamac.portal.core.utils.PortalUtils.buildMapDimensionsValuesLabels;
import static org.siemac.metamac.portal.core.utils.PortalUtils.dataToDataArray;

import java.util.List;
import java.util.Map;

import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dimension;

public abstract class DatasetAccess {

    private final Dataset                    dataset;
    private List<Dimension>                  dimensionsMetadata;
    private Map<String, Map<String, String>> dimensionValuesLabels; // indexed by dimensionId and dimensionValueId

    private final String                     lang;
    private final String                     langAlternative;

    private String[]                         observations;

    public DatasetAccess(Dataset dataset, String lang, String langAlternative) throws MetamacException {
        this.dataset = dataset;
        this.lang = lang;
        this.langAlternative = langAlternative;

        initializeDimensions(dataset);
        initializeObservations(dataset);
    }

    public Dataset getDataset() {
        return dataset;
    }

    public List<Dimension> getDimensionsMetadata() {
        return dimensionsMetadata;
    }

    public String[] getObservations() {
        return observations;
    }

    public String getDimensionValueLabel(String dimensionId, String dimensionValueId) {
        return dimensionValuesLabels.get(dimensionId).get(dimensionValueId);
    }

    /**
     * Inits dimensions and dimensions values. Builds a map with titles of dimensions values
     */
    private void initializeDimensions(Dataset dataset) throws MetamacException {
        this.dimensionsMetadata = dataset.getMetadata().getDimensions().getDimensions();
        this.dimensionValuesLabels = buildMapDimensionsValuesLabels(this.dimensionsMetadata, lang, langAlternative);
    }

    /**
     * Init observations values
     */
    private void initializeObservations(Dataset dataset) {
        this.observations = dataToDataArray(dataset.getData().getObservations());
    }
}
