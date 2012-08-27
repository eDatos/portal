package com.stat4you.importation.processor;

import com.arte.statistic.dataset.repository.dto.AttributeDto;
import com.arte.statistic.dataset.repository.dto.ObservationExtendedDto;
import com.stat4you.statistics.dsd.dto.DatasetDto;

public interface StatisticProcessor {

    public String getUrl();
    public void processDataset(Callback<DatasetDto> callback);
    public void processObservations(Callback<ObservationExtendedDto> callback);
    public void processAttributes(Callback<AttributeDto> callback);

    public static interface Callback<T> {

        public void register(T item);
    }

}