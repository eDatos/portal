package com.stat4you.rest.transform;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Stack;

import com.stat4you.normalizedvalues.dto.CategoryDto;
import com.stat4you.normalizedvalues.dto.LanguageDto;
import com.stat4you.rest.domain.*;
import com.stat4you.statistics.dsd.domain.DimensionTypeEnum;
import org.apache.commons.lang3.StringUtils;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;

import com.arte.statistic.dataset.repository.dto.AttributeBasicDto;
import com.arte.statistic.dataset.repository.dto.AttributeDto;
import com.arte.statistic.dataset.repository.dto.ObservationExtendedDto;
import com.stat4you.common.dto.InternationalStringDto;
import com.stat4you.statistics.dsd.dto.AttributeDefinitionDto;
import com.stat4you.statistics.dsd.dto.CodeDimensionDto;
import com.stat4you.statistics.dsd.dto.DatasetBasicDto;
import com.stat4you.statistics.dsd.dto.DimensionBasicDto;
import com.stat4you.statistics.dsd.dto.DimensionDto;
import com.stat4you.statistics.dsd.dto.ProviderDto;
import com.stat4you.statistics.dsd.service.DsdService;
import com.stat4you.rest.domain.Data;
import com.stat4you.rest.domain.DataDimension;
import com.stat4you.rest.domain.Dataset;
import com.stat4you.rest.domain.DatasetDB;
import com.stat4you.rest.domain.Metadata;
import com.stat4you.rest.domain.MetadataAttribute;
import com.stat4you.rest.domain.MetadataDimension;
import com.stat4you.rest.domain.MetadataRepresentation;

public class DatasetTransform {

    public static Dataset generate(DatasetDB datasetDB) throws ApplicationException {
        Metadata metadata = generateMetadata(datasetDB);
        Data data = generateData(datasetDB);

        Dataset datasetResult = new Dataset();
        datasetResult.setSelectedLanguages(Arrays.asList(datasetDB.getSelectedLocales()));
        datasetResult.setMetadata(metadata);
        datasetResult.setData(data);
        return datasetResult;
    }

