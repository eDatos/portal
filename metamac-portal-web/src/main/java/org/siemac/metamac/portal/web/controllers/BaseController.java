package org.siemac.metamac.portal.web.controllers;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

public abstract class BaseController {

    private static String REDIRECT_PREFIX = "redirect:";

    protected Logger logger = LoggerFactory.getLogger(getClass());

    protected ModelAndView getModelAndView(String viewName, Exception ex) {
        ModelAndView mv = new ModelAndView(viewName);
        if (logger.isDebugEnabled()) {
            logger.debug("Exposing Exception as model attribute 'exception'");
        }
        mv.addObject("exception", ex);
        return mv;
    }

    protected String redirectToView(String viewName) {
        return StringUtils.join(REDIRECT_PREFIX, viewName);
    }

    @ExceptionHandler(Exception.class)
    public ModelAndView handleIOException(Exception ex, HttpServletRequest request) {
        logException(ex);
        ModelAndView mv = new ModelAndView("errors/errors");
        mv.addObject("code", "500");
        return mv;
    }

    private void logException(Exception ex) {
        logger.error(ex.getMessage(), ex);
    }

}
