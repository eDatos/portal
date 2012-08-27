package com.stat4you.idxmanager.domain;

import org.joda.time.DateTime;

import com.stat4you.common.dto.InternationalStringDto;



public class DatasetBasicIdx {
    private static final long serialVersionUID = 1L;
    
    private String uri;
    private String identifier;
    private InternationalStringDto title;
    private DateTime publishingDate;
    private DateTime providerPublishingDate;
    private String providerAcronym;

    public DatasetBasicIdx() {
    }
    
    public String getUri() {
        return uri;
    }
    
    public void setUri(String uri) {
        this.uri = uri;
    }
    
    public String getIdentifier() {
        return identifier;
    }
    
    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }
    
    public InternationalStringDto getTitle() {
        return title;
    }

    public void setTitle(InternationalStringDto title) {
        this.title = title;
    }

    public DateTime getPublishingDate() {
        return publishingDate;
    }

    public void setPublishingDate(DateTime publishingDate) {
        this.publishingDate = publishingDate;
    }
    
    public DateTime getProviderPublishingDate() {
        return providerPublishingDate;
    }
    
    public void setProviderPublishingDate(DateTime providerPublishingDate) {
        this.providerPublishingDate = providerPublishingDate;
    }

    public String getProviderAcronym() {
        return providerAcronym;
    }

    public void setProviderAcronym(String providerAcronym) {
        this.providerAcronym = providerAcronym;
    }
}
