package com.stat4you.common.utils;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;

import com.stat4you.common.dto.InternationalStringDto;
import com.stat4you.common.dto.LocalisedStringDto;
import com.stat4you.common.exception.CommonExceptionCodeEnum;

public class ValidationUtils {
        
    /**
     * Checks parameter is not empty
     * @throws ApplicationException if parameter is empty
     */
	public static void validateParameterRequired(Object parameter, String parameterName) throws ApplicationException {
        if (isEmpty(parameter)) {
            throw new ApplicationException(CommonExceptionCodeEnum.REQUIRED_ATTRIBUTE.getName(), "Attribute \"" + parameterName + "\" required");            
        }
    }
    
    /**
     * Checks parameter is empty
     * @throws ApplicationException if parameter is not empty
     */
    public static void validateParameterEmpty(Object parameter, String parameterName) throws ApplicationException {
        if (!isEmpty(parameter)) {
            throw new ApplicationException(CommonExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), "Attribute \"" + parameterName + "\" must be empty");            
        }
    }
    
    /**
     * Checks parameter has not been modified
     * @throws ApplicationException if parameter has been modified
     */
    public static void validateUnmodifiableAttribute(String original, String actual, String attributeName) throws ApplicationException {
        if ((original == null && actual != null) || 
            (original != null && actual == null) ||
            (original != null && !original.equals(actual))) {
            throw new ApplicationException(CommonExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), "Attribute \"" + attributeName + "\" can not be modified");
        }
    }
    
    /**
     * Checks InternationalString is not empty and it is correct
     * @throws ApplicationException if internationalString is empty or incorrect
     */
    public static void validateInternationalString(InternationalStringDto internationalStringDto, String attribute) throws ApplicationException {
         validateParameterRequired(internationalStringDto, attribute);
         validateParameterRequired(internationalStringDto.getTexts(), attribute + ".texts");
         Set<String> locales = new HashSet<String>();
         for (LocalisedStringDto localisedStringDto : internationalStringDto.getTexts()) {
             validateParameterRequired(localisedStringDto.getLabel(), attribute + ".texts.label");
             validateParameterRequired(localisedStringDto.getLocale(), attribute + ".texts.locale");
             
             // Check unique locale
             if (locales.contains(localisedStringDto.getLocale().toUpperCase())) {
                 throw new ApplicationException(CommonExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), "Locale \"" + localisedStringDto.getLocale() + "\" duplicated. Label: " + localisedStringDto.getLabel());
             }
             locales.add(localisedStringDto.getLocale().toUpperCase());
         }
     }
    
    /**
     * Check if an object is empty. The checked objects are: String, List, Set, InternationalStringDto
     */
    @SuppressWarnings("rawtypes")
    public static Boolean isEmpty(Object parameter) {
        if (parameter == null) {
            return Boolean.TRUE;
        } else if (String.class.isInstance(parameter)) {
            return isEmpty((String) parameter);
        } else if (Collection.class.isInstance(parameter)) {
            return isEmpty((Collection) parameter);
        } else if (InternationalStringDto.class.isInstance(parameter)) {
            return isEmpty((InternationalStringDto) parameter);
        }
        return Boolean.FALSE;
    }

    private static Boolean isEmpty(String parameter) {
        if (parameter == null) {
            return Boolean.TRUE;
        }
        return StringUtils.isBlank((String) parameter);
    }

    @SuppressWarnings("rawtypes")
    private static Boolean isEmpty(Collection parameter) {
        if (parameter == null) {
            return Boolean.TRUE;
        }
        return parameter.size() == 0;
    }

    /**
     * Check if an InternationalStringDto is empty
     */
    private static Boolean isEmpty(InternationalStringDto parameter) {
        if (parameter == null) {
            return Boolean.TRUE;
        }
        if (parameter.getTexts().size() == 0) {
            return Boolean.TRUE;
        }
        for (LocalisedStringDto localisedStringDto : parameter.getTexts()) {
            if (isEmpty(localisedStringDto.getLabel()) || isEmpty(localisedStringDto.getLocale())) {
                return Boolean.TRUE;
            }
        }
        return Boolean.FALSE;
    }
}
