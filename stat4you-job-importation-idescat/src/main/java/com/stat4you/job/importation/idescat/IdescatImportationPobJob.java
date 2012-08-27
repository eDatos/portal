package com.stat4you.job.importation.idescat;

import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.quartz.DisallowConcurrentExecution;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.stat4you.common.configuration.Stat4YouConfiguration;
import com.stat4you.common.spring.ApplicationContextProvider;
import com.stat4you.importation.service.ImportationService;
import com.stat4you.job.importation.idescat.processor.IdescatPobDatasetProcessor;

@DisallowConcurrentExecution
public class IdescatImportationPobJob implements Job {

    private static final Logger         LOG = LoggerFactory.getLogger(IdescatImportationPobJob.class);
    // TODO ADD SECURITY
    private static final ServiceContext ctx = new ServiceContext("idescat-user", null, null, null);
    
    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        ImportationService importationService = ApplicationContextProvider.getApplicationContext().getBean(ImportationService.class);

        String datasetUri = null;
        try {
            String feedUrl = Stat4YouConfiguration.instance().getProperty(JobImportationIdescatConstant.PROP_ENDPOINT_API) + "/pob/v1/cerca.xml";
            String providerURI = Stat4YouConfiguration.instance().getProperty(JobImportationIdescatConstant.PROP_ENDPOINT_PROVIDER_URI);

            IdescatPobDatasetProcessor idescatPobDatasetProcessor = new IdescatPobDatasetProcessor(feedUrl, providerURI);            
            importationService.importStatistic(ctx, idescatPobDatasetProcessor);
        } catch (ApplicationException e) {
            LOG.error("Recovering from exception. Discard draft version of dataset " + datasetUri, e);
        }
    }

}
