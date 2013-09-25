package org.siemac.metamac.portal.core.enume;

public enum LabelVisualisationModeEnum {

    CODE, LABEL, CODE_AND_LABEL;

    public String value() {
        return name();
    }

    public static LabelVisualisationModeEnum fromValue(String v) {
        return valueOf(v);
    }

}
