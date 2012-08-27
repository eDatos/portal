package com.stat4you.job.importation.idescat.processor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.namespace.QName;

import org.apache.abdera.Abdera;
import org.apache.abdera.ext.opensearch.OpenSearchConstants;
import org.apache.abdera.ext.opensearch.model.IntegerElement;
import org.apache.abdera.model.Category;
import org.apache.abdera.model.Document;
import org.apache.abdera.model.Element;
import org.apache.abdera.model.Entry;
import org.apache.abdera.model.ExtensibleElement;
import org.apache.abdera.model.Feed;
import org.apache.abdera.protocol.Response.ResponseType;
import org.apache.abdera.protocol.client.AbderaClient;
import org.apache.abdera.protocol.client.ClientResponse;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.CoreProtocolPNames;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Assert;

import com.arte.statistic.dataset.repository.dto.AttributeBasicDto;
import com.arte.statistic.dataset.repository.dto.AttributeDto;
import com.arte.statistic.dataset.repository.dto.ObservationExtendedDto;
import com.stat4you.common.dto.InternationalStringDto;
import com.stat4you.common.dto.LocalisedStringDto;
import com.stat4you.importation.processor.StatisticProcessor;
import com.stat4you.statistics.dsd.domain.AttributeAttachmentLevelEnum;
import com.stat4you.statistics.dsd.domain.DatasetSourceEnum;
import com.stat4you.statistics.dsd.domain.DimensionTypeEnum;
import com.stat4you.statistics.dsd.dto.AttributeDefinitionDto;
import com.stat4you.statistics.dsd.dto.CodeDimensionDto;
import com.stat4you.statistics.dsd.dto.DatasetDto;
import com.stat4you.statistics.dsd.dto.DimensionDto;
import com.stat4you.statistics.dsd.dto.PrimaryMeasureDto;
import com.stat4you.statistics.dsd.dto.ResourceIdentierDto;

public class IdescatPobDatasetProcessor implements StatisticProcessor {
    
    private static final Logger                                                                   LOG                         = LoggerFactory.getLogger(IdescatPobDatasetProcessor.class);

    public static final String                                                                    USER_AGENT                  = "Apache-Droids/1.1 (java 1.5)";

    public static final String                                                                    IDENTIFIER                  = "CERCA";

    public static final String                                                                    LANG_ES                     = "es";
    public static final String                                                                    LANG_EN                     = "en";
    public static final String                                                                    LANG_CA                     = "ca";

    public static final String                                                                    DIM_AREA                    = "AREA";

    public static final String                                                                    DIM_SEX                     = "SEX";
    public static final String                                                                    DIM_SEX_CODE_MALE           = "M";
    public static final String                                                                    DIM_SEX_CODE_FEMALE         = "F";
    public static final String                                                                    DIM_SEX_CODE_TOTAL          = "T";

    public static final String                                                                    DIM_TIME_PERIOD             = "TIME_PERIOD";

    public static final String                                                                    DIM_FREQ                    = "FREQ";

    public static final String                                                                    ATT_OBS_STATUS              = "OBS_STATUS";
    public static final String                                                                    ATT_UNIT_MULT               = "UNIT_MULT";
    public static final String                                                                    ATT_DECIMALS                = "DECIMALS";

    public static final QName                                                                     CROSS_DATA_SET              = new QName("http://www.idescat.cat/-/cross/1.0/", "DataSet");
    public static final QName                                                                     CROSS_SECTION               = new QName("http://www.idescat.cat/-/cross/1.0/", "Section");
    public static final QName                                                                     CROSS_OBSERVATION           = new QName("http://www.idescat.cat/-/cross/1.0/", "Obs");
    public static final String                                                                    FEED_ATT_AREA               = "AREA";
    public static final String                                                                    FEED_ATT_SEX                = "SEX";
    public static final String                                                                    FEED_ATT_OBS_VALUE          = "OBS_VALUE";
    public static final String                                                                    FEED_ATT_TIME_PERIOD        = "TIME_PERIOD";
    public static final String                                                                    FEED_ATT_FREQ               = "FREQ";
    public static final String                                                                    FEED_ATT_OBS_STATUS         = "OBS_STATUS";
    public static final String                                                                    FEED_ATT_UNIT_MULT          = "UNIT_MULT";

