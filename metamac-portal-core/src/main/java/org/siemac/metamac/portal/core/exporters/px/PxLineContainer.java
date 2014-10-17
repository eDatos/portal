package org.siemac.metamac.portal.core.exporters.px;

import java.util.List;

public class PxLineContainer {

    private PxKeysEnum   pxKey;
    private List<String> indexedValue;
    private String       lang;
    private Object       value;

    public PxKeysEnum getPxKey() {
        return pxKey;
    }

    public void setPxKey(PxKeysEnum pxKey) {
        this.pxKey = pxKey;
    }

    public List<String> getIndexedValue() {
        return indexedValue;
    }

    public void setIndexedValue(List<String> indexedValue) {
        this.indexedValue = indexedValue;
    }

    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

}
