package org.siemac.metamac.portal.rest.external.service;

import org.siemac.metamac.portal.core.domain.Permalink;

public interface PortalRestExternalCommonService {

    public Permalink retrievePermalink(String code);
    public Permalink createPermalink(Permalink permalink);
}
