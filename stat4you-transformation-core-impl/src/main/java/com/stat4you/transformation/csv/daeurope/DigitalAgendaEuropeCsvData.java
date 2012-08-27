package com.stat4you.transformation.csv.daeurope;

import java.util.ArrayList;
import java.util.List;

import com.arte.statistic.dataset.repository.dto.ObservationExtendedDto;
import com.stat4you.statistics.dsd.dto.AttributeDefinitionDto;
import com.stat4you.statistics.dsd.dto.DimensionDto;

public class DigitalAgendaEuropeCsvData {

    private List<DimensionDto>           dimensions   = new ArrayList<DimensionDto>();
    private List<ObservationExtendedDto> observations = new ArrayList<ObservationExtendedDto>();
    private List<AttributeDefinitionDto> attributesObservations = new ArrayList<AttributeDefinitionDto>();

    public List<DimensionDto> getDimensions() {
        return dimensions;
    }

    public List<ObservationExtendedDto> getObservations() {
        return observations;
    }
    
    public List<AttributeDefinitionDto> getAttributesObservations() {
        return attributesObservations;
    }
}
