package org.siemac.metamac.portal.dto;

import java.util.Map;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class IndicatorInstance {

    protected Map<String, String> title;
    protected Map<String, String> conceptDescription;

    public Map<String, String> getTitle() {
        return title;
    }

    public void setTitle(Map<String, String> title) {
        this.title = title;
    }

    public Map<String, String> getConceptDescription() {
        return conceptDescription;
    }

    public void setConceptDescription(Map<String, String> conceptDescription) {
        this.conceptDescription = conceptDescription;
    }

}
