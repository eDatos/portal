package org.siemac.metamac.portal.web.controllers;

import org.siemac.metamac.portal.web.WebConstants;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class DatasetController extends BaseController {

    @RequestMapping(value = "/dataset", method = RequestMethod.GET)
    public String setupForm() {
        return WebConstants.VIEW_NAME_DATASET_VIEW;
    }

}