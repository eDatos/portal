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
    public String retrievePortalAgricultureStyleHeaderUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_AGRICULTURE_STYLE_HEADER_URL);
    }

    @Override
    public String retrievePortalAgricultureStyleCssUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_AGRICULTURE_STYLE_CSS_URL);
    }

    @Override
    public String retrievePortalAgricultureStyleFooterUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_AGRICULTURE_STYLE_FOOTER_URL);
    }

    @Override
    public String retrievePortalEnvironmentStyleHeaderUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_ENVIRONMENT_STYLE_HEADER_URL);
    }

    @Override
    public String retrievePortalEnvironmentStyleCssUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_ENVIRONMENT_STYLE_CSS_URL);
    }

    @Override
    public String retrievePortalEnvironmentStyleFooterUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_ENVIRONMENT_STYLE_FOOTER_URL);
    }

    @Override
    public String retrievePortalTourismStyleHeaderUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_TOURISM_STYLE_HEADER_URL);
    }

    @Override
    public String retrievePortalTourismStyleCssUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_TOURISM_STYLE_CSS_URL);
    }

    @Override
    public String retrievePortalTourismStyleFooterUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_TOURISM_STYLE_FOOTER_URL);
    }

    @Override
    public String retrievePortalPublicServiceStyleHeaderUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_PUBLIC_SERVICE_STYLE_HEADER_URL);
    }

    @Override
    public String retrievePortalPublicServiceStyleCssUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_PUBLIC_SERVICE_STYLE_CSS_URL);
    }

    @Override
    public String retrievePortalPublicServiceStyleFooterUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_PUBLIC_SERVICE_STYLE_FOOTER_URL);
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        super.afterPropertiesSet();

        if (environmentConfigurationProperties.getProperty(ENVIROMENT_CONF_INSTALLATION_TYPE) == null) {
            throw new IllegalArgumentException("ERROR: Portal installation type must be specified. Possible values are : \"INTERNAL\" or \"EXTERNAL\" ");
        }
    }

}
