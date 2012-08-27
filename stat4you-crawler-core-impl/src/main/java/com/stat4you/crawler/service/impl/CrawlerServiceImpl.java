package com.stat4you.crawler.service.impl;

import static org.quartz.DateBuilder.futureDate;
import static org.quartz.JobBuilder.newJob;
import static org.quartz.SimpleScheduleBuilder.simpleSchedule;
import static org.quartz.TriggerBuilder.newTrigger;

import java.util.Set;

import org.apache.commons.lang.RandomStringUtils;
import org.apache.commons.lang.StringUtils;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.quartz.DateBuilder.IntervalUnit;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SimpleTrigger;
import org.quartz.impl.SchedulerRepository;
import org.quartz.impl.matchers.GroupMatcher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.stat4you.common.Stat4YouConstants;
import com.stat4you.common.spring.ApplicationContextProvider;
import com.stat4you.crawler.droids.enums.CrawlerProvider;
import com.stat4you.crawler.droids.job.ImportDigitalAgendaEuropeCsvOffLineJob;
import com.stat4you.crawler.droids.job.ImportOffLineJob;
import com.stat4you.crawler.droids.job.IstacDroidJob;
import com.stat4you.crawler.util.CrawlerInfo;
import com.stat4you.crawler.util.ForceUpdateInfo;

@Service("crawlerService")
public class CrawlerServiceImpl implements CrawlerService {

    private final Logger log = LoggerFactory.getLogger(CrawlerService.class);
    
    private final String GROUP_CRAWLER = "crawlerDroid";
    private final String GROUP_IMPORT  = "importDroid";

    /**************************************************************************
     * CRAWLERS
     *************************************************************************/
    @Override
    public synchronized boolean forceFireJob(CrawlerProvider crawlerProvider) throws ApplicationException {
        if (crawlerProvider == null) {
            throw new ApplicationException("FIREJOB_ERROR", "Unable to fire JOB, crawlerProvider are required.");
        }
        return fireJob(crawlerProvider, null);
    }

    @Override
    public synchronized boolean fireCrawlerJob(CrawlerProvider crawlerProvider, ForceUpdateInfo forceUpdateInfo) throws ApplicationException {
        if (crawlerProvider == null || forceUpdateInfo == null || StringUtils.isBlank(forceUpdateInfo.getStartUrl())) {
            throw new ApplicationException("FIREJOB_ERROR", "Unable to fire for " + crawlerProvider.getName() + ", crawlerProvider, forceUpdateInfo ant startUrl are required.");
        }

        switch (crawlerProvider) {
            case CRW_EUSTAT:
            case CRW_INE:
            case CRW_ISTAC:
                if (StringUtils.isBlank(forceUpdateInfo.getCategory())) {
                    throw new ApplicationException("FIREJOB_ERROR", "Unable to fire for " + crawlerProvider.getName() + ", category are required.");
                }
            case CRW_IBESTAT:
                break;
            default:
                break;
        }
        return fireJob(crawlerProvider, forceUpdateInfo);
    }

    /**************************************************************************
     * IMPORTS
     *************************************************************************/
    @Override
    public boolean fireImportOffLineJob(String directoryPath) throws ApplicationException {
        return fireImportOffLineJob(directoryPath, null, false);
    }

    @Override
    public synchronized boolean fireImportOffLineJob(String directoryPath, CrawlerInfo crawlerInfo, boolean isForcemode) throws ApplicationException {
        return fireImportOffLineJobCommon(directoryPath, crawlerInfo, isForcemode, ImportOffLineJob.class);
    }

    @Override
    public synchronized boolean fireImportOffLineDigitalAgendaEuropeCsvJob(String directoryPath) throws ApplicationException {
        return fireImportOffLineJobCommon(directoryPath, null, false, ImportDigitalAgendaEuropeCsvOffLineJob.class);
    }

    /**************************************************************************
     * PRIVATE
     **************************************************************************/   
    @SuppressWarnings({"rawtypes", "unchecked"})
    private synchronized boolean fireImportOffLineJobCommon(String directoryPath, CrawlerInfo crawlerInfo, boolean isForcemode, Class jobClass) throws ApplicationException {
        try {
            Scheduler sched = SchedulerRepository.getInstance().lookup(Stat4YouConstants.JOB_SCHEDULER); // get a reference to a scheduler

            // Find jobs with path equals directoryPath
            JobKey jobKey = findPathInImportOfflineJobs(directoryPath, sched);

            if (jobKey == null || isForcemode) {
                JobDataMap jobDataMap = new JobDataMap();
                jobDataMap.put(ImportOffLineJob.DIRECTORY_PATH, directoryPath);

                if (crawlerInfo != null && crawlerInfo.isForceUpdateInfoMode()) {
                    jobDataMap.put(ImportOffLineJob.LOCATIONS, crawlerInfo.getForceUpdateInfoMode().getDownloadedPxs());
                }

                String generatedName = RandomStringUtils.randomAlphabetic(10);
                JobDetail jobDetail = newJob(jobClass).withIdentity("job" + jobClass.getSimpleName() + generatedName, GROUP_IMPORT).usingJobData(jobDataMap).build();

                SimpleTrigger trigger = newTrigger().withIdentity("trigger" + jobClass.getSimpleName() + generatedName, GROUP_CRAWLER).startAt(futureDate(1, IntervalUnit.SECOND))
                        .withSchedule(simpleSchedule()).build();

                sched.scheduleJob(jobDetail, trigger);
                return true;
            }
            return false; // the job is not executing now

        } catch (SchedulerException e) {
            throw new ApplicationException("FIREJOB_ERROR", e.getMessage(), e);
        }
    }

