package org.siemac.metamac.portal.web;

import javax.servlet.ServletContextEvent;

import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.core.common.listener.ApplicationStartupListener;
import org.siemac.metamac.core.common.util.ApplicationContextProvider;
import org.siemac.metamac.portal.core.conf.PortalConfiguration;
import org.siemac.metamac.portal.core.constants.PortalConfigurationConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ApplicationStartup extends ApplicationStartupListener {

    private static final Logger log = LoggerFactory.getLogger(ApplicationStartup.class);

    @Override
    public String projectName() {
        return "statistical-visualizer";
    }

    private PortalConfiguration portalConfigurationService;

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        try {
            portalConfigurationService = ApplicationContextProvider.getApplicationContext().getBean(PortalConfiguration.class);
        } catch (Exception e) {
            // Abort startup application
            throw new RuntimeException(e);
        }
        super.contextInitialized(sce);
        try {
            WebUtils.setOrganisation(configurationService.retrieveOrganisation());
            WebUtils.setExportApiBaseURL(configurationService.retrievePortalExternalApisExportUrlBase());
            WebUtils.setPermalinksApiBaseURL(configurationService.retrievePortalExternalApisPermalinksUrlBase());
            
            WebUtils.setApiStyleHeaderUrl(configurationService.retrieveApiStyleHeaderUrl());
            WebUtils.setApiStyleCssUrl(configurationService.retrieveApiStyleCssUrl());
            WebUtils.setApiStyleFooterUrl(configurationService.retrieveApiStyleFooterUrl());
        } catch (MetamacException e) {
            log.error("Error retrieving application configuration", e);
        }
    }

    @Override
    public void checkApplicationProperties() throws MetamacException {
        // Datasource
        checkRequiredProperty(PortalConfigurationConstants.DB_DRIVER_NAME);
        checkRequiredProperty(PortalConfigurationConstants.DB_URL);
        checkRequiredProperty(PortalConfigurationConstants.DB_USERNAME);
        checkRequiredProperty(PortalConfigurationConstants.DB_PASSWORD);
        checkRequiredProperty(PortalConfigurationConstants.DB_DIALECT);

        // Api
        checkRequiredProperty(PortalConfigurationConstants.ENDPOINT_STATISTICAL_RESOURCES_EXTERNAL_API);
        checkRequiredProperty(PortalConfigurationConstants.ENDPOINT_PORTAL_EXTERNAL_BASE);

        // Visualizer (also the api ones)
        checkRequiredProperty(PortalConfigurationConstants.METAMAC_ORGANISATION);
        String INSTALLATION_TYPE = portalConfigurationService.retrieveInstallationType();

        if (INSTALLATION_TYPE.equals("EXTERNAL")) {
            // checkRequiredProperty(PortalConfigurationConstants.ENDPOINT_SRM_EXTERNAL_API); // Already checked for metamac-portal-rest-external
            checkRequiredProperty(PortalConfigurationConstants.ENDPOINT_STATISTICAL_RESOURCES_EXTERNAL_API);
        } else if (INSTALLATION_TYPE.equals("INTERNAL")) {
            checkRequiredProperty(PortalConfigurationConstants.ENDPOINT_SRM_INTERNAL_API);
            checkRequiredProperty(PortalConfigurationConstants.ENDPOINT_STATISTICAL_RESOURCES_INTERNAL_API);
        }

        // Misc
        checkRequiredProperty(PortalConfigurationConstants.METAMAC_EDITION_LANGUAGES);

        // Captcha
        checkRequiredProperty(PortalConfigurationConstants.CAPTCHA_ENABLE);
        if (portalConfigurationService.retrieveCaptchaEnable()) {
            checkRequiredProperty(PortalConfigurationConstants.CAPTCHA_PROVIDER);

            String provider = portalConfigurationService.retrieveCaptchaProvider();
            if (PortalConfigurationConstants.CAPTCHA_PROVIDER_RECAPTCHA.equals(provider)) {
                checkRequiredProperty(PortalConfigurationConstants.CAPTCHA_PRIVATE_KEY);
                checkRequiredProperty(PortalConfigurationConstants.CAPTCHA_PUBLIC_KEY);
            }
        }
    }
}
