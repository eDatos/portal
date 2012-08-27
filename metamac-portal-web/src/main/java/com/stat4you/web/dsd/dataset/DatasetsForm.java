package com.stat4you.web.dsd.dataset;

import java.util.List;

import com.stat4you.statistics.dsd.dto.DatasetBasicDto;


public class DatasetsForm {

    private List<DatasetBasicDto>              datasets;

    public void setDatasets(List<DatasetBasicDto> datasets) {
        this.datasets = datasets;
    }

    public List<DatasetBasicDto> getDatasets() {
        return datasets;
    }    
}