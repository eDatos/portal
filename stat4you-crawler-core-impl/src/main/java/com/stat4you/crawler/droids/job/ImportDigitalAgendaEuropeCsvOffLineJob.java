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
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
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
import com.stat4you.importation.service.ImportationService;
import com.stat4you.transformation.dto.DigitalAgendaEuropeCsvDto;

public class ImportDigitalAgendaEuropeCsvOffLineJob implements Job {

    private final Logger       log                = LoggerFactory.getLogger(ImportDigitalAgendaEuropeCsvOffLineJob.class);

    private ServiceContext     serviceContext     = new ServiceContext("crawler", "crawler-import-offline", "stat4you");

    private ImportationService importationService = null;

    private DateTimeFormatter  dateTimeFormatter  = DateTimeFormat.forPattern("dd/MM/yyyy HH:mm");

    // Job Context Param
    public static final String DIRECTORY_PATH     = "path";

    public ServiceContext getServiceContext() {
        return serviceContext;
    }

    public ImportationService getImportationService() {
        if (importationService == null) {
            importationService = (ImportationService) ApplicationContextProvider.getApplicationContext().getBean("importationService");
        }
        return importationService;
    }

    public ImportDigitalAgendaEuropeCsvOffLineJob() {
    }

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        log.info("Starting executing import DigitalAgendaEuropeCsvOffLine Job...");
        
        String[] extensions = {"info"};

        // Parameters
        JobDataMap data = context.getJobDetail().getJobDataMap();

        String path = null;
        if (data.containsKey(ImportDigitalAgendaEuropeCsvOffLineJob.DIRECTORY_PATH)) {
            path = data.getString(ImportDigitalAgendaEuropeCsvOffLineJob.DIRECTORY_PATH);
            log.info("Path is setting to " + path);
        } else {
            throw new JobExecutionException("Import Offline Job PATH not found");
        }

        try {
            importDigitalAgendaEuropeCsvFiles(extensions, Boolean.TRUE, path);
        } catch (Exception e) {
            throw new JobExecutionException(e);
        }
        
