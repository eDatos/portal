package com.stat4you.crawler.droid.external.droid;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.apache.droids.api.Droid;
import org.apache.droids.api.Link;
import org.apache.droids.exception.DroidsException;
import org.apache.droids.robot.crawler.CrawlingDroid;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Matchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.stat4you.common.Stat4YouConstants;
import com.stat4you.common.spring.ApplicationContextProvider;
import com.stat4you.crawler.droids.handle.PxHandler;
import com.stat4you.crawler.util.CrawlerInfo;
import com.stat4you.crawler.util.FileRepositoryIndex;
import com.stat4you.crawler.util.ForceUpdateInfo;
import com.stat4you.crawler.util.ForceUpdateInfoBuilder;
import com.stat4you.importation.service.ImportationService;
import com.stat4you.transformation.dto.PxImportDto;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring/mockito.xml", "classpath:spring/applicationContext-test.xml"})
public class IstacDroidExternalTest {

    private CrawlerInfo crawlerInfo = null;

    @Autowired
    private ImportationService importationService;
    
    @BeforeClass
    public static void setUpBeforeClass() throws Exception {
        System.setProperty(Stat4YouConstants.PROP_DATA_URL, "./data/");
    }

    @Before
    public void setUp() throws Exception {
        this.crawlerInfo = (CrawlerInfo) ApplicationContextProvider.getApplicationContext().getBean("istacCrawlerInfo");
        
        when(importationService.importPx((ServiceContext) Matchers.anyObject(), (PxImportDto) Matchers.anyObject())).thenReturn("stat4you:dsd:dataset:1");
    }

    @Test
    public void testForceUpdateCrawlingDroid() throws Exception {
        ForceUpdateInfo forceUpdateInfoMode = ForceUpdateInfoBuilder.forceUpdateInfo().withCategory("sociedad")
                .withStartUrl("http://www2.gobiernodecanarias.org/istac/jaxi-web/menu.do?path=/03022/E30416A/P0001&file=pcaxis&type=pcaxis").build();

        this.crawlerInfo.setForceUpdateInfoMode(forceUpdateInfoMode);

        crawlingDroid(null);
    }
    
    @Test
    public void testReportCrawlingDroid() throws Exception {
        // Failed before locations      
        List<String> locations = this.crawlerInfo.retrieveUrlsNotLoaded();
        
        locations.add("http://www.gobiernodecanarias.org/istac/temas_estadisticos/temas.html");
 
        crawlingDroid(locations);
    }

    /**************************************************************************
     * PRIVATE
     *************************************************************************/
    
    private void crawlingDroid(List<String> locations) throws DroidsException, InterruptedException, ApplicationException {
        ((PxHandler) ApplicationContextProvider.getApplicationContext().getBean("istacPxHandler")).setImportationService(mock(ImportationService.class));
        
        Droid<Link> droid = null;
        
        if (this.crawlerInfo.isForceUpdateInfoMode()) {
            locations = new ArrayList<String>();
            locations.add(this.crawlerInfo.getForceUpdateInfoMode().getStartUrl().toString());
        }
        
        droid = createSimpleReportCrawlingDroid(locations);

        // Droid
        droid.init();
        droid.start();

        // Wait until finish
        droid.getTaskMaster().awaitTermination(300, TimeUnit.SECONDS);
        
        // Close Lucene Index
        FileRepositoryIndex fileRepositoryIndex = (FileRepositoryIndex) ApplicationContextProvider.getApplicationContext().getBean("istacFileRepositoryIndex");
        fileRepositoryIndex.closeIndex();
    }

    private Droid<Link> createSimpleReportCrawlingDroid(List<String> locations) {
        Droid<Link> droid = (Droid<Link>) ApplicationContextProvider.getApplicationContext().getBean("istacCrawler");
        Assert.assertFalse("Droid is null.", droid == null);
        Assert.assertTrue("The test droid must be an instance of Stat4youPxCrawlingDroid", droid instanceof com.stat4you.crawler.droids.impl.Stat4youPxCrawlingDroid);
        ((CrawlingDroid) droid).setInitialLocations(locations);

        return droid;
    }
    
}
