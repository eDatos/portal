package org.siemac.metamac.portal.core.serviceimpl.validators;

import static org.siemac.metamac.core.common.serviceimpl.utils.ValidationUtils.checkMetadataEmpty;
import static org.siemac.metamac.core.common.serviceimpl.utils.ValidationUtils.checkMetadataRequired;
import static org.siemac.metamac.core.common.serviceimpl.utils.ValidationUtils.checkParameterRequired;

import java.util.List;

import org.fornax.cartridges.sculptor.framework.accessapi.ConditionalCriteria;
import org.fornax.cartridges.sculptor.framework.domain.PagingParameter;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.core.common.exception.MetamacExceptionItem;
import org.siemac.metamac.portal.core.domain.Permalink;
import org.siemac.metamac.portal.core.error.ServiceExceptionParameters;

public class PermalinksServiceInvocationValidatorImpl extends BaseInvocationValidator {

    public static void checkCreatePermalink(Permalink permalink, List<MetamacExceptionItem> exceptions) throws MetamacException {
        checkPermalink(permalink, exceptions);
    }

    public static void checkRetrievePermalinkByCode(String code, List<MetamacExceptionItem> exceptions) throws MetamacException {
        checkRetrieveByCode(code, exceptions);
    }

    private static void checkPermalink(Permalink permalink, List<MetamacExceptionItem> exceptions) {
        checkParameterRequired(permalink, ServiceExceptionParameters.PERMALINK_PREFIX, exceptions);
        if (permalink == null) {
            return;
        }
        if (permalink.getId() == null) {
            checkMetadataEmpty(permalink.getCode(), ServiceExceptionParameters.PERMALINK_CODE, exceptions);
        } else {
            checkMetadataRequired(permalink.getCode(), ServiceExceptionParameters.PERMALINK_CODE, exceptions);
        }
        checkMetadataRequired(permalink.getContent(), ServiceExceptionParameters.PERMALINK_CONTENT, exceptions);
    }

    public static void checkFindPermalinksByCondition(List<ConditionalCriteria> conditions, PagingParameter pagingParameter, List<MetamacExceptionItem> exceptions) {
        checkFindByCondition(conditions, pagingParameter, exceptions);
    }
}
