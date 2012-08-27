package com.stat4you.crawler.droid.external.droid;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.net.URI;
import java.util.Set;

import org.apache.droids.LinkTask;
import org.apache.droids.api.Link;
import org.joda.time.DateTime;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.junit.Test;

import com.arte.statistic.dataset.repository.repository.impl.util.Pair;
import com.stat4you.crawler.droids.api.LinkStat4you;
import com.stat4you.crawler.droids.parse.html.EustatHtmlParser;
import com.stat4you.crawler.util.CrawlerInfo;

public class EustatDomTest {
        
    private static final DateTime veryOldDate = new DateTime(1900, 1, 1, 1, 1, 1, 1);
    
    @Test
    public void extractCategory() throws Exception{
        assertEquals("Población", extractCategory("http://www.eustat.es/bancopx/spanish/tipo_N/id_2214/indice.html#axzz1ocQgmXcz"));
        assertEquals("Economía", extractCategory("http://www.eustat.es/bancopx/spanish/tipo_N/id_2208/indice.html#axzz1ocQgmXcz"));
        assertEquals("Economía", extractCategory("http://www.eustat.es/bancopx/spanish/tipo_N/id_2250/indice.html#axzz1ocQgmXcz"));
        assertEquals("Sociedad de la información (I+D+i)", extractCategory("http://www.eustat.es/bancopx/spanish/tipo_N/id_2391/indice.html#axzz1ocQgmXcz"));
    }
    
    private String extractCategory(String uri) throws Exception {
        EustatHtmlParser parser = new EustatHtmlParser();
        
        Document doc = Jsoup.connect(uri).get();
        Link link = mock(LinkTask.class);
        when(link.getURI()).thenReturn(new URI(uri));
        
        LinkStat4you linkStat4you = new LinkStat4you(link, new URI(uri), 0);
        String extractedCategory = parser.extractCategory(linkStat4you, doc);
        return extractedCategory;
    }
    
    @Test
    public void extractPxLinks() throws Exception {
        int pxsInPage = 21;
        String url = "http://www.eustat.es/bancopx/spanish/id_2217/indiceRR.html#axzz1ocQgmXcz";
        Pair<Set<Link>, Set<Link>> extractPxLinks = extractPxLinks(url, veryOldDate);
        
        assertEquals(pxsInPage, extractPxLinks.getFirst().size());
        assertEquals(0, extractPxLinks.getSecond().size());
        
        extractPxLinks = extractPxLinks(url, new DateTime());
        assertEquals(0, extractPxLinks.getFirst().size());
        assertEquals(pxsInPage, extractPxLinks.getSecond().size());
    }
    
    @Test
    public void extractPxLinksWithMultipleHeaders() throws Exception {
        String url = "http://www.eustat.es/bancopx/spanish/id_2411/indiceRR.html";
        Pair<Set<Link>, Set<Link>> extractPxLinks = extractPxLinks(url, veryOldDate);
        assertEquals(12, extractPxLinks.getFirst().size());
    }
    
    private Pair<Set<Link>, Set<Link>> extractPxLinks(String uri, DateTime lastExecuted) throws Exception {
        EustatHtmlParser parser = new EustatHtmlParser();
        
        CrawlerInfo crawlerInfoMock = mock(CrawlerInfo.class);
        crawlerInfoMock.setCrawlerName("EUSTAT");
        
        when(crawlerInfoMock.isNeedProcessLink(any(LinkStat4you.class), any(DateTime.class))).thenReturn(true);
        
        Document doc = Jsoup.connect(uri).get();
        Link link = mock(LinkTask.class);
        when(link.getURI()).thenReturn(new URI(uri));
        
        LinkStat4you linkStat4you = new LinkStat4you(link, new URI(uri), 0);
        linkStat4you.setCategory("MOCK_CATEGORY");
        
        Pair<Set<Link>, Set<Link>> extractLastUpdate = parser.extractPxLastUpdate(linkStat4you, doc);
        
        for (Link ext: extractLastUpdate.getFirst()) {
            System.out.println("URI: " + ext.getURI() + " DATE: " + ((LinkStat4you)ext).getPxLastUpdate() + " CATEGORY: " + ((LinkStat4you)ext).getCategory());
         }
         System.out.println("FETCH: " + extractLastUpdate.getFirst().size());
        
        return extractLastUpdate;
    }
}
