package org.siemac.metamac.portal.core.serviceapi;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.siemac.metamac.portal.core.serviceapi.common.PortalBaseTest;
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
public class PermalinkServiceTest extends PortalBaseTest implements PermalinkServiceTestBase {

    @Autowired
    protected PermalinkService permalinkService;

    @Override
    @Test
    public void testCreatePermalink() throws Exception {
        // TODO Auto-generated method stub
    }

    @Override
    @Test
    public void testRetrievePermalinkByCode() throws Exception {
        // TODO Auto-generated method stub
    }

    @Override
    protected String getDataSetFile() {
        return "dbunit/PermalinkServiceTest.xml";
    }
}
