package com.stat4you.statistics.dsd.domain;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

/**
 * Data sypplied by a provided
 */
@Entity
@Table(name = "TBL_DATASETS",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"IDENTIFIER", "PROVIDER_FK"})})
public class DatasetEntity extends DatasetEntityBase {
    private static final long serialVersionUID = 1L;

    public DatasetEntity() {
    }
}
