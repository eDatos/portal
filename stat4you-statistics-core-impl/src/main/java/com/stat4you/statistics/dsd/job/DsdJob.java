package com.stat4you.statistics.dsd.job;

import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import com.stat4you.common.spring.ApplicationContextProvider;
import com.stat4you.idxmanager.service.indexation.IdxManagerService;


public class DsdJob implements Job {

    // Note: this bean can not be autowired
    private IdxManagerService  idxManagerService;

    public static final String JOB_DSD_GROUP                 = "jobDsdGroup";

    public static final String JOB_IDENTITY_PREFIX           = "jobDsd";
    public static final String JOB_TRIGGER_PREFIX            = "triggerDsd";

    public static final String PARAMETER_DATASET_URI         = "datasetUri";
    public static final String PARAMETER_OPERATION           = "operation";
    public static final String PARAMETER_OPERATION_PUBLISH   = "indexPublished";
    public static final String PARAMETER_OPERATION_UNPUBLISH = "indexUnpublished";

    public DsdJob() {
        idxManagerService = (IdxManagerService) ApplicationContextProvider.getApplicationContext().getBean("idxManagerService");
    }

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {

        // Parameters
        String operation = getParameter(context, DsdJob.PARAMETER_OPERATION);

        // Do operation
        try {
            if (PARAMETER_OPERATION_PUBLISH.equals(operation)) {
                String datasetUri = getParameter(context, DsdJob.PARAMETER_DATASET_URI);
                idxManagerService.indexDatasetPublished(datasetUri);
            } else if (PARAMETER_OPERATION_UNPUBLISH.equals(operation)) {
                String datasetUri = getParameter(context, DsdJob.PARAMETER_DATASET_URI);
                idxManagerService.removeDataset(datasetUri);
            } else {
                throw new JobExecutionException("Operation not supported: " + operation);
            }
        } catch (Exception e) {
            throw new JobExecutionException(e);
        }
    }

    /**
     * Get parameter of data job
     */
    private String getParameter(JobExecutionContext context, String key) throws JobExecutionException {
        JobDataMap data = context.getJobDetail().getJobDataMap();
        if (data.containsKey(key)) {
            return data.getString(key);
        }
        throw new JobExecutionException("Job execution failed: parameter '" + key + "' not found");
    }
}
