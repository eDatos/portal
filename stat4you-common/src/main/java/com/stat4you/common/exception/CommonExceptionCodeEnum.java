package com.stat4you.common.exception;

import java.io.Serializable;

public enum CommonExceptionCodeEnum implements Serializable {
    PARAMETER_INCORRECT,
    REQUIRED_ATTRIBUTE,
    ILLEGAL_ARGUMENT,
    UNKNOWN;

    /**
     */
    private CommonExceptionCodeEnum() {
    }

    public String getName() {
        return name();
    }
}
