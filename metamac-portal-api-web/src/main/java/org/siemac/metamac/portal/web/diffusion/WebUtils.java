package org.siemac.metamac.portal.web.diffusion;

import java.net.MalformedURLException;

public class WebUtils extends org.siemac.metamac.core.common.util.WebUtils {

    protected static String exportApiBaseUrl                = null;
    protected static String permalinksApiBaseUrl            = null;

    public static void setExportApiBaseURL(String exportApiBaseUrl) {
        WebUtils.exportApiBaseUrl = exportApiBaseUrl;
    }

    public static String getExportApiBaseURL() throws MalformedURLException {
        return normalizeUrl(exportApiBaseUrl);
    }

    public static void setPermalinksApiBaseURL(String permalinksApiBaseUrl) {
        WebUtils.permalinksApiBaseUrl = permalinksApiBaseUrl;
    }

    public static String getPermalinksApiBaseURL() throws MalformedURLException {
        return normalizeUrl(permalinksApiBaseUrl);
    }
}
