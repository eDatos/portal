package com.stat4you.crawler.droid.external.droid;

import static org.junit.Assert.assertTrue;

import java.net.URI;

import org.junit.Test;

import com.stat4you.crawler.util.CrawlerUtil;
import com.stat4you.crawler.util.NormalizeURL;


public class UtilsTest {

    @Test
    public void testNormalizeUrls() throws Exception {
        
        String normalize = null;
        URI result = null;
        String url = null;
        
        url = "http://www.ibestat.es/ibestat/page?p=px_tablas&nodeId=26882e03-9b9e-4200-b2bc-b855406b687e";
        normalize = NormalizeURL.normalize(url);
        System.out.println(normalize);
        result = CrawlerUtil.stringToUri(new URI("http://www.host.es/app"), url);
        System.out.println(result.toString());
        
        url = "http://www.ine.es/jaxi/menu.do;jsessionid=B76378BF6E407D93F2A67EB22E7897D3.jaxi01?type=pcaxis&path=/t01/p044/a2005/ccaa12/&file=pcaxis&L=0";
        normalize = NormalizeURL.normalize(url);
        System.out.println(normalize);
        assertTrue(!normalize.contains(";jsessionid=B76378BF6E407D93F2A67EB22E7897D3.jaxi01"));
        result = CrawlerUtil.stringToUri(new URI("http://www.host.es/app"), url);
        System.out.println(result.toString());
        
        url = "http://www.ibestat.es/con espacios ibestat/page?p=px_tablas&nodeId=26882e03-9b9e-4200-b2bc-b855406b687e";
        normalize = NormalizeURL.normalize(url);
        System.out.println(normalize);
        result = CrawlerUtil.stringToUri(new URI("http://www.host.es/app"), url);
        System.out.println(result.toString());
    }

}
