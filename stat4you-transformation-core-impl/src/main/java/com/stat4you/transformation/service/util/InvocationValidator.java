package com.stat4you.transformation.service.util;

import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;

import com.stat4you.common.utils.ValidationUtils;
import com.stat4you.transformation.dto.DigitalAgendaEuropeCsvDto;
import com.stat4you.transformation.dto.PxImportDto;

public class InvocationValidator {

    public static void validateTransformPxToStatistic(PxImportDto pxImportDto) throws ApplicationException {
        validatePxImportDto(pxImportDto);
    }

    public static void validateTransformDigitalAgendaEurope(DigitalAgendaEuropeCsvDto digitalAgendaEuropeCsvDto) throws ApplicationException {
        validateDigitalAgendaEuropeCsvDto(digitalAgendaEuropeCsvDto);
    }

    public static void validateTransformPxToSdmxMl(PxImportDto pxImportDto) throws ApplicationException {
        validatePxImportDto(pxImportDto);
    }

    private static void validatePxImportDto(PxImportDto pxImportDto) throws ApplicationException {
        ValidationUtils.validateParameterRequired(pxImportDto, "pxImportDto");
        ValidationUtils.validateParameterRequired(pxImportDto.getProviderUri(), "pxImportDto.providerUri");
        ValidationUtils.validateParameterRequired(pxImportDto.getContent(), "pxImportDto.content");
        ValidationUtils.validateParameterRequired(pxImportDto.getCategory(), "pxImportDto.category");
        ValidationUtils.validateParameterRequired(pxImportDto.getPxUrl(), "pxImportDto.pxUrl");
    }
    
    private static void validateDigitalAgendaEuropeCsvDto(DigitalAgendaEuropeCsvDto digitalAgendaEuropeCsvDto) throws ApplicationException {
        ValidationUtils.validateParameterRequired(digitalAgendaEuropeCsvDto, "digitalAgendaEuropeCsvDto");
        ValidationUtils.validateParameterRequired(digitalAgendaEuropeCsvDto.getData(), "digitalAgendaEuropeCsvDto.data");
        ValidationUtils.validateParameterRequired(digitalAgendaEuropeCsvDto.getIndicators(), "digitalAgendaEuropeCsvDto.indicators");
        ValidationUtils.validateParameterRequired(digitalAgendaEuropeCsvDto.getSources(), "digitalAgendaEuropeCsvDto.sources");
        ValidationUtils.validateParameterRequired(digitalAgendaEuropeCsvDto.getIdentifier(), "digitalAgendaEuropeCsvDto.identifier");
        ValidationUtils.validateParameterRequired(digitalAgendaEuropeCsvDto.getTitle(), "digitalAgendaEuropeCsvDto.title");
        ValidationUtils.validateParameterRequired(digitalAgendaEuropeCsvDto.getUrl(), "digitalAgendaEuropeCsvDto.url");
        ValidationUtils.validateParameterRequired(digitalAgendaEuropeCsvDto.getProviderUri(), "digitalAgendaEuropeCsvDto.provider");
        ValidationUtils.validateParameterRequired(digitalAgendaEuropeCsvDto.getProviderReleaseDate(), "digitalAgendaEuropeCsvDto.providerReleaseDate");
        ValidationUtils.validateParameterRequired(digitalAgendaEuropeCsvDto.getProviderPublishingDate(), "digitalAgendaEuropeCsvDto.providerPublishingDate");
        ValidationUtils.validateParameterRequired(digitalAgendaEuropeCsvDto.getLanguage(), "digitalAgendaEuropeCsvDto.language");
        ValidationUtils.validateParameterRequired(digitalAgendaEuropeCsvDto.getCategory(), "digitalAgendaEuropeCsvDto.category");
    }
}
