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

    protected static String portalEnvironmentStyleHeaderUrl = null;
    protected static String portalEnvironmentStyleCssUrl    = null;
    protected static String portalEnvironmentStyleFooterUrl = null;

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

    /* Portal specific. See web.xml for matched patterns */
    public static String getPortalStyleHeaderUrl(String organizationService) {
        switch (organizationService) {
            case "agricultura":
                return portalAgricultureStyleHeaderUrl;
            case "medioambiente":
                return portalEnvironmentStyleHeaderUrl;
            default:
                return portalDefaultStyleHeaderUrl;
        }
    }

    public static String getPortalStyleFooterUrl(String organizationService) {
        switch (organizationService) {
            case "agricultura":
                return portalAgricultureStyleFooterUrl;
            case "medioambiente":
                return portalEnvironmentStyleFooterUrl;
            default:
                return portalDefaultStyleFooterUrl;
        }
    }

    public static String getPortalStyleCssUrl(String organizationService) {
        switch (organizationService) {
            case "agricultura":
                return portalAgricultureStyleCssUrl;
            case "medioambiente":
                return portalEnvironmentStyleCssUrl;
            default:
                return portalDefaultStyleCssUrl;
        }
    }

    public static void setPortalDefaultStyleHeaderUrl(String portalDefaultStyleHeaderUrl) {
        WebUtils.portalDefaultStyleHeaderUrl = portalDefaultStyleHeaderUrl;
    }

    public static void setPortalDefaultStyleCssUrl(String portalDefaultStyleCssUrl) {
        WebUtils.portalDefaultStyleCssUrl = portalDefaultStyleCssUrl;
    }

    public static void setPortalDefaultStyleFooterUrl(String portalDefaultStyleFooterUrl) {
        WebUtils.portalDefaultStyleFooterUrl = portalDefaultStyleFooterUrl;
    }

    public static void setPortalAgricultureStyleHeaderUrl(String portalAgricultureStyleHeaderUrl) {
        WebUtils.portalAgricultureStyleHeaderUrl = portalAgricultureStyleHeaderUrl;
    }

    public static void setPortalAgricultureStyleCssUrl(String portalAgricultureStyleCssUrl) {
        WebUtils.portalAgricultureStyleCssUrl = portalAgricultureStyleCssUrl;
    }

    public static void setPortalAgricultureStyleFooterUrl(String portalAgricultureStyleFooterUrl) {
        WebUtils.portalAgricultureStyleFooterUrl = portalAgricultureStyleFooterUrl;
    }

    public static void setPortalEnvironmentStyleHeaderUrl(String portalEnvironmentStyleHeaderUrl) {
        WebUtils.portalEnvironmentStyleHeaderUrl = portalEnvironmentStyleHeaderUrl;
    }

    public static void setPortalEnvironmentStyleCssUrl(String portalEnvironmentStyleCssUrl) {
        WebUtils.portalEnvironmentStyleCssUrl = portalEnvironmentStyleCssUrl;
    }

    public static void setPortalEnvironmentStyleFooterUrl(String portalEnvironmentStyleFooterUrl) {
        WebUtils.portalEnvironmentStyleFooterUrl = portalEnvironmentStyleFooterUrl;
    }
}
