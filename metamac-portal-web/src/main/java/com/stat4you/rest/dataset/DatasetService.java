package com.stat4you.rest.dataset;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.stat4you.normalizedvalues.dto.CategoryDto;
import com.stat4you.normalizedvalues.dto.LanguageDto;
import com.stat4you.normalizedvalues.service.NormalizedValuesService;
import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.util.UriComponentsBuilder;

import com.arte.statistic.dataset.repository.dto.AttributeDto;
import com.arte.statistic.dataset.repository.dto.ConditionDimensionDto;
import com.arte.statistic.dataset.repository.dto.ObservationExtendedDto;
import com.stat4you.idxmanager.domain.DatasetBasicIdx;
import com.stat4you.idxmanager.exception.IdxManagerException;
import com.stat4you.idxmanager.service.search.SearchService;
import com.stat4you.rest.domain.Data;
import com.stat4you.rest.domain.Dataset;
import com.stat4you.rest.domain.DatasetDB;
import com.stat4you.rest.domain.Metadata;
import com.stat4you.rest.transform.DatasetTransform;
import com.stat4you.statistics.data.service.DataService;
import com.stat4you.statistics.dsd.dto.AttributeDefinitionDto;
import com.stat4you.statistics.dsd.dto.DatasetBasicDto;
import com.stat4you.statistics.dsd.dto.DimensionBasicDto;
import com.stat4you.statistics.dsd.dto.DimensionDto;
import com.stat4you.statistics.dsd.dto.ProviderDto;
import com.stat4you.statistics.dsd.service.DsdService;

@Controller("datasetService")
public class DatasetService extends RestBaseService {

    @Autowired
    private DsdService    dsdService    = null;

    @Autowired
    private DataService   dataService   = null;

    @Autowired
    private SearchService searchService = null;

    @Autowired
    private NormalizedValuesService normalizedValuesService = null;

