package com.stat4you.crawler.exceptions;

import java.io.Serializable;

/**
 * Enum for ImportationExceptionCodeEnum
 */
public enum CrawlerExceptionCodeEnum implements Serializable {
    LUCENE;

    /**
     */
    private CrawlerExceptionCodeEnum() {
    }

    public String getName() {
        return name();
    }
}
