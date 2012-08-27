package com.stat4you.common.dto;

/**
 * Dto for LocalisedString
 */
public class LocalisedStringDto extends LocalisedStringDtoBase {

    private static final long serialVersionUID = 1L;

    public LocalisedStringDto() {
    }

    public LocalisedStringDto(String locale, String label) {
        setLabel(label);
        setLocale(locale);
    }
}