    private boolean                                                                               initialized                 = false;

    private String                                                                                feedUrl                     = null;
    private String                                                                                providerUri                 = null;
    private DatasetDto                                                                            datasetDto                  = null;
    private List<ObservationExtendedDto>                                                          observationExtendedDtos     = null;

    private Map<String, DimensionDto>                                                             structureDimensionMap       = new HashMap<String, DimensionDto>();
    private Map<String, Map<String, CodeDimensionDto>>                                            structureCodeDimensionMap   = new HashMap<String, Map<String, CodeDimensionDto>>();

    private Map<String, Map<String, com.arte.statistic.dataset.repository.dto.CodeDimensionDto>>  dataCodeDimensionMap        = new HashMap<String, Map<String, com.arte.statistic.dataset.repository.dto.CodeDimensionDto>>();
    private Map<String, com.arte.statistic.dataset.repository.dto.CodeDimensionDto>               dataCurrentCodeDimensionMap = new HashMap<String, com.arte.statistic.dataset.repository.dto.CodeDimensionDto>();

    private Map<String, Map<String, com.arte.statistic.dataset.repository.dto.AttributeBasicDto>> dataAttributeMap            = new HashMap<String, Map<String, com.arte.statistic.dataset.repository.dto.AttributeBasicDto>>();
    private Map<String, com.arte.statistic.dataset.repository.dto.AttributeBasicDto>              dataCurrentAttributeMap     = new HashMap<String, com.arte.statistic.dataset.repository.dto.AttributeBasicDto>();

    private final HttpClient                                                                      httpclient;

    private static final List<String>                                                             SUPPORTED_POBLATION_TYPE    = Arrays.asList("CAT", "PROV", "ATP", "COM", "MUN");

    public IdescatPobDatasetProcessor() {
        this(new DefaultHttpClient(), null, null);
    }

    public IdescatPobDatasetProcessor(final String feedUrl, final String providerUri) {
        this(new DefaultHttpClient(), feedUrl, providerUri);
    }

    public IdescatPobDatasetProcessor(final HttpClient httpclient, final String feedUrl, final String providerUri) {
        super();
        this.httpclient = httpclient;
        this.httpclient.getParams().setParameter(CoreProtocolPNames.USER_AGENT, USER_AGENT);

        this.feedUrl = feedUrl;
        this.providerUri = providerUri;
    }

    public String getFeedUrl() {
        return feedUrl;
    }

    public void setFeedUrl(String feedUrl) {
        this.feedUrl = feedUrl;
    }

    public String getProviderUri() {
        return providerUri;
    }

    public void setProviderUri(String providerUri) {
        this.providerUri = providerUri;
    }
    
    @Override
    public String getUrl() {
        return this.feedUrl;
    }

    @Override
    public void processDataset(Callback<DatasetDto> callback) {
        if (!initialized) {
            init();
        }
        callback.register(datasetDto);
    }

    @Override
    public void processObservations(Callback<ObservationExtendedDto> callback) {
        if (!initialized) {
            init();
        }

        for (ObservationExtendedDto observationExtendedDto : observationExtendedDtos) {
            callback.register(observationExtendedDto);
        }
    }

    @Override
    public void processAttributes(Callback<AttributeDto> callback) {
        if (!initialized) {
            init();
        }

        // TODO Ver qué hacemos con estos atributos.
        // Estos atributos no se parsean ya que están puestos a nivel de Dataset
        // y se está generando una combinación de muchos
        AttributeDto unitMult = new AttributeDto();
        unitMult.setAttributeId(ATT_UNIT_MULT);
        unitMult.setValue(getInternationalStringArte("0"));

        AttributeDto unitDecimals = new AttributeDto();
        unitDecimals.setAttributeId(ATT_DECIMALS);
        unitDecimals.setValue(getInternationalStringArte("0"));

        callback.register(unitMult);
        callback.register(unitDecimals);

    }

