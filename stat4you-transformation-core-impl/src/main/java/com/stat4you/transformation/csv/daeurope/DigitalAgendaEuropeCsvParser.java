package com.stat4you.transformation.csv.daeurope;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.arte.statistic.dataset.repository.dto.AttributeBasicDto;
import com.arte.statistic.dataset.repository.dto.AttributeDto;
import com.arte.statistic.dataset.repository.dto.CodeDimensionDto;
import com.arte.statistic.dataset.repository.dto.InternationalStringDto;
import com.arte.statistic.dataset.repository.dto.LocalisedStringDto;
import com.arte.statistic.dataset.repository.dto.ObservationExtendedDto;
import com.stat4you.statistics.dsd.domain.AttributeAttachmentLevelEnum;
import com.stat4you.statistics.dsd.dto.AttributeDefinitionDto;
import com.stat4you.statistics.dsd.dto.DimensionDto;

public class DigitalAgendaEuropeCsvParser {

    private static String CSV_SEPARATOR = ";";

    private enum CsHeaderType {
        DIMENSION, PRIMARY_MEASURE, ATTRIBUTE;
    }

    /**
     * Transform csv file with observations and attributes of observations
     */
    public static DigitalAgendaEuropeCsvData toData(InputStream dataStream, String charsetName, String locale) throws Exception {

        BufferedReader bufferedReader = null;
        try {
            bufferedReader = getBufferedReader(dataStream, charsetName);

            // Identifiers of dimensions, primary measure and attributes
            List<String> dimensionsIdentifiers = getDimensionIdentifiers();
            String primaryMeasureIdentifier = getPrimaryMeasureIdentifier();
            List<String> attributeObservationsIdentifiers = getAttributesObservationsIdentifiers();
            List<String> codesDimensionsIgnored = getCodeDimensionsIgnored();

            DigitalAgendaEuropeCsvData csvModel = new DigitalAgendaEuropeCsvData();
            Map<String, DimensionDto> dimensions = new HashMap<String, DimensionDto>();
            Map<Integer, DimensionDto> dimensionsByPosition = new HashMap<Integer, DimensionDto>();
            Map<String, List<String>> codesDimensionByDimensionIdentifier = new HashMap<String, List<String>>();
            Map<Integer, String> attributesByPosition = new HashMap<Integer, String>();

            // Header line
            String line = bufferedReader.readLine();
            String[] values = toArray(line);
            List<CsHeaderType> headerTypes = new ArrayList<CsHeaderType>(values.length);
            for (int i = 0; i < values.length; i++) {
                String value = values[i];
                if (dimensionsIdentifiers.contains(value)) {
                    headerTypes.add(CsHeaderType.DIMENSION);
                    DimensionDto dimension = new DimensionDto();
                    dimension.setIdentifier(value);
                    csvModel.getDimensions().add(dimension);
                    dimensions.put(value, dimension);
                    dimensionsByPosition.put(Integer.valueOf(i), dimension);
                } else if (primaryMeasureIdentifier.equals(value)) {
                    headerTypes.add(CsHeaderType.PRIMARY_MEASURE);
                } else if (attributeObservationsIdentifiers.contains(value)) {
                    headerTypes.add(CsHeaderType.ATTRIBUTE);
                    attributesByPosition.put(Integer.valueOf(i), value);

                    AttributeDefinitionDto attributeDefinitionDto = new AttributeDefinitionDto();
                    attributeDefinitionDto.setAttachmentLevel(AttributeAttachmentLevelEnum.OBSERVATION);
                    attributeDefinitionDto.setIdentifier(value);
                    csvModel.getAttributesObservations().add(attributeDefinitionDto);
                } else {
                    throw new Exception("Error parsing csv: header is not identified: " + value);
                }
            }

            // Data lines
            while ((line = bufferedReader.readLine()) != null) {
                values = toArray(line);
                ObservationExtendedDto observation = new ObservationExtendedDto();
                for (int i = 0; i < values.length; i++) {
                    String value = values[i];
                    if (StringUtils.isBlank(value)) {
                        continue;
                    }
                    if (CsHeaderType.DIMENSION.equals(headerTypes.get(i))) {
                        String codeDimensionId = value;
                        if (codesDimensionsIgnored.contains(codeDimensionId)) {
                            observation = null;
                            break; // do not insert these observations
                        }

                        // Code dimension
                        DimensionDto dimension = dimensionsByPosition.get(Integer.valueOf(i));
                        if (codesDimensionByDimensionIdentifier.get(dimension.getIdentifier()) == null) {
                            codesDimensionByDimensionIdentifier.put(dimension.getIdentifier(), new ArrayList<String>());
                        }
                        if (!codesDimensionByDimensionIdentifier.get(dimension.getIdentifier()).contains(codeDimensionId)) {
                            codesDimensionByDimensionIdentifier.get(dimension.getIdentifier()).add(codeDimensionId);
                            com.stat4you.statistics.dsd.dto.CodeDimensionDto codeDimensionDto = new com.stat4you.statistics.dsd.dto.CodeDimensionDto();
                            codeDimensionDto.setIdentifier(codeDimensionId);
                            dimension.addCode(codeDimensionDto);
                        }

                        // Observation
                        observation.getCodesDimension().add(new CodeDimensionDto(dimension.getIdentifier(), codeDimensionId));
                    } else if (CsHeaderType.PRIMARY_MEASURE.equals(headerTypes.get(i))) {
                        observation.setPrimaryMeasure(value);
                    } else if (CsHeaderType.ATTRIBUTE.equals(headerTypes.get(i))) {
                        String attributeIdentifier = attributesByPosition.get(Integer.valueOf(i));
                        InternationalStringDto attributeLabel = new InternationalStringDto();
                        LocalisedStringDto localisedStringDto = new LocalisedStringDto();
                        localisedStringDto.setLabel(value);
                        localisedStringDto.setLocale(locale);
                        attributeLabel.addText(localisedStringDto);
                        observation.addAttribute(new AttributeBasicDto(attributeIdentifier, attributeLabel));
                    } else {
                        throw new Exception("Error parsing csv: value in line is not identified: " + value);
                    }
                }
                if (observation != null) {
                    if (observation.getCodesDimension().size() != csvModel.getDimensions().size()) {
                        throw new Exception("Error parsing csv: observation has not all dimensions: " + line);
                    }
                    csvModel.getObservations().add(observation);
                }
            }
            return csvModel;
        } finally {
            bufferedReader.close();
        }
    }

