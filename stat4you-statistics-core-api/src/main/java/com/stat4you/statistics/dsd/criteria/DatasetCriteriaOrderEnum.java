package com.stat4you.statistics.dsd.criteria;

public enum DatasetCriteriaOrderEnum {

    CREATION_DATE;

    public String value() {
        return name();
    }

    public static DatasetCriteriaOrderEnum fromValue(String v) {
        return valueOf(v);
    }
}