    public static Metadata generateMetadata(DatasetDB datasetDB) {
        DatasetBasicDto dataset = datasetDB.getDataset();
        String[] selectedLocales = datasetDB.getSelectedLocales();
        ProviderDto providerDto = datasetDB.getProviderDto();
        List<AttributeDefinitionDto> attributeDefinitions = datasetDB.getAttributeDefinitions();
        List<DimensionDto> dimensions = datasetDB.getDimensions();

        List<String> metadataGeographicalCoverages = new ArrayList<String>();
        List<String> metadataTemporalCoverages = new ArrayList<String>();
        List<String> metadataDimensionIds = new ArrayList<String>();
        Map<String, List<String>> metadataDimensionLabels = new LinkedHashMap<String, List<String>>();
        Map<String, List<String>> metadataRepresentationIds = new LinkedHashMap<String, List<String>>();
        Map<String, Map<String, List<String>>> metadataRepresentationLabels = new LinkedHashMap<String, Map<String, List<String>>>();
        Map<String, MetadataAttribute> metadataAttributes = new LinkedHashMap<String, MetadataAttribute>();

        // DIMENSIONS
        for (DimensionDto dimensionDto : dimensions) {
            switch (dimensionDto.getType()) {
                // TODO: CONTEMPLAR MEASURE_DIMENSION
                
                case GEOGRAPHIC_DIMENSION:
                    metadataGeographicalCoverages.add(dimensionDto.getIdentifier());
                    break;
                case TIME_DIMENSION:
                    metadataTemporalCoverages.add(dimensionDto.getIdentifier());
                    break;
            }
            metadataDimensionIds.add(dimensionDto.getIdentifier());
            metadataDimensionLabels.put(dimensionDto.getIdentifier(), getLocalisedLabel(dimensionDto.getTitle(), selectedLocales));

            List<String> metadataRepresentationIdByDimension = new ArrayList<String>();
            Map<String, List<String>> metadataRepresentationLabelByDimension = new LinkedHashMap<String, List<String>>();

            metadataRepresentationIds.put(dimensionDto.getIdentifier(), metadataRepresentationIdByDimension);
            metadataRepresentationLabels.put(dimensionDto.getIdentifier(), metadataRepresentationLabelByDimension);

            for (int j = 0; j < dimensionDto.getCodes().size(); j++) {
                CodeDimensionDto codeDimensionDto = dimensionDto.getCodes().get(j);

                // METADATA
                metadataRepresentationIdByDimension.add(codeDimensionDto.getIdentifier());
                metadataRepresentationLabelByDimension.put(codeDimensionDto.getIdentifier(), getLocalisedLabel(codeDimensionDto.getTitle(), selectedLocales));
            }
        }

        // ATTRIBUTE DEFINITION
        for (AttributeDefinitionDto attributeDefinitionDto : attributeDefinitions) {
            MetadataAttribute metadataAttribute = new MetadataAttribute();
            // metadataAttribute.put("id", attributeDefinitionDto.getIdentifier());
            metadataAttribute.setTitle(getLocalisedLabel(attributeDefinitionDto.getTitle(), selectedLocales));
            metadataAttribute.setAttachmentLevel(attributeDefinitionDto.getAttachmentLevel());

            metadataAttributes.put(attributeDefinitionDto.getIdentifier(), metadataAttribute);
        }

        // TODO ===========================================================
        // TODO ESTA PROP SE TENDRÍA QUE SACAR DEL MODELO Y NO DE LOS DATOS
        List<AttributeDto> attributeValues = datasetDB.getAttributeValues();
        for (AttributeDto attributeDto : attributeValues) {
            MetadataAttribute metadataAttribute = metadataAttributes.get(attributeDto.getAttributeId());
            if (metadataAttribute == null) {
                continue;
            }

            List<String> list = new ArrayList<String>();
            for (com.arte.statistic.dataset.repository.dto.CodeDimensionDto codeDimensionDto : attributeDto.getCodesDimension()) {
                if (codeDimensionDto.getCodeDimensionId() != null && !list.contains(codeDimensionDto.getDimensionId())) {
                    list.add(codeDimensionDto.getDimensionId());
                }
            }
            if (list.size() > 0) {
                metadataAttribute.setAttachemntDimension(list);
            }
        }
        // TODO ===========================================================

        Metadata metadata = new Metadata();
        MetadataDimension metadataDimension = new MetadataDimension();
        MetadataRepresentation metadataRepresentation = new MetadataRepresentation();

        metadata.setModificationDate(dataset.getLastUpdated());
        metadata.setProviderModificationDate(dataset.getProviderPublishingDate());
        metadata.setTitle(getLocalisedLabel(dataset.getTitle(), selectedLocales));
        metadata.setDescription(getLocalisedLabel(dataset.getDescription(), selectedLocales));
        metadata.setPublisher("Stat4You");
        metadata.setReleaseDate(dataset.getReleaseDate());
        metadata.setProviderReleaseDate(dataset.getProviderReleaseDate());
        metadata.setFrequency(dataset.getFrequency());
        metadata.setIdentifier(dataset.getIdentifier());
        metadata.setGeographicalCoverage(metadataGeographicalCoverages);
        metadata.setTemporalCoverage(metadataTemporalCoverages);
        metadata.setLicense(getLocalisedLabel(providerDto.getLicense(), selectedLocales));
        metadata.setLicenseURL(providerDto.getLicenseUrl());
        metadata.setTheme(dataset.getCategories());
        metadata.setCreator(providerDto.getName());
        metadata.setCreatorAcronym(providerDto.getAcronym());

        metadata.setDimension(metadataDimension);
        metadata.setAttribute(metadataAttributes);

        metadataDimension.setId(metadataDimensionIds);
        metadataDimension.setLabel(metadataDimensionLabels);
        metadataDimension.setRepresentation(metadataRepresentation);

        metadataRepresentation.setId(metadataRepresentationIds);
        metadataRepresentation.setLabel(metadataRepresentationLabels);

        // REMOVE UNUSED
        if (metadataGeographicalCoverages.size() == 0) {
            metadata.setGeographicalCoverage(null);
        }

        if (metadataTemporalCoverages.size() == 0) {
            metadata.setTemporalCoverage(null);
        }


        //Language
        List<String> metadataLanguageId = new ArrayList<String>();
        Map<String, List<String>> metadataLanguageLabel = new HashMap<String, List<String>>();
        for(LanguageDto language : datasetDB.getLanguages()) {
            metadataLanguageId.add(language.getCode());
            List<String> labels = getLocalisedLabel(language.getValue(), selectedLocales);
            metadataLanguageLabel.put(language.getCode(), labels);
        }
        MetadataLanguage metadataLanguage = new MetadataLanguage();
        metadataLanguage.setId(metadataLanguageId);
        metadataLanguage.setLabel(metadataLanguageLabel);
        metadata.setLanguage(metadataLanguage);


        //Category
        if(datasetDB.getCategories() != null) {
            List<String> metadataCategoryId = new ArrayList<String>();
            Map<String, List<String>> metadataCategoryLabel = new HashMap<String, List<String>>();

            for(CategoryDto category : datasetDB.getCategories()) {
                String code = category.getCode();
                List<String> localisedLabel = getLocalisedLabel(category.getValue(), selectedLocales);
                metadataCategoryId.add(code);
                metadataCategoryLabel.put(code, localisedLabel);
            }
            MetadataCategory metadataCategory = new MetadataCategory();
            metadataCategory.setId(metadataCategoryId);
            metadataCategory.setLabel(metadataCategoryLabel);
            metadata.setCategory(metadataCategory);
        }

        // Measure Dimension

        DimensionDto measureDimensionDto = null;
        for (DimensionDto dimensionDto : dimensions) {
            if ((dimensionDto.getType()).equals(DimensionTypeEnum.MEASURE_DIMENSION)) {
                measureDimensionDto = dimensionDto;
                break;
            }
        }
        if(measureDimensionDto != null){
            metadata.setMeasureDimension(measureDimensionDto.getIdentifier());
        }


        return metadata;
    }

