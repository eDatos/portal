package com.stat4you.common.dto;

/**
 * Dto for InternationalString
 */
public class InternationalStringDto extends InternationalStringDtoBase {

    private static final long serialVersionUID = 1L;

    public InternationalStringDto() {
    }

    public String getLocalisedLabel(String locale) {
        LocalisedStringDto localisedString = getLocalisedString(locale);
        if (localisedString != null) {
            return localisedString.getLabel();
        } else {
            return null;
        }
    }

    public LocalisedStringDto getLocalisedString(String locale) {
        if (locale == null) {
            return null;
        }
        for (LocalisedStringDto localstr : getTexts()) {
            if (locale.equalsIgnoreCase(localstr.getLocale())) {
                return localstr;
            }
        }
        return null;
    }
}
