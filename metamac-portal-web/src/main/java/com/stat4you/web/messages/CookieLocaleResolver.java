package com.stat4you.web.messages;

import org.springframework.util.StringUtils;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

/**
 */
public class CookieLocaleResolver extends org.springframework.web.servlet.i18n.CookieLocaleResolver {

    protected Set<String> supportedLocales = new HashSet<String>();

    public Set<String> getSupportedLocales() {
        return supportedLocales;
    }

    public void setSupportedLocales(Set<String> supportedLocales) {
        this.supportedLocales = supportedLocales;
    }

    protected Locale simplifyLocale(Locale locale) {
        if(locale != null){
            return StringUtils.parseLocaleString(locale.getLanguage());
        }
        return null;
    };

    protected boolean isSupportedLocale(Locale locale) {
        String lang = locale.getLanguage();
        return supportedLocales.contains(lang);
    }

    protected Locale getLocaleFromQueryParam(HttpServletRequest request) {
        Locale locale = (Locale) request.getAttribute(LOCALE_REQUEST_ATTRIBUTE_NAME);
        return locale;
    }

    protected Locale getLocaleFromCookie(HttpServletRequest request){
        Locale locale = null;
        // Retrieve and parse cookie value.
        Cookie cookie = WebUtils.getCookie(request, getCookieName());
        if (cookie != null) {
            locale = StringUtils.parseLocaleString(cookie.getValue());
            if (logger.isDebugEnabled()) {
                logger.debug("Parsed cookie value [" + cookie.getValue() + "] into locale '" + locale + "'");
            }
            if (locale != null) {
                request.setAttribute(LOCALE_REQUEST_ATTRIBUTE_NAME, locale);
                return locale;
            }
        }
        return locale;
    }

    protected Locale getLocaleFromHeader(HttpServletRequest request){
        return request.getLocale();
    }

    public Locale resolveLocale(HttpServletRequest request) {
        Locale defaultLocale = getDefaultLocale();

        Locale locale = getLocaleFromQueryParam(request);

        if(locale == null){
            locale = getLocaleFromCookie(request);
        }

        if(locale == null) {
            locale = getLocaleFromHeader(request);
        }

        locale = simplifyLocale(locale);
        if(locale == null || !isSupportedLocale(locale)) {
            locale = defaultLocale;
        }
        return locale;
    }

}
