package org.siemac.metamac.portal.web;

import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.core.common.listener.ApplicationStartupListener;
import org.siemac.metamac.portal.core.constants.PortalConfigurationConstants;

public class ApplicationStartup extends ApplicationStartupListener {

    @Override
    public String projectName() {
        return "statistical-visualizer";
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
        checkRequiredProperty(PortalConfigurationConstants.ENDPOINT_PORTAL_EXTERNAL_APIS);

        // Misc
        checkRequiredProperty(PortalConfigurationConstants.METAMAC_EDITION_LANGUAGES);

        // Captcha
        checkRequiredProperty(PortalConfigurationConstants.CAPTCHA_ENABLE);
        if (configurationService.retrievePropertyBoolean(PortalConfigurationConstants.CAPTCHA_ENABLE)) {
            checkRequiredProperty(PortalConfigurationConstants.CAPTCHA_PROVIDER);

            String provider = configurationService.retrieveProperty(PortalConfigurationConstants.CAPTCHA_PROVIDER);
            if (PortalConfigurationConstants.CAPTCHA_PROVIDER_RECAPTCHA.equals(provider)) {
                checkRequiredProperty(PortalConfigurationConstants.CAPTCHA_PRIVATE_KEY);
                checkRequiredProperty(PortalConfigurationConstants.CAPTCHA_PUBLIC_KEY);
            }
        }

    }

}
