package com.stat4you.statistics.dsd.criteria;

public enum DatasetCriteriaPropertyEnum {

    PROVIDER_URI,
    URL;

    public String value() {
        return name();
    }

    public static DatasetCriteriaPropertyEnum fromValue(String v) {
        return valueOf(v);
    }
}