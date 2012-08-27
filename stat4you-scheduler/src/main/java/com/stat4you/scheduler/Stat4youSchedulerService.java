package com.stat4you.scheduler;

import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;

public interface Stat4youSchedulerService {

    /**
     * Create a job
     * 
     * @param job
     */
    public void createJob(Stat4youJob job) throws ApplicationException;

    /**
     * Fire a job.
     * 
     * @param crawlerProvider
     * @return true if the Job has been planned successfully, otherwise false.
     * @throws ApplicationException
     */
    public void fireJob(Stat4youJob job) throws ApplicationException;

}
