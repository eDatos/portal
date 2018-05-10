package org.siemac.metamac.portal.dto;

import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;

public abstract class MultidatasetNode {

    protected InternationalString name;
    protected InternationalString description;

    public InternationalString getName() {
        return name;
    }

    public void setName(InternationalString value) {
        name = value;
    }

    public InternationalString getDescription() {
        return description;
    }

    public void setDescription(InternationalString value) {
        description = value;
    }

}
