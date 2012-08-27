package com.stat4you.rest.domain;

import java.util.List;
import java.util.Map;

import org.codehaus.jackson.annotate.JsonPropertyOrder;
import org.joda.time.DateTime;

@JsonPropertyOrder({
    "identifier",
    "title",
    "description",
    "creator",
    "creatorAcronym",
    "modificationDate",
    "providerModificationDate",
    "publisher",
    "releaseDate",
    "providerReleaseDate",
    "frequency",    
    "geographicalCoverage",
    "temporalCoverage",
    "license",
    "licenseURL",
    "theme",
    "language",
    "category",
    "dimension",
    "attribute"
})
public class Metadata {

    private String                         identifier               = null;
    private List<String>                   title                    = null;
    private List<String>                   description              = null;
    private String                         creator                  = null;
    private String                         creatorAcronym           = null;    
    private DateTime                       modificationDate         = null;
    private DateTime                       providerModificationDate = null;
    private String                         publisher                = null;
    private DateTime                       releaseDate              = null;
    private DateTime                       providerReleaseDate      = null;
    private String                         frequency                = null;
    private List<String>                   geographicalCoverage     = null;
    private List<String>                   temporalCoverage         = null;
    private List<String>                   license                  = null;
    private String                         licenseURL               = null;
    private List<String>                   theme                    = null;
    private MetadataLanguage               language                 = null;
    private MetadataCategory               category                 = null;
    private String                         measureDimension         = null;
    private MetadataDimension              dimension                = null;
    private Map<String, MetadataAttribute> attribute                = null;


    public DateTime getModificationDate() {
        return modificationDate;
    }

    public void setModificationDate(DateTime modificationDate) {
        this.modificationDate = modificationDate;
    }

    public DateTime getProviderModificationDate() {
        return providerModificationDate;
    }

    public void setProviderModificationDate(DateTime providerModificationDate) {
        this.providerModificationDate = providerModificationDate;
    }

    public List<String> getTitle() {
        return title;
    }

    public void setTitle(List<String> title) {
        this.title = title;
    }

    public List<String> getDescription() {
        return description;
    }

    public void setDescription(List<String> description) {
        this.description = description;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public DateTime getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(DateTime releaseDate) {
        this.releaseDate = releaseDate;
    }

    public DateTime getProviderReleaseDate() {
        return providerReleaseDate;
    }

    public void setProviderReleaseDate(DateTime providerReleaseDate) {
        this.providerReleaseDate = providerReleaseDate;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public List<String> getGeographicalCoverage() {
        return geographicalCoverage;
    }

    public void setGeographicalCoverage(List<String> geographicalCoverage) {
        this.geographicalCoverage = geographicalCoverage;
    }

    public List<String> getTemporalCoverage() {
        return temporalCoverage;
    }

    public void setTemporalCoverage(List<String> temporalCoverage) {
        this.temporalCoverage = temporalCoverage;
    }

    public List<String> getLicense() {
        return license;
    }

    public void setLicense(List<String> license) {
        this.license = license;
    }

    public String getLicenseURL() {
        return licenseURL;
    }

    public void setLicenseURL(String licenseURL) {
        this.licenseURL = licenseURL;
    }

    public List<String> getTheme() {
        return theme;
    }

    public void setTheme(List<String> theme) {
        this.theme = theme;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getCreatorAcronym() {
        return creatorAcronym;
    }

    public void setCreatorAcronym(String creatorAcronym) {
        this.creatorAcronym = creatorAcronym;
    }

    public MetadataLanguage getLanguage() {
        return language;
    }

    public void setLanguage(MetadataLanguage language) {
        this.language = language;
    }

    public MetadataCategory getCategory() {
        return category;
    }

    public void setCategory(MetadataCategory category) {
        this.category = category;
    }

    public String getMeasureDimension() {
        return measureDimension;
    }

    public void setMeasureDimension(String measureDimension) {
        this.measureDimension = measureDimension;
    }

    public MetadataDimension getDimension() {
        return dimension;
    }

    public void setDimension(MetadataDimension dimension) {
        this.dimension = dimension;
    }

    public Map<String, MetadataAttribute> getAttribute() {
        return attribute;
    }

    public void setAttribute(Map<String, MetadataAttribute> attribute) {
        this.attribute = attribute;
    }


}
