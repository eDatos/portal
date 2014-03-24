package org.siemac.metamac.portal.dto;

import java.util.ArrayList;
import java.util.List;

public class CollectionNodes {

    protected List<CollectionNode> nodes;

    /**
     * Gets the value of the nodes property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the nodes property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getNodes().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link CollectionNode }
     * 
     * 
     */
    public List<CollectionNode> getNodes() {
        if (nodes == null) {
            nodes = new ArrayList<CollectionNode>();
        }
        return this.nodes;
    }

}
