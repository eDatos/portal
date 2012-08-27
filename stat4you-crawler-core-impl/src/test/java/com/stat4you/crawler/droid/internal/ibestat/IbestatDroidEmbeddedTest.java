package com.stat4you.crawler.droid.internal.ibestat;

import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.apache.droids.api.Droid;
import org.apache.droids.api.Link;
import org.apache.droids.robot.crawler.CrawlingDroid;
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
import com.stat4you.crawler.droid.ResourceHandler;
import com.stat4you.crawler.util.CrawlerInfo;
import com.stat4you.crawler.util.LocalHttpServer;
import com.stat4you.importation.service.ImportationService;
import com.stat4you.transformation.dto.PxImportDto;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring/mockito.xml", "classpath:spring/applicationContext-test.xml", "classpath:spring/droids/droids-core-context-ibestat.xml"})
public class IbestatDroidEmbeddedTest {

    private CrawlerInfo crawlerInfo = null;

    protected LocalHttpServer    testserver;

    @Autowired
    private ImportationService importationService;
    
    public CrawlerInfo getCrawlerInfo() {
        return crawlerInfo;
    }

    @BeforeClass
    public static void setUpBeforeClass() throws Exception {
        System.setProperty(Stat4YouConstants.PROP_DATA_URL, "./data/");
    }

    @Before
    public void setUp() throws Exception {
        this.crawlerInfo = (CrawlerInfo) ApplicationContextProvider.getApplicationContext().getBean("ibestatCrawlerInfo");
        this.testserver = new LocalHttpServer();

        when(importationService.importPx((ServiceContext) Matchers.anyObject(), (PxImportDto) Matchers.anyObject())).thenReturn("stat4you:dsd:dataset:1");
    }

    @Test
    public void testIbeCrawlingDroid() throws Exception {
        this.testserver.register("*", new ResourceHandler());
        this.testserver.start();

        String baseURI = "http:/" + this.testserver.getServiceAddress();
        String targetURI = baseURI + "/ibestat_html";

        Droid<Link> droid = createSimpleReportCrawlingDroid(targetURI);

        // Droid
        droid.init();
        droid.start();

        // Wait until finish
        droid.getTaskMaster().awaitTermination(300, TimeUnit.SECONDS);
    }

    private Droid<Link> createSimpleReportCrawlingDroid(final String targetURI) {
        Droid<Link> droid = (Droid<Link>) ApplicationContextProvider.getApplicationContext().getBean("ibestatCrawler");

        Assert.assertFalse("Droid is null.", droid == null);
        Assert.assertTrue("The test droid must be an instance of SaveCrawlingDroid", droid instanceof com.stat4you.crawler.droids.impl.Stat4youPxCrawlingDroid);

        final List<String> locations = new ArrayList<String>();
        locations.add(targetURI);
        ((CrawlingDroid) droid).setInitialLocations(locations);

        return droid;
    }

}
