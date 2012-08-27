package com.stat4you.web.index;

import java.io.IOException;
import java.util.List;

import org.codehaus.jackson.map.ObjectMapper;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.stat4you.statistics.dsd.dto.ProviderDto;
import com.stat4you.statistics.dsd.service.DsdService;
import com.stat4you.idxmanager.domain.DatasetBasicIdx;
import com.stat4you.idxmanager.exception.IdxManagerException;
import com.stat4you.idxmanager.service.search.SearchService;
import com.stat4you.web.BaseController;
import com.stat4you.web.WebConstants;

@Controller
public class IndexController extends BaseController {

    @Autowired
    private DsdService dsdService;
    
    @Autowired
    private SearchService searchService;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ModelAndView mainSearch() throws ApplicationException, IOException, IdxManagerException {
       // List<DatasetBasicDto> datasets = dsdService.findDatasetsLastPublished(getServiceContext(), 10);
        List<DatasetBasicIdx> datasets = searchService.findLastPublishedDatasets(10);
        List<ProviderDto> providers = dsdService.retrieveProviders(getServiceContext());

        ObjectMapper mapper = new ObjectMapper();
        String providersJson = mapper.writeValueAsString(providers);
        String datasetJson = mapper.writeValueAsString(datasets);

        ModelAndView mv = new ModelAndView(WebConstants.VIEW_NAME_INDEX);
        mv.addObject("providers", providersJson);
        mv.addObject("datasets", datasetJson);

        return mv;
    }
}
