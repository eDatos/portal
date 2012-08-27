package com.stat4you.rest.domain;

import java.util.List;

import org.codehaus.jackson.annotate.JsonPropertyOrder;

@JsonPropertyOrder({
        "selectedLanguages",
        "metadata",
        "data"})
public class Dataset {

    private List<String> selectedLanguages = null;
    private Metadata     metadata          = null;
    private Data         data              = null;

    public List<String> getSelectedLanguages() {
        return selectedLanguages;
    }

    public void setSelectedLanguages(List<String> selectedLanguages) {
        this.selectedLanguages = selectedLanguages;
    }

    public Metadata getMetadata() {
        return metadata;
    }

    public void setMetadata(Metadata metadata) {
        this.metadata = metadata;
    }

    public Data getData() {
        return data;
    }

    public void setData(Data data) {
        this.data = data;
    }

}
