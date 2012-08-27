package com.stat4you.idxmanager.service.indexation;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.stat4you.idxmanager.exception.IdxManagerException;
import com.stat4you.idxmanager.util.ApplicationContextProvider;

public class IdxManagerJob implements Job {

	private IdxManagerService idxManagerService;
	
	private static Logger logger = LoggerFactory.getLogger(IdxManagerJob.class);
	
    /** Quartz requiere un constructor publico vacio para que el scheduler pueda instanciar la clase cuando la necesite.*/
	public IdxManagerJob() {
	}
	
	@Override
	public void execute(JobExecutionContext jobContext) throws JobExecutionException {
		try {
			logger.info("Running IdxManagerJob ...");
			getIdxManagerService().reloadIndex();
		} catch (IdxManagerException e) {
			logger.error("Exception in idxManager Job "+e.getLocalizedMessage(),e);
			throw new JobExecutionException(e);
		}
	}
	
	private IdxManagerService getIdxManagerService() {
		if (idxManagerService == null) {
			idxManagerService = (IdxManagerService)ApplicationContextProvider.getApplicationContext().getBean("idxManagerService");
		}
		return idxManagerService;
	}
}
