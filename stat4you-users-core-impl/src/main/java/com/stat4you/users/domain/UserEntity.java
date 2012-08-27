package com.stat4you.users.domain;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

/**
 * Registered User
 */
@Entity
@Table(name = "TBL_USERS",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"USERNAME"})})
public class UserEntity extends UserEntityBase {
    private static final long serialVersionUID = 1L;

    public UserEntity() {
    }
}
