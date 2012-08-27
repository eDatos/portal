package com.stat4you.transformation.mapper;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.mutable.MutableInt;
import org.apache.commons.lang3.StringUtils;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.joda.time.DateTime;
import org.springframework.stereotype.Component;

import com.arte.statistic.dataset.repository.dto.AttributeBasicDto;
import com.arte.statistic.dataset.repository.dto.AttributeDto;
import com.arte.statistic.dataset.repository.dto.CodeDimensionDto;
import com.arte.statistic.dataset.repository.dto.ObservationExtendedDto;
import com.arte.statistic.dataset.repository.util.DtoUtils;
import com.arte.statistic.parser.px.domain.InternationalString;
import com.arte.statistic.parser.px.domain.LocalisedString;
import com.arte.statistic.parser.px.domain.PxAttribute;
import com.arte.statistic.parser.px.domain.PxAttributeCodes;
import com.arte.statistic.parser.px.domain.PxAttributeDimension;
import com.arte.statistic.parser.px.domain.PxCodeDimension;
import com.arte.statistic.parser.px.domain.PxData;
import com.arte.statistic.parser.px.domain.PxDimension;
import com.arte.statistic.parser.px.domain.PxModel;
import com.arte.statistic.parser.px.util.PxIdentifierUtils;
import com.stat4you.common.dto.InternationalStringDto;
import com.stat4you.common.dto.LocalisedStringDto;
import com.stat4you.statistics.dsd.domain.AttributeAttachmentLevelEnum;
import com.stat4you.statistics.dsd.domain.DatasetSourceEnum;
import com.stat4you.statistics.dsd.domain.DimensionTypeEnum;
import com.stat4you.statistics.dsd.dto.AttributeDefinitionDto;
import com.stat4you.statistics.dsd.dto.DatasetDto;
import com.stat4you.statistics.dsd.dto.DimensionDto;
import com.stat4you.statistics.dsd.dto.PrimaryMeasureDto;
import com.stat4you.statistics.dsd.dto.ResourceIdentierDto;
import com.stat4you.transformation.conf.TransformationConstants;
import com.stat4you.transformation.conf.TransformationDataloader;
import com.stat4you.transformation.domain.TransformationExceptionCodeEnum;
import com.stat4you.transformation.dto.PxImportDto;

@Component
public class PxMapper extends BaseMapper {

    private final List<String> measureDimensionPossibleIdentifiers = Arrays.asList("INDICADOR", "INDICADORES");

    /**
     * Transform attributes (global, dimensions, observations...) removing dimensions with '*' as codes, and assigning new attributes identifiers
     * IMPORTANT: Change pxModel!
     */
    public void reviewPxAttributesIdentifiersAndDimensions(PxModel pxModel) {
        _reviewPxAttributesIdentifiersAndDimensions(pxModel.getAttributesGlobal());
        _reviewPxAttributesIdentifiersAndDimensions(pxModel.getAttributesDimensions());
        _reviewPxAttributesIdentifiersAndDimensions(pxModel.getAttributesObservations());
    }

    /**
     * Transform to dataset
     */
    public DatasetDto toDataset(PxModel pxModel, PxImportDto pxImportDto) throws ApplicationException {

        // Dataset, basic metatadas
        DatasetDto datasetDto = toDatasetBasicMetadatas(pxModel, pxImportDto);

        // Dimensions
        List<PxDimension> pxDimensions = getPxDimensions(pxModel);
        datasetDto.getDimensions().addAll(toDatasetDimensions(pxModel, pxImportDto, pxDimensions));

        // Primary Measure
        PrimaryMeasureDto primaryMeasureDto = toDatasetPrimaryMeasure(datasetDto.getLanguages());
        datasetDto.setPrimaryMeasure(primaryMeasureDto);

        // Definitions of attributes
        List<AttributeDefinitionDto> attributeDefinitions = toDatasetAttributeDeffinitions(pxModel, pxDimensions);
        datasetDto.getAttributeDefinitions().addAll(attributeDefinitions);

        return datasetDto;
    }

