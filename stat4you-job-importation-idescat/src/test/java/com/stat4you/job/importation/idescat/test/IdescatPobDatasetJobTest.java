package com.stat4you.job.importation.idescat.test;

import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.quartz.JobBuilder.newJob;
import static org.quartz.TriggerBuilder.newTrigger;

import org.apache.http.localserver.LocalTestServer;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.Trigger;
import org.quartz.impl.StdSchedulerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.stat4you.common.spring.ApplicationContextProvider;
import com.stat4you.importation.processor.StatisticProcessor;
import com.stat4you.importation.service.ImportationService;
import com.stat4you.job.importation.idescat.IdescatImportationPobJob;
import com.stat4you.job.importation.idescat.JobImportationIdescatConstant;
import com.stat4you.job.importation.idescat.test.http.IdescatHttpRequestHandler;
import com.stat4you.job.importation.idescat.test.http.LocalHttpServerSingleton;
import com.stat4you.job.importation.idescat.test.quartz.TriggerStatusListener;
import com.stat4you.job.importation.idescat.test.quartz.TriggerStatusListener.TriggerStatus;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring/job-importation-test.xml"})
public class IdescatPobDatasetJobTest {

    private static Logger      LOG                = LoggerFactory.getLogger(IdescatPobDatasetJobTest.class);

    private ImportationService importationService = null;

    @BeforeClass
    public static void setupTestClass() throws Exception {
        LocalTestServer localHttpServer = LocalHttpServerSingleton.getLocalHttpServer();
        localHttpServer.register("/pob/v1/*", new IdescatHttpRequestHandler());
        localHttpServer.start();
        System.setProperty(JobImportationIdescatConstant.PROP_ENDPOINT_API, "http://" + localHttpServer.getServiceAddress().getHostName() + ":" + localHttpServer.getServiceAddress().getPort());
        
        LOG.info("Started Http Server in: {}", localHttpServer.getServiceAddress());
        
    }

    @AfterClass
    public static void tearDownTestClass() throws Exception {
        LocalHttpServerSingleton.getLocalHttpServer().stop();        
        LocalHttpServerSingleton.clearLocalHttpServer();
        
        LOG.info("Stoped Http Server");
    }

    @Before
    public void setupTest() throws Exception {
        importationService = ApplicationContextProvider.getApplicationContext().getBean(ImportationService.class);
        reset(importationService);

        when(importationService.importStatistic(any(ServiceContext.class), any(StatisticProcessor.class))).thenReturn("DATASET:1");
    }

    @Test
    public void executeJob() throws Exception {
        IdescatImportationPobJob job = new IdescatImportationPobJob();
        job.execute(null);

        ArgumentCaptor<StatisticProcessor> captureStatisticProcessor = ArgumentCaptor.forClass(StatisticProcessor.class);
        // ArgumentCaptor<List<StatisticProcessor>> captureList = (ArgumentCaptor<List<StatisticProcessor>>) (Object) ArgumentCaptor.forClass(List.class);
        verify(importationService, times(1)).importStatistic(any(ServiceContext.class), captureStatisticProcessor.capture());
    }

    @Test
    public void avoidConcurrentInvocation() throws Exception {

        when(importationService.importStatistic(any(ServiceContext.class), any(StatisticProcessor.class))).thenAnswer(new Answer<String>() {

            @Override
            public String answer(InvocationOnMock invocation) throws Throwable {
                Thread.sleep(500);
                return "ABCD1234";
            }
        });

        Scheduler scheduler = null;
        try {
            TriggerStatusListener listener = new TriggerStatusListener();

            // Grab the Scheduler instance from the Factory
            scheduler = StdSchedulerFactory.getDefaultScheduler();
            scheduler.getListenerManager().addTriggerListener(listener);

            // and start it off
            scheduler.start();

            JobDetail job = newJob(IdescatImportationPobJob.class)
                            .withIdentity("job", "group")
                            .storeDurably()
                            .build();

            scheduler.addJob(job, true);

            Trigger trigger1 = newTrigger()
                              .withIdentity("trigger1", "group")
                              .forJob(job.getKey())
                              .startNow()
                              .build();

            Trigger trigger2 = newTrigger()
                               .withIdentity("trigger2", "group")
                               .forJob(job.getKey())
                               .startNow()
                               .build();

            scheduler.scheduleJob(trigger1);
            scheduler.scheduleJob(trigger2);

            boolean repeat = false;
            do {
                repeat = false;
                TriggerStatus triggerStatus = listener.getStatus().get(trigger2.getKey());
                if (triggerStatus == null || triggerStatus.getCompleteDate() == null) {
                    Thread.sleep(500);
                    repeat = true;
                }
            } while (repeat);

            // Trigger1.CompleteDate <= Trigger2.FireDate
            TriggerStatus triggerStatus1 = listener.getStatus().get(trigger1.getKey());
            TriggerStatus triggerStatus2 = listener.getStatus().get(trigger2.getKey());
            assertTrue(triggerStatus1.getCompleteDate().compareTo(triggerStatus2.getFireDate()) <= 0);

            verify(importationService, times(2)).importStatistic(any(ServiceContext.class), any(StatisticProcessor.class));
        } finally {
            scheduler.shutdown();
        }

    }
}
