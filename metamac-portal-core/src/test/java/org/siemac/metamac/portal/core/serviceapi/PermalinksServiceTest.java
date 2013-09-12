package org.siemac.metamac.portal.core.serviceapi;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.siemac.metamac.common.test.utils.MetamacAsserts.assertEqualsDate;
import static org.siemac.metamac.portal.core.serviceapi.utils.Asserts.assertEqualsPermalink;

import java.util.Date;
import java.util.List;

import org.apache.commons.lang.time.DateUtils;
import org.fornax.cartridges.sculptor.framework.accessapi.ConditionalCriteria;
import org.fornax.cartridges.sculptor.framework.accessapi.ConditionalCriteriaBuilder;
import org.fornax.cartridges.sculptor.framework.domain.PagedResult;
import org.fornax.cartridges.sculptor.framework.domain.PagingParameter;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.joda.time.DateTime;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.domain.Permalink;
import org.siemac.metamac.portal.core.domain.PermalinkProperties;
import org.siemac.metamac.portal.core.error.ServiceExceptionParameters;
import org.siemac.metamac.portal.core.error.ServiceExceptionType;
import org.siemac.metamac.portal.core.serviceapi.common.PortalBaseTest;
import org.siemac.metamac.portal.core.serviceapi.utils.DoMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.transaction.annotation.Transactional;

/**
 * Spring based transactional test with DbUnit support.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring/portal/applicationContext-test.xml"})
@TransactionConfiguration(transactionManager = "txManagerCore", defaultRollback = true)
@Transactional
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
public class PermalinksServiceTest extends PortalBaseTest implements PermalinksServiceTestBase {

    @Autowired
    protected PermalinksService  permalinksService;

    private final ServiceContext ctx         = getServiceContext();

    private static String        PERMALINK_1 = "permalink01";
    private static String        PERMALINK_2 = "permalink02";
    private static String        PERMALINK_3 = "permalink03";

    @Override
    @Test
    public void testCreatePermalink() throws Exception {

        Permalink permalink = DoMocks.mockPermalink();
        Permalink permalinkCreated = permalinksService.createPermalink(ctx, permalink);
        String code = permalinkCreated.getCode();
        assertNotNull(code);

        // Validate
        Permalink permalinkRetrieved = permalinksService.retrievePermalinkByCode(ctx, code);

        assertEquals(ctx.getUserId(), permalinkRetrieved.getCreatedBy());
        assertEquals(ctx.getUserId(), permalinkRetrieved.getCreatedBy());
        assertTrue(DateUtils.isSameDay(new Date(), permalinkRetrieved.getCreatedDate().toDate()));
        assertEquals(ctx.getUserId(), permalinkRetrieved.getLastUpdatedBy());
        assertTrue(DateUtils.isSameDay(new Date(), permalinkRetrieved.getLastUpdated().toDate()));

        assertEqualsPermalink(permalink, permalinkRetrieved);
    }

    @Test
    public void testCreatePermalinkErrorIncorrectMetadata() throws Exception {
        Permalink permalink = DoMocks.mockPermalink();
        permalink.setContent(null);

        try {
            permalinksService.createPermalink(ctx, permalink);
            fail("metadata required");
        } catch (MetamacException e) {
            assertEquals(1, e.getExceptionItems().size());
            assertListContainsExceptionItemOneParameter(e, ServiceExceptionType.METADATA_REQUIRED, ServiceExceptionParameters.PERMALINK_CONTENT);
        }
    }

    @Test
    public void testCreatePermalinkErrorCodeUnexpected() throws Exception {
        Permalink permalink = DoMocks.mockPermalink();
        permalink.setCode("code");
        try {
            permalinksService.createPermalink(ctx, permalink);
            fail("unexpected");
        } catch (MetamacException e) {
            assertEquals(1, e.getExceptionItems().size());
            assertListContainsExceptionItemOneParameter(e, ServiceExceptionType.METADATA_UNEXPECTED, ServiceExceptionParameters.PERMALINK_CODE);
        }
    }

    @Override
    @Test
    public void testRetrievePermalinkByCode() throws Exception {
        String code = PERMALINK_1;
        Permalink permalink = permalinksService.retrievePermalinkByCode(ctx, code);

        assertEquals(code, permalink.getCode());
        assertEquals("http://datasets/ISTAC/OCUPACION_HOTELERA", permalink.getContent());
        assertEquals("1", permalink.getUuid());
        assertEqualsDate(new DateTime(2011, 01, 01, 01, 02, 03, 0), permalink.getCreatedDate());
        assertEquals("user1", permalink.getCreatedBy());
        assertEqualsDate(new DateTime(2012, 01, 22, 01, 02, 03, 0), permalink.getLastUpdated());
        assertEquals("user2", permalink.getLastUpdatedBy());
        assertEquals(Long.valueOf(1), permalink.getVersion());
    }

    @Test
    public void testRetrievePermalinkByCodeErrorNotFound() throws Exception {
        String code = NOT_EXISTS;
        try {
            permalinksService.retrievePermalinkByCode(ctx, code);
            fail("not found");
        } catch (MetamacException e) {
            assertEquals(1, e.getExceptionItems().size());
            assertListContainsExceptionItemOneParameter(e, ServiceExceptionType.PERMALINK_NOT_FOUND, code);
            assertEquals("El enlace con código not-exists no existe", e.getExceptionItems().get(0).getMessage());
        }
    }

    @Test
    public void testRetrievePermalinkByCodeErrorParameterRequired() throws Exception {
        String code = null;
        try {
            permalinksService.retrievePermalinkByCode(ctx, code);
            fail("parameter required");
        } catch (MetamacException e) {
            assertEquals(1, e.getExceptionItems().size());
            assertListContainsExceptionItemOneParameter(e, ServiceExceptionType.PARAMETER_REQUIRED, ServiceExceptionParameters.CODE);
        }
    }

    @Override
    @Test
    public void testFindPermalinksByCondition() throws Exception {
        // Find all
        {
            List<ConditionalCriteria> conditions = ConditionalCriteriaBuilder.criteriaFor(Permalink.class).orderBy(PermalinkProperties.code()).build();
            PagingParameter pagingParameter = PagingParameter.rowAccess(0, Integer.MAX_VALUE, true);
            PagedResult<Permalink> result = permalinksService.findPermalinksByCondition(ctx, conditions, pagingParameter);

            assertEquals(3, result.getTotalRows());
            int i = 0;
            assertEquals(PERMALINK_1, result.getValues().get(i++).getCode());
            assertEquals(PERMALINK_2, result.getValues().get(i++).getCode());
            assertEquals(PERMALINK_3, result.getValues().get(i++).getCode());
            assertEquals(result.getTotalRows(), i);
        }
        // Find by content
        {
            List<ConditionalCriteria> conditions = ConditionalCriteriaBuilder.criteriaFor(Permalink.class).withProperty(PermalinkProperties.content()).like("%ISTAC%")
                    .orderBy(PermalinkProperties.code()).build();
            PagingParameter pagingParameter = PagingParameter.rowAccess(0, Integer.MAX_VALUE, true);
            PagedResult<Permalink> result = permalinksService.findPermalinksByCondition(ctx, conditions, pagingParameter);
            assertEquals(2, result.getTotalRows());
            int i = 0;
            assertEquals(PERMALINK_1, result.getValues().get(i++).getCode());
            assertEquals(PERMALINK_2, result.getValues().get(i++).getCode());
            assertEquals(result.getTotalRows(), i);
        }
    }

    @Override
    protected String getDataSetFile() {
        return "dbunit/PermalinksServiceTest.xml";
    }
}
