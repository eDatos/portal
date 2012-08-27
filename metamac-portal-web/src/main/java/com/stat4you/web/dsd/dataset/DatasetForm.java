package com.stat4you.web.dsd.dataset;

import java.util.List;

import com.arte.statistic.dataset.repository.dto.AttributeDto;
import com.arte.statistic.dataset.repository.dto.ObservationExtendedDto;
import com.stat4you.statistics.dsd.dto.DatasetBasicDto;
import com.stat4you.statistics.dsd.dto.DimensionDto;
import com.stat4you.statistics.dsd.dto.ProviderDto;
import com.stat4you.normalizedvalues.dto.CategoryDto;
import com.stat4you.normalizedvalues.dto.LanguageDto;

public class DatasetForm {

    private DatasetBasicDto              dataset                     = null;
    private List<DimensionDto>           dimensions                  = null;
    // private PrimaryMeasureDto primaryMeasure = null;
    private DimensionDto                 measureDimension            = null;
    private ProviderDto                  provider                    = null;
    private List<CategoryDto>            categories                  = null;
    private List<LanguageDto>            languages                   = null;
    private List<AttributeDto>           attributeDtosDatasets       = null;
    private List<AttributeDto>           attributeDtosCodesDimension = null;
    private List<ObservationExtendedDto> observations                = null;

    public DatasetBasicDto getDataset() {
        return dataset;
    }

    public void setDataset(DatasetBasicDto dataset) {
        this.dataset = dataset;
    }

    public List<DimensionDto> getDimensions() {
        return dimensions;
    }

    public void setDimensions(List<DimensionDto> dimensions) {
        this.dimensions = dimensions;
    }

    // New: MeasureDimension
    public DimensionDto getMeasureDimension() {
        return measureDimension;
    }

    public void setMeasureDimension(DimensionDto measureDimension) {
        this.measureDimension = measureDimension;
    }

    // public PrimaryMeasureDto getPrimaryMeasure() {
    // return primaryMeasure;
    // }
    //
    // public void setPrimaryMeasure(PrimaryMeasureDto primaryMeasure) {
    // this.primaryMeasure = primaryMeasure;
    // }

    public void setProvider(ProviderDto provider) {
        this.provider = provider;
    }

    public ProviderDto getProvider() {
        return provider;
    }

    public void setCategories(List<CategoryDto> categories) {
        this.categories = categories;
    }

    public List<CategoryDto> getCategories() {
        return categories;
    }

    public void setLanguages(List<LanguageDto> languages) {
        this.languages = languages;
    }

    public List<LanguageDto> getLanguages() {
        return languages;
    }

    public List<ObservationExtendedDto> getObservations() {
        return observations;
    }

    public void setObservations(List<ObservationExtendedDto> observations) {
        this.observations = observations;
    }

    
    public List<AttributeDto> getAttributeDtosDatasets() {
        return attributeDtosDatasets;
    }

    
    public void setAttributeDtosDatasets(List<AttributeDto> attributeDtosDatasets) {
        this.attributeDtosDatasets = attributeDtosDatasets;
    }

    
    public List<AttributeDto> getAttributeDtosCodesDimension() {
        return attributeDtosCodesDimension;
    }

    
    public void setAttributeDtosCodesDimension(List<AttributeDto> attributeDtosCodesDimension) {
        this.attributeDtosCodesDimension = attributeDtosCodesDimension;
    }


}
