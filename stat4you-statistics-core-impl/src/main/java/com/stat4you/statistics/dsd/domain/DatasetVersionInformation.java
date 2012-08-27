package com.stat4you.statistics.dsd.domain;

import javax.persistence.Embeddable;

/**
 * BasicType representing DatasetVersionInformation.
 * <p>
 * This class is responsible for the domain object related
 * business logic for DatasetVersionInformation. Properties and associations are
 * implemented in the generated base class {@link com.stat4you.statistics.dsd.domain.DatasetVersionInformationBase}.
 */
@Embeddable
public class DatasetVersionInformation extends DatasetVersionInformationBase {
    private static final long serialVersionUID = 1L;

    public DatasetVersionInformation() {
    }

    public DatasetVersionInformation(Long idDatasetVersion, Integer versionNumber) {
        super(idDatasetVersion, versionNumber);
    	if (idDatasetVersion == null) {
    		throw new IllegalArgumentException("'idDatasetVersion' can not be null");
    	} else if (versionNumber == null) {
    		throw new IllegalArgumentException("'versionNumber' can not be null");
    	}
    }
}
