package com.stat4you.rest.domain;

import java.util.Map;

import org.codehaus.jackson.annotate.JsonPropertyOrder;

@JsonPropertyOrder({"representationIndex"})
public class DataDimension {

    private Map<String, Integer> representationIndex = null;

    public Map<String, Integer> getRepresentationIndex() {
        return representationIndex;
    }

    public void setRepresentationIndex(Map<String, Integer> representationIndex) {
        this.representationIndex = representationIndex;
    }

}
