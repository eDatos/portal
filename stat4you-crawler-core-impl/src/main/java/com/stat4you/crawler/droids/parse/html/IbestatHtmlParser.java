package com.stat4you.crawler.droids.parse.html;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.ListIterator;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.io.IOUtils;
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

public class IbestatHtmlParser implements Parser {

    private Map<String, String>  elements          = null;

    private static final String  PARAMETER_LANG_ES = "&lang=es";

    private static final Pattern LASTUPDATE        = Pattern.compile("[^:]*:(.*)\\(.*\\)");
    private static final Pattern IBESTAT_CATEGORY_PATTERN = Pattern.compile("[^:]*:(.*)");

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
            Document doc = Jsoup.parse(instream, null, link.getURI().toString());

            Pair<Set<Link>, Set<Link>> extractPxLinks = extractPxLastUpdate(link, doc); // Extract PX links

            Set<Link> extractLinks = extractPxLinks.getFirst();
            extractLinks.addAll(extractLinks(link, doc)); // add all links of page
            extractLinks.removeAll(extractPxLinks.getSecond()); // remove all PX links that not updated

            // If force mode
            if (this.crawlerInfo.getForceUpdateInfoMode() != null) {
                extractLinks = CrawlerUtil.filterLinksForForceMode(getForceModeFilter(), extractLinks);
            }
            
            return new ParseImpl(link.getId(), extractLinks);
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

                // ONLY PAGES IN 'ES' LANGUAGE
                if (!tagAttribute.contains(PARAMETER_LANG_ES)) {
                    tagAttribute = tagAttribute.concat(PARAMETER_LANG_ES);
                }

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
     * Extract a ibestat category from breadcrumb
     * 
     * @param link
     * @param doc
     * @return
     */
    private String extractCategory(Link link, Document doc) {

        Elements contents = doc.select("ul#navlist > li");

        Iterator<Element> it = contents.iterator();
        Element elem;
        boolean first = true;
        while (it.hasNext()) {
            elem = it.next();

            // First breadcrumb not processed
            if (first) {
                first = false;
            } else {
                if (elem.children().size() >= 1) {
                    // Area BreadCrumb
                    Matcher matcher = IBESTAT_CATEGORY_PATTERN.matcher(elem.child(1).text());
                    if (matcher.matches()) {
                        if (matcher.groupCount() >= 1) {
                            return matcher.group(1).trim();
                        }
                    }
                    return null;
                }
            }

        }

        return null;
    }

    /**
     * Extract a link PX
     * 
     * @param link
     * @param doc
     * @return
     * @throws DroidsException 
     */
    public Pair<Set<Link>, Set<Link>> extractPxLastUpdate(Link link, Document doc) throws DroidsException {

        Set<Link> extractedPxToDownloadLinks = new HashSet<Link>();
        Set<Link> extractedPxToDontDownloadLinks = new HashSet<Link>();

        Set<String> history = new HashSet<String>();

        String category = extractCategory(link, doc);
        Elements select = doc.select(".tools_lista_tablas");

        ListIterator<Element> listIterator = select.listIterator();

        while (listIterator.hasNext()) {
            Element next = listIterator.next();

            Elements tableInfo = next.select(".tools_lista_tablas_info img ");
            String attr = tableInfo.attr("alt");

            // DATE
            Matcher matcher = LASTUPDATE.matcher(attr);
            if (matcher.matches()) {
                if (matcher.groupCount() >= 1) {
                    attr = matcher.group(1);
                }
            }

            DateTimeFormatter fmt = DateTimeFormat.forPattern("EEE MMM dd yyyy HH:mm:ss 'GMT'Z").withLocale(Locale.ENGLISH);
            DateTime parseDateTime = fmt.parseDateTime(attr.trim());

            // URL
            Elements tablePx = next.select(".linkDescargaDocumento");
            String href = tablePx.attr("href");

            // ONLY PAGES IN 'ES' LANGUAGE
            if (!href.contains(PARAMETER_LANG_ES)) {
                href = href.concat(PARAMETER_LANG_ES);
            }

            // ULR
            LinkStat4you linkStat4you = null;

            URI uri = CrawlerUtil.stringToUri(link.getURI(), href);
            if (uri != null && history.add(href)) {
                linkStat4you = new LinkStat4you(link, uri, link.getDepth() + 1);
                
                linkStat4you.setCategory(category);
                linkStat4you.setPxLastUpdate(parseDateTime);
                linkStat4you.getRelativeContextPages().add(link.getURI().toString());
            }

            if (linkStat4you != null) {
                if (getCrawlerInfo().isNeedProcessLink(linkStat4you, parseDateTime)) {
                    extractedPxToDownloadLinks.add(linkStat4you);
                } else {
                    extractedPxToDontDownloadLinks.add(linkStat4you);
                }
            }
        }

        return new Pair<Set<Link>, Set<Link>>(extractedPxToDownloadLinks, extractedPxToDontDownloadLinks);
    }

}