    /**
     * Transform observations and observations attributes
     */
    public List<ObservationExtendedDto> toObservations(PxData pxData, List<PxAttribute> pxAttributesOneObservation, List<DimensionDto> dimensionsDto) throws ApplicationException {
        List<ObservationExtendedDto> observationsExtendedDto = new ArrayList<ObservationExtendedDto>(pxData.getData().size());
        CodeDimensionDto[] codeDimensionsOfObservation = new CodeDimensionDto[dimensionsDto.size()];
        Map<String, List<AttributeBasicDto>> attributesObservations = toAttributesObservations(pxAttributesOneObservation, dimensionsDto);
        MutableInt observationCounter = new MutableInt(0);
        extractDataFromPxData(0, observationCounter, dimensionsDto, observationsExtendedDto, pxData, codeDimensionsOfObservation, attributesObservations);
        if (observationCounter.intValue() != pxData.getData().size()) {
            throw new ApplicationException(TransformationExceptionCodeEnum.UNKNOWN.name(), "Error parsing data: observations number != counter observations");
        }
        return observationsExtendedDto;
    }

    /**
     * Transform dataset and dimensions attributes
     */
    public List<AttributeDto> toAttributes(PxModel pxModel) throws ApplicationException {

        List<AttributeDto> attributes = new ArrayList<AttributeDto>();

        // Global attributes
        for (PxAttribute pxAttributeDto : pxModel.getAttributesGlobal()) {
            AttributeDto attributeDto = new AttributeDto();
            attributeDto.setAttributeId(pxAttributeDto.getIdentifier());
            attributeDto.setValue(toInternationalStringStatisticRepository(pxAttributeDto.getValue()));
            attributes.add(attributeDto);
        }

        // Dimension attributes
        for (PxAttribute pxAttributeDto : pxModel.getAttributesDimensions()) {
            AttributeDto attributeDto = new AttributeDto();
            attributeDto.setAttributeId(pxAttributeDto.getIdentifier());
            attributeDto.setValue(toInternationalStringStatisticRepository(pxAttributeDto.getValue()));
            for (PxAttributeDimension pxAttributeDimension : pxAttributeDto.getDimensions()) {
                CodeDimensionDto codeDimensionDto = new CodeDimensionDto();
                codeDimensionDto.setDimensionId(pxAttributeDimension.getDimension());
                if (PxAttributeCodes.ALL_DIMENSION_CODES.equals(pxAttributeDimension.getDimensionCode())) {
                    throw new ApplicationException(TransformationExceptionCodeEnum.UNKNOWN.name(), "Dimension with code * unexpected");
                }
                codeDimensionDto.setCodeDimensionId(pxAttributeDimension.getDimensionCode());
                attributeDto.addCodesDimension(codeDimensionDto);
            }
            attributes.add(attributeDto);
        }

        return attributes;
    }

    /**
     * Transform observations attributes (only attributes for one observation)
     * 
     * @return Map with key = unique key of observations; value = list of attributes of observation
     */
    public Map<String, List<AttributeBasicDto>> toAttributesObservations(List<PxAttribute> attributesOneObservation, List<DimensionDto> dimensionsDto) throws ApplicationException {

        Map<String, List<AttributeBasicDto>> attributes = new HashMap<String, List<AttributeBasicDto>>();

        if (attributesOneObservation != null) {
            for (PxAttribute pxAttributeDto : attributesOneObservation) {
                AttributeDto attributeDto = new AttributeDto();
                attributeDto.setAttributeId(pxAttributeDto.getIdentifier());
                attributeDto.setValue(toInternationalStringStatisticRepository(pxAttributeDto.getValue()));
                for (PxAttributeDimension pxAttributeDimension : pxAttributeDto.getDimensions()) {
                    CodeDimensionDto codeDimensionDto = new CodeDimensionDto();
                    if (PxAttributeCodes.ALL_DIMENSION_CODES.equals(pxAttributeDimension.getDimensionCode())) {
                        throw new ApplicationException(TransformationExceptionCodeEnum.UNKNOWN.name(), "Dimension with code * unexpected");
                    }
                    codeDimensionDto.setDimensionId(pxAttributeDimension.getDimension());
                    codeDimensionDto.setCodeDimensionId(pxAttributeDimension.getDimensionCode());
                    attributeDto.addCodesDimension(codeDimensionDto);
                }
                String uniqueKey = DtoUtils.generateUniqueKey(attributeDto.getCodesDimension());
                if (!attributes.containsKey(uniqueKey)) {
                    attributes.put(uniqueKey, new ArrayList<AttributeBasicDto>());
                }
                attributes.get(uniqueKey).add(attributeDto);
            }
        }

        return attributes;
    }

