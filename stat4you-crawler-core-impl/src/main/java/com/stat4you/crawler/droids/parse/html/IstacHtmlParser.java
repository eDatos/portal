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
import com.stat4you.common.dto.InternationalStringDto;
import com.stat4you.common.dto.LocalisedStringDto;
import com.stat4you.crawler.droids.api.LinkStat4you;
import com.stat4you.crawler.util.CrawlerInfo;
import com.stat4you.crawler.util.CrawlerUtil;

public class IstacHtmlParser implements Parser {

    private Map<String, String>  elements             = null;

    private static final Pattern LASTUPDATE           = Pattern.compile("[^:]*: (\\d{1,2}/\\d{1,2}/\\d\\d\\d\\d) -.*");
    private static final Pattern CATEGOY_EXTRACT_PAGE = Pattern.compile(".*temas_estadisticos/([^/]*)/.*");

    private CrawlerInfo          crawlerInfo;
    
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

                URI uri = CrawlerUtil.stringToUri(link.getURI(), tagAttribute);
                if (uri != null && history.add(tagAttribute)) {
                    LinkStat4you linkStat4you = new LinkStat4you(link, uri, link.getDepth() + 1);
                    linkStat4you.setCategory(category);
                    addLinkContextHistory(link, linkStat4you);
                    extractedLinks.add(linkStat4you);
                }
            }
        }

        return extractedLinks;
    }

    /**
     * Add info to link about context pages where the PX is published
     * 
     * @param link
     * @param linkStat4you
     */
    private void addLinkContextHistory(Link link, LinkStat4you linkStat4you) {
        if (link instanceof LinkStat4you) {
            linkStat4you.getRelativeContextPages().addAll(((LinkStat4you) link).getRelativeContextPages());
        }
        // Context page
        linkStat4you.getRelativeContextPages().add(link.getURI().toString());
    }

    /**
     * Extract a istac category from breadcrumb
     * 
     * @param link
     * @param doc
     * @return
     */
    public String extractCategory(Link link, Document doc) {

        LinkStat4you linkStat4you = null;
        if (link instanceof LinkStat4you) {
            linkStat4you = (LinkStat4you) link;

            // If the category was extracted before this time, then continue
            if (StringUtils.isNotEmpty(linkStat4you.getCategory())) {
                return linkStat4you.getCategory();
            }
        }
        
        // If is Force Update, the category is a param of Crawler-Job service.
        if (getCrawlerInfo().isForceUpdateInfoMode()) {
            return getCrawlerInfo().getForceUpdateInfoMode().getCategory();
        }

        // If is a page JAXI:menu, try extract subject.
        Matcher matcher = CATEGOY_EXTRACT_PAGE.matcher(link.getURI().toString());
        if (matcher.matches()) {
            if (matcher.groupCount() >= 1) {
                return matcher.group(1);
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
     */
    public Pair<Set<Link>, Set<Link>> extractPxLastUpdate(Link link, Document doc) throws DroidsException  {

        Set<Link> extractedPxToDownloadLinks = new HashSet<Link>();
        Set<Link> extractedPxToDontDownloadLinks = new HashSet<Link>();
        Set<String> history = new HashSet<String>();

        InternationalStringDto titleDto = null;
        if (link.getURI().toString().contains("menu.do")) {
            titleDto = extractTitle(link, doc);
        }
        
        Elements select = doc.select(".linkDescargaDocumento");

        ListIterator<Element> listIterator = select.listIterator();

        // All downloads links
        while (listIterator.hasNext()) {
            Element next = listIterator.next();

            String lastUpdateString = next.parent().select("img").first().attr("title");

            // DATE : example -> "Última modificación: 31/10/2011 - Tamaño: 2086 bytes"
            DateTime parseDateTime = null;
            Matcher matcher = LASTUPDATE.matcher(lastUpdateString);
            if (matcher.matches()) {
                if (matcher.groupCount() >= 1) {
                    lastUpdateString = matcher.group(1);

                    DateTimeFormatter fmt = DateTimeFormat.forPattern("dd'/'MM'/'yyyy'").withLocale(Locale.ENGLISH);
                    parseDateTime = fmt.parseDateTime(lastUpdateString);
                }
            }

            // URL
            String href = next.attr("href");
            LinkStat4you linkStat4you = null;

            URI uri = CrawlerUtil.stringToUri(link.getURI(), href);
            if (uri != null && history.add(href)) {
                linkStat4you = new LinkStat4you(link, uri, link.getDepth() + 1);
                if ((link instanceof LinkStat4you)) {
                    linkStat4you.setCategory(((LinkStat4you) link).getCategory());
                    // Add Context
                    linkStat4you.getRelativeContextPages().addAll(((LinkStat4you) link).getRelativeContextPages());
                    linkStat4you.getRelativeContextPages().add(link.getURI().toString());
                } else {
                    // If is Force Update, the category is a param of Crawler-Job service.
                    if (getCrawlerInfo().isForceUpdateInfoMode()) {
                        linkStat4you.setCategory(getCrawlerInfo().getForceUpdateInfoMode().getCategory());
                    }
                }
                linkStat4you.getRelativeContextPages().add(link.getURI().toString());
                linkStat4you.setTitle(titleDto);
                linkStat4you.setPxLastUpdate(parseDateTime);
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
    
    public InternationalStringDto extractTitle(Link link, Document doc) {
        LinkStat4you linkStat4you = null;
        if (link instanceof LinkStat4you) {
            linkStat4you = (LinkStat4you) link;
        }
        
        // First: Try extract from .p1
        Elements select = doc.select(".h2content");

        InternationalStringDto internationalStringDto = new InternationalStringDto();

        // Getting Title in spanish (default)
        if (select.hasText()) {
            LocalisedStringDto localisedStringDto = new LocalisedStringDto();
            localisedStringDto.setLocale("es");
            // Default is Spanish -> l0
            localisedStringDto.setLabel(select.text().trim());

            internationalStringDto.addText(localisedStringDto);
            return internationalStringDto;
        }
        
        // If the title was extracted before this time, then continue
        if (linkStat4you != null && linkStat4you.getTitle() != null) {
            return linkStat4you.getTitle();
        }

        return null;
    }

}
