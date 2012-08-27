package com.stat4you.importation.service.processor;

import com.stat4you.importation.processor.StatisticProcessor;
import com.stat4you.statistics.dsd.dto.DatasetDto;

public class DatasetCallback implements StatisticProcessor.Callback<DatasetDto> {

    private DatasetDto dataset = null;

    @Override
    public void register(DatasetDto item) {
        this.dataset = item;
    }

    public DatasetDto getDataset() {
        return dataset;
    }
}
