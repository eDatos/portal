package org.siemac.metamac.portal.core.invocation.mapper;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;
import org.siemac.metamac.rest.common.v1_0.domain.LocalisedString;
import org.siemac.metamac.rest.common.v1_0.domain.Resource;
import org.siemac.metamac.rest.common.v1_0.domain.Resources;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.CodeRepresentation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.CodeRepresentations;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Data;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DataStructureDefinition;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DatasetMetadata;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dimension;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionRepresentation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionRepresentations;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionType;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionValues;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dimensions;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionsId;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.EnumeratedDimensionValue;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.EnumeratedDimensionValues;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.NextVersionType;

import es.gobcan.istac.indicators.rest.types.DataDimensionType;
import es.gobcan.istac.indicators.rest.types.DataType;
import es.gobcan.istac.indicators.rest.types.IndicatorDataDimensionTypeEnum;
import es.gobcan.istac.indicators.rest.types.IndicatorInstanceType;
import es.gobcan.istac.indicators.rest.types.IndicatorType;
import es.gobcan.istac.indicators.rest.types.MetadataDimensionType;
import es.gobcan.istac.indicators.rest.types.MetadataRepresentationType;

/* Don't map all the fields, only the ones needed to export */
public class IndicatorsRestExternalMapper {

    private static final String LOCALE_SPANISH                 = "es";
    private static final String DATASET_OBSERVATIONS_SEPARATOR = " | ";

    public static Dataset indicatorToDatasetMapper(IndicatorType indicator, DataType data) {
        Dataset dataset = indicatorToDatasetBaseMapper(indicator.getId(), indicator.getTitle(), data);
        dataset.setMetadata(indicatorMetadataToDatasetMetadata(indicator));
        return dataset;
    }

    public static Dataset indicatorInstanceToDatasetMapper(IndicatorInstanceType indicatorInstance, DataType data) {
        Dataset dataset = indicatorToDatasetBaseMapper(indicatorInstance.getSystemCode(), indicatorInstance.getTitle(), data);
        dataset.setMetadata(indicatorInstanceMetadataToDatasetMetadata(indicatorInstance));
        return dataset;
    }

    private static Dataset indicatorToDatasetBaseMapper(String id, Map<String, String> title, DataType data) {
        Dataset dataset = new Dataset();
        dataset.setId(id);
        dataset.setName(indicatorInternationalTextToInternationalString(title));
        dataset.setData(indicatorDataToDatasetData(data));
        return dataset;
    }

    private static DatasetMetadata indicatorInstanceMetadataToDatasetMetadata(IndicatorInstanceType indicatorInstance) {
        return indicatorBaseMetadataToDatasetMetadata(null, indicatorInstance.getDimension(), indicatorInstance.getTitle());
    }

    private static DatasetMetadata indicatorMetadataToDatasetMetadata(IndicatorType indicator) {
        return indicatorBaseMetadataToDatasetMetadata(indicator.getVersion(), indicator.getDimension(), indicator.getTitle());
    }

    private static DatasetMetadata indicatorBaseMetadataToDatasetMetadata(String version, Map<String, MetadataDimensionType> dimension, Map<String, String> title) {
        DatasetMetadata datasetMetadata = new DatasetMetadata();
        datasetMetadata.setVersion(version);
        datasetMetadata.setDimensions(indicatorMetadataDimensionsToDatasetMetadataDimensions(dimension));
        datasetMetadata.setRightsHolder(mockRightsHolder());
        datasetMetadata.setLanguages(indicatorLanguagesFromLocalisedStringToDatasetLanguages(title));
        datasetMetadata.setNextVersion(mockNextVersion());
        datasetMetadata.setRelatedDsd(buildRelatedDsd());
        datasetMetadata.setPublishers(mockPublishers());
        datasetMetadata.setStatisticalOperation(mockStatisticalOperation());
        return datasetMetadata;
    }

    private static Resource mockStatisticalOperation() {
        Resource statisticalOperation = new Resource();
        statisticalOperation.setName(new InternationalString());
        return statisticalOperation;
    }

    private static Resources mockPublishers() {
        Resources publishers = new Resources();
        return publishers;
    }

    private static DataStructureDefinition buildRelatedDsd() {
        DataStructureDefinition relatedDsd = new DataStructureDefinition();
        relatedDsd.setShowDecimals(mockShowDecimals());
        relatedDsd.setHeading(buildIndicatorHeading());
        relatedDsd.setStub(buildIndicatorStub());
        return relatedDsd;
    }

    // Always this values for indicators
    private static DimensionsId buildIndicatorHeading() {
        DimensionsId heading = new DimensionsId();
        heading.getDimensionIds().add(IndicatorDataDimensionTypeEnum.GEOGRAPHICAL.getName());
        heading.getDimensionIds().add(IndicatorDataDimensionTypeEnum.MEASURE.getName());
        return heading;
    }

