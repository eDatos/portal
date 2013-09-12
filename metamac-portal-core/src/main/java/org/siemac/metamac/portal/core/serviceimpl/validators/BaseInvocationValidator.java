package org.siemac.metamac.portal.core.serviceimpl.validators;

import java.util.List;

import org.fornax.cartridges.sculptor.framework.accessapi.ConditionalCriteria;
import org.fornax.cartridges.sculptor.framework.domain.PagingParameter;
import org.siemac.metamac.core.common.exception.MetamacExceptionItem;
import org.siemac.metamac.core.common.serviceimpl.utils.ValidationUtils;
import org.siemac.metamac.portal.core.error.ServiceExceptionParameters;

public class BaseInvocationValidator {

    public static void checkRetrieveByUrn(String urn, List<MetamacExceptionItem> exceptions) {
        ValidationUtils.checkParameterRequired(urn, ServiceExceptionParameters.URN, exceptions);
    }

    public static void checkRetrieveByCode(String code, List<MetamacExceptionItem> exceptions) {
        ValidationUtils.checkParameterRequired(code, ServiceExceptionParameters.CODE, exceptions);
    }

    public static void checkFindByCondition(List<ConditionalCriteria> conditions, PagingParameter pagingParameter, List<MetamacExceptionItem> exceptions) {
        // nothing
    }
}
