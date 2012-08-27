package com.stat4you.crawler.util;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.droids.api.Link;
import org.apache.droids.exception.DroidsException;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.stat4you.common.configuration.Stat4YouConfiguration;
import com.stat4you.crawler.droids.api.LinkStat4you;

public class CrawlerInfo {
  
    
    private String crawlerName = "DEFAULT_NAME";
    
    private String providerUrl = "stat4you:dsd:provider:P-UNKNOWN";
    
    private final Logger log = LoggerFactory.getLogger(CrawlerInfo.class);
    
    private ForceUpdateInfo forceUpdateInfoMode = null;
    
    private FileRepositoryIndex fileRepositoryIndex;

    public void setCrawlerName(String crawlerName) {
        this.crawlerName = crawlerName;
    }
    
    public void setProviderUrl(String providerUrl) {
        this.providerUrl = providerUrl;
    }
    
    public String getCrawlerName() {
        return crawlerName;
    }
    
    public String getProviderUrl() {
        return providerUrl;
    }
    
    public ForceUpdateInfo getForceUpdateInfoMode() {
        return forceUpdateInfoMode;
    }
    
    public void setForceUpdateInfoMode(ForceUpdateInfo forceUpdateInfoMode) {
        this.forceUpdateInfoMode = forceUpdateInfoMode;
    }
    
    public boolean isForceUpdateInfoMode() {
        return (this.forceUpdateInfoMode != null);
    }
    
    public void setFileRepositoryIndex(FileRepositoryIndex fileRepositoryIndex) {
        this.fileRepositoryIndex = fileRepositoryIndex;
    }
    
    public FileRepositoryIndex getFileRepositoryIndex() {
        return fileRepositoryIndex;
    }
    
    public boolean isNeedProcessLink(LinkStat4you linkStat4you, DateTime dateTime) throws DroidsException  {
        DateTime lastExecution = null;
        if (isForceUpdateInfoMode()) {
            return true;
        }
        else {
            try {
                lastExecution = this.getFileRepositoryIndex().retrieveLastUpdateForDocument(linkStat4you);
                if (lastExecution == null) {
                    return true;
                }
            } catch (ApplicationException e) {
                throw new DroidsException(e.getMessage(), e);
            }
        }
        
        return (lastExecution.isBefore(dateTime) || lastExecution.isEqual(dateTime));
    }
    
    /*
    public DateTime retrieveCrawlerLastExecutedDate() {
        if (crawlerLastExecutedDate == null) {
        
            String saveDir = Stat4YouConfiguration.instance().getProperty("stat4you.crawler.droids.handler.save.dir");
            saveDir += "/" + getCrawlerName() + "/crawler.info";
            
            File file = new File(saveDir);
            
            if (file.exists()) {
                String readFileToString;
                try {
                    DateTimeFormatter fmt = DateTimeFormat.forStyle("S-").withLocale(Locale.ENGLISH);
                    readFileToString = FileUtils.readFileToString(file, "ISO-8859-1");
                    crawlerLastExecutedDate = fmt.parseDateTime(readFileToString.trim());              
                } catch (IOException e) {
                    log.error("Unable to find crawler.info file!!!", e);
                }                
            }
            else {
                crawlerLastExecutedDate = new DateTime(1900, 1, 1, 1, 1, 1, 1);
            }
        }
        
        return crawlerLastExecutedDate;
    }
    */
/*
    public void updateCrawlerInfoDate() {
        String saveDir = Stat4YouConfiguration.instance().getProperty("stat4you.crawler.droids.handler.save.dir");
        saveDir += "/" + getCrawlerName() + "/crawler.info";
        
        File file = new File(saveDir);
        try {
            DateTimeFormatter fmt = DateTimeFormat.forStyle("S-").withLocale(Locale.ENGLISH);
            FileUtils.writeStringToFile(file, new DateTime().toString(fmt));
        } catch (IOException e) {
            log.error("Unable to create crawler.info file!!!", e);
        }
    }
    */
    
    public void addUrlNotLoaded(Link link) {
        
        String saveDir = Stat4YouConfiguration.instance().getProperty("stat4you.crawler.droids.handler.save.dir");
        saveDir += "/" + getCrawlerName() + "/notloaded.info";
        
        File file = new File(saveDir);
        List<String> lines = new ArrayList<String>();
        lines.add(link.getURI().toString());
        
        //        FileUtils.writeLines(file, lines, true); // If IOUTILS 2.1 exist in the classpath use this line instead the below lines.
        FileWriter fw = null;
        try {
            if (!file.exists()) {
                FileUtils.writeStringToFile(file, StringUtils.EMPTY, "ISO-8859-1");
            }
            fw = new FileWriter(file, true);

            IOUtils.writeLines(lines, null, fw);
        } catch (IOException e) {
            log.error("Unable to update notloaded.info file!!!", e);
        }
        finally {
            IOUtils.closeQuietly(fw);
        }
    }
    
    
    @SuppressWarnings("unchecked")
    public List<String> retrieveUrlsNotLoaded() {
        
        return new ArrayList<String>();
        
        //TODO Don't try again failed locations because if the locations are PX links, must be Stat4youLinks and now there isn't.
        
        /*
        String saveDir = Stat4YouConfiguration.instance().getProperty("stat4you.crawler.droids.handler.save.dir");
        saveDir += "/" + getCrawlerName() + "/notloaded.info";
        
        File file = new File(saveDir);
        
        List<String> readFileLines = new ArrayList<String>();
        
        if (file.exists()) {            
            try {
                readFileLines = FileUtils.readLines(file, "ISO-8859-1");        
            } catch (IOException e) {
                log.error("Unable to find notloaded.info file!!!", e);
            }
            
            // Remove file for prepare new execution
            file.delete();
        }
        
        return readFileLines;
        */
    }
    
    public String retrieveRepositoryPath() {
        StringBuilder stringBuilder = new StringBuilder(Stat4YouConfiguration.instance().getProperty("stat4you.crawler.droids.handler.save.dir"));
        stringBuilder.append("/").append(getCrawlerName());
        return stringBuilder.toString();
    }
    
    
    
}
