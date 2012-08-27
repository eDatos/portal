package com.stat4you.rest.domain;

import java.util.List;
import java.util.Map;

import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;

import com.arte.statistic.dataset.repository.dto.AttributeDto;
import com.arte.statistic.dataset.repository.dto.ObservationExtendedDto;
import com.stat4you.normalizedvalues.dto.CategoryDto;
import com.stat4you.normalizedvalues.dto.LanguageDto;
import com.stat4you.statistics.dsd.dto.AttributeDefinitionDto;
import com.stat4you.statistics.dsd.dto.DatasetBasicDto;
import com.stat4you.statistics.dsd.dto.DimensionBasicDto;
import com.stat4you.statistics.dsd.dto.DimensionDto;
import com.stat4you.statistics.dsd.dto.ProviderDto;
import com.stat4you.statistics.dsd.service.DsdService;

public class DatasetDB {

    private ServiceContext                      ctx                  = null;
    private DsdService                          dsdService           = null;

    private String[]                            selectedLocales      = null;
    private List<LanguageDto>                   languages            = null;
    private ProviderDto                         providerDto          = null;
    private DatasetBasicDto                     dataset              = null;
    private List<DimensionDto>                  dimensions           = null;
    private Map<String, List<String>>           selectedDimensions   = null;
    private List<AttributeDefinitionDto>        attributeDefinitions = null;

    private List<DimensionBasicDto>             dimensionsBasic      = null;
    private List<AttributeDto>                  attributeValues      = null;
    private Map<String, ObservationExtendedDto> observations         = null;
    private List<CategoryDto>                   categories           = null;

    public ServiceContext getServiceContext() {
        return ctx;
    }

    public void setServiceContext(ServiceContext ctx) {
        this.ctx = ctx;
    }

    public DsdService getDsdService() {
        return dsdService;
    }

    public void setDsdService(DsdService dsdService) {
        this.dsdService = dsdService;
    }

    public String[] getSelectedLocales() {
        return selectedLocales;
    }

    public void setSelectedLocales(String[] selectedLocales) {
        this.selectedLocales = selectedLocales;
    }

    public ProviderDto getProviderDto() {
        return providerDto;
    }

    public void setProviderDto(ProviderDto providerDto) {
        this.providerDto = providerDto;
    }

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

    public List<AttributeDefinitionDto> getAttributeDefinitions() {
        return attributeDefinitions;
    }

    public void setAttributeDefinitions(List<AttributeDefinitionDto> attributeDefinitions) {
        this.attributeDefinitions = attributeDefinitions;
    }

    public List<AttributeDto> getAttributeValues() {
        return attributeValues;
    }

    public void setAttributeValues(List<AttributeDto> attributeValues) {
        this.attributeValues = attributeValues;
    }

    public Map<String, ObservationExtendedDto> getObservations() {
        return observations;
    }

    public void setObservations(Map<String, ObservationExtendedDto> observations) {
        this.observations = observations;
    }

    public Map<String, List<String>> getSelectedDimensions() {
        return selectedDimensions;
    }

    public void setSelectedDimensions(Map<String, List<String>> selectedDimensions) {
        this.selectedDimensions = selectedDimensions;
    }

    public List<DimensionBasicDto> getDimensionsBasic() {
        return dimensionsBasic;
    }

    public void setDimensionsBasic(List<DimensionBasicDto> dimensionsBasic) {
        this.dimensionsBasic = dimensionsBasic;
    }

    public List<CategoryDto> getCategories() {
        return categories;
    }

    public void setCategories(List<CategoryDto> categories) {
        this.categories = categories;
    }

    public List<LanguageDto> getLanguages() {
        return languages;
    }

    public void setLanguages(List<LanguageDto> languages) {
        this.languages = languages;
    }
}
