package com.stat4you.web.converter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.support.AbstractMessageSource;
import org.springframework.core.convert.converter.Converter;

import com.stat4you.statistics.dsd.domain.DatasetSourceEnum;

// TODO locale
final class DatasetSourceToStringConverter implements Converter<DatasetSourceEnum, java.lang.String> {

    @Autowired
    @Qualifier("messageSource")
    private AbstractMessageSource messages;
    
    @Override
    public String convert(DatasetSourceEnum source) {
        return messages.getMessage("entity.dataset.source." + source.getName(), null, null);
    }


}