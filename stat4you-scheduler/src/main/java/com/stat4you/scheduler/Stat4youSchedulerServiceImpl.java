package com.stat4you.scheduler;

import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.quartz.DateBuilder;
import org.quartz.DateBuilder.IntervalUnit;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SimpleScheduleBuilder;
import org.quartz.SimpleTrigger;
import org.quartz.TriggerBuilder;
import org.quartz.impl.SchedulerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.stat4you.common.Stat4YouConstants;

@Service("stat4youSchedulerService")
public class Stat4youSchedulerServiceImpl implements Stat4youSchedulerService {

    private static Logger LOG = LoggerFactory.getLogger(Stat4youSchedulerServiceImpl.class);

    @Override
    public void createJob(Stat4youJob job) throws ApplicationException {
        try {
            if (!org.quartz.Job.class.isAssignableFrom(job.getJobClass())) {
                throw new ApplicationException("SCHEDULER_CREATE_JOB_CLASS", "Incompatible type for job class. Passed: " + job.getJobClass());
            }
            Scheduler scheduler = SchedulerRepository.getInstance().lookup(Stat4YouConstants.JOB_SCHEDULER); // get a reference to a scheduler

            JobKey jobKey = new JobKey("job-" + job.getName(), job.getGroup());
            JobDetail jobDetail = scheduler.getJobDetail(jobKey);
            if (jobDetail != null) {
                LOG.warn("Already exist job \"{}\". Ignoring creation.", jobKey);
                return;
            }

            @SuppressWarnings("unchecked")
            Class<? extends org.quartz.Job> clazz = (Class<? extends org.quartz.Job>) job.getJobClass();
            jobDetail = JobBuilder.newJob(clazz).withIdentity(jobKey).storeDurably().build();
            scheduler.addJob(jobDetail, false);
        } catch (Exception e) {
            throw new ApplicationException("SCHEDULER_UNEXPECTED", e.getMessage(), e);
        }

    }

    @Override
    public void fireJob(Stat4youJob job) throws ApplicationException {
        try {
            Scheduler scheduler = SchedulerRepository.getInstance().lookup(Stat4YouConstants.JOB_SCHEDULER); // get a reference to a scheduler

            JobKey jobKey = new JobKey("job-" + job.getName(), job.getGroup());
            JobDetail jobDetail = scheduler.getJobDetail(jobKey);
            if (jobDetail == null) {
                LOG.error("Job not found \"{}\".", jobKey);
                throw new ApplicationException("SCHEDULER_JOB_NOT_FOUND", "SCHEDULER_JOB_NOT_FOUND");
            }

            SimpleTrigger triggerEustat = TriggerBuilder.newTrigger()
                                                        .withIdentity("trigger-" + job.getName(), job.getGroup())
                                                        .startAt(DateBuilder.futureDate(1, IntervalUnit.SECOND))
                                                        .withSchedule(SimpleScheduleBuilder.simpleSchedule())
                                                        .forJob(jobKey)
                                                        .build();
            scheduler.scheduleJob(triggerEustat);
        } catch (Exception e) {
            throw new ApplicationException("FIREJOB_ERROR", e.getMessage(), e);
        }
    }

}
