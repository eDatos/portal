package com.stat4you.crawler.droids.enums;


public enum CrawlerProvider {

    CRW_INE("INE"),
    CRW_ISTAC("ISTAC"),
    CRW_EUSTAT("EUSTAT"),
    CRW_IBESTAT("IBESTAT");
    
    private String name;
    
    private CrawlerProvider(String name) {
        this.name = name;
    }
    
    
    public String getName() {
        return name;
    }
}
