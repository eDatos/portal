package com.stat4you.web.i18n;

import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.support.RequestContextUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
public class LocaleController {

    @RequestMapping(value = "/app/changeLocale", method = RequestMethod.GET)
    public String changeLocale(HttpServletRequest request,
                             HttpServletResponse response,
                             @RequestParam String locale,
                             @RequestParam(defaultValue = "/") String target) {
        LocaleResolver localeResolver = RequestContextUtils.getLocaleResolver(request);
        if (localeResolver == null) {
            throw new IllegalStateException("No LocaleResolver found: not in a DispatcherServlet request?");
        }
        localeResolver.setLocale(request, response, StringUtils.parseLocaleString(locale));
        return "redirect:" + target;
    }

}