    public InternationalStringDto toInternationalStringDsd(com.arte.statistic.parser.px.domain.InternationalString source) throws ApplicationException {
        if (source == null) {
            return null;
        }
        InternationalStringDto target = new InternationalStringDto();
        for (LocalisedString sourceLocalisedString : source.getTexts()) {
            LocalisedStringDto targetLocalisedString = new LocalisedStringDto();
            targetLocalisedString.setLocale(toLanguage(sourceLocalisedString.getLocale()));
            targetLocalisedString.setLabel(sourceLocalisedString.getLabel());
            target.getTexts().add(targetLocalisedString);
        }
        return target;
    }

    public com.arte.statistic.dataset.repository.dto.InternationalStringDto toInternationalStringStatisticRepository(com.arte.statistic.parser.px.domain.InternationalString source)
            throws ApplicationException {
        if (source == null) {
            return null;
        }
        com.arte.statistic.dataset.repository.dto.InternationalStringDto target = new com.arte.statistic.dataset.repository.dto.InternationalStringDto();
        for (LocalisedString sourceLocalisedString : source.getTexts()) {
            com.arte.statistic.dataset.repository.dto.LocalisedStringDto targetLocalisedString = new com.arte.statistic.dataset.repository.dto.LocalisedStringDto();
            targetLocalisedString.setLocale(toLanguage(sourceLocalisedString.getLocale()));
            targetLocalisedString.setLabel(sourceLocalisedString.getLabel());
            target.getTexts().add(targetLocalisedString);
        }
        return target;
    }