    private void init() {
        if (initialized) {
            return;
        }
        
        LOG.info("Initializing IdescatPobDatasetProcessor. Feed: {}", feedUrl);
        observationExtendedDtos = new ArrayList<ObservationExtendedDto>();

        AbderaClient client = new AbderaClient(Abdera.getInstance());

        boolean hashNext = true;
        int currentIndex = 0;
        int totalResulsts = 0;
        int itemPerPage = 0;
        String currentFeedUrl = feedUrl;
        while (hashNext) {
            LOG.info("Processing Feed: {}", currentFeedUrl);

            ClientResponse resp = client.get(currentFeedUrl);
            if (resp.getType() != ResponseType.SUCCESS) {
                throw new RuntimeException("Error retrieving: " + feedUrl + " - " + resp.getStatusText());
            }

            Document<Feed> doc = resp.getDocument();
            Feed feed = doc.getRoot();

            if (datasetDto == null) {
                processFeedFirst(feed);
                datasetDto.setUrl(feedUrl);

                IntegerElement totalResulstsElement = feed.getExtension(OpenSearchConstants.TOTAL_RESULTS);
                IntegerElement itemPerPageElement = feed.getExtension(OpenSearchConstants.ITEMS_PER_PAGE);
                totalResulsts = totalResulstsElement.getValue();
                itemPerPage = itemPerPageElement.getValue();
            }

            processFeed(feed);

            // Next
            currentIndex += itemPerPage;
            currentFeedUrl = feedUrl + "?posicio=" + currentIndex;
            if (currentIndex >= totalResulsts) {
                hashNext = false;
            }
        }

        initialized = true;
        LOG.info("Finish initializing IdescatPobDatasetProcessor. Feed: {}", feedUrl);
    }

