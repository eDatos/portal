package org.siemac.metamac.portal.web;

import java.net.MalformedURLException;

import org.siemac.metamac.core.common.util.swagger.SwaggerUtils;

public class WebUtils {

    protected static String organisation         = null;
    protected static String exportApiBaseUrl     = null;
    protected static String permalinksApiBaseUrl = null;

    public static void setExportApiBaseURL(String apiBaseUrl) {
        WebUtils.exportApiBaseUrl = SwaggerUtils.normalizeUrl(apiBaseUrl);
    }

    public static String getExportApiBaseURL() throws MalformedURLException {
        return exportApiBaseUrl;
    }

    public static void setPermalinksApiBaseURL(String apiBaseUrl) {
        WebUtils.permalinksApiBaseUrl = SwaggerUtils.normalizeUrl(apiBaseUrl);
    }

    public static String getPermalinksApiBaseURL() throws MalformedURLException {
        return permalinksApiBaseUrl;
    }

    public static void setOrganisation(String organisation) {
        WebUtils.organisation = organisation;
    }

    public static String getFavicon() {
        return SwaggerUtils.getFavicon(organisation);
    }
}