    /**
     * Transform basic metadata of dataset: title, description, languages...
     */
    private DatasetDto toDatasetBasicMetadatas(PxModel pxModel, PxImportDto pxImportDto) throws ApplicationException {

        DatasetDto datasetDto = new DatasetDto();
        datasetDto.setProviderUri(pxImportDto.getProviderUri());
        datasetDto.setSource(DatasetSourceEnum.PX);
        datasetDto.setLanguage(toLanguage(pxModel.getLanguage()));
        if (!CollectionUtils.isEmpty(pxModel.getLanguages())) {
            for (String language : pxModel.getLanguages()) {
                datasetDto.getLanguages().add(toLanguage(language));
            }
        } else {
            datasetDto.getLanguages().add(toLanguage(pxModel.getLanguage()));
        }
        datasetDto.setTitle(toDatasetTitle(pxModel, pxImportDto));
        try {
            datasetDto.setIdentifier(PxIdentifierUtils.normalizeStringToSemanticIdentifier(datasetDto.getTitle().getLocalisedLabel(datasetDto.getLanguage()), datasetDto.getLanguage(), "DATASET_"));
        } catch (Exception e) {
            throw new ApplicationException(TransformationExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), "Error parsing px file", e);
        }
        datasetDto.setDescription(toInternationalStringDsd(pxModel.getDescription()));
        datasetDto.setProviderReleaseDate(pxModel.getCreationDate() != null ? new DateTime(pxModel.getCreationDate().getTime()) : null);
        datasetDto.setProviderPublishingDate(pxModel.getLastUpdated() != null ? new DateTime(pxModel.getLastUpdated().getTime()) : datasetDto.getProviderReleaseDate());
        datasetDto.setFrequency(pxModel.getUpdateFrequency());
        datasetDto.setUrl(pxImportDto.getPxUrl());
        datasetDto.getCategories().add(pxImportDto.getCategory());
        return datasetDto;
    }

    /**
     * Generate dataset title from:
     * - Title in px (it is required, but in some providers can be empty)
     * - Add information of px: info, refperiod
     * - Add additional title from pxImportDto
     * - If title if empty yet, add information from other metadatas in px (contents, dimensions...)
     * - Add information about geographical and time from pxImportDto from crawler
     * - Add units information
     */
    private InternationalStringDto toDatasetTitle(PxModel pxModel, PxImportDto pxImportDto) throws ApplicationException {

        List<String> languages = null;
        if (pxModel.getLanguages().size() != 0) {
            languages = pxModel.getLanguages();
        } else {
            languages = new ArrayList<String>();
            languages.add(pxModel.getLanguage());
        }
        List<PxDimension> pxDimensions = new ArrayList<PxDimension>();
        pxDimensions.addAll(pxModel.getStub());
        pxDimensions.addAll(pxModel.getHeading());

        // Title or description in px
        InternationalStringDto title = null;
        if (pxModel.getTitle() != null) {
            title = toInternationalStringDsd(pxModel.getTitle());
        } else if (pxModel.getDescription() != null) {
            title = toInternationalStringDsd(pxModel.getDescription());
        } else {
            title = new InternationalStringDto();
        }

        // Enrich title
        for (String languageInPx : languages) {
            LocalisedStringDto localisedStringDto = title.getLocalisedString(languageInPx);
            if (localisedStringDto == null) {
                localisedStringDto = new LocalisedStringDto();
                localisedStringDto.setLocale(toLanguage(languageInPx));
                title.addText(localisedStringDto);
            }
            String label = localisedStringDto.getLabel();

            // Info
            label = enrichText(label, pxModel.getInfo(), languageInPx);

            // Refperiod (only if contains number)
            if (!labelContainsYear(pxModel.getInfo(), languageInPx)) {
                if (labelContainsAnyDigit(pxModel.getRefPeriod(), languageInPx)) {
                    label = enrichText(label, pxModel.getRefPeriod(), languageInPx);
                } else {
                    // Try refperiod in code dimensions
                    String refPeriodDimensions = null;
                    for (PxDimension pxDimension : pxDimensions) {
                        for (PxCodeDimension pxCodeDimension : pxDimension.getCodes()) {
                            if (labelContainsAnyDigit(pxCodeDimension.getRefPeriod(), languageInPx)) {
                                refPeriodDimensions = enrichText(refPeriodDimensions, pxCodeDimension.getRefPeriod(), languageInPx, ",");
                            }
                        }
                    }
                    label = enrichText(label, refPeriodDimensions);
                }
            }

            // Survey
            if (labelIsNull(pxModel.getInfo(), languageInPx) && labelIsNull(pxModel.getTitle(), languageInPx) && !labelIsNull(pxModel.getSurvey(), languageInPx)) {
                label = enrichText(label, pxModel.getSurvey(), languageInPx);
            }

            // If label is empty yet, try fill it with another information in px
            if (StringUtils.isBlank(label)) {
                // Contents
                label = enrichText(label, pxModel.getContents(), languageInPx);
                // Dimensions
                for (PxDimension pxDimension : pxDimensions) {
                    label = enrichText(label, pxDimension.getLabel(), languageInPx, ",");
                }
            }

            // Try fill with additional information from PxImport
            if ((pxImportDto.getForceAddContextInformation() != null && pxImportDto.getForceAddContextInformation())
                    || (labelIsNull(pxModel.getInfo(), languageInPx) && labelIsNull(pxModel.getRefPeriod(), languageInPx))) {
                label = enrichText(label, pxImportDto.getTitle(), localisedStringDto.getLocale());
            }

            // Subject area
            if (pxImportDto.getForceAddContextInformation() != null && pxImportDto.getForceAddContextInformation()) {
                // Only for INE
                label = enrichText(label, pxModel.getSubjectArea(), languageInPx);
            }
            
            // Fill geographic and time information
            label = enrichText(label, pxImportDto.getGeographicalValue(), localisedStringDto.getLocale());
            label = enrichText(label, pxImportDto.getPeriod());

            // Units
            if (!labelIsNull(pxModel.getUnits(), languageInPx) && !label.toLowerCase().contains(pxModel.getUnits().getLocalisedLabel(languageInPx).toLowerCase())
                    && !pxModel.getUnits().getLocalisedLabel(languageInPx).equals("?")) {
                label = enrichText(label, getUnitsLabel(localisedStringDto.getLocale()) + pxModel.getUnits().getLocalisedLabel(languageInPx));
            }

            localisedStringDto.setLabel(label.toString());
        }
        return title;
    }
    private Boolean labelIsNull(InternationalString internationalString, String locale) {
        return internationalString == null || internationalString.getLocalisedLabel(locale) == null;
    }

    private Boolean labelContainsAnyDigit(InternationalString internationalString, String locale) {
        return !labelIsNull(internationalString, locale) && internationalString.getLocalisedLabel(locale).matches(".*[0-9].*");
    }

    private Boolean labelContainsYear(InternationalString internationalString, String locale) {
        return !labelIsNull(internationalString, locale) && internationalString.getLocalisedLabel(locale).matches(".*[1-2]\\d{3}.*");
    }

    private String enrichText(String text, InternationalString additionalText, String locale) {
        if (additionalText == null) {
            return text;
        }
        return enrichText(text, additionalText.getLocalisedLabel(locale), ".");
    }

    private String enrichText(String text, InternationalString additionalText, String locale, String separator) {
        if (additionalText == null) {
            return text;
        }
        return enrichText(text, additionalText.getLocalisedLabel(locale), separator);
    }

    private String enrichText(String text, InternationalStringDto additionalText, String locale) {
        if (additionalText == null) {
            return text;
        }
        return enrichText(text, additionalText.getLocalisedLabel(locale), ".");
    }

    private String enrichText(String text, String additionalText) {
        return enrichText(text, additionalText, ".");
    }

    private String enrichText(String text, String additionalText, String separator) {
        if (additionalText == null) {
            return text;
        }
        if (StringUtils.isBlank(text)) {
            return additionalText;
        }

        if (text.toLowerCase().contains(additionalText.toLowerCase())) {
            return text;
        }

        if (!(text.endsWith(separator) || text.endsWith(separator + " "))) {
            text = StringUtils.join(text, separator);
        }
        text = StringUtils.join(text, " ", additionalText);
        return text;
    }

    /**
     * Transform all dimensions
     */
    private List<DimensionDto> toDatasetDimensions(PxModel pxModel, PxImportDto pxImportDto, List<PxDimension> pxDimensions) throws ApplicationException {

        List<DimensionDto> dimensionsDto = new ArrayList<DimensionDto>();
        for (PxDimension pxDimension : pxDimensions) {
            // Dimension
            DimensionDto dimensionDto = new DimensionDto();
            dimensionDto.setIdentifier(pxDimension.getIdentifier());
            dimensionDto.setTitle(toInternationalStringDsd(pxDimension.getLabel()));
            dimensionDto.setType(guessDimensionType(dimensionDto, pxModel, pxImportDto.getProviderUri()));

            // Codes
            for (PxCodeDimension pxCodeDimension : pxDimension.getCodes()) {
                com.stat4you.statistics.dsd.dto.CodeDimensionDto codeDimensionDto = new com.stat4you.statistics.dsd.dto.CodeDimensionDto();
                codeDimensionDto.setIdentifier(pxCodeDimension.getIdentifier());
                codeDimensionDto.setTitle(toInternationalStringDsd(pxCodeDimension.getLabel()));
                dimensionDto.addCode(codeDimensionDto);
            }
            // Add to dataset
            dimensionsDto.add(dimensionDto);
        }

        return dimensionsDto;
    }

    /**
     * Transform primary measure
     */
    private PrimaryMeasureDto toDatasetPrimaryMeasure(List<String> datasetLanguages) throws ApplicationException {
        PrimaryMeasureDto primaryMeasureDto = new PrimaryMeasureDto();
        primaryMeasureDto.setIdentifier(TransformationConstants.PRIMARY_MEASURE_IDENTIFIER_DEFAULT);
        primaryMeasureDto.setTitle(new InternationalStringDto());
        for (String languageLocale : datasetLanguages) {
            LocalisedStringDto localisedString = new LocalisedStringDto();
            localisedString.setLocale(toLanguage(languageLocale));
            localisedString.setLabel(getPrimaryMeasureLabel(languageLocale));
            primaryMeasureDto.getTitle().getTexts().add(localisedString);
        }
        return primaryMeasureDto;
    }

    /**
     * Transform of attribute definitions
     */
    private List<AttributeDefinitionDto> toDatasetAttributeDeffinitions(PxModel pxModel, List<PxDimension> pxDimensions) throws ApplicationException {

        Set<String> attributeCodesToAvoidDuplicated = new HashSet<String>();

        List<AttributeDefinitionDto> attributeDefinitions = new ArrayList<AttributeDefinitionDto>();
        attributeDefinitions.addAll(toAttributeDefinition(pxModel.getAttributesGlobal(), AttributeAttachmentLevelEnum.DATASET, attributeCodesToAvoidDuplicated));
        attributeDefinitions.addAll(toAttributeDefinition(pxModel.getAttributesDimensions(), AttributeAttachmentLevelEnum.DIMENSION, attributeCodesToAvoidDuplicated));
        attributeDefinitions.addAll(toAttributeDefinition(pxModel.getAttributesObservations(), AttributeAttachmentLevelEnum.OBSERVATION, attributeCodesToAvoidDuplicated));

        return attributeDefinitions;
    }

    /**
     * Guesses dimension type (measure, time, geographic o default), checking:
     * a) Measure: If it is contVariable or is identified as "Indicador", "Indicadores"...
     * b) Time: if the title of dimensions exists in a list of time dimensions
     * c) Geographic: if the title of dimensions exists in a list of geographic dimensions
     */
    private DimensionTypeEnum guessDimensionType(DimensionDto dimensionDto, PxModel pxModel, String providerDatasetUri) throws ApplicationException {

        List<String> dimensionTimeNomenclatures = TransformationDataloader.instance().getDimensionTimeNomenclatures();
        List<String> dimensionGeographicNomenclatures = TransformationDataloader.instance().getDimensionGeographicNomenclatures();

        if (findDimensionNomenclatureCoincidence(dimensionDto.getTitle(), dimensionTimeNomenclatures)) {
            return DimensionTypeEnum.TIME_DIMENSION;
        } else if (findDimensionNomenclatureCoincidence(dimensionDto.getTitle(), dimensionGeographicNomenclatures)) {
            return DimensionTypeEnum.GEOGRAPHIC_DIMENSION;
        } else if (dimensionDto.getIdentifier().equals(pxModel.getContVariableIdentifier())) {
            return DimensionTypeEnum.MEASURE_DIMENSION;
        } else if (measureDimensionPossibleIdentifiers.contains(dimensionDto.getIdentifier())) {
            return DimensionTypeEnum.MEASURE_DIMENSION;
        }

        // Default
        return DimensionTypeEnum.DIMENSION;

    }

    /**
     * Checks if the title of a dimension exists in a list of values
     */
    private Boolean findDimensionNomenclatureCoincidence(InternationalStringDto dimensionTitle, List<String> values) {

        for (String value : values) {
            if (StringUtils.isBlank(value)) {
                continue;
            }
            if (value.startsWith(TransformationConstants.FILE_COMMENTS)) {
                continue;
            }
            String[] valuesSplit = value.split(TransformationConstants.FILES_SEPARATORS);
            String language = valuesSplit[0];
            String[] dimensionNomenclatureInLanguage = valuesSplit[1].split(TransformationConstants.FILE_COMMENTS);
            for (int j = 0; j < dimensionNomenclatureInLanguage.length; j++) {
                String label = dimensionTitle.getLocalisedLabel(language);
                if (label != null && label.equalsIgnoreCase(dimensionNomenclatureInLanguage[j])) {
                    return Boolean.TRUE;
                }
            }
        }

        return Boolean.FALSE;
    }

    private List<AttributeDefinitionDto> toAttributeDefinition(List<PxAttribute> pxAttributes, AttributeAttachmentLevelEnum attachmentLevel, Set<String> attributeCodes) throws ApplicationException {
        List<AttributeDefinitionDto> attributeDefinitions = new ArrayList<AttributeDefinitionDto>();
        for (PxAttribute pxAttribute : pxAttributes) {
            if (!attributeCodes.contains(pxAttribute.getIdentifier())) { // can be duplicated
                AttributeDefinitionDto attributeDefinitionDto = new AttributeDefinitionDto();
                attributeDefinitionDto.setIdentifier(pxAttribute.getIdentifier());
                attributeDefinitionDto.setAttachmentLevel(attachmentLevel);
                // Attachment dimensions
                if (AttributeAttachmentLevelEnum.DIMENSION.equals(attributeDefinitionDto.getAttachmentLevel())) {
                    for (PxAttributeDimension pxAttributeDimension : pxAttribute.getDimensions()) {
                        ResourceIdentierDto attachmentDimension = new ResourceIdentierDto();
                        attachmentDimension.setIdentifier(pxAttributeDimension.getDimension());
                        attributeDefinitionDto.addAttachmentDimension(attachmentDimension);
                    }
                }

                attributeDefinitions.add(attributeDefinitionDto);
                attributeCodes.add(pxAttribute.getIdentifier());
            }
        }
        return attributeDefinitions;
    }

    /**
     * Get header and stub.
     * Important: Add firstly stub and then heading. Order is important because observations come in this order
     */
    private List<PxDimension> getPxDimensions(PxModel pxModel) {
        List<PxDimension> pxDimensions = new ArrayList<PxDimension>();
        pxDimensions.addAll(pxModel.getStub());
        pxDimensions.addAll(pxModel.getHeading());
        return pxDimensions;
    }

    /**
     * Get code at Normalized Values Service of a language from px
     */
    private String toLanguage(String languagePx) throws ApplicationException {
        // TODO SerÃ­a conveniente poner esto en una utilidad comÃºn a todos los subproyectos
        if (!TransformationDataloader.instance().getLanguages().containsKey(languagePx)) {
            throw new ApplicationException(TransformationExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), "Language not supported in properties file: " + languagePx);
        }
        return TransformationDataloader.instance().getLanguages().get(languagePx);
    }

    /**
     * Generate all combinations of codes of dimensions
     */
    private void extractDataFromPxData(int nivel, MutableInt positionObservation, List<DimensionDto> dimensions, List<ObservationExtendedDto> observationsExtended, PxData pxData,
            CodeDimensionDto[] codeDimensionsOfObservation, Map<String, List<AttributeBasicDto>> attributesObservations) {

        if (nivel == dimensions.size()) {
            // Already it is available the combination with all dimensions code for observation
            String observationValue = pxData.getData().get(positionObservation.intValue());
            positionObservation.increment();

            ObservationExtendedDto observationExtendedDto = new ObservationExtendedDto();
            observationExtendedDto.setPrimaryMeasure(observationValue);
            observationExtendedDto.getCodesDimension().addAll(Arrays.asList(codeDimensionsOfObservation));
            if (attributesObservations.containsKey(observationExtendedDto.getUniqueKey())) {
                observationExtendedDto.getAttributes().addAll(attributesObservations.get(observationExtendedDto.getUniqueKey()));
            }
            observationsExtended.add(observationExtendedDto);
            return;
        }

        DimensionDto dimensionDto = dimensions.get(nivel);
        for (com.stat4you.statistics.dsd.dto.CodeDimensionDto codeDimensionDtoDsd : dimensionDto.getCodes()) {
            CodeDimensionDto codeDimensionDto = new CodeDimensionDto();
            codeDimensionDto.setDimensionId(dimensionDto.getIdentifier());
            codeDimensionDto.setCodeDimensionId(codeDimensionDtoDsd.getIdentifier());
            codeDimensionsOfObservation[nivel] = codeDimensionDto;
            if (nivel < dimensions.size()) {
                extractDataFromPxData(nivel + 1, positionObservation, dimensions, observationsExtended, pxData, codeDimensionsOfObservation, attributesObservations);
            }
        }
    }

    /**
     * Transform attributes, removing dimensions with '*' as codes, and assigning new attributes identifiers
     */
    private void _reviewPxAttributesIdentifiersAndDimensions(List<PxAttribute> pxAttributes) {

        Map<String, Integer> attributesIdentifiers = new HashMap<String, Integer>(); // key: original attribute identifier; value: counter of attributes with same identifier
        Map<String, PxAttribute> attributesDefinitions = new HashMap<String, PxAttribute>(); // key: dimensionIdentifier; value: existing attribute with same dimensions

        for (PxAttribute pxAttribute : pxAttributes) {
            // Remove dimensions with '*' as code
            List<PxAttributeDimension> pxAttributesDimensions = new ArrayList<PxAttributeDimension>();
            for (PxAttributeDimension pxAttributeDimension : pxAttribute.getDimensions()) {
                if (!PxAttributeCodes.ALL_DIMENSION_CODES.equals(pxAttributeDimension.getDimensionCode())) {
                    pxAttributesDimensions.add(pxAttributeDimension);
                }
            }
            // Generate identifier
            String key = generateKeyAttributeToMap(pxAttribute.getIdentifier(), pxAttributesDimensions);
            PxAttribute pxAttributeWithSameDimension = attributesDefinitions.get(key);
            if (pxAttributeWithSameDimension != null) {
                pxAttribute.setIdentifier(pxAttributeWithSameDimension.getIdentifier());
            } else {
                String originalIdentifier = null;
                if (pxAttributesDimensions.size() == 0) {
                    // global
                    originalIdentifier = pxAttribute.getIdentifier().endsWith("X") ? PxAttributeCodes.NOTEX : PxAttributeCodes.NOTE;
                } else if (pxAttributesDimensions.size() != pxAttribute.getDimensions().size()) {
                    // dimension
                    originalIdentifier = pxAttribute.getIdentifier().endsWith("X") ? PxAttributeCodes.VALUENOTEX : PxAttributeCodes.VALUENOTE;
                } else {
                    // observation
                    originalIdentifier = pxAttribute.getIdentifier();
                }
                pxAttribute.setIdentifier(generatePxAttributeIdentifier(attributesIdentifiers, originalIdentifier));
                attributesDefinitions.put(key, pxAttribute);
            }

            // Reset attachment dimensions
            pxAttribute.getDimensions().clear();
            pxAttribute.getDimensions().addAll(pxAttributesDimensions);
        }
    }

    /**
     * Generate unique identifier to attribute
     */
    private String generatePxAttributeIdentifier(Map<String, Integer> attributesIdentifiers, String identifierOriginal) {

        String identifier = identifierOriginal;
        String identifierUnique = null;
        if (!attributesIdentifiers.containsKey(identifier)) {
            attributesIdentifiers.put(identifier, Integer.valueOf(0));
        }
        Integer count = Integer.valueOf(attributesIdentifiers.get(identifier) + 1);
        identifierUnique = identifier + "_" + count;
        attributesIdentifiers.put(identifier, count);

        return identifierUnique;
    }

    /**
     * Generate key to attribute with dimensions identifiers
     */
    private String generateKeyAttributeToMap(String attributeCode, List<PxAttributeDimension> attributeDimensions) {
        StringBuilder key = new StringBuilder();
        key.append(attributeCode);
        key.append("_");
        for (PxAttributeDimension pxAttributeDimension : attributeDimensions) {
            key.append(pxAttributeDimension.getDimension()).append("_");
        }
        return key.toString();
    }
}
