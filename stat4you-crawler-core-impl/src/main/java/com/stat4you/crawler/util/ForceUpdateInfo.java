package com.stat4you.crawler.util;

import java.io.File;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;


public class ForceUpdateInfo {

    private Set<File> downloadedPxs = new HashSet<File>();
    private String category = null;
    private String startUrl = null;
    
    private String period = null;
    private String region = null;
    
    
    public Set<File> getDownloadedPxs() {
        return downloadedPxs;
    }

    public void addDownloadedPxs(Collection<File> downloadedPxs) {
        this.downloadedPxs.addAll(downloadedPxs);
    }
    
    public void addDownloadedPx(File downloadedPx) {
        this.downloadedPxs.add(downloadedPx);
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getStartUrl() {
        return startUrl;
    }
    
    public void setStartUrl(String startUrl) {
        this.startUrl = startUrl;
    }
    
    public String getRegion() {
        return region;
    }
    
    public void setRegion(String region) {
        this.region = region;
    }
    
    public String getPeriod() {
        return period;
    }
    
    public void setPeriod(String period) {
        this.period = period;
    }
    
    /**
     * Constructor
     */
    public ForceUpdateInfo() {
    }
    
    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }
    
    
}
