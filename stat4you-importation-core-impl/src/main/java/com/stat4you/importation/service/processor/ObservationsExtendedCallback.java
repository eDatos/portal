package com.stat4you.importation.service.processor;

import java.util.ArrayList;
import java.util.List;

import com.arte.statistic.dataset.repository.dto.ObservationExtendedDto;
import com.stat4you.importation.processor.StatisticProcessor;

public class ObservationsExtendedCallback implements StatisticProcessor.Callback<ObservationExtendedDto> {

    private List<ObservationExtendedDto> observations = new ArrayList<ObservationExtendedDto>();

    @Override
    public void register(ObservationExtendedDto item) {
        this.observations.add(item);
    }

    public List<ObservationExtendedDto> getObservations() {
        return observations;
    }

}
