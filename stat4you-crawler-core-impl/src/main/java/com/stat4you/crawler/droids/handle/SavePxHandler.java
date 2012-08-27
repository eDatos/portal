package com.stat4you.crawler.droids.handle;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.URI;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.RandomStringUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.droids.api.ContentEntity;
import org.apache.droids.api.Link;
import org.apache.droids.exception.DroidsException;
import org.apache.droids.handle.WriterHandler;
import org.apache.droids.helper.FileUtil;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.stat4you.common.dto.InternationalStringDto;
import com.stat4you.common.dto.LocalisedStringDto;
import com.stat4you.crawler.droids.api.HandlerStat4you;
import com.stat4you.crawler.droids.api.LinkStat4you;
import com.stat4you.crawler.util.CrawlerInfo;
import com.stat4you.crawler.util.CrawlerUtil;

/**
 * Handler which is writing the stream to the file system.
 * <p>
 * Before using make sure you have set the export directory {@link #setOutputDir(String outputDir)} and whether you want to use the host as prefix {@link #setIncludeHost(boolean includeHost)}.
 * 
 * @version 1.0
 */
public class SavePxHandler extends WriterHandler implements HandlerStat4you {

    private final Logger log = LoggerFactory.getLogger(SavePxHandler.class);

    private String       outputDir;

    private URI          uri;

    private boolean      includeHost;

    private CrawlerInfo crawlerInfo;

    public SavePxHandler() {
        super();
    }

    public void handle(Link baseLink, ContentEntity entity) throws IOException, DroidsException {
        this.uri = baseLink.getURI();

        // Only PX files
        if (CrawlerUtil.isPxFile(baseLink, entity)) {

            InputStream instream = entity.obtainContent();
            try {
                writeOutput(baseLink, instream);
            } catch (ApplicationException e) {
               throw new DroidsException(e.getMessage(), e);
            } finally {
                instream.close();
            }
        }

    }

    private void writeOutput(Link baseLink, InputStream stream) throws IOException, ApplicationException {
        if (!uri.getPath().endsWith("/")) {
            String filePath = calculateFilePath();
            log.info("Trying to save " + uri + " to " + filePath);
            
            // Save File
            File cache = new File(filePath);
            FileUtil.createFile(cache);
            writeContentToFile(stream, cache);

            // Save Info File
            File infoFile = new File(cache.getParent() + "/" + cache.getName() + ".info");
            writeInfoToFile(baseLink, infoFile);
            
            // If is force update mode, save a list of saved files to import.
            if (this.crawlerInfo.isForceUpdateInfoMode()) {
                this.crawlerInfo.getForceUpdateInfoMode().addDownloadedPx(cache);
            }
            
            // Update repository index
            if (baseLink instanceof LinkStat4you) {
                this.crawlerInfo.getFileRepositoryIndex().updateRepositoryIndex((LinkStat4you) baseLink, cache);
            }
        }
    }

    private void writeContentToFile(InputStream stream, File cache) throws FileNotFoundException, IOException {
        OutputStream output = null;
        final int bufferSize = 8192;
        byte[] buffer = new byte[bufferSize];
        int length = -1;
        try {
            output = new BufferedOutputStream(new FileOutputStream(cache));
            while ((length = stream.read(buffer)) > -1) {
                output.write(buffer, 0, length);
            }
        } finally {
            if (null != output) {
                output.flush();
                output.close();
            }
        }
    }

