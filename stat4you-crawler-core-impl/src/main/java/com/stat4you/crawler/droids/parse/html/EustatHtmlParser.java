package com.stat4you.crawler.droids.parse.html;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.droids.api.ContentEntity;
import org.apache.droids.api.Link;
import org.apache.droids.api.Parse;
import org.apache.droids.api.Parser;
import org.apache.droids.exception.DroidsException;
import org.apache.droids.net.RegexURLFilter;
import org.apache.droids.parse.ParseImpl;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import com.arte.statistic.dataset.repository.repository.impl.util.Pair;
import com.stat4you.crawler.droids.api.LinkStat4you;
import com.stat4you.crawler.util.CrawlerInfo;
import com.stat4you.crawler.util.CrawlerUtil;

public class EustatHtmlParser implements Parser {

    private Map<String, String> elements = null;
    
    private CrawlerInfo crawlerInfo;
    
    private RegexURLFilter       forceModeFilter;

    public void setForceModeFilter(RegexURLFilter forceModeFilter) {
        this.forceModeFilter = forceModeFilter;
    }

    public RegexURLFilter getForceModeFilter() {
        return forceModeFilter;
    }
    
    public void setCrawlerInfo(CrawlerInfo crawlerInfo) {
        this.crawlerInfo = crawlerInfo;
    }
    
    public CrawlerInfo getCrawlerInfo() {
        return crawlerInfo;
    }
    
    public Map<String, String> getElements() {
        if (elements == null) {
            elements = new HashMap<String, String>();
        }
        return elements;
    }

    public void setElements(Map<String, String> elements) {
        this.elements = elements;
    }

    public Parse parse(ContentEntity entity, Link link) throws IOException, DroidsException {
        InputStream instream = entity.obtainContent();
        try {
            // Document doc = Jsoup.parse(instream, CrawlerUtil.getEncoding(instream, metadata), link.getURI().toString());
            Document doc = Jsoup.parse(instream, "ISO-8859-1", link.getURI().toString());

            Pair<Set<Link>, Set<Link>> pxLinks = extractPxLastUpdate(link, doc); // Extract PX links

            Set<Link> allLinks = extractLinks(link, doc);
            Set<Link> linksToDownload = pxLinks.getFirst();
            Set<Link> linksToDontDownload = pxLinks.getSecond();

            linksToDownload.addAll(allLinks);
            linksToDontDownload.removeAll(linksToDontDownload);

            // If force mode
            if (this.crawlerInfo.getForceUpdateInfoMode() != null) {
                linksToDownload = CrawlerUtil.filterLinksForForceMode(getForceModeFilter(), linksToDownload);
            }
            
            return new ParseImpl(link.getId(), linksToDownload);
        } finally {
            IOUtils.closeQuietly(instream);
        }
    }

    /**
     * Extract links from html
     * 
     * @param link
     * @param doc
     * @return
     */
    private Set<Link> extractLinks(Link link, Document doc) {
        Set<Link> extractedLinks = new HashSet<Link>();
        Set<String> history = new HashSet<String>();

        String category = extractCategory(link, doc);

        Iterator<String> it = elements.keySet().iterator();
        String elem, linkAtt;
        while (it.hasNext()) {
            elem = it.next(); // HTML tag
            linkAtt = elements.get(elem); // HTML tag attribute

            Elements linkElements = doc.getElementsByTag(elem);
            for (Element linkElement : linkElements) {
                String tagAttribute = linkElement.attr(linkAtt);

                URI uri = CrawlerUtil.stringToUri(link.getURI(), tagAttribute);
                if (uri != null && history.add(tagAttribute)) {
                    LinkStat4you linkStat4you = new LinkStat4you(link, uri, link.getDepth() + 1);
                    linkStat4you.setCategory(category);
                    extractedLinks.add(linkStat4you);
                }
            }
        }

        return extractedLinks;
    }

