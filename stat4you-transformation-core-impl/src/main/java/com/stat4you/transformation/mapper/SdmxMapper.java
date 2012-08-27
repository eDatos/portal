package com.stat4you.transformation.mapper;

import org.springframework.stereotype.Component;

@Component
public class SdmxMapper {

    // TODO pendiente px to sdmx
    
//    private final String VERSION_LOGIC                      = "1.0";
//    private final String STAT4YOU_AGENCY                    = "STAT4YOU";
//    private final String STAT4YOU_ORGANISATION_SCHEMA       = "STAT4YOU_STANDALONE_ORGANISATION_SCHEMA";
//    private final String STAT4YOU_CONCEPT_SCHEMA            = "STAT4YOU_STANDALONE_CONCEPT_SCHEMA";
//
//    private final String PRIMARY_MEASURE_CONCEPT_IDENTIFIER = "OBS_VALUE";
//    private final String CODELIST_PREFIX                    = "CL_";
//
//    private final String GENERATION_METHOD_IDENTIFIER       = "GENERATION_METHOD";
//    private final String GENERATION_METHOD_TITLE            = "Used method for file generation";
//    private final String GENERATION_METHOD_VALUE_ES         = "Fichero generado automáticamente a partir de un PX";
//    private final String GENERATION_METHOD_VALUE_EN         = "File automatically generated from PC-Axis file";
//
//    private final String LOCALE_ES                          = "es";
//    private final String LOCALE_EN                          = "en";
//
//    /**
//     * Transform to SDMX DSD
//     * 
//     * @throws ApplicationException
//     */
//
//    public DataStructureDefinitionExtendDto toDsd(DatasetDto dataset) throws ApplicationException {
//        DataStructureDefinitionExtendDto dsd = new DataStructureDefinitionExtendDto();
//
//        // PROVIDER
//        ExternalItemBtDto provider = toExternalItem(STAT4YOU_AGENCY, dataset.getIdentifier(), VERSION_LOGIC, STAT4YOU_ORGANISATION_SCHEMA, null, TypeExternalArtefactsEnum.AGENCY);
//
//        // --------------------------------
//        // MaintainableArtefactDto fields
//        // --------------------------------
//        dsd.setVersionLogic(VERSION_LOGIC);
//        dsd.setValidFrom(null);
//        dsd.setValidTo(null);
//        dsd.setFinalLogic(Boolean.FALSE);
//        dsd.setIsExternalReference(Boolean.FALSE);
//        dsd.setStructureURL(null);
//        dsd.setServiceURL(null);
//        dsd.setMaintainer(provider);
//
//        // --------------------------------
//        // NameableArtefactDto fields
//        // --------------------------------
//        dsd.setName(toInternationalString(dataset.getTitle()));
//        dsd.setDescription(toInternationalString(dataset.getDescription()));
//
//        // --------------------------------
//        // IdentifiableArtefactDto fields
//        // --------------------------------
//        dsd.setIdLogic(dataset.getIdentifier());
//        dsd.setUri(dataset.getUri());
//        dsd.setUrn(null);
//
//        // --------------------------------
//        // AnnotableArtefactDto fields
//        // --------------------------------
//
//        // GENERATION_METHOD
//        InternationalStringDto generationMethod = new InternationalStringDto();
//        LocalisedStringDto generationMethod_es = new LocalisedStringDto();
//        generationMethod_es.setLocale(LOCALE_ES);
//        generationMethod_es.setLabel(GENERATION_METHOD_VALUE_ES);
//        generationMethod.addText(generationMethod_es);
//
//        LocalisedStringDto generationMethod_en = new LocalisedStringDto();
//        generationMethod_en.setLocale(LOCALE_EN);
//        generationMethod_en.setLabel(GENERATION_METHOD_VALUE_EN);
//        generationMethod.addText(generationMethod_en);
//
//        AnnotationDto generationMethodAnnotation = new AnnotationDto();
//        generationMethodAnnotation.setIdLogic(GENERATION_METHOD_IDENTIFIER);
//        generationMethodAnnotation.setTitle(GENERATION_METHOD_TITLE);
//        generationMethodAnnotation.setText(generationMethod);
//        dsd.addAnnotation(generationMethodAnnotation);
//
//        // --------------------------------
//        // AuditableDto fields
//        // --------------------------------
//
//        // TODO: Confirmar con Zeben que estos campos no se usan para poner cuándo se creo el DSD. En ese caso pensar si sería preferible que pusiera los datos de auditoría del dataset (LAST_UPDATE,
//        // ..)
//        dsd.setCreatedDate(new Date());
//        dsd.setCreatedBy(STAT4YOU_AGENCY);
//        dsd.setLastUpdated(new Date());
//        dsd.setLastUpdatedBy(STAT4YOU_AGENCY);
//
//        // --------------------------------
//        // IdentityDto fields
//        // --------------------------------
//        dsd.setId(null);
//        dsd.setUuid(null);
//        dsd.setVersion(null);
//
//        // --------------------------------
//        // PrimaryMeasure
//        // --------------------------------
//        dsd.addGrouping(toPrimaryMeasure(dataset.getPrimaryMeasure()));
//
//        // --------------------------------
//        // Dimensions
//        // --------------------------------
//        dsd.addGrouping(toDimensionsList(dataset.getDimensions()));
//
//        // --------------------------------
//        // Attributes
//        // --------------------------------
//        // dsd.addGrouping(toAttributesList(dataset.getAttributeDefinitions()));
//
//        return dsd;
//    }
//
//    private org.siemac.metamac.core.common.dto.serviceapi.InternationalStringDto toInternationalString(com.stat4you.common.dto.InternationalStringDto internationalString) {
//        org.siemac.metamac.core.common.dto.serviceapi.InternationalStringDto sdmxInternationalString = new org.siemac.metamac.core.common.dto.serviceapi.InternationalStringDto();
//
//        sdmxInternationalString.setId(null);
//        sdmxInternationalString.setUuid(null);
//
//        for (com.stat4you.common.dto.LocalisedStringDto item : internationalString.getTexts()) {
//            sdmxInternationalString.addText(toLocalisedString(item));
//        }
//
//        return sdmxInternationalString;
//    }
//
//    private org.siemac.metamac.core.common.dto.serviceapi.LocalisedStringDto toLocalisedString(com.stat4you.common.dto.LocalisedStringDto item) {
//        org.siemac.metamac.core.common.dto.serviceapi.LocalisedStringDto sdmxLocalisedString = new org.siemac.metamac.core.common.dto.serviceapi.LocalisedStringDto();
//
//        sdmxLocalisedString.setId(null);
//        sdmxLocalisedString.setLabel(item.getLabel());
//        sdmxLocalisedString.setLocale(item.getLocale());
//        sdmxLocalisedString.setUuid(null);
//        sdmxLocalisedString.setVersion(null);
//
//        return sdmxLocalisedString;
//    }
//
//    private ExternalItemBtDto toExternalItem(String agencyId, String maintainableObjectId, String maintainableObjectVersion, String containerObjectId, String objectId,
//            TypeExternalArtefactsEnum typeExt) throws ApplicationException {
//        try {
//            return GeneratorUriUtil.createExternalItem(agencyId, maintainableObjectId, maintainableObjectVersion, containerObjectId, objectId, typeExt);
//        } catch (Exception e) {
//            // TODO: Cambiar el tipo de excepción
//            throw new ApplicationException(StatisticExceptionCodeEnum.UNKNOWN.getName(), "Error creating externalItem for Provider", e);
//        }
//    }
//
//    private ComponentListDto toPrimaryMeasure(PrimaryMeasureDto primaryMeasure) throws ApplicationException {
//        ComponentDto componentElement = new ComponentDto();
//
//        // TODO: San va a añadir identifier a la PRIMARY_MEASURE. En ese momento deberíamos hacer el mapeo con primaryMeasure.getIdentifier()
//        componentElement.setIdLogic(PRIMARY_MEASURE_CONCEPT_IDENTIFIER);
//
//        componentElement.setTypeComponent(TypeComponent.PRIMARY_MEASURE);
//        // TODO: Cambiar PRIMARY_MEASURE_CONCEPT_IDENTIFIER por primarymeasure.getIdentifier()
//        componentElement.setCptIdRef(toExternalItem(STAT4YOU_AGENCY, PRIMARY_MEASURE_CONCEPT_IDENTIFIER, VERSION_LOGIC, STAT4YOU_CONCEPT_SCHEMA, null, TypeExternalArtefactsEnum.CONCEPT));
//        componentElement.setLocalRepresentation(toSimpleTextFormatRepresentation());
//
//        ComponentListDto sdmxPrimaryMeasure = new ComponentListDto();
//        sdmxPrimaryMeasure.addComponent(componentElement);
//
//        return sdmxPrimaryMeasure;
//    }
//
//    private ComponentListDto toDimensionsList(List<DimensionDto> dimensions) throws ApplicationException {
//        ComponentListDto sdmxDimensionsList = new ComponentListDto();
//
//        boolean existsTimeDimension = false;
//        
//        for (DimensionDto dimension : dimensions) {
//            sdmxDimensionsList.addComponent(toDimension(dimension, existsTimeDimension));
//            if (DimensionTypeEnum.TIME_DIMENSION.equals(dimension.getType())) {
//                existsTimeDimension = true;
//            }
//        }
//
//        return sdmxDimensionsList;
//    }
//
//    private DimensionComponentDto toDimension(DimensionDto dimension, boolean existsTimeDimension) throws ApplicationException {
//        DimensionComponentDto sdmxDimension = new DimensionComponentDto();
//
//        sdmxDimension.setIdLogic(dimension.getIdentifier());
//
//        sdmxDimension.setTypeDimensionComponent(toTypeDimensionComponent(dimension.getType(), existsTimeDimension));
//        
//        sdmxDimension.setTypeComponent(TypeComponent.DIMENSION_COMPONENT);
//        sdmxDimension.setCptIdRef(toExternalItem(STAT4YOU_AGENCY, dimension.getIdentifier(), VERSION_LOGIC, STAT4YOU_CONCEPT_SCHEMA, null, TypeExternalArtefactsEnum.CONCEPT));
//        
//        if (TypeDimensionComponent.TIMEDIMENSION.equals(sdmxDimension.getTypeDimensionComponent())) {
//            // TIMEDIMENSION requires a non enumerated representation. 
//            // TODO: Aunque lo ideal sería ponerle un no enumerado de tipo fecha es complicado porque no sabemos el formato de la fecha.
//            sdmxDimension.setLocalRepresentation(toSimpleTextFormatRepresentation());
//        } else {
//            sdmxDimension.setLocalRepresentation(toEnumeratedRepresentation(dimension.getIdentifier()));
//        }
//
//        // TODO: Inicialmente a la TIME_DIMENSION le asignábamos el valor "0". Ahora no se está usando y el order no cumple ninguna finalidad. Si se le comienza a dar uso habría que cambiar el mapeo
//        sdmxDimension.setOrderLogic(null);
//
//        return sdmxDimension;
//    }
//
//    private TypeDimensionComponent toTypeDimensionComponent(DimensionTypeEnum type, boolean existsTimeDimension) {
//        switch (type) {
//            case TIME_DIMENSION:
//                // Stat4You model supports more than one TIME_DIMENSION 
//                if (!existsTimeDimension) {
//                    return TypeDimensionComponent.TIMEDIMENSION;
//                } else {
//                    return TypeDimensionComponent.DIMENSION;
//                }
//            case MEASURE_DIMENSION:
//                return TypeDimensionComponent.MEASUREDIMENSION;
//
//            case GEOGRAPHIC_DIMENSION:
//                // TODO: Como mejora se podría poner que si el type es geographicDimension se creara un rol de tipo geografico
//                return TypeDimensionComponent.DIMENSION;
//
//            default:
//                return TypeDimensionComponent.DIMENSION;
//        }
//    }
//
//    private ComponentListDto toAttributesList(List<AttributeDefinitionDto> attributeDefinitions) throws ApplicationException {
//        // TODO Auto-generated method stub
//        return null;
//    }
//    
//
//    private RepresentationDto toEnumeratedRepresentation(String identifier) throws ApplicationException {
//        RepresentationDto enumeratedRepresentation = new RepresentationDto();
//        enumeratedRepresentation.setTypeRepresentationEnum(TypeRepresentationEnum.ENUMERATED);
//        enumeratedRepresentation.setEnumerated(toExternalItem(STAT4YOU_AGENCY, identifier, VERSION_LOGIC, CODELIST_PREFIX.concat(identifier), null, TypeExternalArtefactsEnum.CODELIST));
//        return enumeratedRepresentation;
//    }
//
//    private RepresentationDto toSimpleTextFormatRepresentation() throws ApplicationException {
//        RepresentationDto textFormatRepresentation = new RepresentationDto();
//        textFormatRepresentation.setTypeRepresentationEnum(TypeRepresentationEnum.TEXT_FORMAT);
//
//        return textFormatRepresentation;
//    }
//    
////    private RepresentationDto toDateFormatRepresentation() throws ApplicationException {
////        RepresentationDto dateFormatRepresentation = new RepresentationDto();
////        dateFormatRepresentation.setTypeRepresentationEnum(TypeRepresentationEnum.TEXT_FORMAT);
////        
////        FacetDto nonEnumerated = new FacetDto();
////        nonEnumerated.setFacetValue(FacetValueTypeEnum.DATE_TIME_FVT);
////        
////        dateFormatRepresentation.setNonEnumerated(nonEnumerated );
////
////        return dateFormatRepresentation;
////    }

}
