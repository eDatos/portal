package org.siemac.metamac.portal.web.controllers;

import org.siemac.metamac.portal.web.WebConstants;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class DatasetController extends BaseController {

    @RequestMapping(value = "/datasets/{agency}/{identifier}/{version:\\d+\\.\\d+}", method = RequestMethod.GET)
    public ModelAndView dataset(@PathVariable("agency") String agency, @PathVariable("identifier") String identifier, @PathVariable("version") String version) {
        ModelAndView mv = new ModelAndView(WebConstants.VIEW_NAME_DATASET_VIEW);
        mv.addObject("type", "dataset");
        mv.addObject("agency", agency);
        mv.addObject("identifier", identifier);
        mv.addObject("version", version);
        return mv;
    }

    @RequestMapping(value = "/queries/{agency}/{identifier}", method = RequestMethod.GET)
    public ModelAndView query(@PathVariable("agency") String agency, @PathVariable("identifier") String identifier) {
        ModelAndView mv = new ModelAndView(WebConstants.VIEW_NAME_DATASET_VIEW);
        mv.addObject("type", "query");
        mv.addObject("agency", agency);
        mv.addObject("identifier", identifier);
        mv.addObject("version", "");
        return mv;
    }

}