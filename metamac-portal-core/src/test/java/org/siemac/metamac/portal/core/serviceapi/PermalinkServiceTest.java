package org.siemac.metamac.portal.core.serviceapi;

import static org.junit.Assert.fail;

import org.fornax.cartridges.sculptor.framework.test.AbstractDbUnitJpaTests;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Spring based transactional test with DbUnit support.
 */
public class PermalinkServiceTest extends AbstractDbUnitJpaTests implements PermalinkServiceTestBase {

    @Autowired
    protected PermalinkService permalinkService;

    @Override
    @Test
    public void testCreatePermalink() throws Exception {
        // TODO Auto-generated method stub
        fail("testCreatePermalink not implemented");
    }

    @Override
    @Test
    public void testRetrievePermalinkByCode() throws Exception {
        // TODO Auto-generated method stub
        fail("testRetrievePermalinkByCode not implemented");
    }
}
