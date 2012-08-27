package com.stat4you.importation.exceptions;

import java.io.Serializable;

/**
 * Enum for ImportationExceptionCodeEnum
 */
public enum ImportationExceptionCodeEnum implements Serializable {
    REQUIRED_ATTRIBUTE,
    ILLEGAL_ARGUMENT,
    UNKNOWN;

    /**
     */
    private ImportationExceptionCodeEnum() {
    }

    public String getName() {
        return name();
    }
}
