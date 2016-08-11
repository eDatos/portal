package org.siemac.metamac.portal.dto;

import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;

public class Dataset {

    protected InternationalString name;
    protected InternationalString description;

    public InternationalString getName() {
        return name;
    }

    public void setName(InternationalString value) {
        this.name = value;
    }

    public InternationalString getDescription() {
        return description;
    }

    public void setDescription(InternationalString value) {
        this.description = value;
    }

}
