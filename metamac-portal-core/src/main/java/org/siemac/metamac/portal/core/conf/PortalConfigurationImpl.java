package org.siemac.metamac.portal.core.conf;

import org.siemac.metamac.core.common.conf.ConfigurationServiceImpl;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.constants.PortalConfigurationConstants;

public class PortalConfigurationImpl extends ConfigurationServiceImpl implements PortalConfiguration {

    private static final String ENVIROMENT_CONF_INSTALLATION_TYPE = "environment.metamac.portal.installation_type";

    @Override
    public boolean retrieveCaptchaEnable() throws MetamacException {
        return retrievePropertyBoolean(PortalConfigurationConstants.CAPTCHA_ENABLE);
    }

    @Override
    public String retrieveCaptchaProvider() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.CAPTCHA_PROVIDER);
    }

    @Override
    public String retrieveCaptchaPrivateKey() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.CAPTCHA_PRIVATE_KEY);
    }

    @Override
    public String retrieveCaptchaPublicKey() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.CAPTCHA_PUBLIC_KEY);
    }

    @Override
    public String retrieveInstallationType() throws MetamacException {
        return (String) environmentConfigurationProperties.getProperty(ENVIROMENT_CONF_INSTALLATION_TYPE);
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        super.afterPropertiesSet();

        if (environmentConfigurationProperties.getProperty(ENVIROMENT_CONF_INSTALLATION_TYPE) == null) {
            throw new IllegalArgumentException("ERROR One of configuration source is required: \"systemConfigurationFile\" or \"configurationDatasource\", has not been properly initialized");
        }
    }
}
