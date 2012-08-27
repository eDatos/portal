package com.stat4you.web.converter;

import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.AbstractMessageSource;
import org.springframework.core.convert.converter.Converter;

// TODO fecha en diferentes locale. Por ahora sólo devuelve en UK
final class DateTimeConverter implements Converter<org.joda.time.DateTime, java.lang.String> {

    @Autowired
    private AbstractMessageSource messages;
    
    public String convert(org.joda.time.DateTime dateTime) {
        
        return dateTime.toString(messages.getMessage("date.short", null, null/*getLocale()*/), Locale.UK);                
    }
}