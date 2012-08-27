package com.stat4you.web.dsd.provider;

import java.io.IOException;
import java.util.List;

import org.codehaus.jackson.map.ObjectMapper;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.stat4you.statistics.dsd.dto.ProviderDto;
import com.stat4you.statistics.dsd.service.DsdService;
import com.stat4you.web.BaseController;
import com.stat4you.web.WebConstants;

@Controller
public class ProvidersController extends BaseController {

    @Autowired
    private DsdService              dsdService;    

    @RequestMapping(value = {"/providers/", "providers/{acronym}"}, method = RequestMethod.GET)
    public ModelAndView providers() throws ApplicationException, IOException {
        ModelAndView modelAndView = new ModelAndView(WebConstants.VIEW_NAME_PROVIDERS_VIEW);
        
        List<ProviderDto> providers = dsdService.retrieveProviders(getServiceContext());
        
        ObjectMapper mapper = new ObjectMapper();
        String providersJson = mapper.writeValueAsString(providers);
        modelAndView.addObject("providers", providersJson);
 
        return modelAndView;
    }

    @RequestMapping(value = {"/providers"}, method = RequestMethod.GET)
    public String providersRedirect() throws ApplicationException, IOException {
        //Esto es necesario únicamente porque el router de backbone necesita que la ruta termine en /
        //para poder ahcer el fallback correctamente con IE
        //En cuanto se cambie a SinglePage, y el Router esté desde la raíz, ya no será necesario

        return "redirect:/providers/";
    }

    @RequestMapping(value = "/providers/{acronym}/datasets", method = RequestMethod.GET)
    public String providerDatasets(@PathVariable("acronym") String acronym) throws ApplicationException, IOException {
        //check if the providers exists
        ProviderDto providerDto = dsdService.retrieveProviderByAcronym(getServiceContext(), acronym);

        return "redirect:/search#!/?ff_ds_prov_acronym=" + providerDto.getAcronym();
    }

    @RequestMapping(value = "/api/NOMBRE_API/v1.0/providers/{acronym}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<ProviderDto> provider(@PathVariable("acronym") String acronym) throws ApplicationException, IOException {
        ProviderDto provider = dsdService.retrieveProviderByAcronym(getServiceContext(), acronym);
        return new ResponseEntity<ProviderDto>(provider, HttpStatus.OK);
    }
}