    private void processFeedFirst(Feed feed) {

        // TODO EXTERNALIZAR LOS TEXTOS A UN FICHERO

        datasetDto = new DatasetDto();

        String titleES = "Población por sexo de cualquier entidad territorial de Cataluña.";
        String titleEN = "Population by sex for any territorial entity in Catalonia.";
        String titleCA = "Població per sexe de qualsevol entitat territorial de Catalunya.";
        datasetDto.setTitle(getInternationalString(titleES, titleEN, titleCA));

        // datasetDto.setDescription(getInternationalString("Dataset description 1"));
        datasetDto.setProviderUri(providerUri);
        datasetDto.setSource(DatasetSourceEnum.MANUAL); // TODO MANUAL???
        datasetDto.setFrequency("No se actualiza"); // TODO
        datasetDto.setLanguage(LANG_CA);
        datasetDto.getLanguages().add(LANG_CA); // PONEMOS Estos IDIOMAS?
        datasetDto.getLanguages().add(LANG_ES);
        datasetDto.getLanguages().add(LANG_EN);
        
        // PRIMARY DATASET
        PrimaryMeasureDto primaryMeasure = new PrimaryMeasureDto();
        primaryMeasure.setIdentifier("OBS_VALUE");
        primaryMeasure.setTitle(getInternationalString("Valor de la observación", "Observation value", "Valor de l'observació"));
        datasetDto.setPrimaryMeasure(primaryMeasure);

        // TODO PONER ESTO
        datasetDto.setProviderPublishingDate(new DateTime(feed.getUpdatedElement().getText())); // TODO Usamos la fecha de actualización para esto?? --> actualización
        datasetDto.setProviderReleaseDate(null);
        datasetDto.setIdentifier(IDENTIFIER); // TODO este es el identificador semático??

        // Dimensions
        // SEX
        CodeDimensionDto maleCode = new CodeDimensionDto();
        maleCode.setIdentifier(DIM_SEX_CODE_MALE);
        maleCode.setTitle(getInternationalString("Másculino", "Male", "Masculí"));

        CodeDimensionDto femaleCode = new CodeDimensionDto();
        femaleCode.setIdentifier(DIM_SEX_CODE_FEMALE);
        femaleCode.setTitle(getInternationalString("Femenino", "Female", "Femení"));

        CodeDimensionDto totalCode = new CodeDimensionDto();
        totalCode.setIdentifier(DIM_SEX_CODE_TOTAL);
        totalCode.setTitle(getInternationalString("Total", "Total", "Total"));

        DimensionDto dimensionSEX = new DimensionDto();
        dimensionSEX.setIdentifier(DIM_SEX);
        dimensionSEX.setType(DimensionTypeEnum.DIMENSION);
        dimensionSEX.setTitle(getInternationalString("Sexo", "Sex", "Sexe"));
        dimensionSEX.addCode(maleCode);
        dimensionSEX.addCode(femaleCode);
        dimensionSEX.addCode(totalCode);

        // TIME PERIOD
        DimensionDto dimensionTimePeriod = new DimensionDto();
        dimensionTimePeriod.setIdentifier(DIM_TIME_PERIOD);
        dimensionTimePeriod.setType(DimensionTypeEnum.TIME_DIMENSION);
        dimensionTimePeriod.setTitle(getInternationalString("Periodo Temporal", "Time Period", "Període Temporal"));

        // FREQ
        DimensionDto dimensionFreq = new DimensionDto();
        dimensionFreq.setIdentifier(DIM_FREQ);
        dimensionFreq.setType(DimensionTypeEnum.DIMENSION);
        dimensionFreq.setTitle(getInternationalString("Frecuencia", "Frequency", "Freqüència"));

        // OBS_STATUS="A" Atributo a nivel de observación
        // TODO UNIT_MULT="0" DECIMALS="0" Atributos a nivel de dimensión AREA TIME_PERIOD FREQ

        // POBLATION
        DimensionDto dimensionArea = new DimensionDto();
        dimensionArea.setIdentifier(DIM_AREA);
        dimensionArea.setType(DimensionTypeEnum.GEOGRAPHIC_DIMENSION);
        dimensionArea.setTitle(getInternationalString("Población", "Population", "Població"));

        datasetDto.addDimension(dimensionSEX);
        datasetDto.addDimension(dimensionTimePeriod);
        datasetDto.addDimension(dimensionFreq);
        datasetDto.addDimension(dimensionArea);
        
        structureDimensionMap.put(DIM_SEX, dimensionSEX);
        structureDimensionMap.put(DIM_TIME_PERIOD, dimensionTimePeriod);
        structureDimensionMap.put(DIM_FREQ, dimensionFreq);
        structureDimensionMap.put(DIM_AREA, dimensionArea);

        // -- ATTRIBUTES --
        ResourceIdentierDto areaIdentifierDto = new ResourceIdentierDto();
        areaIdentifierDto.setIdentifier(DIM_AREA);
        ResourceIdentierDto timePeriodIdentifierDto = new ResourceIdentierDto();
        timePeriodIdentifierDto.setIdentifier(DIM_TIME_PERIOD);
        ResourceIdentierDto freqIdentifierDto = new ResourceIdentierDto();
        freqIdentifierDto.setIdentifier(DIM_FREQ);

        // OBS_STATUS
        AttributeDefinitionDto attributeDefinitionObsStatus = new AttributeDefinitionDto();
        attributeDefinitionObsStatus.setIdentifier(ATT_OBS_STATUS);
        attributeDefinitionObsStatus.setAttachmentLevel(AttributeAttachmentLevelEnum.OBSERVATION);
        attributeDefinitionObsStatus.setTitle(getInternationalString("TODO: OBSSTATUS")); // TODO Qué título le ponemos
        datasetDto.addAttributeDefinition(attributeDefinitionObsStatus);

        // ATT_UNIT_MULT
        AttributeDefinitionDto attributeDefinitionUnitMult = new AttributeDefinitionDto();
        attributeDefinitionUnitMult.setIdentifier(ATT_UNIT_MULT);
        attributeDefinitionUnitMult.setAttachmentLevel(AttributeAttachmentLevelEnum.DIMENSION);
        attributeDefinitionUnitMult.setTitle(getInternationalString("TODO: UNIT_MULT")); // TODO Qué título le ponemos
        attributeDefinitionUnitMult.addAttachmentDimension(areaIdentifierDto);
        attributeDefinitionUnitMult.addAttachmentDimension(timePeriodIdentifierDto);
        attributeDefinitionUnitMult.addAttachmentDimension(freqIdentifierDto);
        datasetDto.addAttributeDefinition(attributeDefinitionUnitMult);

        // ATT_DECIMALS
        AttributeDefinitionDto attributeDefinitionDecimals = new AttributeDefinitionDto();
        attributeDefinitionDecimals.setIdentifier(ATT_DECIMALS);
        attributeDefinitionDecimals.setAttachmentLevel(AttributeAttachmentLevelEnum.DIMENSION);
        attributeDefinitionDecimals.setTitle(getInternationalString("TODO: ATT_DECIMALS")); // TODO Qué título le ponemos
        attributeDefinitionDecimals.addAttachmentDimension(areaIdentifierDto);
        attributeDefinitionDecimals.addAttachmentDimension(timePeriodIdentifierDto);
        attributeDefinitionDecimals.addAttachmentDimension(freqIdentifierDto);
        datasetDto.addAttributeDefinition(attributeDefinitionDecimals);

        // DATA
        com.arte.statistic.dataset.repository.dto.CodeDimensionDto sexCodeMaleDto = new com.arte.statistic.dataset.repository.dto.CodeDimensionDto();
        sexCodeMaleDto.setDimensionId(DIM_SEX);
        sexCodeMaleDto.setCodeDimensionId(DIM_SEX_CODE_MALE);

        com.arte.statistic.dataset.repository.dto.CodeDimensionDto sexCodeFemaleDto = new com.arte.statistic.dataset.repository.dto.CodeDimensionDto();
        sexCodeFemaleDto.setDimensionId(DIM_SEX);
        sexCodeFemaleDto.setCodeDimensionId(DIM_SEX_CODE_FEMALE);

        com.arte.statistic.dataset.repository.dto.CodeDimensionDto sexCodeTotalDto = new com.arte.statistic.dataset.repository.dto.CodeDimensionDto();
        sexCodeTotalDto.setDimensionId(DIM_SEX);
        sexCodeTotalDto.setCodeDimensionId(DIM_SEX_CODE_TOTAL);

        Map<String, com.arte.statistic.dataset.repository.dto.CodeDimensionDto> dimensioMap = getDataCodeDimensionMap(DIM_SEX);
        dimensioMap.put(DIM_SEX_CODE_MALE, sexCodeMaleDto);
        dimensioMap.put(DIM_SEX_CODE_FEMALE, sexCodeFemaleDto);
        dimensioMap.put(DIM_SEX_CODE_TOTAL, sexCodeTotalDto);
    }

