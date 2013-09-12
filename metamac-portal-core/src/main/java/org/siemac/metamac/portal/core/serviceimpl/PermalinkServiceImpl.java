package org.siemac.metamac.portal.core.serviceimpl;

import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.domain.Permalink;
import org.springframework.stereotype.Service;

/**
 * Implementation of PermalinkService.
 */
@Service("permalinkService")
public class PermalinkServiceImpl extends PermalinkServiceImplBase {

    public PermalinkServiceImpl() {
    }

    @Override
    public Permalink createPermalink(ServiceContext ctx, Permalink permalink) throws MetamacException {

        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("createPermalink not implemented");

    }

    @Override
    public Permalink retrievePermalinkByCode(ServiceContext ctx, String code) throws MetamacException {

        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("retrievePermalinkByCode not implemented");

    }
}
