package org.siemac.metamac.portal.web.urlrewrite;

import javax.servlet.ServletException;

import org.siemac.metamac.core.common.conf.ConfigurationService;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.core.common.util.ApplicationContextProvider;
import org.siemac.metamac.core.common.util.urlrewrite.AbstractRewriteMatch;
import org.siemac.metamac.portal.rest.external.RestExternalConstants;

class PortalRewriteMatch extends AbstractRewriteMatch {

    private static final String  EXPORT_API_PREFIX     = "export";
    private static final String  PERMALINKS_API_PREFIX = "permalinks";

    private ConfigurationService configurationService  = null;

    @Override
    protected String[] getAcceptedApiPrefixes() {
        return new String[]{EXPORT_API_PREFIX, PERMALINKS_API_PREFIX};
    }

    @Override
    protected String getLatestApiVersion() {
        return RestExternalConstants.API_VERSION_1_0;
    }

    @Override
    protected String getApiBaseUrl() throws ServletException {
        try {
            return PERMALINKS_API_PREFIX.equals(getCurrentApiPrefix()) ? getConfigurationService().retrievePortalExternalApisPermalinksUrlBase() : getConfigurationService()
                    .retrievePortalExternalApisExportUrlBase();
        } catch (MetamacException e) {
            throw new ServletException("Error retrieving configuration property of the external API URL base", e);
        }
    }

    private ConfigurationService getConfigurationService() {
        if (configurationService == null) {
            configurationService = ApplicationContextProvider.getApplicationContext().getBean(ConfigurationService.class);
        }
        return configurationService;
    }
}
