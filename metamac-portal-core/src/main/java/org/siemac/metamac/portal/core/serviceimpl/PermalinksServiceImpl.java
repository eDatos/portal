package org.siemac.metamac.portal.core.serviceimpl;

import java.util.List;

import org.fornax.cartridges.sculptor.framework.accessapi.ConditionalCriteria;
import org.fornax.cartridges.sculptor.framework.accessapi.ConditionalCriteriaBuilder;
import org.fornax.cartridges.sculptor.framework.domain.PagedResult;
import org.fornax.cartridges.sculptor.framework.domain.PagingParameter;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.core.common.exception.MetamacExceptionBuilder;
import org.siemac.metamac.core.common.util.IdGenerator;
import org.siemac.metamac.portal.core.domain.Permalink;
import org.siemac.metamac.portal.core.error.ServiceExceptionType;
import org.siemac.metamac.portal.core.serviceapi.validators.PermalinksServiceInvocationValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Implementation of PermalinkService.
 */
@Service("permalinksService")
public class PermalinksServiceImpl extends PermalinksServiceImplBase {

    @Autowired
    private PermalinksServiceInvocationValidator permalinksServiceInvocationValidator;

    public PermalinksServiceImpl() {
    }

    @Override
    public Permalink createPermalink(ServiceContext ctx, Permalink permalink) throws MetamacException {
        // Validation
        permalinksServiceInvocationValidator.checkCreatePermalink(ctx, permalink);

        // Create
        String code = IdGenerator.generateUniqueId();
        permalink.setCode(code);
        permalink = getPermalinkRepository().save(permalink);
        return permalink;
    }

    @Override
    public Permalink retrievePermalinkByCode(ServiceContext ctx, String code) throws MetamacException {
        // Validation
        permalinksServiceInvocationValidator.checkRetrievePermalinkByCode(ctx, code);

        // Retrieve
        Permalink permalink = getPermalinkRepository().findByCode(code);
        if (permalink == null) {
            throw MetamacExceptionBuilder.builder().withExceptionItems(ServiceExceptionType.PERMALINK_NOT_FOUND).withMessageParameters(code).build();
        }
        return permalink;
    }

    @Override
    public PagedResult<Permalink> findPermalinksByCondition(ServiceContext ctx, List<ConditionalCriteria> conditions, PagingParameter pagingParameter) throws MetamacException {
        // Validation
        permalinksServiceInvocationValidator.checkFindPermalinksByCondition(ctx, conditions, pagingParameter);

        // Find
        if (conditions == null) {
            conditions = ConditionalCriteriaBuilder.criteriaFor(Permalink.class).distinctRoot().build();
        }
        PagedResult<Permalink> permalinkPagedResult = getPermalinkRepository().findByCondition(conditions, pagingParameter);
        return permalinkPagedResult;
    }

}