    private void processFeed(Feed feed) {
        for (Entry entry : feed.getEntries()) {
            ExtensibleElement dataset = entry.getExtension(CROSS_DATA_SET);
            ExtensibleElement section = dataset.getExtension(CROSS_SECTION);

            boolean processed = processAreaDimension(entry, dataset, section); 
            if (!processed) {
                continue;
            }
            processTimePeriodDimension(entry, dataset, section);
            processFreqDimension(entry, dataset, section);

            List<Element> observationsElement = section.getExtensions(CROSS_OBSERVATION);
            for (Element observationElement : observationsElement) {

                processSexDimension(observationElement);

                processAttributeObsStatus(observationElement);

                String obsValue = observationElement.getAttributeValue(FEED_ATT_OBS_VALUE);

                ObservationExtendedDto observationExtendedDto = new ObservationExtendedDto();
                observationExtendedDto.setPrimaryMeasure(obsValue);
                observationExtendedDto.addCodesDimension(dataCurrentCodeDimensionMap.get(DIM_SEX));
                observationExtendedDto.addCodesDimension(dataCurrentCodeDimensionMap.get(DIM_TIME_PERIOD));
                observationExtendedDto.addCodesDimension(dataCurrentCodeDimensionMap.get(DIM_FREQ));
                observationExtendedDto.addCodesDimension(dataCurrentCodeDimensionMap.get(DIM_AREA));

                if (dataCurrentAttributeMap.get(ATT_OBS_STATUS) != null) {
                    observationExtendedDto.addAttribute(dataCurrentAttributeMap.get(ATT_OBS_STATUS));
                }

                observationExtendedDtos.add(observationExtendedDto);
            }
        }
    }
    private boolean processAreaDimension(Entry entry, ExtensibleElement dataset, ExtensibleElement section) {
        String poblationType = StringUtils.EMPTY;
        for (Category category : entry.getCategories()) {
            if (!category.getTerm().startsWith("sim")) {
                poblationType = category.getTerm();
            }
        }

        String areaCode = section.getAttributeValue(FEED_ATT_AREA);

        Assert.notNull(areaCode, "Dimension AREA is required");
        
        if (!SUPPORTED_POBLATION_TYPE.contains(poblationType)) {
            return false;
        }

        String identifier = poblationType + areaCode;

        // STRUCTURAL
        CodeDimensionDto structureAreaCode = getStructureCodeDimensionMap(DIM_AREA).get(identifier);
        if (structureAreaCode == null) {
            structureAreaCode = new CodeDimensionDto();
            structureAreaCode.setTitle(getInternationalString(entry.getTitle()));
            structureAreaCode.setIdentifier(identifier);

            structureDimensionMap.get(DIM_AREA).addCode(structureAreaCode);
            getStructureCodeDimensionMap(DIM_AREA).put(identifier, structureAreaCode);
        }

        // DATA
        com.arte.statistic.dataset.repository.dto.CodeDimensionDto dataAreaCode = getDataCodeDimensionMap(DIM_AREA).get(identifier);
        if (dataAreaCode == null) {
            dataAreaCode = new com.arte.statistic.dataset.repository.dto.CodeDimensionDto();
            dataAreaCode.setDimensionId(DIM_AREA);
            dataAreaCode.setCodeDimensionId(identifier);

            getDataCodeDimensionMap(DIM_AREA).put(identifier, dataAreaCode);
        }

        dataCurrentCodeDimensionMap.put(DIM_AREA, dataAreaCode);
        return true;
    }