    /**
     * @throws ApplicationException
     */
    @RequestMapping(value = "/api/NOMBRE_API/v1.0/providers/{providerAcronym}/datasets", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<DatasetBasicIdx>> retrieveDatasets(final @PathVariable("providerAcronym") String providerAcronym) throws ApplicationException, IdxManagerException {
        // TODO el método no debería devolver el DTO sino una entidad de dominio rest??
        // ServiceContext ctx = getServiceContext();

        List<DatasetBasicIdx> datasets = searchService.findLastPublishedDatasetsByProvider(providerAcronym, 20);
        ResponseEntity<List<DatasetBasicIdx>> responseEntity = new ResponseEntity<List<DatasetBasicIdx>>(datasets, HttpStatus.OK);
        return responseEntity;
    }

    /**
     * @throws ApplicationException
     */
    @RequestMapping(value = "/api/NOMBRE_API/v1.0/providers/{providerAcronym}/datasets/{datasetId}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Dataset> retrieveDataset(
            final @PathVariable("providerAcronym") String providerAcronym,
            final @PathVariable("datasetId") String datasetId,
            final @RequestParam(required = false) String dim,
            final @RequestParam(required = false) String[] lang,
            final @RequestParam(required = false) String fields,
            final UriComponentsBuilder uriComponentsBuilder) throws ApplicationException {

        ServiceContext ctx = getServiceContext();

        DatasetBasicDto datasetBasicDto = dsdService.retrieveDatasetBasicPublishedByIdentifier(ctx, providerAcronym, datasetId);
        String[] selectedLocales = lang;
        if (ArrayUtils.isEmpty(selectedLocales)) {
            selectedLocales = datasetBasicDto.getLanguages().toArray(new String[datasetBasicDto.getLanguages().size()]);
        }

        // TODO Esto sólo se tendría que poner en los datos, pero se estan usando a la hora de crear los atributos. 
        //List<AttributeDto> attributeDtoList = dataService.findAttributes(ctx, datasetBasicDto.getUri());
        List<AttributeDto> attributeDtoList = new ArrayList<AttributeDto>();
        
        Metadata metadata = null;
        Data data = null;
        
        // TODO debe invocarse a retrieveDatasetPublished...
        // SEARCH
        if (fields == null || !fields.contains("-metadata")) {
            List<AttributeDefinitionDto> attributeDefinitionDtoList = dsdService.retrieveDatasetAttributeDefinitions(ctx, datasetBasicDto.getUri());
            List<DimensionDto> dimensionDtoList = dsdService.retrieveDatasetDimensions(ctx, datasetBasicDto.getUri());
            ProviderDto providerDto = dsdService.retrieveProvider(ctx, datasetBasicDto.getProviderUri());

            List<LanguageDto> languages = new ArrayList<LanguageDto>();
            for (String language_code : datasetBasicDto.getLanguages()) {
                languages.add(normalizedValuesService.retrieveLanguage(getServiceContext(), language_code));
            }

            List<CategoryDto> categories = new ArrayList<CategoryDto>();
            for (String category_code : datasetBasicDto.getCategories()) {
                categories.add(normalizedValuesService.retrieveCategory(getServiceContext(), category_code));
            }

            DatasetDB datasetDB = new DatasetDB();
            datasetDB.setSelectedLocales(selectedLocales);
            datasetDB.setProviderDto(providerDto);
            datasetDB.setDataset(datasetBasicDto);
            datasetDB.setDimensions(dimensionDtoList);
            datasetDB.setAttributeValues(attributeDtoList);
            datasetDB.setAttributeDefinitions(attributeDefinitionDtoList);
            datasetDB.setLanguages(languages);
            datasetDB.setCategories(categories);
            
            metadata = DatasetTransform.generateMetadata(datasetDB);
        }

        if (fields == null || !fields.contains("-data")) {            
            Map<String, List<String>> selectedDimensions = parseDimExpression(dim);
            List<ConditionDimensionDto> conditions = generateConditions(selectedDimensions);
    
            List<DimensionBasicDto> dimensionBasicDtoList = dsdService.retrieveDatasetDimensionsBasics(ctx, datasetBasicDto.getUri());
            Map<String, ObservationExtendedDto> observationDtoMap = dataService.findObservationsExtendedByDimensions(ctx, datasetBasicDto.getUri(), conditions);
            
            DatasetDB datasetDB = new DatasetDB();
            datasetDB.setServiceContext(ctx);
            datasetDB.setDsdService(dsdService);
            
            datasetDB.setDimensionsBasic(dimensionBasicDtoList);
            datasetDB.setSelectedLocales(selectedLocales);
            datasetDB.setSelectedDimensions(selectedDimensions);
            datasetDB.setAttributeValues(attributeDtoList);
            datasetDB.setObservations(observationDtoMap);
            
            data = DatasetTransform.generateData(datasetDB);
        }


        // GENERATE RESPONSE
        Dataset dataset = new Dataset();
        dataset.setSelectedLanguages(Arrays.asList(selectedLocales));
        dataset.setMetadata(metadata);
        dataset.setData(data);        
        ResponseEntity<Dataset> responseEntity = new ResponseEntity<Dataset>(dataset, HttpStatus.OK);
        return responseEntity;
    }

    @SuppressWarnings("unchecked")
    private Map<String, List<String>> parseDimExpression(String dimExpression) {
        if (StringUtils.isBlank(dimExpression)) {
            return MapUtils.EMPTY_MAP;
        }

        // dimExpression = MOTIVOS_ESTANCIA:000|001|002:ISLAS_DESTINO_PRINCIPAL:005|006
        Pattern patternDimension = Pattern.compile("(\\w+):(([\\w\\|-])+)");
        Pattern patternCode = Pattern.compile("([\\w-]+)\\|?");

        Matcher matcherDimension = patternDimension.matcher(dimExpression);

        Map<String, List<String>> selectedDimension = new HashMap<String, List<String>>();
        while (matcherDimension.find()) {
            String dimIdentifier = matcherDimension.group(1);
            String codes = matcherDimension.group(2);
            Matcher matcherCode = patternCode.matcher(codes);
            while (matcherCode.find()) {
                List<String> codeDimensions = selectedDimension.get(dimIdentifier);
                if (codeDimensions == null) {
                    codeDimensions = new ArrayList<String>();
                    selectedDimension.put(dimIdentifier, codeDimensions);
                }
                String codeIdentifier = matcherCode.group(1);
                codeDimensions.add(codeIdentifier);
            }
        }
        return selectedDimension;
    }

    // Recursive method to get all the conditions from the given dimentions
    // ---
    private List<ConditionDimensionDto> generateConditions(Map<String, List<String>> selectedDimension) {
        List<ConditionDimensionDto> conditionDimensionDtos = new ArrayList<ConditionDimensionDto>();

        for (Entry<String, List<String>> entry : selectedDimension.entrySet()) {
            ConditionDimensionDto conditionDimensionDto = new ConditionDimensionDto();
            conditionDimensionDto.setDimensionId(entry.getKey());
            for (String value : entry.getValue()) {
                conditionDimensionDto.getCodesDimension().add(value);
            }
            conditionDimensionDtos.add(conditionDimensionDto);
        }

        return conditionDimensionDtos;
    }

}
