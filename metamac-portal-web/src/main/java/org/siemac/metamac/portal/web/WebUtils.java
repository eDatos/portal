package org.siemac.metamac.portal.web;

import java.net.MalformedURLException;

import org.siemac.metamac.core.common.util.swagger.SwaggerUtils;

public class WebUtils extends org.siemac.metamac.core.common.util.WebUtils {

    protected static String exportApiBaseUrl                = null;
    protected static String permalinksApiBaseUrl            = null;

    protected static String portalDefaultStyleHeaderUrl     = null;
    protected static String portalDefaultStyleCssUrl        = null;
    protected static String portalDefaultStyleFooterUrl     = null;

    protected static String portalAgricultureStyleHeaderUrl = null;
    protected static String portalAgricultureStyleCssUrl    = null;
    protected static String portalAgricultureStyleFooterUrl = null;

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

    public static String getPortalDefaultStyleHeaderUrl() {
        return portalDefaultStyleHeaderUrl;
    }

    public static void setPortalDefaultStyleHeaderUrl(String portalDefaultStyleHeaderUrl) {
        WebUtils.portalDefaultStyleHeaderUrl = portalDefaultStyleHeaderUrl;
    }

    public static String getPortalDefaultStyleCssUrl() {
        return portalDefaultStyleCssUrl;
    }

    public static void setPortalDefaultStyleCssUrl(String portalDefaultStyleCssUrl) {
        WebUtils.portalDefaultStyleCssUrl = portalDefaultStyleCssUrl;
    }

    public static String getPortalDefaultStyleFooterUrl() {
        return portalDefaultStyleFooterUrl;
    }

    public static void setPortalDefaultStyleFooterUrl(String portalDefaultStyleFooterUrl) {
        WebUtils.portalDefaultStyleFooterUrl = portalDefaultStyleFooterUrl;
    }

    public static String getPortalAgricultureStyleHeaderUrl() {
        return portalAgricultureStyleHeaderUrl;
    }

    public static void setPortalAgricultureStyleHeaderUrl(String portalAgricultureStyleHeaderUrl) {
        WebUtils.portalAgricultureStyleHeaderUrl = portalAgricultureStyleHeaderUrl;
    }

    public static String getPortalAgricultureStyleCssUrl() {
        return portalAgricultureStyleCssUrl;
    }

    public static void setPortalAgricultureStyleCssUrl(String portalAgricultureStyleCssUrl) {
        WebUtils.portalAgricultureStyleCssUrl = portalAgricultureStyleCssUrl;
    }

    public static String getPortalAgricultureStyleFooterUrl() {
        return portalAgricultureStyleFooterUrl;
    }

    public static void setPortalAgricultureStyleFooterUrl(String portalAgricultureStyleFooterUrl) {
        WebUtils.portalAgricultureStyleFooterUrl = portalAgricultureStyleFooterUrl;
    }
}
