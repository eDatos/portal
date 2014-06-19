package org.siemac.metamac.portal.core.conf;

import org.siemac.metamac.core.common.conf.ConfigurationService;
import org.siemac.metamac.core.common.exception.MetamacException;

public interface PortalConfiguration extends ConfigurationService {

    boolean retrieveCaptchaEnable() throws MetamacException;

    String retrieveCaptchaProvider() throws MetamacException;

    String retrieveCaptchaPrivateKey() throws MetamacException;

    String retrieveCaptchaPublicKey() throws MetamacException;
    
    String retrieveInstallationType() throws MetamacException;

}
