package com.stat4you.crawler.droids.job;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collection;
import java.util.Iterator;
import java.util.Properties;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.quartz.DisallowConcurrentExecution;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.stat4you.common.dto.InternationalStringDto;
import com.stat4you.common.dto.LocalisedStringDto;
import com.stat4you.common.exception.CommonExceptionCodeEnum;
import com.stat4you.common.spring.ApplicationContextProvider;
import com.stat4you.crawler.util.CrawlerUtil;
import com.stat4you.importation.service.ImportationService;
import com.stat4you.transformation.dto.PxImportDto;

@DisallowConcurrentExecution
public class ImportOffLineJob implements Job {

    private final Logger       log            = LoggerFactory.getLogger(ImportOffLineJob.class);

    private ServiceContext     serviceContext = new ServiceContext("crawler", "crawler-import-offline", "stat4you");

    private ImportationService importationService = null;
    
    // Job Context Param
    public static final String DIRECTORY_PATH = "path";
    public static final String LOCATIONS = "locations";

    public ServiceContext getServiceContext() {
        return serviceContext;
    }
    
    public ImportationService getImportationService() {
        if (importationService == null) {
            importationService = (ImportationService) ApplicationContextProvider.getApplicationContext().getBean("importationService");
        }
        return importationService;
    }

    public ImportOffLineJob() {
    }

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        
        log.info("Starting executing Importing Job...");
        
        String[] extensions = {"px"};

        // Parameters
        JobDataMap data = context.getJobDetail().getJobDataMap();

        String path = null;
        if (data.containsKey(ImportOffLineJob.DIRECTORY_PATH)) {
            path = data.getString(ImportOffLineJob.DIRECTORY_PATH);
            log.info("Path is setting to " + path);
        } else {
            throw new JobExecutionException("Import Offline Job PATH not found");
        }
        
        Collection locations = null;
        if (data.containsKey(ImportOffLineJob.LOCATIONS)) {
            locations = (Collection) data.get(ImportOffLineJob.LOCATIONS);
            log.info("Import locations overwrite [This is a force update)");
        }
        
        try {
            listFiles(extensions, Boolean.TRUE, path, locations);
        } catch (Exception e) {
            throw new JobExecutionException(e);
        }
        
