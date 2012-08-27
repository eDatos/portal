package com.stat4you.web.search;

import java.util.Date;

import com.stat4you.idxmanager.domain.ResourceTypeEnum;

public class SearchDatasetResult extends SearchEntryResult {
    private String name;
    private Date providerPublishingDate;
    private String acronym;
    private String identifier;

    public SearchDatasetResult() {
        super();
        this.type = ResourceTypeEnum.DSET.getType();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getProviderPublishingDate() {
        return providerPublishingDate;
    }

    public void setProviderPublishingDate(Date providerPublishingDate) {
        this.providerPublishingDate = providerPublishingDate;
    }

    public String getAcronym() {
        return acronym;
    }

    public void setAcronym(String acronym) {
        this.acronym = acronym;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }
}
