package com.stat4you.normalizedvalues.service.util;

import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;

import com.stat4you.common.utils.ValidationUtils;

public class InvocationValidator {

    public static void validateRetrieveLanguage(String code) throws ApplicationException {
        ValidationUtils.validateParameterRequired(code, "code");
    }

    public static void validateRetrieveCategory(String code) throws ApplicationException {
        ValidationUtils.validateParameterRequired(code, "code");
    }
}
