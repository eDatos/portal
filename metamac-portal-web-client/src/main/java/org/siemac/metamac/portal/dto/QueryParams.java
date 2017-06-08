package org.siemac.metamac.portal.dto;

public class QueryParams {

    protected String type;
    protected String agency;
    protected String identifier;
    protected String version;

    protected String indicatorSystem;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getAgency() {
        return agency;
    }

    public void setAgency(String agency) {
        this.agency = agency;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getIndicatorSystem() {
        return indicatorSystem;
    }

    public void setIndicatorSystem(String indicatorSystem) {
        this.indicatorSystem = indicatorSystem;
    }


}
