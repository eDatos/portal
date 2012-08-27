package com.stat4you.web.converter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.AbstractMessageSource;
import org.springframework.core.convert.converter.Converter;

import com.stat4you.statistics.dsd.domain.DimensionTypeEnum;

// TODO locale
final class DimensionTypeToStringConverter implements Converter<DimensionTypeEnum, java.lang.String> {

    @Autowired
    private AbstractMessageSource messages;
    
    @Override
    public String convert(DimensionTypeEnum source) {
        return messages.getMessage("entity.dimension.type." + source.getName(), null, null);
    }


}