    // Always this values for indicators
    private static DimensionsId buildIndicatorStub() {
        DimensionsId stub = new DimensionsId();
        stub.getDimensionIds().add(IndicatorDataDimensionTypeEnum.TIME.getName());
        return stub;
    }

    private static int mockShowDecimals() {
        return 2;
    }

    private static NextVersionType mockNextVersion() {
        // FIXME
        return NextVersionType.NO_UPDATES;
    }

    // This will be later used on org.siemac.metamac.portal.core.exporters.PxExporter.writeLanguages. We don´t need the full resource, only the id, so we´ll build a mocked one for it
    private static Resources indicatorLanguagesFromLocalisedStringToDatasetLanguages(Map<String, String> localisedString) {
        List<String> languagesIds = calculateLanguagesFromIndicatorLocalisedString(localisedString);
        Resources languages = new Resources();
        for (String languageId : languagesIds) {
            Resource language = new Resource();
            language.setId(languageId);
            languages.getResources().add(language);
        }
        languages.setTotal(BigInteger.valueOf(languagesIds.size()));
        return languages;
    }

    // Take a look at es.gobcan.istac.indicators.rest.mapper.MapperUtil
    private static List<String> calculateLanguagesFromIndicatorLocalisedString(Map<String, String> localisedString) {
        String DEFAULT = "__default__";
        List<String> languages = new ArrayList<String>();
        for (String language : localisedString.keySet()) {
            if (!DEFAULT.equals(language)) {
                languages.add(language);
            }
        }
        return languages;
    }

    // FIXME
    private static Resource mockRightsHolder() {
        Resource rightsHolder = new Resource();
        rightsHolder.setName(buildLocalizedSpanishText("ISTAC"));
        return rightsHolder;
    }

    private static Dimensions indicatorMetadataDimensionsToDatasetMetadataDimensions(Map<String, MetadataDimensionType> metadataDimensions) {
        Dimensions datasetMetadataDimensions = new Dimensions();
        for (Map.Entry<String, MetadataDimensionType> entry : metadataDimensions.entrySet()) {
            datasetMetadataDimensions.getDimensions().add(indicatorMetadataDimensionToDatasetMetadataDimension(entry.getKey(), entry.getValue()));
        }
        datasetMetadataDimensions.setTotal(BigInteger.valueOf(metadataDimensions.size()));
        return datasetMetadataDimensions;
    }

    private static Dimension indicatorMetadataDimensionToDatasetMetadataDimension(String index, MetadataDimensionType metadataDimension) {
        Dimension datasetMetadataDimension = new Dimension();
        datasetMetadataDimension.setId(index);
        datasetMetadataDimension.setName(buildLocalizedSpanishText(metadataDimension.getCode()));
        datasetMetadataDimension.setType(buildDimensionFromIndicatorDimensionCode(metadataDimension.getCode()));
        datasetMetadataDimension.setDimensionValues(indicatorMetadataDimensionRepresentationsToDatasetMetadataDimensionValues(metadataDimension.getRepresentation()));
        return datasetMetadataDimension;
    }

    private static DimensionValues indicatorMetadataDimensionRepresentationsToDatasetMetadataDimensionValues(List<MetadataRepresentationType> representations) {
        EnumeratedDimensionValues datasetDimensionValues = new EnumeratedDimensionValues();
        for (MetadataRepresentationType metadataRepresentation : representations) {
            datasetDimensionValues.getValues().add(indicatorMetadataDimensionRepresentationToDatasetMetadataDimensionValue(metadataRepresentation));
        }
        datasetDimensionValues.setTotal(BigInteger.valueOf(representations.size()));
        return datasetDimensionValues;
    }

    private static EnumeratedDimensionValue indicatorMetadataDimensionRepresentationToDatasetMetadataDimensionValue(MetadataRepresentationType metadataRepresentation) {
        EnumeratedDimensionValue datasetDimensionValue = new EnumeratedDimensionValue();
        datasetDimensionValue.setId(metadataRepresentation.getCode());
        datasetDimensionValue.setName(indicatorInternationalTextToInternationalString(metadataRepresentation.getTitle()));
        return datasetDimensionValue;
    }

    private static InternationalString indicatorInternationalTextToInternationalString(Map<String, String> indicatorInternationalText) {
        InternationalString internationalString = new InternationalString();
        for (Map.Entry<String, String> entry : indicatorInternationalText.entrySet()) {
            LocalisedString localisedString = new LocalisedString();
            localisedString.setLang(entry.getKey());
            localisedString.setValue(entry.getValue());
            internationalString.getTexts().add(localisedString);
        }
        return internationalString;
    }

    private static DimensionType buildDimensionFromIndicatorDimensionCode(String code) {
        switch (IndicatorDataDimensionTypeEnum.valueOf(code)) {
            case GEOGRAPHICAL:
                return DimensionType.GEOGRAPHIC_DIMENSION;
            case MEASURE:
                return DimensionType.MEASURE_DIMENSION;
            case TIME:
                return DimensionType.TIME_DIMENSION;
            default:
                return null;
        }
    }

