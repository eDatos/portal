package com.stat4you.importation.service.processor;

import com.arte.statistic.dataset.repository.dto.AttributeDto;
import com.arte.statistic.dataset.repository.dto.ObservationExtendedDto;
import com.stat4you.importation.processor.StatisticProcessor;
import com.stat4you.statistics.dsd.dto.DatasetDto;
import com.stat4you.transformation.dto.StatisticDto;

public class StatisticDtoProcessor implements StatisticProcessor {

    private String       url          = null;
    private StatisticDto statisticDto = null;

    public StatisticDtoProcessor(String url, StatisticDto statisticDto) {
        this.url = url;
        this.statisticDto = statisticDto;
    }
    @Override
    public String getUrl() {
        return this.url;
    }

    @Override
    public void processDataset(Callback<DatasetDto> callback) {
        callback.register(statisticDto.getDataset());
    }

    @Override
    public void processObservations(Callback<ObservationExtendedDto> callback) {
        for (ObservationExtendedDto observationExtendedDto : statisticDto.getObservationsExtended()) {
            callback.register(observationExtendedDto);
        }
    }

    @Override
    public void processAttributes(Callback<AttributeDto> callback) {
        for (AttributeDto attributeDto : statisticDto.getAttributes()) {
            callback.register(attributeDto);
        }
    }

}
