package org.siemac.metamac.portal.core.conf;

import org.siemac.metamac.core.common.conf.ConfigurationService;
import org.siemac.metamac.core.common.exception.MetamacException;

public interface PortalConfiguration extends ConfigurationService {

    boolean retrieveCaptchaEnable() throws MetamacException;

    String retrieveCaptchaProvider() throws MetamacException;

    String retrieveCaptchaPrivateKey() throws MetamacException;

    String retrieveCaptchaPublicKey() throws MetamacException;

    String retrieveInstallationType() throws MetamacException;

    // Visualizer Styles
    String retrievePortalDefaultStyleHeaderUrl() throws MetamacException;
    String retrievePortalDefaultStyleCssUrl() throws MetamacException;
    String retrievePortalDefaultStyleFooterUrl() throws MetamacException;

    String retrievePortalAgricultureStyleHeaderUrl() throws MetamacException;
    String retrievePortalAgricultureStyleCssUrl() throws MetamacException;
    String retrievePortalAgricultureStyleFooterUrl() throws MetamacException;

    String retrievePortalEnvironmentStyleHeaderUrl() throws MetamacException;
    String retrievePortalEnvironmentStyleCssUrl() throws MetamacException;
    String retrievePortalEnvironmentStyleFooterUrl() throws MetamacException;

    String retrievePortalTourismStyleHeaderUrl() throws MetamacException;
    String retrievePortalTourismStyleCssUrl() throws MetamacException;
    String retrievePortalTourismStyleFooterUrl() throws MetamacException;
    
    String retrievePortalPublicServiceStyleHeaderUrl() throws MetamacException;
    String retrievePortalPublicServiceStyleCssUrl() throws MetamacException;
    String retrievePortalPublicServiceStyleFooterUrl() throws MetamacException;

}
