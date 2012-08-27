package com.stat4you.normalizedvalues.domain;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

/**
 * Categories
 */
@Entity
@Table(name = "TBL_CATEGORIES",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"CODE"})})
public class CategoryEntity extends CategoryEntityBase {
    private static final long serialVersionUID = 1L;

    public CategoryEntity() {
    }
}
