package com.stat4you.normalizedvalues.domain;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

/**
 * Languages
 */
@Entity
@Table(name = "TBL_LANGUAGES",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"CODE"})})
public class LanguageEntity extends LanguageEntityBase {
    private static final long serialVersionUID = 1L;

    public LanguageEntity() {
    }
}
