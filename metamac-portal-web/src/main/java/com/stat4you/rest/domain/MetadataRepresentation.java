package com.stat4you.rest.domain;

import java.util.List;
import java.util.Map;

import org.codehaus.jackson.annotate.JsonPropertyOrder;

@JsonPropertyOrder({
    "id",
    "label"
})
public class MetadataRepresentation {

    private Map<String, List<String>>              id    = null;
    private Map<String, Map<String, List<String>>> label = null;

    public Map<String, List<String>> getId() {
        return id;
    }

    public void setId(Map<String, List<String>> id) {
        this.id = id;
    }

    public Map<String, Map<String, List<String>>> getLabel() {
        return label;
    }

    public void setLabel(Map<String, Map<String, List<String>>> label) {
        this.label = label;
    }

}
