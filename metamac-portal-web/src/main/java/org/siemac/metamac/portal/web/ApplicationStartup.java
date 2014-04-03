package org.siemac.metamac.portal.web;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.siemac.metamac.core.common.conf.ConfigurationService;
import org.siemac.metamac.core.common.util.ApplicationContextProvider;
import org.siemac.metamac.portal.core.constants.PortalConfigurationConstants;

public class ApplicationStartup implements ServletContextListener {

    private static final Log     LOG = LogFactory.getLog(ApplicationStartup.class);

    private ConfigurationService configurationService;

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        try {
            configurationService = ApplicationContextProvider.getApplicationContext().getBean(ConfigurationService.class);
            checkConfiguration();
        } catch (Exception e) {
            // Abort startup application
            throw new RuntimeException(e);
        }
    }

    private void checkConfiguration() {
        LOG.info("**************************************************************************");
        LOG.info("[metamac-portal-web] Checking application configuration");
        LOG.info("**************************************************************************");

        // Datasource
        configurationService.checkRequiredProperty(PortalConfigurationConstants.DB_DRIVER_NAME);
        configurationService.checkRequiredProperty(PortalConfigurationConstants.DB_URL);
        configurationService.checkRequiredProperty(PortalConfigurationConstants.DB_USERNAME);
        configurationService.checkRequiredProperty(PortalConfigurationConstants.DB_PASSWORD);
        configurationService.checkRequiredProperty(PortalConfigurationConstants.DB_DIALECT);

        // Api
        configurationService.checkRequiredProperty(PortalConfigurationConstants.ENDPOINT_STATISTICAL_RESOURCES_EXTERNAL_API);
        configurationService.checkRequiredProperty(PortalConfigurationConstants.ENDPOINT_PORTAL_EXTERNAL_APIS);

        // Misc
        configurationService.checkRequiredProperty(PortalConfigurationConstants.METAMAC_EDITION_LANGUAGES);

        // Captcha
        configurationService.checkRequiredProperty(PortalConfigurationConstants.CAPTCHA_ENABLE);
        if (configurationService.getConfig().getBoolean(PortalConfigurationConstants.CAPTCHA_ENABLE)) {

            configurationService.checkRequiredProperty(PortalConfigurationConstants.CAPTCHA_PROVIDER);

            String provider = configurationService.getConfig().getString(PortalConfigurationConstants.CAPTCHA_PROVIDER);
            if (PortalConfigurationConstants.CAPTCHA_PROVIDER_RECAPTCHA.equals(provider)) {
                configurationService.checkRequiredProperty(PortalConfigurationConstants.CAPTCHA_PRIVATE_KEY);
                configurationService.checkRequiredProperty(PortalConfigurationConstants.CAPTCHA_PUBLIC_KEY);
            }
        }

        LOG.info("**************************************************************************");
        LOG.info("[metamac-portal-web] Application configuration checked");
        LOG.info("**************************************************************************");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
    }

}