    /**
     * Extract a eustat category from breadcrumb
     * 
     * @param refererLink
     * @param doc
     * @return
     */
    public String extractCategory(Link refererLink, Document doc) {

        LinkStat4you linkStat4you = null;
        if (refererLink instanceof LinkStat4you) {
            linkStat4you = (LinkStat4you) refererLink;
            
            // If the category was extracted before this time, then continue
            if (StringUtils.isNotEmpty(linkStat4you.getCategory())) {
                return linkStat4you.getCategory();
            }
        }
        
        // If is Force Update, the category is a param of Crawler-Job service.
        if (getCrawlerInfo().isForceUpdateInfoMode()) {
            return getCrawlerInfo().getForceUpdateInfoMode().getCategory();
        }
        
        Element primerEnlaceHoja = doc.select(".eustplantlista li:not(.eustNodoNoHoja)").first();
        if (primerEnlaceHoja != null) {
            // Página con el menú donde hay que extraer la categoria
            Element lastMenuParent = findLastParentThatMatch("li", primerEnlaceHoja);
            Elements aCategoria = lastMenuParent.select("> a");
            return aCategoria.text();
        }

        return null;
    }

    private Element findLastParentThatMatch(String tagName, Element element){
        Element result = null;
        
        for(Element parent : element.parents()){
            if(parent.tagName().equals(tagName)){
                result = parent;
            }
        }
        
        return result;
    }
    
    
    /**
     * Extract a link PX
     * 
     * @param refererLink
     * @param doc
     * @return
     * @throws DroidsException 
     */
    public Pair<Set<Link>, Set<Link>> extractPxLastUpdate(Link refererLink, Document doc) throws DroidsException {
        Set<Link> extractedPxToDownloadLinks = new HashSet<Link>();
        Set<Link> extractedPxToDontDownloadLinks = new HashSet<Link>();

        Elements tableRows = doc.select(".eusttablaint tbody tr");
        for (Element row : tableRows) {
            // Only rows with 3 columns because there are may headings in the middle.
            if (row.children().size() == 3) {
                // Date
                Element modifiedColumn = row.child(1);
                String modifiedDateText = modifiedColumn.text();
                DateTime modifiedDate = parseDate(modifiedDateText);

                // link
                Element downloadColumn = row.child(2);
                String pxLink = downloadColumn.select("a").attr("href");

                LinkStat4you link = createLink(refererLink, pxLink, modifiedDate);

                if (link != null) {
                    if (getCrawlerInfo().isNeedProcessLink(link, link.getPxLastUpdate())) {
                        extractedPxToDownloadLinks.add(link);
                    } else {
                        extractedPxToDontDownloadLinks.add(link);
                    }
                }
            }
        }

        return new Pair<Set<Link>, Set<Link>>(extractedPxToDownloadLinks, extractedPxToDontDownloadLinks);
    }

    private DateTime parseDate(String date) {
        DateTime parseDateTime = null;
        DateTimeFormatter fmt = DateTimeFormat.forPattern("dd'/'MM'/'yyyy'").withLocale(Locale.ENGLISH);
        parseDateTime = fmt.parseDateTime(date);
        return parseDateTime;
    }

    private LinkStat4you createLink(Link link, String url, DateTime modifiedDate) {
        URI uri = CrawlerUtil.stringToUri(link.getURI(), url);
        if (uri == null)
            return null;
        LinkStat4you linkStat4you = new LinkStat4you(link, uri, link.getDepth() + 1);
        if (link instanceof LinkStat4you) {
            linkStat4you.setCategory(((LinkStat4you) link).getCategory());
        }
        else {
            // If is Force Update, the category is a param of Crawler-Job service.
            if (getCrawlerInfo().isForceUpdateInfoMode()) {
                linkStat4you.setCategory(getCrawlerInfo().getForceUpdateInfoMode().getCategory());
            }
        }
        linkStat4you.setPxLastUpdate(modifiedDate);
        return linkStat4you;
    }
}
