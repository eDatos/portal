package com.stat4you.statistics.analytics.service.util;

import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;

import com.stat4you.common.utils.ValidationUtils;
import com.stat4you.statistics.analytics.dto.DatasetVisitedDto;

public class InvocationValidator {

    public static void validateAddDatasetVisited(DatasetVisitedDto datasetVisitedDto) throws ApplicationException {
        validateDatasetVisited(datasetVisitedDto);
    }

    public static void validateRetrieveDatasetsMostVisited() throws ApplicationException {
        // nothing
    }

    private static void validateDatasetVisited(DatasetVisitedDto datasetVisitedDto) throws ApplicationException {
        ValidationUtils.validateParameterRequired(datasetVisitedDto, "datasetVisitedDto");
        ValidationUtils.validateParameterRequired(datasetVisitedDto.getProviderAcronym(), "datasetVisitedDto.providerAcronym");
        ValidationUtils.validateParameterRequired(datasetVisitedDto.getDatasetIdentifier(), "datasetVisitedDto.datasetIdentifier");
        ValidationUtils.validateParameterRequired(datasetVisitedDto.getUser(), "datasetVisitedDto.user");
        ValidationUtils.validateParameterRequired(datasetVisitedDto.getIp(), "datasetVisitedDto.ip");
    }
}