    public static Data generateData(DatasetDB datasetDB) throws ApplicationException {
        DsdService dsdService = datasetDB.getDsdService();
        
        Map<String, ObservationExtendedDto> datas = datasetDB.getObservations();
        String[] selectedLocales = datasetDB.getSelectedLocales();
        List<AttributeDto> attributeValues = datasetDB.getAttributeValues();
        List<DimensionBasicDto> dimensions = datasetDB.getDimensionsBasic();
        Map<String, List<String>> selectedDimensionsAux = datasetDB.getSelectedDimensions();        
        
        
        // Filter codeDimension
        Map<String, List<String>> dimensionsCodes = new HashMap<String, List<String>>();
        for (DimensionBasicDto dimensionDto : dimensions) {
            List<String> dimensionCodes = selectedDimensionsAux.get(dimensionDto.getIdentifier());
            List<String> dimensionCodesSelected = new ArrayList<String>();
            if (dimensionCodes == null || dimensionCodes.size() == 0) {
                List<CodeDimensionDto> codeDimensionDtos = dsdService.retrieveCodesDimension(datasetDB.getServiceContext(), dimensionDto.getUri());
                for (CodeDimensionDto codeDimensionDto : codeDimensionDtos) {
                    dimensionCodesSelected.add(codeDimensionDto.getIdentifier());                
                }
            } else {
                dimensionCodesSelected.addAll(dimensionCodes);
            }
            dimensionsCodes.put(dimensionDto.getIdentifier(), dimensionCodesSelected);
        }
        
        // Observation Size
        int sizeObservation = 1;
        for (DimensionBasicDto dimensionDto : datasetDB.getDimensionsBasic()) {
            sizeObservation = sizeObservation * dimensionsCodes.get(dimensionDto.getIdentifier()).size();
        }
        

        Map<String, Map<String, Object>> dataAttributes = new LinkedHashMap<String, Map<String, Object>>();
        List<String> dataObservations = new ArrayList<String>(sizeObservation);
        Map<String, Object[]> dataObservationsAttributes = new LinkedHashMap<String, Object[]>();
        Map<String, DataDimension> dataDimensions = new LinkedHashMap<String, DataDimension>();
        List<List<String>> dataFormat = new ArrayList<List<String>>();

        // ATTRIBUTE VALUES
        for (AttributeDto attributeDto : attributeValues) {
            // DATA
            Map<String, Object> dataAttributeData = (Map<String, Object>) dataAttributes.get(attributeDto.getAttributeId());
            if (dataAttributeData == null) {
                dataAttributeData = new LinkedHashMap<String, Object>();
                dataAttributes.put(attributeDto.getAttributeId(), dataAttributeData);
            }

            Map<String, Object> currentMap = dataAttributeData;
            for (com.arte.statistic.dataset.repository.dto.CodeDimensionDto codeDimensionDto : attributeDto.getCodesDimension()) {
                if (codeDimensionDto.getCodeDimensionId() != null) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> aux = (Map<String, Object>) currentMap.get(codeDimensionDto.getCodeDimensionId());
                    if (aux == null) {
                        aux = new LinkedHashMap<String, Object>();
                        currentMap.put(codeDimensionDto.getCodeDimensionId(), aux);
                    }
                    currentMap = aux;
                }
            }
            // TODO QUITAR ESTO NO TENDRÍA QUE AÑADIRSE el "VALUE" se tendría que añadir diréctamente al MAPA
            currentMap.put("VALUE", getLocalisedLabel(attributeDto.getValue(), selectedLocales));
        }