    private void processTimePeriodDimension(Entry entry, ExtensibleElement dataset, ExtensibleElement section) {
        String timePeriodCode = section.getAttributeValue(FEED_ATT_TIME_PERIOD);

        Assert.notNull(timePeriodCode, "Dimension TIME PERIOD is required");

        // STRUCTURAL
        CodeDimensionDto structureTimePeriodCode = getStructureCodeDimensionMap(DIM_TIME_PERIOD).get(timePeriodCode);
        if (structureTimePeriodCode == null) {
            structureTimePeriodCode = new CodeDimensionDto();
            structureTimePeriodCode.setTitle(getInternationalString(timePeriodCode));
            structureTimePeriodCode.setIdentifier(timePeriodCode);

            structureDimensionMap.get(DIM_TIME_PERIOD).addCode(structureTimePeriodCode);
            getStructureCodeDimensionMap(DIM_TIME_PERIOD).put(timePeriodCode, structureTimePeriodCode);
        }

        // DATA
        com.arte.statistic.dataset.repository.dto.CodeDimensionDto dataTimePeriodCodeDto = getDataCodeDimensionMap(DIM_TIME_PERIOD).get(timePeriodCode);
        if (dataTimePeriodCodeDto == null) {
            dataTimePeriodCodeDto = new com.arte.statistic.dataset.repository.dto.CodeDimensionDto();
            dataTimePeriodCodeDto.setDimensionId(DIM_TIME_PERIOD);
            dataTimePeriodCodeDto.setCodeDimensionId(timePeriodCode);

            getDataCodeDimensionMap(DIM_TIME_PERIOD).put(timePeriodCode, dataTimePeriodCodeDto);
        }

        dataCurrentCodeDimensionMap.put(DIM_TIME_PERIOD, dataTimePeriodCodeDto);
    }