    private static InternationalString buildLocalizedSpanishText(String code) {
        if (code == null) {
            return null;
        }
        LocalisedString spanishLocalisedString = new LocalisedString();
        spanishLocalisedString.setLang(LOCALE_SPANISH);
        spanishLocalisedString.setValue(code);
        InternationalString internationalString = new InternationalString();
        internationalString.getTexts().add(spanishLocalisedString);
        return internationalString;
    }

    private static Data indicatorDataToDatasetData(DataType data) {
        if (data == null) {
            return null;
        }
        Data datasetData = new Data();

        datasetData.setObservations(indicatorObservationsToDatasetObservations(data.getObservation()));
        datasetData.setDimensions(indicatorDimensionsToDatasetDimensions(data.getDimension()));

        return datasetData;
    }

    private static String indicatorObservationsToDatasetObservations(List<String> observation) {
        return String.join(DATASET_OBSERVATIONS_SEPARATOR, observation);
    }

    private static DimensionRepresentations indicatorDimensionsToDatasetDimensions(Map<String, DataDimensionType> dataDimensions) {
        DimensionRepresentations dimensionRepresentations = new DimensionRepresentations();

        for (Map.Entry<String, DataDimensionType> entry : dataDimensions.entrySet()) {
            dimensionRepresentations.getDimensions().add(indicatorDataDimensionToDatasetDimensionRepresentation(entry.getKey(), entry.getValue()));
        }
        return dimensionRepresentations;
    }

    private static DimensionRepresentation indicatorDataDimensionToDatasetDimensionRepresentation(String index, DataDimensionType dataDimension) {
        DimensionRepresentation dimensionRepresentation = new DimensionRepresentation();
        dimensionRepresentation.setDimensionId(index);
        dimensionRepresentation.setRepresentations(indicatorDataDimensionTypeToDatasetCodeRepresentations(dataDimension));
        return dimensionRepresentation;
    }

    private static CodeRepresentations indicatorDataDimensionTypeToDatasetCodeRepresentations(DataDimensionType dataDimension) {
        CodeRepresentations codeRepresentations = new CodeRepresentations();
        codeRepresentations.setTotal(BigInteger.valueOf(dataDimension.getRepresentation().getSize()));
        for (Map.Entry<String, Integer> entry : dataDimension.getRepresentation().getIndex().entrySet()) {
            CodeRepresentation codeRepresentation = new CodeRepresentation();
            codeRepresentation.setCode(entry.getKey());
            codeRepresentation.setIndex(entry.getValue());
            codeRepresentations.getRepresentations().add(codeRepresentation);
        }
        return codeRepresentations;
    }

    public static String dimensionSelectionToSelectedRepresentations(String dimensionsSelections) {
        Map<String, List<String>> dimensionsSelectionsMap = parseDimensionExpression(dimensionsSelections);

        List<String> selectedRepresentations = new ArrayList<String>();
        for (Map.Entry<String, List<String>> dimensionSelection : dimensionsSelectionsMap.entrySet()) {
            StringBuilder selectedRepresentation = new StringBuilder();
            selectedRepresentations.add(selectedRepresentation.append(dimensionSelection.getKey()).append("[").append(StringUtils.join(dimensionSelection.getValue(), "|")).append("]").toString());
        }
        return StringUtils.join(selectedRepresentations, ',');
    }


    private static final Pattern patternDimension = Pattern.compile("(\\w+):(([\\w\\|-])+)");
    private static final Pattern patternCode      = Pattern.compile("([\\w-]+)\\|?");

    /**
     * Parse dimension expression from request
     * Sample: MOTIVOS_ESTANCIA:000|001|002:ISLAS_DESTINO_PRINCIPAL:005|006
     * Cloned from org.siemac.metamac.statistical_resources.rest.external.service.utils.StatisticalResourcesRestExternalUtils.parseDimensionExpression(String)
     */
    public static Map<String, List<String>> parseDimensionExpression(String dimExpression) {
        if (StringUtils.isBlank(dimExpression)) {
            return Collections.emptyMap();
        }

        Matcher matcherDimension = patternDimension.matcher(dimExpression);
        Map<String, List<String>> selectedDimension = new HashMap<String, List<String>>();
        while (matcherDimension.find()) {
            String dimensionIdentifier = matcherDimension.group(1);
            String codes = matcherDimension.group(2);
            Matcher matcherCode = patternCode.matcher(codes);
            while (matcherCode.find()) {
                List<String> codeDimensions = selectedDimension.get(dimensionIdentifier);
                if (codeDimensions == null) {
                    codeDimensions = new ArrayList<String>();
                    selectedDimension.put(dimensionIdentifier, codeDimensions);
                }
                String codeIdentifier = matcherCode.group(1);
                codeDimensions.add(codeIdentifier);
            }
        }
        return selectedDimension;
    }

}
