package org.siemac.metamac.portal.dto;

public class Permalink {

    protected String           id;
    protected PermalinkContent content;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public PermalinkContent getContent() {
        return content;
    }

    public void setContent(PermalinkContent content) {
        this.content = content;
    }

}