        // OBSERVATIONS (return sorted)
        Stack<OrderingStackElement> stack = new Stack<OrderingStackElement>();
        stack.push(new OrderingStackElement(StringUtils.EMPTY, -1));
        
        ArrayList<String> entryId = new ArrayList<String>(dimensions.size());
        for (int i=0; i<dimensions.size(); i++) {
            entryId.add(i, StringUtils.EMPTY);
        }

        int lastDim = dimensions.size() -1;
        int current = 0;
        while (stack.size() > 0) {
            // POP
            OrderingStackElement elem = stack.pop();
            int elemDim = elem.getDimNum();
            String elemCode = elem.getCodeId();
            
            // The first time we don't need a hash (#)
            if (elemDim != -1) {
                entryId.set(elemDim, elemCode);
            }
            
            // The entry is complete
            if (elemDim == lastDim) {
                //entryId.
                String id = StringUtils.join(entryId, "#");
            
                // We have the full entry here
                ObservationExtendedDto value = datas.get(id);
                if (value != null) {
                    dataObservations.add(value.getPrimaryMeasure());
                    for (AttributeBasicDto attributeBasicDto : value.getAttributes()) {
                        Object[] dataAttributeValues = (Object[]) dataObservationsAttributes.get(attributeBasicDto.getAttributeId());
                        if (dataAttributeValues == null) {
                            //dataAttributeValues = new Object[sizeObservation];
                            dataAttributeValues = new Object[sizeObservation];
                            dataObservationsAttributes.put(attributeBasicDto.getAttributeId(), dataAttributeValues);
                        }
                        dataAttributeValues[current] = getLocalisedLabel(attributeBasicDto.getValue(), selectedLocales);
                    }
                } else {
                    dataObservations.add(null); // Return observation full
                }
                entryId.set(elemDim, StringUtils.EMPTY);
                current++;
            } else {
                DimensionBasicDto dim = dimensions.get(elemDim + 1);
                List<String> dimensionCodes = dimensionsCodes.get(dim.getIdentifier());
                for (int i = dimensionCodes.size() - 1; i >= 0; i--) {
                    OrderingStackElement temp = new OrderingStackElement(dimensionCodes.get(i), elemDim + 1);
                    stack.push(temp);
                }
            }
        }

        // IDEX DIMENSION
        dataFormat.add(new ArrayList<String>(dimensions.size()));
        dataFormat.add(new ArrayList<String>(dimensions.size()));
        for (DimensionBasicDto dimensionDto : dimensions) {
            DataDimension dataDimension = new DataDimension();
            Map<String, Integer> dataDimensionRepresentation = new LinkedHashMap<String, Integer>();

            dataDimensions.put(dimensionDto.getIdentifier(), dataDimension);
            dataDimension.setRepresentationIndex(dataDimensionRepresentation);

            int codesSize = 0;
            for (String dimensioncode : dimensionsCodes.get(dimensionDto.getIdentifier())) {
                dataDimensionRepresentation.put(dimensioncode, codesSize);
                codesSize++;
            }

            dataFormat.get(0).add(dimensionDto.getIdentifier());
            dataFormat.get(1).add(String.valueOf(codesSize));
        }

        Data data = new Data();
        data.setAttribute(dataAttributes);
        data.setObservation(dataObservations);
        data.setObservationAttributes(dataObservationsAttributes);
        data.setFormat(dataFormat);
        data.setDimension(dataDimensions);
        return data;
    }

    private static List<String> getLocalisedLabel(InternationalStringDto internationalStringDto, String[] locales) {
        if (internationalStringDto == null || locales == null) {
            return null;
        }

        List<String> labels = new ArrayList<String>(locales.length);
        for (String locale : locales) {
            String label = internationalStringDto.getLocalisedLabel(locale);
            labels.add(label);
        }
        return labels;
    }

    private static List<String> getLocalisedLabel(com.arte.statistic.dataset.repository.dto.InternationalStringDto internationalStringDto, String[] locales) {
        if (internationalStringDto == null || locales == null) {
            return null;
        }

        List<String> labels = new ArrayList<String>(locales.length);
        for (String locale : locales) {
            String label = internationalStringDto.getLocalisedLabel(locale);
            labels.add(label);
        }
        return labels;
    }
}
