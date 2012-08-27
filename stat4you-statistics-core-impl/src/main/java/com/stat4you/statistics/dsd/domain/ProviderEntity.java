package com.stat4you.statistics.dsd.domain;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

/**
 * Data productor. Examples: ISTAC, IBESTAT, INE...
 */
@Entity
@Table(name = "TBL_PROVIDERS",
		uniqueConstraints = {@UniqueConstraint(columnNames = {"ACRONYM"})})
public class ProviderEntity extends ProviderEntityBase {
    private static final long serialVersionUID = 1L;

    public ProviderEntity() {
    }
}
