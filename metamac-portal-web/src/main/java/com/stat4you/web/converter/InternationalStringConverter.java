package com.stat4you.web.converter;

import org.springframework.core.convert.converter.Converter;

import com.stat4you.common.dto.InternationalStringDto;
import com.stat4you.common.dto.LocalisedStringDto;
import com.stat4you.web.WebConstants;

// TODO mensajes en diferentes idiomas. Por ahora sólo devuelve español
final class InternationalStringConverter implements Converter<com.stat4you.common.dto.InternationalStringDto, java.lang.String> {

    public String convert(InternationalStringDto source) {
        for (LocalisedStringDto localisedStringDto : source.getTexts()) {
            if (WebConstants.LOCALE_ES.equals(localisedStringDto.getLocale())) {
                return localisedStringDto.getLabel();
            }
        }
        // If the locale doesn't exist, then show it in english
        for (LocalisedStringDto localisedStringDto : source.getTexts()) {
            if (WebConstants.LOCALE_EN.equals(localisedStringDto.getLocale())) {
                return localisedStringDto.getLabel();
            }
        }
        return null;
    }
}