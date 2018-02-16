package org.siemac.metamac.portal.core.invocation.mapper;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;
import org.siemac.metamac.rest.common.v1_0.domain.LocalisedString;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.CodeRepresentation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.CodeRepresentations;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Data;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DatasetMetadata;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dimension;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionRepresentation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionRepresentations;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionType;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionValues;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dimensions;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.EnumeratedDimensionValue;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.EnumeratedDimensionValues;

import es.gobcan.istac.indicators.rest.types.DataDimensionType;
import es.gobcan.istac.indicators.rest.types.DataType;
import es.gobcan.istac.indicators.rest.types.IndicatorDataDimensionTypeEnum;
import es.gobcan.istac.indicators.rest.types.IndicatorType;
import es.gobcan.istac.indicators.rest.types.MetadataDimensionType;
import es.gobcan.istac.indicators.rest.types.MetadataRepresentationType;
import es.gobcan.istac.indicators.rest.util.RequestUtil;

/* Don't map all the fields, only the ones needed to export */
public class IndicatorsRestExternalMapper {

    private static final String LOCALE_SPANISH                 = "es";
    private static final String DATASET_OBSERVATIONS_SEPARATOR = " | ";

    public static Dataset indicatorToDatasetMapper(IndicatorType indicator, DataType data) {
        Dataset dataset = new Dataset();

        dataset.setName(indicatorInternationalTextToInternationalString(indicator.getTitle()));
        dataset.setMetadata(indicatorDataToDatasetMetadata(indicator, data));
        dataset.setData(indicatorDataToDatasetData(data));

        return dataset;
    }

    private static DatasetMetadata indicatorDataToDatasetMetadata(IndicatorType indicator, DataType data) {
        DatasetMetadata datasetMetadata = new DatasetMetadata();
        datasetMetadata.setVersion(indicator.getVersion());
        datasetMetadata.setDimensions(indicatorMetadataDimensionsToDatasetMetadataDimensions(indicator.getDimension()));
        return datasetMetadata;
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
        Map<String, List<String>> dimensionsSelectionsMap = RequestUtil.parseParamExpression(dimensionsSelections);

        List<String> selectedRepresentations = new ArrayList<String>();
        for (Map.Entry<String, List<String>> dimensionSelection : dimensionsSelectionsMap.entrySet()) {
            StringBuilder selectedRepresentation = new StringBuilder();
            selectedRepresentations.add(selectedRepresentation.append(dimensionSelection.getKey()).append("[").append(StringUtils.join(dimensionSelection.getValue(), "|")).append("]").toString());
        }
        return StringUtils.join(selectedRepresentations, ',');
    }

}