    private void processFreqDimension(Entry entry, ExtensibleElement dataset, ExtensibleElement section) {
        String freqCode = section.getAttributeValue(FEED_ATT_FREQ);

        Assert.notNull(freqCode, "Dimension FREQ is required");

        // STRUCTURAL
        CodeDimensionDto structureFreqCode = getStructureCodeDimensionMap(DIM_FREQ).get(freqCode);
        if (structureFreqCode == null) {
            structureFreqCode = new CodeDimensionDto();
            structureFreqCode.setTitle(getInternationalString(freqCode));
            structureFreqCode.setIdentifier(freqCode);

            structureDimensionMap.get(DIM_FREQ).addCode(structureFreqCode);
            getStructureCodeDimensionMap(DIM_FREQ).put(freqCode, structureFreqCode);
        }

        // DATA
        com.arte.statistic.dataset.repository.dto.CodeDimensionDto dataFreqCode = getDataCodeDimensionMap(DIM_FREQ).get(freqCode);
        if (dataFreqCode == null) {
            dataFreqCode = new com.arte.statistic.dataset.repository.dto.CodeDimensionDto();
            dataFreqCode.setDimensionId(DIM_FREQ);
            dataFreqCode.setCodeDimensionId(freqCode);

            getDataCodeDimensionMap(DIM_FREQ).put(freqCode, dataFreqCode);
        }

        dataCurrentCodeDimensionMap.put(DIM_FREQ, dataFreqCode);
    }

    private void processSexDimension(Element element) {
        String sexCode = element.getAttributeValue(FEED_ATT_SEX);

        Assert.notNull(sexCode, "Dimension SEX is required");

        com.arte.statistic.dataset.repository.dto.CodeDimensionDto dataSexCodeDto = getDataCodeDimensionMap(DIM_SEX).get(sexCode);
        if (dataSexCodeDto == null) {
            throw new RuntimeException("Unknow sex code: " + sexCode);
        }

        dataCurrentCodeDimensionMap.put(DIM_SEX, dataSexCodeDto);
    }

    private void processAttributeObsStatus(Element element) {
        String obsStatus = element.getAttributeValue(FEED_ATT_OBS_STATUS);
        if (obsStatus == null) {
            dataCurrentAttributeMap.put(ATT_OBS_STATUS, null);
            return;
        }

        // Caching OBS_STATUS
        com.arte.statistic.dataset.repository.dto.AttributeBasicDto dataAttributeDto = getDataAttributeMap(ATT_OBS_STATUS).get(obsStatus);
        if (dataAttributeDto == null) {
            dataAttributeDto = new AttributeBasicDto();
            dataAttributeDto.setAttributeId(ATT_OBS_STATUS);
            dataAttributeDto.setValue(getInternationalStringArte(obsStatus));
            getDataAttributeMap(ATT_OBS_STATUS).put(obsStatus, dataAttributeDto);
        }

        dataCurrentAttributeMap.put(ATT_OBS_STATUS, dataAttributeDto);
    }

    private Map<String, com.arte.statistic.dataset.repository.dto.CodeDimensionDto> getDataCodeDimensionMap(String dim) {
        Map<String, com.arte.statistic.dataset.repository.dto.CodeDimensionDto> map = dataCodeDimensionMap.get(dim);
        if (map == null) {
            map = new HashMap<String, com.arte.statistic.dataset.repository.dto.CodeDimensionDto>();
            dataCodeDimensionMap.put(dim, map);
        }
        return map;
    }

