package com.stat4you.web.dsd.provider;

import java.util.List;

import com.stat4you.statistics.dsd.dto.DatasetBasicDto;
import com.stat4you.statistics.dsd.dto.ProviderDto;

public class ProviderForm {

    private ProviderDto           provider;
    private List<DatasetBasicDto> datasets;

    public void setDatasets(List<DatasetBasicDto> datasets) {
        this.datasets = datasets;
    }

    public List<DatasetBasicDto> getDatasets() {
        return datasets;
    }

    public void setProvider(ProviderDto provider) {
        this.provider = provider;
    }

    public ProviderDto getProvider() {
        return provider;
    }
}