    /**
     * Parse attributes of sources.csv to reuse in indicators.csv
     */
    public static Map<String, List<AttributeDto>> toAttributesSources(InputStream sourcesStream, String charsetName, String locale) throws Exception {

        BufferedReader bufferedReader = null;
        try {
            bufferedReader = getBufferedReader(sourcesStream, charsetName);

            List<String> attributesSupported = getAttributesDimensionsIdentifiers();
            List<String> attributesIgnored = getAttributesDimensionsIdentifiersIgnored();

            Map<String, List<AttributeDto>> attributesSources = new HashMap<String, List<AttributeDto>>();

            // Header line
            String line = bufferedReader.readLine();
            String[] values = toArray(line);

            Map<Integer, String> attributesByPosition = new HashMap<Integer, String>();
            for (int i = 1; i < values.length; i++) {
                attributesByPosition.put(Integer.valueOf(i), values[i]);
            }

            // Attributes lines
            while ((line = bufferedReader.readLine()) != null) {
                values = toArray(line);
                String attributeCode = values[0];
                attributesSources.put(attributeCode, new ArrayList<AttributeDto>());
                for (int i = 1; i < values.length; i++) {
                    String value = values[i];
                    if (StringUtils.isBlank(value)) {
                        continue;
                    }
                    String attributeIdentifier = attributesByPosition.get(Integer.valueOf(i));
                    if (attributesIgnored.contains(attributeIdentifier)) {
                        continue;
                    }
                    if (!attributesSupported.contains(attributeIdentifier)) {
                        throw new IllegalArgumentException("Attribute not identified: " + attributeIdentifier);
                    }
                    AttributeDto attribute = new AttributeDto();
                    attribute.setAttributeId(attributeIdentifier);
                    attribute.setValue(getInternationalString(value, locale));
                    attributesSources.get(attributeCode).add(attribute);
                }
            }
            return attributesSources;
        } finally {
            bufferedReader.close();
        }
    }

