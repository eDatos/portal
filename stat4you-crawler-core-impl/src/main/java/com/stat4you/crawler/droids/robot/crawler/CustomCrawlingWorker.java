package com.stat4you.crawler.droids.robot.crawler;

import java.io.IOException;

import org.apache.droids.LinkTask;
import org.apache.droids.api.ContentEntity;
import org.apache.droids.api.Link;
import org.apache.droids.exception.DroidsException;
import org.apache.droids.robot.crawler.CrawlingDroid;
import org.apache.droids.robot.crawler.CrawlingWorker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.stat4you.crawler.droids.api.LinkStat4you;
import com.stat4you.crawler.droids.helper.factories.HandlerFactoryStat4you;
import com.stat4you.crawler.util.CrawlerInfo;

public class CustomCrawlingWorker extends CrawlingWorker {

    private final Logger   log = LoggerFactory.getLogger(CrawlingWorker.class);

    private HandlerFactoryStat4you handlerFactoryStat4you;    

    private CrawlerInfo crawlerInfo;
    
    
    public void setCrawlerInfo(CrawlerInfo crawlerInfo) {
        this.crawlerInfo = crawlerInfo;
    }
    
    public CrawlerInfo getCrawlerInfo() {
        return crawlerInfo;
    }   
    
    public void setHandlerFactoryStat4you(HandlerFactoryStat4you handlerFactoryStat4you) {
        this.handlerFactoryStat4you = handlerFactoryStat4you;
    }

    public HandlerFactoryStat4you getHandlerFactoryStat4you() {
        return handlerFactoryStat4you;
    }

    public CustomCrawlingWorker(CrawlingDroid droid) {
        super(droid);
    }
     

    @Override
    public void execute(Link link) throws DroidsException, IOException {
        try {
            super.execute(link);
        } catch (Exception e) {
            // TODO The second call is usually successful. Study this case!!!!!
            // reload one more time before fail
          try {
              log.error("First attempt fail: " + link.getURI().toString());
              log.error("Try one more time before fail: " + link.getURI().toString());
              super.execute(link);
          } catch (IOException io2) {
              getCrawlerInfo().addUrlNotLoaded(link);
              log.error("Not Loaded: " + link.getURI().toString());              
          } catch (Exception e2) {
              getCrawlerInfo().addUrlNotLoaded(link);
              log.error("Not Loaded: " + link.getURI().toString(), e);     
          }
        }
    }

    @Override
    protected void handle(ContentEntity entity, Link link) throws DroidsException, IOException {
        if (link instanceof LinkStat4you) {
            getHandlerFactoryStat4you().handle((LinkStat4you) link, entity);
        } else {
            getHandlerFactoryStat4you().handle(new LinkTask(link.getFrom(), link.getURI(), link.getDepth()), entity);
        }
    }

}
