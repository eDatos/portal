package com.stat4you.importation.service.processor;

import java.util.ArrayList;
import java.util.List;

import com.arte.statistic.dataset.repository.dto.AttributeDto;
import com.stat4you.importation.processor.StatisticProcessor;

public class AttributesCallback implements StatisticProcessor.Callback<AttributeDto> {

    private List<AttributeDto> attributes = new ArrayList<AttributeDto>();

    @Override
    public void register(AttributeDto item) {
        this.attributes.add(item);
    }

    public List<AttributeDto> getAttributes() {
        return attributes;
    }

}
