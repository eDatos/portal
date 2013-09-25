package org.siemac.metamac.portal.core.conf;

import java.util.List;

import org.siemac.metamac.core.common.conf.ConfigurationService;
import org.siemac.metamac.core.common.exception.MetamacException;

public interface PortalConfiguration extends ConfigurationService {

    /**
     * Retrieves all languages managed by service
     */
    @Override
    public List<String> retrieveLanguages() throws MetamacException;

    /**
     * Retrieves language as default
     */
    @Override
    public String retrieveLanguageDefault() throws MetamacException;

}
