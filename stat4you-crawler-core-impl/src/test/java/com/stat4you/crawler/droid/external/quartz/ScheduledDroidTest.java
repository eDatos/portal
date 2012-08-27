package com.stat4you.crawler.droid.external.quartz;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.quartz.DateBuilder.futureDate;
import static org.quartz.JobBuilder.newJob;
import static org.quartz.SimpleScheduleBuilder.simpleSchedule;
import static org.quartz.TriggerBuilder.newTrigger;

import java.util.Properties;

import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.quartz.DateBuilder.IntervalUnit;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SchedulerFactory;
import org.quartz.SimpleTrigger;
import org.quartz.impl.SchedulerRepository;
import org.quartz.impl.StdSchedulerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.stat4you.common.Stat4YouConstants;
import com.stat4you.common.configuration.Stat4YouConfiguration;
import com.stat4you.crawler.droids.enums.CrawlerProvider;
import com.stat4you.crawler.droids.job.EustatDroidJob;
import com.stat4you.crawler.droids.job.IbestatDroidJob;
import com.stat4you.crawler.droids.job.IneDroidJob;
import com.stat4you.crawler.droids.job.IstacDroidJob;
import com.stat4you.crawler.service.impl.CrawlerService;
import com.stat4you.crawler.util.CrawlerUtil;
import com.stat4you.crawler.util.ForceUpdateInfo;
import com.stat4you.crawler.util.ForceUpdateInfoBuilder;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring/mockito.xml", "classpath:spring/applicationContext-test.xml"})
public class ScheduledDroidTest {

    @Autowired
    private CrawlerService crawlerService;

    @BeforeClass
    public static void setUpBeforeClass() throws Exception {
        // Quartz
        if (SchedulerRepository.getInstance().lookup(Stat4YouConstants.JOB_SCHEDULER) == null) {
            // Create Scheduler for Quartz
            Properties quartzProperties = Stat4YouConfiguration.instance().getProperties();

            SchedulerFactory sf;
            try {
                sf = new StdSchedulerFactory(quartzProperties);
                Scheduler sched = sf.getScheduler();
                // Start now
                sched.start();
            } catch (SchedulerException e) {
                e.printStackTrace();
            }
        }
        
        CrawlerUtil.addCronTrigers();
    }

    @Test
    public void testScheduledDroid() throws Exception {
        
        try {
            Scheduler sched = SchedulerRepository.getInstance().lookup(Stat4YouConstants.JOB_SCHEDULER); // get a reference to a scheduler

            
            JobDetail job = newJob(IstacDroidJob.class).withIdentity("jobIstacDroid", "crawlerDroid").build();

            SimpleTrigger trigger = newTrigger().withIdentity("trigerIstacDroid", "crawlerDroid").startAt(futureDate(1, IntervalUnit.SECOND)).withSchedule(simpleSchedule()).build();

            sched.scheduleJob(job, trigger);
            
            
            JobDetail jobIbestat = newJob(IbestatDroidJob.class).withIdentity("jobIbestatcDroid", "crawlerDroid").build();

            SimpleTrigger triggerIbestat = newTrigger().withIdentity("trigerIbestatDroid", "crawlerDroid").startAt(futureDate(1, IntervalUnit.SECOND)).withSchedule(simpleSchedule()).build();

            sched.scheduleJob(jobIbestat, triggerIbestat);
            
           
            JobDetail jobEustat = newJob(EustatDroidJob.class).withIdentity("jobEustatDroid", "crawlerDroid").build();

            SimpleTrigger triggerEustat = newTrigger().withIdentity("trigerEustatDroid", "crawlerDroid").startAt(futureDate(1, IntervalUnit.SECOND)).withSchedule(simpleSchedule()).build();

            sched.scheduleJob(jobEustat, triggerEustat);
            
           
            JobDetail jobIne = newJob(IneDroidJob.class).withIdentity("jobIneDroid", "crawlerDroid").build();

            SimpleTrigger triggerIne = newTrigger().withIdentity("trigerIneDroid", "crawlerDroid").startAt(futureDate(1, IntervalUnit.SECOND)).withSchedule(simpleSchedule()).build();

            sched.scheduleJob(jobIne, triggerIne);
            
            Thread.sleep(40 * 1000l);
        } catch (SchedulerException e) {
            // TODO add exception
            e.printStackTrace();
        }

    }
    
    @Test
    @Ignore
    public void testTemp() throws Exception {
        assertTrue(this.crawlerService.fireImportOffLineJob("C:/data/stat4you/crawler/px/test/ISTAC"));
        
        assertFalse(this.crawlerService.fireImportOffLineJob("C:/data/stat4you/crawler/px/test/ISTAC"));
        
        assertFalse(this.crawlerService.fireImportOffLineJob("C:/data/stat4you/crawler/px/test/ISTAC"));
        
        Thread.sleep(5 * 1000l);
    }
    
    @Test
//  @Ignore
  public void testCrawlerFireJobINE() throws Exception {

      assertTrue(this.crawlerService.forceFireJob(CrawlerProvider.CRW_INE));
      assertTrue(this.crawlerService.forceFireJob(CrawlerProvider.CRW_EUSTAT));
      assertTrue(this.crawlerService.forceFireJob(CrawlerProvider.CRW_IBESTAT));
      assertTrue(this.crawlerService.forceFireJob(CrawlerProvider.CRW_ISTAC));

      Thread.sleep(5 * 1000l);
  }
    
    @Test
//    @Ignore
    public void testCrawlerFireJobOneInstance() throws Exception {

        ForceUpdateInfo forceUpdateInfoMode = ForceUpdateInfoBuilder.forceUpdateInfo().withCategory("sociedad")
                .withStartUrl("http://www2.gobiernodecanarias.org/istac/jaxi-web/menu.do?path=/03022/E30416A/P0001&file=pcaxis&type=pcaxis").build();

        assertTrue(this.crawlerService.fireCrawlerJob(CrawlerProvider.CRW_ISTAC, forceUpdateInfoMode));
        assertFalse(this.crawlerService.forceFireJob(CrawlerProvider.CRW_ISTAC));
        assertFalse(this.crawlerService.fireCrawlerJob(CrawlerProvider.CRW_ISTAC, forceUpdateInfoMode));

        Thread.sleep(5 * 1000l);
    }

}
