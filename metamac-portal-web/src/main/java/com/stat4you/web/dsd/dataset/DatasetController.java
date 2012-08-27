package com.stat4you.web.dsd.dataset;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.LocaleResolver;

import com.arte.statistic.dataset.repository.dto.AttributeDto;
import com.stat4you.normalizedvalues.dto.CategoryDto;
import com.stat4you.normalizedvalues.dto.LanguageDto;
import com.stat4you.normalizedvalues.service.NormalizedValuesService;
import com.stat4you.rest.domain.Dataset;
import com.stat4you.rest.domain.DatasetDB;
import com.stat4you.rest.domain.Metadata;
import com.stat4you.rest.transform.DatasetTransform;
import com.stat4you.statistics.data.service.DataService;
import com.stat4you.statistics.dsd.dto.AttributeDefinitionDto;
import com.stat4you.statistics.dsd.dto.DatasetDto;
import com.stat4you.statistics.dsd.dto.DimensionDto;
import com.stat4you.statistics.dsd.dto.ProviderDto;
import com.stat4you.statistics.dsd.service.DsdService;
import com.stat4you.web.BaseController;
import com.stat4you.web.WebConstants;

@Controller
public class DatasetController extends BaseController {

    @Autowired
    private DsdService dsdService = null;

    @Autowired
    private DataService dataService = null;

    @Autowired
    private NormalizedValuesService normalizedValuesService = null;

    @Autowired
    private LocaleResolver localeResolver;

    // TODO tratamiento de excepciones
    @RequestMapping(value = "/providers/{acronym}/datasets/{identifier}", method = RequestMethod.GET)
    public String setupForm(Model model,
                            @PathVariable("acronym") String acronym,
                            @PathVariable("identifier") String identifier,
                            HttpServletRequest request)
            throws ApplicationException, JsonGenerationException, JsonMappingException, IOException {

        ServiceContext ctx = getServiceContext();
        String providerAcronym = acronym;
        String datasetId = identifier;

        //selected + locale + default;


        DatasetDto datasetDto = dsdService.retrieveDatasetPublishedByIdentifier(ctx, providerAcronym, datasetId);
        List<DimensionDto> dimensionDtoList = datasetDto.getDimensions();
        List<AttributeDefinitionDto> attributeDefinitionDtoList = datasetDto.getAttributeDefinitions();
        ProviderDto providerDto = dsdService.retrieveProvider(ctx, datasetDto.getProviderUri());
        Map<String, List<String>> selectedDimensions = Collections.emptyMap();

        List<AttributeDto> attributeDtoList = dataService.findAttributes(ctx, datasetDto.getUri());

        List<String> selectedLanguages = new ArrayList<String>(datasetDto.getLanguages());
        Locale userLocale = localeResolver.resolveLocale(request);
        if(!selectedLanguages.contains(userLocale.getLanguage())){
            selectedLanguages.add(userLocale.getLanguage());
        }
        String[] selectedLocales = selectedLanguages.toArray(new String[selectedLanguages.size()]);


        List<LanguageDto> languages = new ArrayList<LanguageDto>();
        for (String language_code : datasetDto.getLanguages()) {
            languages.add(normalizedValuesService.retrieveLanguage(getServiceContext(), language_code));
        }

        List<CategoryDto> categories = new ArrayList<CategoryDto>();
        for (String category_code : datasetDto.getCategories()) {
            categories.add(normalizedValuesService.retrieveCategory(getServiceContext(), category_code)); // TODO pedir según locales
        }

        // METADATA
        DatasetDB datasetDB = new DatasetDB();
        datasetDB.setSelectedLocales(selectedLocales);
        datasetDB.setLanguages(languages);
        datasetDB.setProviderDto(providerDto);
        datasetDB.setDataset(datasetDto);
        datasetDB.setDimensions(dimensionDtoList);
        datasetDB.setSelectedDimensions(selectedDimensions);
        datasetDB.setAttributeDefinitions(attributeDefinitionDtoList);
        datasetDB.setAttributeValues(attributeDtoList);
        datasetDB.setCategories(categories);


        Metadata metadata = DatasetTransform.generateMetadata(datasetDB);

        Dataset dataset = new Dataset();
        dataset.setMetadata(metadata);
        dataset.setSelectedLanguages(Arrays.asList(selectedLocales));


        // Attributes
        // TODO esto se va a hacer con una petición a la parte de datos seleccionando el campo attributes en los fields
        List<AttributeDto> attributeDtos = dataService.findAttributes(getServiceContext(), datasetDto.getUri());
        List<AttributeDto> attributeDtosDatasets = new ArrayList<AttributeDto>();
        List<AttributeDto> attributeDtosCodesDimension = new ArrayList<AttributeDto>();

        for (AttributeDto attributeDto : attributeDtos) {
            if (attributeDto.getCodesDimension().size() == 0)
                attributeDtosDatasets.add(attributeDto);
            else {
                attributeDtosCodesDimension.add(attributeDto);
            }
        }
        Map<String, List<AttributeDto>> attributes = new HashMap<String, List<AttributeDto>>();
        attributes.put("dataset", attributeDtosDatasets);
        attributes.put("codesDimension", attributeDtosCodesDimension);



        ObjectMapper mapper = new ObjectMapper();
        String datasetFormJson = mapper.writeValueAsString(dataset);
        model.addAttribute("dataset", datasetFormJson);
        model.addAttribute("attributes", mapper.writeValueAsString(attributes));

        String citation = providerDto.getCitation();
        if(citation == null){
            citation = "";
        }

        model.addAttribute("citation", citation); // TODO esto debería venir en el dataset?

        return WebConstants.VIEW_NAME_DATASET_VIEW;
    }
}