    private Map<String, CodeDimensionDto> getStructureCodeDimensionMap(String dim) {
        Map<String, CodeDimensionDto> map = structureCodeDimensionMap.get(dim);
        if (map == null) {
            map = new HashMap<String, CodeDimensionDto>();
            structureCodeDimensionMap.put(dim, map);
        }
        return map;
    }

    private Map<String, AttributeBasicDto> getDataAttributeMap(String key) {
        Map<String, AttributeBasicDto> map = dataAttributeMap.get(key);
        if (map == null) {
            map = new HashMap<String, AttributeBasicDto>();
            dataAttributeMap.put(key, map);
        }
        return map;
    }

    private com.arte.statistic.dataset.repository.dto.InternationalStringDto getInternationalStringArte(String text) {
        return getInternationalStringArte(text, text, text);
    }

    private com.arte.statistic.dataset.repository.dto.InternationalStringDto getInternationalStringArte(String textES, String textEN, String textCA) {
        com.arte.statistic.dataset.repository.dto.InternationalStringDto internationalStringDto = new com.arte.statistic.dataset.repository.dto.InternationalStringDto();
        com.arte.statistic.dataset.repository.dto.LocalisedStringDto es = new com.arte.statistic.dataset.repository.dto.LocalisedStringDto();
        es.setLabel(textES);
        es.setLocale(LANG_ES);
        com.arte.statistic.dataset.repository.dto.LocalisedStringDto en = new com.arte.statistic.dataset.repository.dto.LocalisedStringDto();
        en.setLabel(textEN);
        en.setLocale(LANG_EN);
        com.arte.statistic.dataset.repository.dto.LocalisedStringDto ca = new com.arte.statistic.dataset.repository.dto.LocalisedStringDto();
        ca.setLabel(textCA);
        ca.setLocale(LANG_CA);
        internationalStringDto.addText(es);
        internationalStringDto.addText(en);
        internationalStringDto.addText(ca);
        return internationalStringDto;
    }

    private InternationalStringDto getInternationalString(String text) {
        return getInternationalString(text, text, text);
    }

    private InternationalStringDto getInternationalString(String textES, String textEN, String textCA) {
        InternationalStringDto internationalStringDto = new InternationalStringDto();
        LocalisedStringDto es = new LocalisedStringDto();
        es.setLabel(textES);
        es.setLocale(LANG_ES);
        LocalisedStringDto en = new LocalisedStringDto();
        en.setLabel(textEN);
        en.setLocale(LANG_EN);
        LocalisedStringDto ca = new LocalisedStringDto();
        ca.setLabel(textCA);
        ca.setLocale(LANG_CA);
        internationalStringDto.addText(es);
        internationalStringDto.addText(en);
        internationalStringDto.addText(ca);
        return internationalStringDto;
    }

    public static class IdescatPobDatasetCallback implements Callback<DatasetDto> {

        private DatasetDto datasetDto = null;

        @Override
        public void register(DatasetDto item) {
            this.datasetDto = item;

        }

        public DatasetDto getDataset() {
            return this.datasetDto;
        }
    };

    public static class IdescatPobObservationExtendedDtoCallback implements Callback<ObservationExtendedDto> {

        private List<ObservationExtendedDto> observationExtendedDtos = new ArrayList<ObservationExtendedDto>();

        @Override
        public void register(ObservationExtendedDto item) {
            this.observationExtendedDtos.add(item);
        }

        public List<ObservationExtendedDto> getObservationsExtendeds() {
            return observationExtendedDtos;
        }

    };

    public static class IdescatPobAttributeDtoCallback implements Callback<AttributeDto> {

        private List<AttributeDto> attributes = new ArrayList<AttributeDto>();

        @Override
        public void register(AttributeDto item) {
            this.attributes.add(item);
        }

        public List<AttributeDto> getAttributes() {
            return attributes;
        }

    };
}
