package com.stat4you.statistics.dsd.domain;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

/**
 * Attribute definition of dataset
 */
@Entity
@Table(name = "TBL_ATTRIBUTES_DEFINITIONS", uniqueConstraints = {@UniqueConstraint(columnNames = {"IDENTIFIER", "DATASET_VERSION_FK"})})
public class AttributeDefinitionEntity extends AttributeDefinitionEntityBase {
    private static final long serialVersionUID = 1L;

    public AttributeDefinitionEntity() {
    }
}
