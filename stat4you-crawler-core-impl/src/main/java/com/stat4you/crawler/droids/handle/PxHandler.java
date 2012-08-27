package com.stat4you.crawler.droids.handle;

import java.io.IOException;

import org.apache.commons.lang.StringUtils;
import org.apache.droids.api.ContentEntity;
import org.apache.droids.api.Link;
import org.apache.droids.exception.DroidsException;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.stat4you.common.dto.InternationalStringDto;
import com.stat4you.crawler.droids.api.HandlerStat4you;
import com.stat4you.crawler.droids.api.LinkStat4you;
import com.stat4you.crawler.util.CrawlerInfo;
import com.stat4you.crawler.util.CrawlerUtil;
import com.stat4you.importation.service.ImportationService;
import com.stat4you.transformation.dto.PxImportDto;

public class PxHandler implements HandlerStat4you {

    private final Logger                log = LoggerFactory.getLogger(PxHandler.class);

    private static final ServiceContext ctx = new ServiceContext("crawlerImportation", "importation", "stat4you-crawler");

    @Autowired
    private ImportationService          importationService;

    private CrawlerInfo                 crawlerInfo;

    public CrawlerInfo getCrawlerInfo() {
        return crawlerInfo;
    }

    public void setCrawlerInfo(CrawlerInfo crawlerInfo) {
        this.crawlerInfo = crawlerInfo;
    }

    public PxHandler() {
        super();
    }

    // Only for test!
    public void setImportationService(ImportationService importationService) {
        this.importationService = importationService;
    }

    @Override
    public void handle(Link baseLink, ContentEntity entity) throws IOException, DroidsException {

        // Only PX files
        if (CrawlerUtil.isPxFile(baseLink, entity)) {

            // Get category
            String category = null;
            String period = StringUtils.EMPTY;
            InternationalStringDto geographicalValue = null;
            InternationalStringDto title = null;
            if (baseLink instanceof LinkStat4you) {
                if (StringUtils.isNotBlank(((LinkStat4you) baseLink).getCategory())) {
                    category = ((LinkStat4you) baseLink).getCategory();
                    period = ((LinkStat4you) baseLink).getPeriod();
                    geographicalValue = ((LinkStat4you) baseLink).getGeographicalValue();
                    title = ((LinkStat4you) baseLink).getTitle();
                }
            }

            // Import
            PxImportDto pxImportDto = new PxImportDto();

            // Prepare import
            pxImportDto.setContent(entity.obtainContent());
            pxImportDto.setProviderUri(getCrawlerInfo().getProviderUrl());
            pxImportDto.setPxUrl(baseLink.getURI().toString());
            try {
                pxImportDto.setCategory(CrawlerUtil.toCategoryStat4You(getCrawlerInfo().getProviderUrl(), category));
            } catch (ApplicationException e1) {
                log.error("Import[ Category: " + category + ", Url: " + baseLink.getURI() + "] Category not found!!!");
                return;
            }
            pxImportDto.setPeriod(period);
            pxImportDto.setGeographicalValue(geographicalValue);
            pxImportDto.setTitle(title);
            
            pxImportDto.setForceAddContextInformation("INE".equals(this.crawlerInfo.getCrawlerName()) ? true : false);
            
            if (log.isDebugEnabled()) {
                log.info("Import[ Category: " + category + ", Url: " + baseLink.getURI() + "]");
            }
            try {
                importationService.importPx(ctx, pxImportDto);
            } catch (ApplicationException e) {
                ; // Nothing, continue
            }

        }
    }

}
