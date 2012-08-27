package com.stat4you.crawler.droids.job;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.apache.droids.api.Droid;
import org.apache.droids.api.Link;
import org.apache.droids.robot.crawler.CrawlingDroid;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.quartz.DisallowConcurrentExecution;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.stat4you.common.configuration.Stat4YouConfiguration;
import com.stat4you.common.spring.ApplicationContextProvider;
import com.stat4you.crawler.droids.impl.Stat4youPxCrawlingDroid;
import com.stat4you.crawler.droids.impl.Stat4youSimpleTaskQueueWithHistory;
import com.stat4you.crawler.service.impl.CrawlerService;
import com.stat4you.crawler.util.CrawlerInfo;
import com.stat4you.crawler.util.FileRepositoryIndex;

@DisallowConcurrentExecution
public class IstacDroidJob implements Job {

    private final Logger log = LoggerFactory.getLogger(IstacDroidJob.class);
    
    public IstacDroidJob() {
    }
    
    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        log.info("Starting executing crawler Istac");
        Droid<Link> droid = (Stat4youPxCrawlingDroid) ApplicationContextProvider.getApplicationContext().getBean("istacCrawler");
        
        // Initialized Crawler context info
        CrawlerInfo crawlerInfo = (CrawlerInfo) ApplicationContextProvider.getApplicationContext().getBean("istacCrawlerInfo");
        
        // Initialized Queue
        Stat4youSimpleTaskQueueWithHistory stat4youSimpleTaskQueueWithHistory = (Stat4youSimpleTaskQueueWithHistory) ApplicationContextProvider.getApplicationContext().getBean("istacQueue");
        stat4youSimpleTaskQueueWithHistory.clearHistory();
        
        // Locations
        List<String> locations;
        if (crawlerInfo.isForceUpdateInfoMode()) {
            locations = new ArrayList<String>();
            locations.add(crawlerInfo.getForceUpdateInfoMode().getStartUrl().toString());
        }
        else {
            // Failed before locations      
            locations = ((Stat4youPxCrawlingDroid)droid).getCrawlerInfo().retrieveUrlsNotLoaded();

            // Originals locations
            locations.add("http://www.gobiernodecanarias.org/istac/temas_estadisticos/temas.html"); 
        }

        ((CrawlingDroid) droid).setInitialLocations(locations);

        // Droid
        try {
            droid.init();
            droid.start();

            // Wait until finish
            droid.getTaskMaster().awaitTermination(0, TimeUnit.SECONDS);
        } catch (Exception e) {
            log.error("Error executing crawler of Istac", e);
        }
        
        // Close Lucene Index
        FileRepositoryIndex fileRepositoryIndex = (FileRepositoryIndex) ApplicationContextProvider.getApplicationContext().getBean("istacFileRepositoryIndex");
        try {
            fileRepositoryIndex.closeIndex();
        } catch (ApplicationException e1) {
            log.error("Error executing close Index for Istac.", e1);
        }
        
        // Run JOB IMPORT OFFLINE
        CrawlerService crawlerService = (CrawlerService) ApplicationContextProvider.getApplicationContext().getBean("crawlerService");
        
        StringBuffer path = new StringBuffer(Stat4YouConfiguration.instance().getProperty("stat4you.crawler.droids.handler.save.dir"));
        path.append("/").append(crawlerInfo.getCrawlerName());
        
        try {
            crawlerService.fireImportOffLineJob(path.toString(), crawlerInfo, true);
        } catch (ApplicationException e) {
            log.error("Error executing import of Istac; " + path.toString(), e);
        }
        log.info("Finalized crawler Istac [ForceMode: " + crawlerInfo.isForceUpdateInfoMode()+ "]");
    }
    
}
