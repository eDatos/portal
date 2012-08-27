package com.stat4you.crawler.droid.external.droid;

import static org.mockito.Mockito.*;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Set;

import org.apache.droids.LinkTask;
import org.apache.droids.api.Link;
import org.apache.droids.exception.DroidsException;
import org.joda.time.DateTime;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.junit.Test;

import com.arte.statistic.dataset.repository.repository.impl.util.Pair;
import com.stat4you.common.dto.InternationalStringDto;
import com.stat4you.crawler.droids.api.LinkStat4you;
import com.stat4you.crawler.droids.parse.html.IbestatHtmlParser;
import com.stat4you.crawler.droids.parse.html.IneHtmlParser;
import com.stat4you.crawler.droids.parse.html.IstacHtmlParser;
import com.stat4you.crawler.util.CrawlerInfo;


public class DomTest {

    @Test
    public void testLastUpdateIBESTAT() throws IOException, URISyntaxException, DroidsException {
        
        String uri = "http://www.ibestat.es/ibestat/page?p=px_tablas&nodeId=26882e03-9b9e-4200-b2bc-b855406b687e";
        
        parserPageToExtractLastUpdateForIbestat(uri);
        
        parserPageToExtractLastUpdateForIbestat(uri);
        
    }
    
    
    @Test
    public void testCategoryISTAC() throws IOException, URISyntaxException, DroidsException {
        
        String uri = "http://www.gobiernodecanarias.org/istac/temas_estadisticos/territorioymedioambiente/";
        
        parserPageToExtractCategoryForIstac(uri);
        
    }
    
    @Test
    public void testLastUpdateISTAC() throws IOException, URISyntaxException, DroidsException {

        String uri = "http://www2.gobiernodecanarias.org/istac/jaxi-web/menu.do?path=/03021/C00035A/P0004/&file=pcaxis&type=pcaxis&L=0";
        
        parserPageToExtractLastUpdateForIstac(uri);

    }
    
    @Test
    public void testCategoryINE() throws IOException, URISyntaxException, DroidsException {
        
        String uri = "http://www.ine.es/jaxi/menu.do?type=pcaxis&path=%2Ft05/p050&file=inebase&L=0";
        
        parserPageToExtractCategoryForIne(uri);
        
    }
    
    @Test
    public void testLastUpdateINE() throws IOException, URISyntaxException, DroidsException {
        
//        String uri = "http://www.ine.es/jaxi/menu.do?type=pcaxis&path=%2Ft20%2Fe260%2Fa2011%2F&file=pcaxis&N=&L=0";
        String uri = "http://www.ine.es/jaxiBD/menu.do?L=0&divi=IPR&his=2&type=db";
         
        parserPageToExtractLastUpdateForIne(uri);

    }
    
    @Test
    public void testTitleINE() throws IOException, URISyntaxException, DroidsException {
        
        String uri = "http://www.ine.es/jaxi/menu.do?type=pcaxis&path=/t01/p044/a2007/ccaa00/&file=pcaxis";
         
        parserPageToExtractTitleForIne(uri);

    }
    
    
    /**************************************************************************
     *  PRIVATE
     * @throws DroidsException 
     *************************************************************************/
    
    private void parserPageToExtractLastUpdateForIbestat(String uri) throws IOException, URISyntaxException, DroidsException {
        IbestatHtmlParser ibestatHtmlParser = new IbestatHtmlParser();
        
        CrawlerInfo crawlerInfo = mock(CrawlerInfo.class);
        crawlerInfo.setCrawlerName("IBESTAT");
        
        when(crawlerInfo.isNeedProcessLink(any(LinkStat4you.class), any(DateTime.class))).thenReturn(true);
        
        ibestatHtmlParser.setCrawlerInfo(crawlerInfo);
        
        Document doc = Jsoup.connect(uri).get();

        Link link = mock(LinkTask.class);
        
        when(link.getURI()).thenReturn(new URI(uri));
        
        LinkStat4you linkStat4you = new LinkStat4you(link, new URI(uri), 0);
        
        Pair<Set<Link>, Set<Link>> extractLastUpdate = ibestatHtmlParser.extractPxLastUpdate(linkStat4you, doc);
        
        for (Link ext: extractLastUpdate.getFirst()) {
           System.out.println("URI: " + ext.getURI() + " DATE: " + ((LinkStat4you)ext).getPxLastUpdate() + " CATEGORY: " + ((LinkStat4you)ext).getCategory());
        }
        System.out.println("FETCH: " + extractLastUpdate.getFirst().size());
    }
    
    private void parserPageToExtractCategoryForIstac(String uri) throws IOException, URISyntaxException, DroidsException {
        IstacHtmlParser istacHtmlParser = new IstacHtmlParser();
        
        CrawlerInfo crawlerInfo = mock(CrawlerInfo.class);
        crawlerInfo.setCrawlerName("ISTAC");
        
        when(crawlerInfo.isNeedProcessLink(any(LinkStat4you.class), any(DateTime.class))).thenReturn(true);
        
        istacHtmlParser.setCrawlerInfo(crawlerInfo);
        
        Document doc = Jsoup.connect(uri).get();

        Link link = mock(LinkTask.class);
        
        when(link.getURI()).thenReturn(new URI(uri));
        
        LinkStat4you linkStat4you = new LinkStat4you(link, new URI(uri), 0);
        
        String extractCategory = istacHtmlParser.extractCategory(linkStat4you, doc);
        
        
        System.out.println("FETCH CATEGORY: " + extractCategory);
    }
    
