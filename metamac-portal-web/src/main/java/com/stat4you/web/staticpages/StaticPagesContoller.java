package com.stat4you.web.staticpages;

import com.stat4you.web.BaseController;
import com.stat4you.web.WebConstants;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 */
@Controller
public class StaticPagesContoller extends BaseController {

    @RequestMapping(value="/roadmap")
    public String roadmap(){
        return WebConstants.VIEW_NAME_ROADMAP;
    }
    
    @RequestMapping(value="/about")
    public String about(){
        return WebConstants.VIEW_NAME_STATIC_ABOUT;
    }
    
    @RequestMapping(value="/legal")
    public String legal(){
        return WebConstants.VIEW_NAME_STATIC_LEGAL;
    }

    @RequestMapping(value="/faq")
    public String faq() {
        return WebConstants.VIEW_NAME_FAQ;
    }

}
