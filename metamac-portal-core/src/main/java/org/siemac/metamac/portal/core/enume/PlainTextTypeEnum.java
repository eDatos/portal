package org.siemac.metamac.portal.core.enume;

import java.io.Serializable;

public enum PlainTextTypeEnum implements Serializable {
    //@formatter:off
    TSV("tsv", "\t"), 
    CSV_COMMA("csv", ","), 
    CSV_SEMICOLON("csv", ";");
    //@formatter:on

    private String extension;
    private String separator;

    /**
     */
    private PlainTextTypeEnum(String value, String separator) {
        this.extension = value;
        this.separator = separator;
    }

    public String getExtension() {
        return extension;
    }

    public String getSeparator() {
        return separator;
    }

    public String getName() {
        return name();
    }
}
