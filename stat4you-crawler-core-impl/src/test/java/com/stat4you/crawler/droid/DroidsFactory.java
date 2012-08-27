package com.stat4you.crawler.droid;

import java.util.HashMap;

import org.apache.droids.api.Handler;
import org.apache.droids.helper.factories.HandlerFactory;

public class DroidsFactory {

    // public static ParserFactory createDefaultParserFactory() {
    // ParserFactory parserFactory = new ParserFactory();
    // HtmlParser htmlParser = new HtmlParser();
    // htmlParser.setElements(new HashMap<String, String>());
    // htmlParser.getElements().put("a", "href");
    // htmlParser.getElements().put("link", "href");
    // htmlParser.getElements().put("img", "src");
    // htmlParser.getElements().put("script", "src");
    // parserFactory.setMap(new HashMap<String, Object>());
    // parserFactory.getMap().put("text/html", htmlParser);
    // return parserFactory;
    // }
    //
    // public static ProtocolFactory createDefaultProtocolFactory() {
    // ProtocolFactory protocolFactory = new ProtocolFactory();
    // HttpProtocol httpProtocol = new HttpProtocol();
    // httpProtocol.setForceAllow(true);
    //
    // protocolFactory.setMap(new HashMap<String, Object>());
    // protocolFactory.getMap().put("http", httpProtocol);
    // return protocolFactory;
    // }
    //
    // public static URLFiltersFactory createDefaultURLFiltersFactory() {
    // URLFiltersFactory filtersFactory = new URLFiltersFactory();
    // URLFilter defaultURLFilter = new URLFilter() {
    //
    // public String filter(String urlString) {
    // return urlString;
    // }
    //
    // };
    // filtersFactory.setMap(new HashMap<String, Object>());
    // filtersFactory.getMap().put("default", defaultURLFilter);
    // return filtersFactory;
    // }

    public static HandlerFactory createDefaultHandlerFactory(Handler defaultHandler) {
        HandlerFactory handlerFactory = new HandlerFactory();
        handlerFactory.setMap(new HashMap<String, Object>());
        handlerFactory.getMap().put("default", defaultHandler);
        return handlerFactory;
    }

    // public static Droid<Link> createSimpleSaveCrawlingDroid(
    // String targetURI) {
    // ParserFactory parserFactory = createDefaultParserFactory();
    // ProtocolFactory protocolFactory = createDefaultProtocolFactory();
    // URLFiltersFactory filtersFactory = createDefaultURLFiltersFactory();
    //
    // SimpleDelayTimer simpleDelayTimer = new SimpleDelayTimer();
    // simpleDelayTimer.setDelayMillis(100);
    //
    // SimpleTaskQueueWithHistory<Link> simpleQueue = new SimpleTaskQueueWithHistory<Link>();
    //
    // SequentialTaskMaster<Link> taskMaster = new SequentialTaskMaster<Link>();
    // taskMaster.setDelayTimer( simpleDelayTimer );
    // taskMaster.setExceptionHandler(new DefaultTaskExceptionHandler());
    //
    // CrawlingDroid crawler = new SaveCrawlingDroid( simpleQueue, taskMaster, new SaveHandler() );
    // crawler.setFiltersFactory(filtersFactory);
    // crawler.setParserFactory(parserFactory);
    // crawler.setProtocolFactory(protocolFactory);
    //
    // Collection<String> initialLocations = new ArrayList<String>();
    // initialLocations.add( targetURI );
    // crawler.setInitialLocations(initialLocations);
    // return crawler;
    // }
    //
    // public static Droid<Link> createSimpleReportCrawlingDroid(
    // String targetURI) {
    // ParserFactory parserFactory = createDefaultParserFactory();
    // ProtocolFactory protocolFactory = createDefaultProtocolFactory();
    // URLFiltersFactory filtersFactory = createDefaultURLFiltersFactory();
    //
    // SimpleDelayTimer simpleDelayTimer = new SimpleDelayTimer();
    // simpleDelayTimer.setDelayMillis(100);
    //
    // SequentialTaskMaster<Link> taskMaster = new SequentialTaskMaster<Link>();
    // // MultiThreadedTaskMaster<Link> taskMaster = new MultiThreadedTaskMaster<Link>();
    // taskMaster.setDelayTimer( simpleDelayTimer );
    // taskMaster.setExceptionHandler(new DefaultTaskExceptionHandler());
    //
    // Queue<Link> queue = new LinkedList<Link>();
    //
    // CrawlingDroid crawler = new ReportCrawlingDroid( queue, taskMaster );
    // crawler.setFiltersFactory(filtersFactory);
    // crawler.setParserFactory(parserFactory);
    // crawler.setProtocolFactory(protocolFactory);
    //
    // Collection<String> initialLocations = new ArrayList<String>();
    // initialLocations.add( targetURI );
    // crawler.setInitialLocations(initialLocations);
    // return crawler;
    // }
    //
    // public static Droid<Link> createSimpleExceptionCrawlingDroid(
    // String targetURI) {
    // ParserFactory parserFactory = createDefaultParserFactory();
    // ProtocolFactory protocolFactory = createDefaultProtocolFactory();
    // URLFiltersFactory filtersFactory = createDefaultURLFiltersFactory();
    //
    // SimpleDelayTimer simpleDelayTimer = new SimpleDelayTimer();
    // simpleDelayTimer.setDelayMillis(100);
    //
    // Queue<Link> queue = new LinkedList<Link>();
    //
    // SequentialTaskMaster<Link> taskMaster = new SequentialTaskMaster<Link>();
    // // MultiThreadedTaskMaster<Link> taskMaster = new MultiThreadedTaskMaster<Link>();
    // taskMaster.setDelayTimer( simpleDelayTimer );
    // taskMaster.setExceptionHandler(new DefaultTaskExceptionHandler());
    //
    // CrawlingDroid crawler = new ExceptionCrawlingDroid( queue, taskMaster );
    // crawler.setFiltersFactory(filtersFactory);
    // crawler.setParserFactory(parserFactory);
    // crawler.setProtocolFactory(protocolFactory);
    //
    // Collection<String> initialLocations = new ArrayList<String>();
    // initialLocations.add( targetURI );
    // crawler.setInitialLocations(initialLocations);
    // return crawler;
    // }

}
