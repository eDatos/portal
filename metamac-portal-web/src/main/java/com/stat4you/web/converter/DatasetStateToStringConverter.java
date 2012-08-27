package com.stat4you.web.converter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.support.AbstractMessageSource;
import org.springframework.core.convert.converter.Converter;

import com.stat4you.statistics.dsd.domain.DatasetStateEnum;

// TODO locale
final class DatasetStateToStringConverter implements Converter<DatasetStateEnum, java.lang.String> {

    @Autowired
    @Qualifier("messageSource")
    private AbstractMessageSource messages;
    
    @Override
    public String convert(DatasetStateEnum source) {
        return messages.getMessage("entity.dataset.state." + source.getName(), null, null);
    }


}