        log.info("Finalized import DigitalAgendaEuropeCsvOffLine Job [" + path + "]");
    }

    /**
     * Import all files of Digital Agenda for Europe
     */
    @SuppressWarnings("rawtypes")
    private void importDigitalAgendaEuropeCsvFiles(String[] extensions, boolean recursive, String rootDir) throws ApplicationException, FileNotFoundException, IOException {
        
        File rootDirectoryFile = new File(rootDir);

        if (!rootDirectoryFile.isDirectory()) {
            throw new ApplicationException(CommonExceptionCodeEnum.PARAMETER_INCORRECT.getName(), "The initial path don't is a directory");
        }

        Collection files = FileUtils.listFiles(rootDirectoryFile, extensions, recursive);

        for (Iterator iterator = files.iterator(); iterator.hasNext();) {
            File infoFile = (File) iterator.next();
            File directory = infoFile.getParentFile();

            String filenamePrefix = FilenameUtils.getBaseName(infoFile.getName());

            // Skip if has marked as processed
            File importedFile = new File(directory, filenamePrefix + ".imported");
            if (importedFile.exists()) {
                continue;
            }

            // Error file
            File failedFile = new File(directory, filenamePrefix + ".failed");
            boolean retryingPreviousFailed = false;
            if (failedFile.exists()) {
                retryingPreviousFailed = true;
            }

            // Load info file
            Properties properties = new Properties();
            FileInputStream infoFileInputStream = null;
            try {
                infoFileInputStream = new FileInputStream(infoFile);
                properties.load(infoFileInputStream);
            } catch (Exception e1) {
                log.error("Import[ File: " + directory + "/" + filenamePrefix + "] Error loading info file");
                continue;
            } finally {
                IOUtils.closeQuietly(infoFileInputStream);
            }

            // Load info
            String providerUri = properties.getProperty("provider.uri");
            String category = properties.getProperty("category");
            String identifier = properties.getProperty("identifier");
            String url = properties.getProperty("url");
            String language = properties.getProperty("language");
            String languages = properties.getProperty("languages");
            InternationalStringDto title = loadInternationalString("title", properties);
            InternationalStringDto description = loadInternationalString("description", properties);
            String providerPublishingDate = properties.getProperty("providerPublishingDate");
            String providerReleaseDate = properties.getProperty("providerReleaseDate");

            InputStream dataInputStream = null;
            InputStream indicatorsInputStream = null;
            InputStream sourcesInputStream = null;
            try {
                dataInputStream = loadCsvFile(directory, filenamePrefix, "data");
                indicatorsInputStream = loadCsvFile(directory, filenamePrefix, "indicators");
                sourcesInputStream = loadCsvFile(directory, filenamePrefix, "sources");

                DigitalAgendaEuropeCsvDto digitalAgendaEuropeCsvDto = new DigitalAgendaEuropeCsvDto();
                digitalAgendaEuropeCsvDto.setData(dataInputStream);
                digitalAgendaEuropeCsvDto.setIndicators(indicatorsInputStream);
                digitalAgendaEuropeCsvDto.setSources(sourcesInputStream);
                digitalAgendaEuropeCsvDto.setUrl(url);
                digitalAgendaEuropeCsvDto.setLanguage(language);
                if (!StringUtils.isBlank(languages)) {
                    String[] languagesSplited = languages.split("#");
                    for (int i = 0; i < languagesSplited.length; i++) {
                        digitalAgendaEuropeCsvDto.getLanguages().add(languagesSplited[i]);
                    }
                }
                digitalAgendaEuropeCsvDto.setProviderUri(providerUri);
                digitalAgendaEuropeCsvDto.setIdentifier(identifier);
                digitalAgendaEuropeCsvDto.setTitle(title);
                digitalAgendaEuropeCsvDto.setDescription(description);
                digitalAgendaEuropeCsvDto.setCategory(category);
                digitalAgendaEuropeCsvDto.setProviderPublishingDate(dateTimeFormatter.parseDateTime(providerPublishingDate));
                digitalAgendaEuropeCsvDto.setProviderReleaseDate(dateTimeFormatter.parseDateTime(providerReleaseDate));

                // Import
                getImportationService().importDigitalAgendaEuropeCsv(serviceContext, digitalAgendaEuropeCsvDto);
                // Mark as processed
                createFile(directory, filenamePrefix, "imported");
                // If is a successfully retry, then remove the failed file
                if (retryingPreviousFailed) {
                    failedFile.delete();
                }
            } catch (Exception e) {
                log.error("Error importing csv files", e);
                createFile(directory, filenamePrefix, "failed");
                continue;
            } finally {
                IOUtils.closeQuietly(dataInputStream);
                IOUtils.closeQuietly(indicatorsInputStream);
                IOUtils.closeQuietly(sourcesInputStream);
            }
        }
    }
    private InputStream loadCsvFile(File directory, String filenamePrefix, String csvType) throws Exception {
        String filename = filenamePrefix + "_" + csvType + ".csv";
        File file = new File(directory, filename);
        if (!file.exists()) {
            log.error("Import[ File: " + directory + "/" + filename + "] not found");
            throw new Exception("Import[ File: " + directory + "/" + filename + "] not found");
            
        }
        return new FileInputStream(file);
    }

    private InternationalStringDto loadInternationalString(String code, Properties properties) {
        InternationalStringDto internationalString = new InternationalStringDto();

        String labelEs = properties.getProperty(code + ".es");
        if (StringUtils.isNotBlank(labelEs)) {
            LocalisedStringDto localisedLabelEs = new LocalisedStringDto();
            localisedLabelEs.setLocale("es");
            localisedLabelEs.setLabel(labelEs);
            internationalString.addText(localisedLabelEs);
        }

        String labelEn = properties.getProperty(code + ".en");
        if (StringUtils.isNotBlank(labelEn)) {
            LocalisedStringDto localisedLabelEn = new LocalisedStringDto();
            localisedLabelEn.setLocale("en");
            localisedLabelEn.setLabel(labelEn);
            internationalString.addText(localisedLabelEn);
        }
        return internationalString;
    }

    private void createFile(File directory, String filenamePrefix, String extension) throws IOException {
        File file = new File(directory, filenamePrefix + "." + extension);
        if (!file.exists()) {
            file.createNewFile();
        }
    }
}
