package org.siemac.metamac.portal.core.conf;

import org.siemac.metamac.core.common.conf.ConfigurationServiceImpl;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.constants.PortalConfigurationConstants;

public class PortalConfigurationImpl extends ConfigurationServiceImpl implements PortalConfiguration {

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
        return retrieveProperty(PortalConfigurationConstants.CAPTCHA_PUBLIC_KEY);
    }

}
