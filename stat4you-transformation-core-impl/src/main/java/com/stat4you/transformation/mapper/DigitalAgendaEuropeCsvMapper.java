package com.stat4you.transformation.mapper;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.collections.CollectionUtils;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.springframework.stereotype.Component;

import com.stat4you.common.dto.InternationalStringDto;
import com.stat4you.common.dto.LocalisedStringDto;
import com.stat4you.statistics.dsd.domain.AttributeAttachmentLevelEnum;
import com.stat4you.statistics.dsd.domain.DatasetSourceEnum;
import com.stat4you.statistics.dsd.domain.DimensionTypeEnum;
import com.stat4you.statistics.dsd.dto.AttributeDefinitionDto;
import com.stat4you.statistics.dsd.dto.CodeDimensionDto;
import com.stat4you.statistics.dsd.dto.DatasetDto;
import com.stat4you.statistics.dsd.dto.DimensionDto;
import com.stat4you.statistics.dsd.dto.PrimaryMeasureDto;
import com.stat4you.statistics.dsd.dto.ResourceIdentierDto;
import com.stat4you.transformation.conf.TransformationConstants;
import com.stat4you.transformation.csv.daeurope.DigitalAgendaEuropeCsvConstants;
import com.stat4you.transformation.csv.daeurope.DigitalAgendaEuropeCsvData;
import com.stat4you.transformation.dto.DigitalAgendaEuropeCsvDto;

@Component
public class DigitalAgendaEuropeCsvMapper extends BaseMapper {

    /**
     * Transform to dataset
     */
    public DatasetDto toDataset(DigitalAgendaEuropeCsvDto csvDigitalAgendaEurope, DigitalAgendaEuropeCsvData digitalAgendaEuropeCsvData) throws ApplicationException {

        // Dataset, basic metatadas
        DatasetDto datasetDto = toDatasetBasicMetadatas(csvDigitalAgendaEurope);

        // Dimensions
        datasetDto.getDimensions().addAll(toDatasetDimensions(csvDigitalAgendaEurope, digitalAgendaEuropeCsvData));

        // Primary Measure
        PrimaryMeasureDto primaryMeasureDto = toDatasetPrimaryMeasure(datasetDto.getLanguages());
        datasetDto.setPrimaryMeasure(primaryMeasureDto);

        // Definitions of attributes
        List<AttributeDefinitionDto> attributeDefinitions = toDatasetAttributeDeffinitions(datasetDto.getLanguage());
        datasetDto.getAttributeDefinitions().addAll(attributeDefinitions);

        return datasetDto;
    }

    /**
     * Transform basic metadata of dataset: title, description, languages...
     */
    private DatasetDto toDatasetBasicMetadatas(DigitalAgendaEuropeCsvDto csvDigitalAgendaEuropeDto) throws ApplicationException {

        DatasetDto datasetDto = new DatasetDto();
        datasetDto.setSource(DatasetSourceEnum.CSV);
        datasetDto.setLanguage(csvDigitalAgendaEuropeDto.getLanguage());
        if (!CollectionUtils.isEmpty(csvDigitalAgendaEuropeDto.getLanguages())) {
            datasetDto.getLanguages().addAll(csvDigitalAgendaEuropeDto.getLanguages());
        } else {
            datasetDto.getLanguages().add(csvDigitalAgendaEuropeDto.getLanguage());
        }
        datasetDto.setIdentifier(csvDigitalAgendaEuropeDto.getIdentifier());
        datasetDto.setTitle(csvDigitalAgendaEuropeDto.getTitle());
        datasetDto.setDescription(csvDigitalAgendaEuropeDto.getDescription());
        datasetDto.setProviderUri(csvDigitalAgendaEuropeDto.getProviderUri());
        datasetDto.setProviderReleaseDate(csvDigitalAgendaEuropeDto.getProviderReleaseDate());
        datasetDto.setProviderPublishingDate(csvDigitalAgendaEuropeDto.getProviderPublishingDate());
        datasetDto.setFrequency(null);
        datasetDto.setUrl(csvDigitalAgendaEuropeDto.getUrl());
        datasetDto.getCategories().add(csvDigitalAgendaEuropeDto.getCategory());
        return datasetDto;
    }

