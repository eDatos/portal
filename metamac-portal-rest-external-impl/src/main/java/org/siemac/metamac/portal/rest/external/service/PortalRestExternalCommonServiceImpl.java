package org.siemac.metamac.portal.rest.external.service;

import static org.siemac.metamac.portal.rest.external.RestExternalConstantsPrivate.SERVICE_CONTEXT;
import static org.siemac.metamac.portal.rest.external.service.utils.PortalRestExternalUtils.manageException;

import javax.ws.rs.core.Response.Status;

import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.domain.Permalink;
import org.siemac.metamac.portal.core.error.ServiceExceptionType;
import org.siemac.metamac.portal.core.serviceapi.PermalinksService;
import org.siemac.metamac.portal.rest.external.exception.RestServiceExceptionType;
import org.siemac.metamac.rest.exception.RestException;
import org.siemac.metamac.rest.exception.utils.RestExceptionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("portalRestExternalCommonService")
public class PortalRestExternalCommonServiceImpl implements PortalRestExternalCommonService {

    @Autowired
    private PermalinksService permalinksService;

    @Override
    public Permalink retrievePermalink(String code) {
        try {
            // Retrieve
            Permalink permalink = null;
            try {
                permalink = permalinksService.retrievePermalinkByCode(SERVICE_CONTEXT, code);
            } catch (MetamacException e) {
                if (e.getExceptionItems().size() == 1 && ServiceExceptionType.PERMALINK_NOT_FOUND.getCode().equals(e.getExceptionItems().get(0).getCode())) {
                    permalink = null;
                } else {
                    throw e;
                }
            }
            if (permalink == null) {
                org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.PERMALINK_NOT_FOUND, code);
                throw new RestException(exception, Status.NOT_FOUND);
            }
            return permalink;
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    @Override
    public Permalink createPermalink(Permalink permalink) {
        try {
            return permalinksService.createPermalink(SERVICE_CONTEXT, permalink);
        } catch (Exception e) {
            throw manageException(e);
        }
    }
}