    private void parserPageToExtractLastUpdateForIstac(String uri) throws IOException, URISyntaxException, DroidsException {
        IstacHtmlParser istacHtmlParser = new IstacHtmlParser();
        
        CrawlerInfo crawlerInfo = mock(CrawlerInfo.class);
        crawlerInfo.setCrawlerName("ISTAC");
        
        when(crawlerInfo.isNeedProcessLink(any(LinkStat4you.class), any(DateTime.class))).thenReturn(true);
        
        istacHtmlParser.setCrawlerInfo(crawlerInfo);
        
        Document doc = Jsoup.connect(uri).get();

        Link link = mock(LinkTask.class);
        
        when(link.getURI()).thenReturn(new URI(uri));
        
        LinkStat4you linkStat4you = new LinkStat4you(link, new URI(uri), 0);
        linkStat4you.setCategory("MOCK_CATEGORY");
        
        Pair<Set<Link>, Set<Link>> extractLastUpdate = istacHtmlParser.extractPxLastUpdate(linkStat4you, doc);
        
        for (Link ext: extractLastUpdate.getFirst()) {
            System.out.println("URI: " + ext.getURI() + " DATE: " + ((LinkStat4you)ext).getPxLastUpdate() + " CATEGORY: " + ((LinkStat4you)ext).getCategory());
         }
         System.out.println("FETCH: " + extractLastUpdate.getFirst().size());
    }
    
    private void parserPageToExtractLastUpdateForIne(String uri) throws IOException, URISyntaxException, DroidsException {
        IneHtmlParser ineHtmlParser = new IneHtmlParser();
        
        CrawlerInfo crawlerInfo = mock(CrawlerInfo.class);
        crawlerInfo.setCrawlerName("INE");
        
        when(crawlerInfo.isNeedProcessLink(any(LinkStat4you.class), any(DateTime.class))).thenReturn(true);
        
        ineHtmlParser.setCrawlerInfo(crawlerInfo);
        
        Document doc = Jsoup.connect(uri).get();

        Link link = mock(LinkTask.class);
        
        when(link.getURI()).thenReturn(new URI(uri));
        
        LinkStat4you linkStat4you = new LinkStat4you(link, new URI(uri), 0);
        linkStat4you.setCategory("MOCK_CATEGORY");
        
        Pair<Set<Link>, Set<Link>> extractLastUpdate = ineHtmlParser.extractPxLastUpdate(linkStat4you, doc);
        
        for (Link ext: extractLastUpdate.getFirst()) {
            System.out.println("URI: " + ext.getURI() + " DATE: " + ((LinkStat4you)ext).getPxLastUpdate() + " CATEGORY: " + ((LinkStat4you)ext).getCategory() + " TITLE: " + ((LinkStat4you)ext).getTitle().getLocalisedLabel("es"));
         }
         System.out.println("FETCH: " + extractLastUpdate.getFirst().size());
    }
    
    private void parserPageToExtractCategoryForIne(String uri) throws IOException, URISyntaxException, DroidsException {
        IneHtmlParser ineHtmlParser = new IneHtmlParser();
        
        CrawlerInfo crawlerInfo = mock(CrawlerInfo.class);
        crawlerInfo.setCrawlerName("INE");
        
        when(crawlerInfo.isNeedProcessLink(any(LinkStat4you.class), any(DateTime.class))).thenReturn(true);
        
        ineHtmlParser.setCrawlerInfo(crawlerInfo);
        
        Document doc = Jsoup.connect(uri).get();

        Link link = mock(LinkTask.class);
        
        when(link.getURI()).thenReturn(new URI(uri));
        
        LinkStat4you linkStat4you = new LinkStat4you(link, new URI(uri), 0);
        
        String extractCategory = ineHtmlParser.extractCategory(linkStat4you, doc);
        
        
        System.out.println("FETCH CATEGORY: " + extractCategory);
    }
    
    
    private void parserPageToExtractTitleForIne(String uri) throws IOException, URISyntaxException, DroidsException {
        IneHtmlParser ineHtmlParser = new IneHtmlParser();
        
        CrawlerInfo crawlerInfo = mock(CrawlerInfo.class);
        crawlerInfo.setCrawlerName("INE");
        
        when(crawlerInfo.isNeedProcessLink(any(LinkStat4you.class), any(DateTime.class))).thenReturn(true);
        
        ineHtmlParser.setCrawlerInfo(crawlerInfo);
        
        Document doc = Jsoup.connect(uri).get();

        Link link = mock(LinkTask.class);
        
        when(link.getURI()).thenReturn(new URI(uri));
        
        LinkStat4you linkStat4you = new LinkStat4you(link, new URI(uri), 0);
        linkStat4you.setCategory("MOCK_CATEGORY");
        
        InternationalStringDto extractTitle = ineHtmlParser.extractTitle(linkStat4you, doc);
        
        System.out.println("Title ES: " + extractTitle.getLocalisedLabel("es"));
        System.out.println("Tilte EN: " + extractTitle.getLocalisedLabel("en"));
    }
}
