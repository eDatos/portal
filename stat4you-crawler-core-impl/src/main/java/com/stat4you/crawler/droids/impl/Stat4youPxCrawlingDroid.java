package com.stat4you.crawler.droids.impl;

import java.util.Queue;

import org.apache.droids.api.Link;
import org.apache.droids.api.TaskMaster;
import org.apache.droids.api.Worker;
import org.apache.droids.robot.crawler.CrawlingDroid;

import com.stat4you.crawler.droids.helper.factories.HandlerFactoryStat4you;
import com.stat4you.crawler.droids.robot.crawler.CustomCrawlingWorker;
import com.stat4you.crawler.util.CrawlerInfo;

public class Stat4youPxCrawlingDroid extends CrawlingDroid {

    private HandlerFactoryStat4you handlerFactory = null;
    
    private CrawlerInfo crawlerInfo = null;
    
    public HandlerFactoryStat4you getHandlerFactory() {
        return handlerFactory;
    }
        
    public void setHandlerFactory(HandlerFactoryStat4you handlerFactory) {
        this.handlerFactory = handlerFactory;
    }
    
    
    public CrawlerInfo getCrawlerInfo() {
        return crawlerInfo;
    }
    
    public void setCrawlerInfo(CrawlerInfo crawlerInfo) {
        this.crawlerInfo = crawlerInfo;
    }
    
    public Stat4youPxCrawlingDroid(Queue<Link> queue, TaskMaster<Link> taskMaster) {
        super(queue, taskMaster);       
    }

    @Override
    public Worker<Link> getNewWorker() {
        final CustomCrawlingWorker worker = new CustomCrawlingWorker(this);
        worker.setHandlerFactoryStat4you(getHandlerFactory());
        worker.setCrawlerInfo(getCrawlerInfo());
        return worker;
    }

}