    /**
     * Transform all dimensions
     */
    private List<DimensionDto> toDatasetDimensions(DigitalAgendaEuropeCsvDto digitalAgendaEuropeCsvDto, DigitalAgendaEuropeCsvData digitalAgendaEuropeCsvData) throws ApplicationException {

        List<DimensionDto> dimensionsDto = new ArrayList<DimensionDto>();
        for (DimensionDto dimensionSource : digitalAgendaEuropeCsvData.getDimensions()) {

            // Dimension
            DimensionDto dimensionDto = new DimensionDto();
            dimensionDto.setIdentifier(dimensionSource.getIdentifier());
            dimensionDto.setTitle(getTitle(dimensionSource.getIdentifier(), digitalAgendaEuropeCsvDto.getLanguage()));
            dimensionDto.setType(guessDimensionType(dimensionDto));

            // Codes
            for (CodeDimensionDto codeDimensionSource : dimensionSource.getCodes()) {
                CodeDimensionDto codeDimensionDto = new CodeDimensionDto();
                codeDimensionDto.setIdentifier(codeDimensionSource.getIdentifier());
                // Try get label, otherwise put code
                String codeDimensionLabel = null;
                if (DimensionTypeEnum.GEOGRAPHIC_DIMENSION.equals(dimensionDto.getType())) {
                    codeDimensionLabel = getLabel(TransformationConstants.MESSAGE_DIMENSION_GEOGRAPHIC_PREFIX + codeDimensionSource.getIdentifier(), digitalAgendaEuropeCsvDto.getLanguage(), codeDimensionSource.getIdentifier());
                } else if (DimensionTypeEnum.MEASURE_DIMENSION.equals(dimensionDto.getType())) {
                    codeDimensionLabel = getLabel(codeDimensionSource.getIdentifier(), digitalAgendaEuropeCsvDto.getLanguage(), codeDimensionSource.getIdentifier());
                } else {
                    codeDimensionLabel = codeDimensionSource.getIdentifier();
                }
                codeDimensionDto.setTitle(getTitle(codeDimensionLabel, digitalAgendaEuropeCsvDto.getLanguage()));
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
            localisedString.setLocale(languageLocale);
            localisedString.setLabel(getPrimaryMeasureLabel(languageLocale));
            primaryMeasureDto.getTitle().getTexts().add(localisedString);
        }
        return primaryMeasureDto;
    }

    /**
     * Guesses dimension type (measure, time, geographic o default), checking name
     */
    private DimensionTypeEnum guessDimensionType(DimensionDto dimensionDto) throws ApplicationException {

        if (DigitalAgendaEuropeCsvConstants.TIME_DIMENSION_IDENTIFIER.equalsIgnoreCase(dimensionDto.getIdentifier())) {
            return DimensionTypeEnum.TIME_DIMENSION;
        } else if (DigitalAgendaEuropeCsvConstants.GEOGRAPHIC_DIMENSION_IDENTIFIER.equalsIgnoreCase(dimensionDto.getIdentifier())) {
            return DimensionTypeEnum.GEOGRAPHIC_DIMENSION;
        } else if (DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER.equalsIgnoreCase(dimensionDto.getIdentifier())) {
            return DimensionTypeEnum.MEASURE_DIMENSION;
        }

        // Default
        return DimensionTypeEnum.DIMENSION;
    }

    /**
     * Transform of attribute definitions
     */
    private List<AttributeDefinitionDto> toDatasetAttributeDeffinitions(String locale) throws ApplicationException {

        List<AttributeDefinitionDto> attributeDefinitions = new ArrayList<AttributeDefinitionDto>();

        // Observations attributes
        attributeDefinitions.add(getAttributeDefinition(AttributeAttachmentLevelEnum.OBSERVATION, DigitalAgendaEuropeCsvConstants.ATTRIBUTE_UNIT, locale, null));
        attributeDefinitions.add(getAttributeDefinition(AttributeAttachmentLevelEnum.OBSERVATION, DigitalAgendaEuropeCsvConstants.ATTRIBUTE_FLAGS, locale, null));
        attributeDefinitions.add(getAttributeDefinition(AttributeAttachmentLevelEnum.OBSERVATION, DigitalAgendaEuropeCsvConstants.ATTRIBUTE_NOTE, locale, null));

        // Dimensions attributes
        attributeDefinitions.add(getAttributeDefinition(AttributeAttachmentLevelEnum.DIMENSION, DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_UNIT, locale,
                DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER));
        attributeDefinitions.add(getAttributeDefinition(AttributeAttachmentLevelEnum.DIMENSION, DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_VARIABLE_CAPTION, locale,
                DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER));
        attributeDefinitions.add(getAttributeDefinition(AttributeAttachmentLevelEnum.DIMENSION, DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_LONG_LABEL, locale,
                DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER));
        attributeDefinitions.add(getAttributeDefinition(AttributeAttachmentLevelEnum.DIMENSION, DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_SHORT_LABEL, locale,
                DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER));
        attributeDefinitions.add(getAttributeDefinition(AttributeAttachmentLevelEnum.DIMENSION, DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATORS_GROUP, locale,
                DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER));
        attributeDefinitions.add(getAttributeDefinition(AttributeAttachmentLevelEnum.DIMENSION, DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_DEFINITION_SCOPE_NOTES, locale,
                DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER));
        attributeDefinitions.add(getAttributeDefinition(AttributeAttachmentLevelEnum.DIMENSION, DigitalAgendaEuropeCsvConstants.ATTRIBUTE_SOURCE_CODE, locale,
                DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER));
        attributeDefinitions.add(getAttributeDefinition(AttributeAttachmentLevelEnum.DIMENSION, DigitalAgendaEuropeCsvConstants.ATTRIBUTE_SOURCE_LABEL, locale,
                DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER));
        attributeDefinitions.add(getAttributeDefinition(AttributeAttachmentLevelEnum.DIMENSION, DigitalAgendaEuropeCsvConstants.ATTRIBUTE_SOURCE_LINKS, locale,
                DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER));
        attributeDefinitions.add(getAttributeDefinition(AttributeAttachmentLevelEnum.DIMENSION, DigitalAgendaEuropeCsvConstants.ATTRIBUTE_SOURCE_LAST_VERSION_USED, locale,
                DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER));

        return attributeDefinitions;
    }

    private AttributeDefinitionDto getAttributeDefinition(AttributeAttachmentLevelEnum attachmentLevelEnum, String attributeIdentifier, String locale, String attachmentDimensionIdentifier) {
        AttributeDefinitionDto attributeDefinitionDto = new AttributeDefinitionDto();
        attributeDefinitionDto.setAttachmentLevel(attachmentLevelEnum);
        attributeDefinitionDto.setIdentifier(attributeIdentifier);
        attributeDefinitionDto.setTitle(null);
        if (attachmentDimensionIdentifier != null) {
            ResourceIdentierDto resourceIdentierDto = new ResourceIdentierDto();
            resourceIdentierDto.setIdentifier(attachmentDimensionIdentifier);
            attributeDefinitionDto.addAttachmentDimension(resourceIdentierDto);
        }
        return attributeDefinitionDto;

    }

    private InternationalStringDto getTitle(String label, String locale) {
        InternationalStringDto internationalStringDto = new InternationalStringDto();
        internationalStringDto.addText(new LocalisedStringDto(locale, label));
        return internationalStringDto;
    }
}
