package org.siemac.metamac.portal.core.error;

import org.siemac.metamac.core.common.exception.CommonServiceExceptionType;

public class ServiceExceptionType extends CommonServiceExceptionType {

    public static final CommonServiceExceptionType PERMALINK_NOT_FOUND                = create("exception.portal.permalink.not_found");
    public static final CommonServiceExceptionType RESOURCE_TYPE_EXPORT_NOT_SUPPORTED = create("exception.portal.export.not_supported");
}