        log.info("Finalized importing Job [" + path + "]");
    }

    /**
     * List files recursively
     * 
     * @param extensions
     * @param recursive
     * @param rootDir
     * @param providerUri
     * @param importationService
     * @throws ApplicationException 
     * @throws IOException 
     * @throws FileNotFoundException 
     * @throws Exception
     */
    private void listFiles(String[] extensions, boolean recursive, String rootDir, Collection files) throws ApplicationException, FileNotFoundException, IOException {
        File directory = new File(rootDir);

        if (!directory.isDirectory()) {
            throw new ApplicationException(CommonExceptionCodeEnum.PARAMETER_INCORRECT.getName(), "The initial path don't is a directory");
        }

        if (files == null) {
            files = FileUtils.listFiles(directory, extensions, recursive);
        }
        for (Iterator iterator = files.iterator(); iterator.hasNext();) {
            File pxFile = (File) iterator.next();

            // Skip if has marked as processed
            File importedFile = new File(pxFile.getParentFile(), pxFile.getName() + ".imported");
            if (importedFile.exists()) {
                continue;
            }
            
            // Error file
            File failedFile = new File(pxFile.getParentFile(), pxFile.getName() + ".failed");
            boolean tryAgainFile = false;
            if (failedFile.exists()) {
                tryAgainFile = true;
            }
            
            Properties properties = new Properties();
            FileInputStream  infoFileInputStream = null;
            try {
                infoFileInputStream = new FileInputStream(new File(pxFile.getParentFile(), pxFile.getName() + ".info"));
                properties.load(infoFileInputStream);
            } catch (Exception e1) {
                log.error("Import[ File: " + pxFile.getParentFile() + "/" + pxFile.getName() + ".info] Info file not found!!!");;
                continue;
            } finally {
                IOUtils.closeQuietly(infoFileInputStream);
            }

            // Provider URI
            String providerUri = properties.getProperty("crawler.provider.uri");
            
            // Category
            String category = null;
            try {
                category = CrawlerUtil.toCategoryStat4You(providerUri, properties.getProperty("crawler.px.category"));
            } catch (ApplicationException e) {
                log.error("Import[ Category: " + properties.getProperty("crawler.px.category") + ", File: " + pxFile.getAbsolutePath() + "] Category not found!!!");
                if (!tryAgainFile) {
                    new File(pxFile.getParentFile(), pxFile.getName() + ".failed").createNewFile(); // Mark as failed PX
                }
                continue;
            }

            // URL
            String url = properties.getProperty("crawler.px.url");

            // GeographicalValue
            InternationalStringDto geographicalValueDto = new InternationalStringDto();

            if (StringUtils.isNotBlank(properties.getProperty("crawler.px.geographicalValue.es"))) {
                LocalisedStringDto localisedStringESDto = new LocalisedStringDto();
                localisedStringESDto.setLocale("es");
                localisedStringESDto.setLabel(properties.getProperty("crawler.px.geographicalValue.es"));
                geographicalValueDto.addText(localisedStringESDto);
            }

            if (StringUtils.isNotBlank(properties.getProperty("crawler.px.geographicalValue.en"))) {
                LocalisedStringDto localisedStringENDto = new LocalisedStringDto();
                localisedStringENDto.setLocale("en");
                localisedStringENDto.setLabel(properties.getProperty("crawler.px.geographicalValue.en"));
                geographicalValueDto.addText(localisedStringENDto);
            }

            // Period
            String period = properties.getProperty("crawler.px.period");
            
            // Title
            InternationalStringDto titleDto = new InternationalStringDto();

            if (StringUtils.isNotBlank(properties.getProperty("crawler.px.title.es"))) {
                LocalisedStringDto titleESDto = new LocalisedStringDto();
                titleESDto.setLocale("es");
                titleESDto.setLabel(properties.getProperty("crawler.px.title.es"));
                titleDto.addText(titleESDto);
            }

            if (StringUtils.isNotBlank(properties.getProperty("crawler.px.title.en"))) {
                LocalisedStringDto titleENDto = new LocalisedStringDto();
                titleENDto.setLocale("en");
                titleENDto.setLabel(properties.getProperty("crawler.px.title.en"));
                titleDto.addText(titleENDto);
            }

            // ForceAddContextInformation
            String forceaddcontextinformation = properties.getProperty("crawler.px.forceaddcontextinformation");
            if (StringUtils.isEmpty(forceaddcontextinformation)) {
                forceaddcontextinformation = "false";
            }
            
            InputStream pxFileInputStream = null;
            PxImportDto pxImportDto = null;
            try {
                pxFileInputStream = new FileInputStream(pxFile);
                pxImportDto = new PxImportDto();
                pxImportDto.setContent(pxFileInputStream);
                pxImportDto.setProviderUri(providerUri);
                pxImportDto.setPxUrl(url);
                pxImportDto.setCategory(category);
                pxImportDto.setTitle((titleDto.getTexts().isEmpty()) ? null : titleDto);
                pxImportDto.setPeriod(period);
                pxImportDto.setGeographicalValue((geographicalValueDto.getTexts().isEmpty()) ? null : geographicalValueDto);
                pxImportDto.setForceAddContextInformation("true".equals(forceaddcontextinformation) ? true : false);
                
                getImportationService().importPx(getServiceContext(), pxImportDto);
                new File(pxFile.getParent(), pxFile.getName() + ".imported").createNewFile(); // Mark as processed PX
                // If is a successfully retry, then remove the failed file.
                if (tryAgainFile) {
                    failedFile.delete();
                }
            } catch (ApplicationException e) {
                log.error("ImportOffline: failed importationSercive invoke", e);
                if (!tryAgainFile) {
                    new File(pxFile.getParentFile(), pxFile.getName() + ".failed").createNewFile(); // Mark as failed PX
                }
                continue;
            } finally {
                IOUtils.closeQuietly(pxFileInputStream);
            }
        }
    }

}
