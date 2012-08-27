package com.stat4you.statistics.dsd.domain;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

/**
 * Dimension of dataset
 */
@Entity
@Table(name = "TBL_DIMENSIONS", uniqueConstraints = {@UniqueConstraint(columnNames = {"IDENTIFIER", "DATASET_VERSION_FK"})})
public class DimensionEntity extends DimensionEntityBase {
    private static final long serialVersionUID = 1L;

    public DimensionEntity() {
    }
}
