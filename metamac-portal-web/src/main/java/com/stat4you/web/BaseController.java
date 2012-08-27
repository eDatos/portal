package com.stat4you.web;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

public abstract class BaseController {

    private static String REDIRECT_PREFIX = "redirect:";

    protected Logger      logger          = LoggerFactory.getLogger(getClass());

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

    @ExceptionHandler(EmptyResultDataAccessException.class)
    public ModelAndView handleIOException(EmptyResultDataAccessException ex, HttpServletRequest request) {
        logException(ex);
        ModelAndView mv = new ModelAndView("errors/errors");
        mv.addObject("code", "404");
        return mv;
    }

    @ExceptionHandler(Exception.class)
    public ModelAndView handleIOException(Exception ex, HttpServletRequest request) {
        logException(ex);
        ModelAndView mv = new ModelAndView("errors/errors");
        mv.addObject("code", "500");
        return mv;
    }

    // TODO ServiceContext
    protected ServiceContext getServiceContext() {
        return new ServiceContext("user1", null, "stat4you");
    }
    
    private void logException(Exception ex) {
        if (ex instanceof ApplicationException) {
            ApplicationException applicationException = (ApplicationException) ex;
            if (applicationException.isLogged()) {
                return;
            }
            logger.error("Error: " + applicationException.getErrorCode(), ex);
        } else {
            logger.error(ex.getMessage(), ex);
        }
    }
}
