package org.siemac.metamac.portal.dto;

import org.siemac.metamac.rest.common.v1_0.domain.Resource;
import org.siemac.metamac.rest.statistical_resources_internal.v1_0.domain.ResourceInternal;

public class Table extends CollectionNode {

    // Antes, resourceInternal (org.siemac.metamac.rest.statistical_resources_internal.v1_0.domain.ResourceInternal)
    protected Resource dataset;
    protected Resource query;
    protected Resource multidataset;

    /**
     * Gets the value of the dataset property.
     * 
     * @return
     *         possible object is
     *         {@link ResourceInternal }
     */
    public Resource getDataset() {
        return dataset;
    }

    /**
     * Sets the value of the dataset property.
     * 
     * @param value
     *            allowed object is
     *            {@link ResourceInternal }
     */
    public void setDataset(Resource value) {
        this.dataset = value;
    }

    /**
     * Gets the value of the query property.
     * 
     * @return
     *         possible object is
     *         {@link ResourceInternal }
     */
    public Resource getQuery() {
        return query;
    }

    /**
     * Sets the value of the query property.
     * 
     * @param value
     *            allowed object is
     *            {@link ResourceInternal }
     */
    public void setQuery(Resource value) {
        this.query = value;
    }

    public Resource getMultidataset() {
        return multidataset;
    }

    public void setMultidataset(Resource multidataset) {
        this.multidataset = multidataset;
    }

}