    /**
     * Parse dimensions attributes of indicators.csv
     */
    public static List<AttributeDto> toAttributesIndicators(InputStream indicatorsStream, String charsetName, String locale, Map<String, List<AttributeDto>> attributesExtensive) throws Exception {

        BufferedReader bufferedReader = null;
        try {
            bufferedReader = getBufferedReader(indicatorsStream, charsetName);

            List<String> attributesSupported = getAttributesDimensionsIdentifiers();
            List<String> attributesIgnored = getAttributesDimensionsIdentifiersIgnored();
            String dimensionIdentifier = DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER;

            List<AttributeDto> attributes = new ArrayList<AttributeDto>();

            // Header line
            String line = bufferedReader.readLine();
            String[] values = toArray(line);

            Map<Integer, String> attributesByPosition = new HashMap<Integer, String>();
            for (int i = 1; i < values.length; i++) {
                attributesByPosition.put(Integer.valueOf(i), values[i]);
            }
            // Attributes lines
            while ((line = bufferedReader.readLine()) != null) {
                values = toArray(line);
                String codeDimensionIdentifier = values[0];
                for (int i = 1; i < values.length; i++) {
                    String value = values[i];
                    if (StringUtils.isBlank(value)) {
                        continue;
                    }
                    String attributeIdentifier = attributesByPosition.get(Integer.valueOf(i));
                    if (attributesIgnored.contains(attributeIdentifier)) {
                        continue;
                    }
                    if (!attributesSupported.contains(attributeIdentifier)) {
                        throw new IllegalArgumentException("Attribute not identified: " + attributeIdentifier);
                    }
                    AttributeDto attribute = new AttributeDto();
                    attribute.setAttributeId(attributeIdentifier);
                    attribute.setValue(getInternationalString(value, locale));
                    attribute.addCodesDimension(new CodeDimensionDto(dimensionIdentifier, codeDimensionIdentifier));
                    attributes.add(attribute);

                    // If attribute belongs to extensive attributes, add additional attributes
                    if (attributesExtensive.containsKey(value)) {
                        for (AttributeDto attributeAdditionalSource : attributesExtensive.get(value)) {
                            AttributeDto attributeAdditional = new AttributeDto();
                            attributeAdditional.setAttributeId(attributeAdditionalSource.getAttributeId());
                            attributeAdditional.setValue(attributeAdditionalSource.getValue());
                            attributeAdditional.addCodesDimension(new CodeDimensionDto(dimensionIdentifier, codeDimensionIdentifier));
                            attributes.add(attributeAdditional);
                        }
                    }
                }
            }

            return attributes;
        } finally {
            bufferedReader.close();
        }
    }

    private static BufferedReader getBufferedReader(InputStream stream, String charsetName) throws Exception {
        return new BufferedReader(new InputStreamReader(stream, charsetName));
    }

    private static String[] toArray(String value) throws Exception {
        String[] values = value.split(CSV_SEPARATOR, -1); // -1 to returns empty columns
        return values;
    }

    private static List<String> getDimensionIdentifiers() {
        List<String> dimensionsIdentifiers = new ArrayList<String>();
        dimensionsIdentifiers.add(DigitalAgendaEuropeCsvConstants.TIME_DIMENSION_IDENTIFIER);
        dimensionsIdentifiers.add(DigitalAgendaEuropeCsvConstants.GEOGRAPHIC_DIMENSION_IDENTIFIER);
        dimensionsIdentifiers.add(DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER);
        return dimensionsIdentifiers;
    }

    private static List<String> getAttributesObservationsIdentifiers() {
        List<String> attributeObservationsIdentifiers = new ArrayList<String>();
        attributeObservationsIdentifiers.add(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_UNIT);
        attributeObservationsIdentifiers.add(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_FLAGS);
        attributeObservationsIdentifiers.add(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_NOTE);
        return attributeObservationsIdentifiers;
    }

    private static String getPrimaryMeasureIdentifier() {
        return DigitalAgendaEuropeCsvConstants.PRIMARY_MEASURE;
    }

    private static List<String> getAttributesDimensionsIdentifiers() {
        List<String> attributesSupported = new ArrayList<String>();
        attributesSupported.add(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_UNIT);
        attributesSupported.add(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_VARIABLE_CAPTION);
        attributesSupported.add(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_LONG_LABEL);
        attributesSupported.add(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_SHORT_LABEL);
        attributesSupported.add(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATORS_GROUP);
        attributesSupported.add(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_DEFINITION_SCOPE_NOTES);
        attributesSupported.add(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_SOURCE_CODE);
        attributesSupported.add(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_SOURCE_LABEL);
        attributesSupported.add(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_SOURCE_LINKS);
        attributesSupported.add(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_SOURCE_LAST_VERSION_USED);
        return attributesSupported;
    }

    private static List<String> getAttributesDimensionsIdentifiersIgnored() {
        List<String> attributesIgnored = new ArrayList<String>();
        attributesIgnored.add(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_IGNORED_ORDER);
        return attributesIgnored;
    }
    
    private static List<String> getCodeDimensionsIgnored() {
        List<String> dimensionsIdentifiers = new ArrayList<String>();
        dimensionsIdentifiers.add(DigitalAgendaEuropeCsvConstants.CODE_DIMENSION_IGNORED_MK);
        dimensionsIdentifiers.add(DigitalAgendaEuropeCsvConstants.CODE_DIMENSION_IGNORED_RS);
        return dimensionsIdentifiers;
    }


    private static InternationalStringDto getInternationalString(String label, String locale) {
        InternationalStringDto internationalString = new InternationalStringDto();
        LocalisedStringDto localisedStringDto = new LocalisedStringDto();
        localisedStringDto.setLabel(label);
        localisedStringDto.setLocale(locale);
        internationalString.addText(localisedStringDto);
        return internationalString;
    }
}