    /**
     * Launch a crawler JOB, configuring partial update if necessary
     * 
     * @param jobKey
     * @param crawlerProvider
     * @param forceUpdateInfo, Required info for partial update, null if is normal execution.
     * @return
     * @throws ApplicationException
     */
    private synchronized boolean fireJob(CrawlerProvider crawlerProvider, ForceUpdateInfo forceUpdateInfo) throws ApplicationException {
        Scheduler sched = SchedulerRepository.getInstance().lookup(Stat4YouConstants.JOB_SCHEDULER); // get a reference to a scheduler

        JobKey jobKey = new JobKey("job" + crawlerProvider.name() + "Droid", GROUP_CRAWLER);
        try {
            switch (crawlerProvider) {
                case CRW_EUSTAT:
                    ((CrawlerInfo) ApplicationContextProvider.getApplicationContext().getBean("eustatCrawlerInfo")).setForceUpdateInfoMode(forceUpdateInfo);
                    SimpleTrigger triggerEustat = newTrigger().withIdentity("triggerForce" + CrawlerProvider.CRW_EUSTAT.name() + "Droid", GROUP_CRAWLER).startAt(futureDate(1, IntervalUnit.SECOND))
                            .withSchedule(simpleSchedule()).forJob(jobKey).build();
                    sched.scheduleJob(triggerEustat);
                    break;
                case CRW_IBESTAT:
                    ((CrawlerInfo) ApplicationContextProvider.getApplicationContext().getBean("ibestatCrawlerInfo")).setForceUpdateInfoMode(forceUpdateInfo);
                    SimpleTrigger triggerIbestat = newTrigger().withIdentity("triggerForce" + CrawlerProvider.CRW_IBESTAT.name() + "Droid", GROUP_CRAWLER).startAt(futureDate(1, IntervalUnit.SECOND))
                            .withSchedule(simpleSchedule()).forJob(jobKey).build();
                    sched.scheduleJob(triggerIbestat);
                    break;
                case CRW_INE:
                    ((CrawlerInfo) (CrawlerInfo) ApplicationContextProvider.getApplicationContext().getBean("ineCrawlerInfo")).setForceUpdateInfoMode(forceUpdateInfo);
                    SimpleTrigger triggerIne = newTrigger().withIdentity("triggerForce" + CrawlerProvider.CRW_INE.name() + "Droid", GROUP_CRAWLER).startAt(futureDate(1, IntervalUnit.SECOND))
                            .withSchedule(simpleSchedule()).forJob(jobKey).build();
                    sched.scheduleJob(triggerIne);
                    break;
                case CRW_ISTAC:
                    ((CrawlerInfo) (CrawlerInfo) ApplicationContextProvider.getApplicationContext().getBean("istacCrawlerInfo")).setForceUpdateInfoMode(forceUpdateInfo);
                    SimpleTrigger triggerIstac = newTrigger().withIdentity("triggerForce" + CrawlerProvider.CRW_ISTAC.name() + "Droid", GROUP_CRAWLER).startAt(futureDate(1, IntervalUnit.SECOND))
                            .withSchedule(simpleSchedule()).forJob(jobKey).build();
                    sched.scheduleJob(triggerIstac);
                    break;
                default:
                    return false;
            }
        } catch (SchedulerException e) {
            if (e instanceof org.quartz.ObjectAlreadyExistsException) {
                log.info("Already exist a forceTrigger, not scheduling another one.");
                return false; // Already exist a forceTrigger, not scheduling another one.
            }
            throw new ApplicationException("FIREJOB_ERROR", "Unable to fire Crawler job for " + crawlerProvider.getName(), e);
        }
        return true;
    }

    /**
     * Search an importOfflineJob with a specific directoryPath
     * 
     * @param directoryPath
     * @param sched
     * @return JobKey is job is found, null is not found
     * @throws SchedulerException
     */
    private JobKey findPathInImportOfflineJobs(String directoryPath, Scheduler sched) throws SchedulerException {
        Set<JobKey> importJobs = sched.getJobKeys(GroupMatcher.jobGroupStartsWith(GROUP_IMPORT));

        for (JobKey jobKey : importJobs) {
            String path = sched.getJobDetail(jobKey).getJobDataMap().getString(ImportOffLineJob.DIRECTORY_PATH);
            if (path.equals(directoryPath)) {
                return jobKey;
            }
        }
        return null;
    }

}
