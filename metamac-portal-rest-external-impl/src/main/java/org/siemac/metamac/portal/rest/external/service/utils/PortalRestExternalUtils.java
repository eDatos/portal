package org.siemac.metamac.portal.rest.external.service.utils;

import javax.ws.rs.core.Response.Status;

import org.siemac.metamac.rest.exception.RestCommonServiceExceptionType;
import org.siemac.metamac.rest.exception.RestException;
import org.siemac.metamac.rest.exception.utils.RestExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PortalRestExternalUtils {

    private static final Logger logger = LoggerFactory.getLogger(PortalRestExternalUtils.class);

    /**
     * Throws response error, logging exception
     */
    public static RestException manageException(Exception e) {
        logger.error("Error", e);
        if (e instanceof RestException) {
            return (RestException) e;
        } else {
            // do not show information details about exception to user
            org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestCommonServiceExceptionType.UNKNOWN);
            return new RestException(exception, Status.INTERNAL_SERVER_ERROR);
        }
    }
}
