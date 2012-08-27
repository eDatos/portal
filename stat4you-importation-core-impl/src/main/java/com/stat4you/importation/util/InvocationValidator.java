package com.stat4you.importation.util;

import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;

import com.stat4you.common.utils.ValidationUtils;
import com.stat4you.transformation.dto.PxImportDto;

public class InvocationValidator {
        
    public static void validateImportPx(PxImportDto pxImportDto) throws ApplicationException {
        ValidationUtils.validateParameterRequired(pxImportDto, "pxImportDto");
        ValidationUtils.validateParameterRequired(pxImportDto.getProviderUri(), "pxImportDto.providerUri");
        ValidationUtils.validateParameterRequired(pxImportDto.getContent(), "pxImportDto.content");
        ValidationUtils.validateParameterRequired(pxImportDto.getCategory(), "pxImportDto.category");
        ValidationUtils.validateParameterRequired(pxImportDto.getPxUrl(), "pxImportDto.pxUrl");
    }
}