    private void writeInfoToFile(Link baseLink, File infoFile) throws IOException {
        // Report
        StringBuffer str = new StringBuffer();

        List<String> lines = new ArrayList<String>();
        
        // Provider URI
        str.append("crawler.provider.uri=");
        str.append(this.crawlerInfo.getProviderUrl());
        lines.add(str.toString());
        
        // Category
        String category = null;
        str = new StringBuffer("crawler.px.category=");
        if (baseLink instanceof LinkStat4you) {
            if (StringUtils.isNotBlank(((LinkStat4you) baseLink).getCategory())) {
                category = ((LinkStat4you) baseLink).getCategory();
            }
        }
        str.append(category);
        
        lines.add(str.toString());
        
        // URL      
        lines.add("crawler.px.url=" + baseLink.getURI().toString());
        
        // GEOGRAPHICALVALUE
        if (baseLink instanceof LinkStat4you) {
            InternationalStringDto internationalStringDto = ((LinkStat4you) baseLink).getGeographicalValue();
            if (internationalStringDto != null) {
                for (LocalisedStringDto localisedStringDto: internationalStringDto.getTexts()) {
                    str = new StringBuffer("crawler.px.geographicalValue");
                    str.append(".").append(localisedStringDto.getLocale()).append("=").append(localisedStringDto.getLabel());
                    lines.add(str.toString());
                } 
            }
        }
        
        // PERIOD
        str = new StringBuffer("crawler.px.period=");
        if (baseLink instanceof LinkStat4you) {
            if (StringUtils.isNotBlank(((LinkStat4you) baseLink).getPeriod())) {
                String value = ((LinkStat4you) baseLink).getPeriod();
                str.append(value);
                lines.add(str.toString());
            }
        }
        
        // Title      
        if (baseLink instanceof LinkStat4you) {
            InternationalStringDto internationalStringDto = ((LinkStat4you) baseLink).getTitle();
            if (internationalStringDto != null) {
                for (LocalisedStringDto localisedStringDto: internationalStringDto.getTexts()) {
                    str = new StringBuffer("crawler.px.title");
                    str.append(".").append(localisedStringDto.getLocale()).append("=").append(localisedStringDto.getLabel());
                    lines.add(str.toString());
                }             
            }
        }
        
        // Context pages
        if (baseLink instanceof LinkStat4you) {
            List<String> contextPages = ((LinkStat4you) baseLink).getRelativeContextPages();
            if (!contextPages.isEmpty()) {
                str = new StringBuffer("crawler.px.context=");
                for (int i = 0; i < contextPages.size(); i++) {
                    str.append(contextPages.get(i));
                    if (i < contextPages.size() -1) {
                        str.append("|");
                    }
                }
                lines.add(str.toString());
            }
        }
        
        // PX LAST UPDATE
        str = new StringBuffer("crawler.px.lastupdate=");
        if (baseLink instanceof LinkStat4you) {
            if (((LinkStat4you) baseLink).getPxLastUpdate() != null) {
                String value = CrawlerUtil.transformDateTimeToISODateTimeLexicalRepresentation(((LinkStat4you) baseLink).getPxLastUpdate());
                str.append(value);
                lines.add(str.toString());
            }
        }
        
        // ForceAddContextInformation, only TRUE for INE PROVIDER
        str = new StringBuffer("crawler.px.forceaddcontextinformation=");
        if ("INE".equals(this.crawlerInfo.getCrawlerName())) {
            str.append("true");
        }
        else {
            str.append("false");
        }
        lines.add(str.toString());
        
        // Save File InFo
        FileUtil.createFile(infoFile);
        OutputStreamWriter out = null;
        try {
            out =  new OutputStreamWriter(new FileOutputStream(infoFile), Charset.forName("ISO-8859-1"));
            IOUtils.writeLines(lines, null, out);
        } finally {
            IOUtils.closeQuietly(out);
        }
    }

    private String calculateFilePath() {
        StringBuffer filePath = new StringBuffer(outputDir);

        DateTimeFormatter fmt = DateTimeFormat.forPattern("yyyyMMdd_HHmm");
        filePath.append("/").append(this.crawlerInfo.getCrawlerName()).append("/").append(fmt.print(new DateTime())).append("/").append(RandomStringUtils.randomAlphanumeric(10)).append(".px");
        
        return filePath.toString();
    }

    /**
     * Get the directory where we want to save the stream.
     * 
     * @return directory where we want to save the stream.
     */
    public String getOutputDir() {
        return outputDir;
    }

    /**
     * Set the directory where we want to save the stream.
     * 
     * @param outputDir
     *            the directory where we want to save the stream.
     */
    public void setOutputDir(String outputDir) {
        this.outputDir = outputDir;
    }

    /**
     * Do we want to prefix the export dir with the host name.
     * 
     * @return true if we want to use the prefix; false otherwise
     */
    public boolean isIncludeHost() {
        return includeHost;
    }

    /**
     * Do we want to prefix the export dir with the host name.
     * 
     * @param includeHost
     *            true if we want to use the prefix; false otherwise
     */
    public void setIncludeHost(boolean includeHost) {
        this.includeHost = includeHost;
    }

    public void setCrawlerInfo(CrawlerInfo crawlerInfo) {
        this.crawlerInfo = crawlerInfo;
    }
    
}
