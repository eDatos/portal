package com.stat4you.job.importation.idescat;

import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.CoreProtocolPNames;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class IdescatImportationJob implements Job {

    private static final Logger LOG        = LoggerFactory.getLogger(IdescatImportationJob.class);
    private static final String USER_AGENT = "Apache-Droids/1.1 (java 1.5)";

    private final HttpClient    httpclient;

    public IdescatImportationJob() {
        this(new DefaultHttpClient());
    }

    public IdescatImportationJob(final HttpClient httpclient) {
        super();
        this.httpclient = httpclient;
        this.httpclient.getParams().setParameter(CoreProtocolPNames.USER_AGENT, USER_AGENT);
    }

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {

        try {
            // TODO
//            String getUrl = Stat4YouConfiguration.instance().getProperty(JobImportationIdescatConstant.PROP_ENDPOINT_API) + "/emex/v1/dades.xml?lang=es&id=09";
//            EmexFitxes emexFitxes = getEmexFitxes(getUrl);
            
            
            
        } catch (Exception e) {
            LOG.error("Idescat Importation Error", e);
        }

        // Droid<Link> droid = (Stat4youPxCrawlingDroid) ApplicationContextProvider.getApplicationContext().getBean("ineCrawler");
        //
        // // Initialized Crawler context info
        // CrawlerInfo crawlerInfo = (CrawlerInfo) ApplicationContextProvider.getApplicationContext().getBean("ineCrawlerInfo");
        // crawlerInfo.clearContext();
        //
        // // Initialized Queue
        // Stat4youSimpleTaskQueueWithHistory stat4youSimpleTaskQueueWithHistory = (Stat4youSimpleTaskQueueWithHistory) ApplicationContextProvider.getApplicationContext().getBean("ineQueue");
        // stat4youSimpleTaskQueueWithHistory.clear();
        //
        // // Failed before locations
        // List<String> locations = ((Stat4youPxCrawlingDroid)droid).getCrawlerInfo().retrieveUrlsNotLoaded();
        //
        // // Originals locations
        // locations.add("http://www.ine.es/inebmenu/indice.htm");
        //
        // ((CrawlingDroid) droid).setInitialLocations(locations);
        //
        // // Droid
        // try {
        // droid.init();
        // droid.start();
        //
        // // Wait until finish
        // droid.getTaskMaster().awaitTermination(0, TimeUnit.SECONDS);
        // } catch (Exception e) {
        // log.error("Error executing crawler of Ine", e);
        // }
        //
        // // Update Info for crawler execution
        // crawlerInfo.updateCrawlerInfoDate();
        //
        // // Close Lucene Index
        // FileRepositoryIndex fileRepositoryIndex = (FileRepositoryIndex) ApplicationContextProvider.getApplicationContext().getBean("ineFileRepositoryIndex");
        // try {
        // fileRepositoryIndex.closeIndex();
        // } catch (ApplicationException e1) {
        // log.error("Error executing close Index for Ine.", e1);
        // }
        //
        // // Run JOB IMPORT OFFLINE
        // CrawlerService crawlerService = (CrawlerService) ApplicationContextProvider.getApplicationContext().getBean("crawlerService");
        //
        // StringBuffer path = new StringBuffer(Stat4YouConfiguration.instance().getProperty("stat4you.crawler.droids.handler.save.dir"));
        // path.append("/").append(crawlerInfo.getCrawlerName());
        //
        // try {
        // crawlerService.fireImportOffLineJob(path.toString());
        // } catch (ApplicationException e) {
        // log.error("Error executing import of Ine; " + path.toString(), e);
        // }

    }

//    private EmexFitxes getEmexFitxes(String getUrl) {
//        try {
//            HttpGet httpGet = new HttpGet(getUrl);
//            HttpResponse httpResponse = httpclient.execute(httpGet);
//            HttpEntity entity = httpResponse.getEntity();
//            if (entity != null) {
//                InputStream instream = entity.getContent();
//                try {
//                    return JAXB.unmarshal(instream, EmexFitxes.class);
//                } finally {
//                    instream.close();
//                }
//            }
//            throw new ApplicationException(JobImportationIdescatConstant.ERROR_RESOURCE_NOT_FOUND, "Resource \"" + getUrl + "\" not found");
//        } catch (Exception e) {
//            LOG.error("Error obtaining \"EmexFitxes\" from \"{}\"", getUrl);
//            throw new RuntimeException(e);
//        }
//    }

}
