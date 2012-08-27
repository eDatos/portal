package com.stat4you.transformation.mapper;

import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.MessageSource;

import com.stat4you.transformation.conf.TransformationConstants;

public abstract class BaseMapper {

    @Autowired
    @Qualifier("messageSourceTransformation")
    private MessageSource messageSource;

    protected String getLabel(String code, String locale, String defaultLabel) {
        return messageSource.getMessage(code, null, defaultLabel, new Locale(locale));
    }

    protected String getUnitsLabel(String locale) {
        return getLabel(TransformationConstants.MESSAGE_PX_UNITS, locale) + ": ";
    }

    protected String getPrimaryMeasureLabel(String locale) {
        return getLabel(TransformationConstants.MESSAGE_PRIMARY_MEASURE, locale);
    }

    private String getLabel(String code, String locale) {
        String label = messageSource.getMessage(code, null, null, new Locale(locale));
        if (label == null) {
            label = messageSource.getMessage(code, null, new Locale(TransformationConstants.DEFAULT_LOCALE));
        }
        return label;
    }
}
