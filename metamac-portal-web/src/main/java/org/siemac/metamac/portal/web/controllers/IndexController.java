package org.siemac.metamac.portal.web.controllers;

import org.siemac.metamac.portal.web.WebConstants;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class IndexController extends BaseController {

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String mainSearch() {
        return WebConstants.VIEW_NAME_INDEX;
    }

}
