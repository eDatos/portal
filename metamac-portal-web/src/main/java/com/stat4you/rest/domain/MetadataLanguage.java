package com.stat4you.rest.domain;

import org.codehaus.jackson.annotate.JsonPropertyOrder;

import java.util.List;
import java.util.Map;

@JsonPropertyOrder({
        "id",
        "label"
})
public class MetadataLanguage {
    private List<String> id = null;
    private Map<String, List<String>> label = null;

    public List<String> getId() {
        return id;
    }

    public void setId(List<String> id) {
        this.id = id;
    }

    public Map<String, List<String>> getLabel() {
        return label;
    }

    public void setLabel(Map<String, List<String>> label) {
        this.label = label;
    }

}
