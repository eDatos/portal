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
import com.stat4you.crawler.droids.enums.IneCCAACodeEnum;
import com.stat4you.crawler.droids.enums.IneSubjectEnum;
import com.stat4you.crawler.util.CrawlerInfo;
import com.stat4you.crawler.util.CrawlerUtil;

public class IneHtmlParser implements Parser {

    private Map<String, String>  elements             = null;

    private static final Pattern LASTUPDATE_SLASH     = Pattern.compile("[^:]*:\\s?(\\d{1,2}/\\d{1,2}/\\d\\d\\d\\d).*", Pattern.DOTALL);
    private static final Pattern LASTUPDATE_DASH      = Pattern.compile("[^:]*:\\s?(\\d{1,2}-\\d{1,2}-\\d\\d\\d\\d).*", Pattern.DOTALL);
    private static final Pattern CATEGORY_SUBJECT_URI = Pattern.compile(".*path=[^t]*t(\\d*)/.*");
    private static final Pattern URL_GENERAPX         = Pattern.compile("(.*GeneraPX.*)TB_iframe.*");
    private static final Pattern URL_DOWNPX           = Pattern.compile(".*pcaxisdl.*");
    private static final Pattern INE_YEAR_PATH_FIX    = Pattern.compile(".*/a(\\d\\d\\d\\d)/.*");
    private static final Pattern INE_REGION_PATH_FIX  = Pattern.compile(".*/ccaa(\\d+)/.*");

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

                Matcher matcher = URL_GENERAPX.matcher(tagAttribute);
                if (matcher.matches()) {
                    if (matcher.groupCount() >= 1) {
                        tagAttribute = matcher.group(1);
                        tagAttribute += "down=";
                    }
                }

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
        // Context page : JAXI
        if (link.getURI().toString().contains("jaxi")) {
            linkStat4you.getRelativeContextPages().add(link.getURI().toString());
        }
    }

    /**
     * Extract a ine category from breadcrumb
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
            return urlCategoryCodeToCategoy(getCrawlerInfo().getForceUpdateInfoMode().getCategory());
        }

        // If is a page JAXI:menu, try extract subject.
        if (link.getURI().toString().contains("menu.do")) {
            // Extract category if exist.
            String subjectCode = StringUtils.EMPTY;
            if (StringUtils.isNotEmpty(link.getURI().getQuery())) {
                Matcher matcher = CATEGORY_SUBJECT_URI.matcher(link.getURI().getQuery());
                if (matcher.matches()) {
                    if (matcher.groupCount() >= 1) {
                        subjectCode = matcher.group(1);
                    }
                }
                return urlCategoryCodeToCategoy(subjectCode);
            }
        }

        return null;
    }

    /**
     * @param category
     * @param subjectCode
     * @return
     */
    private String urlCategoryCodeToCategoy(String subjectCode) {
        IneSubjectEnum ineSubjectEnum = null;
        try {
            ineSubjectEnum = IneSubjectEnum.fromSubSubject(subjectCode);
        } catch (Exception e) {
            return null;
        }

        return ineSubjectEnum.getValue();
    }

    /**
     * Extract a link PX
     * 
     * @param link
     * @param doc
     * @return extractedPxToDownloadLinks, extractedPxToDontDownloadLinks
     * @throws DroidsException 
     */
    public Pair<Set<Link>, Set<Link>> extractPxLastUpdate(Link link, Document doc) throws DroidsException {

        Set<Link> extractedPxToDownloadLinks = new HashSet<Link>();
        Set<Link> extractedPxToDontDownloadLinks = new HashSet<Link>();
        Set<String> history = new HashSet<String>();

        String period = StringUtils.EMPTY;
        InternationalStringDto region = null;
        InternationalStringDto titleDto = null;
        if (link.getURI().toString().contains("menu.do")) {
            period = fixPeriod(link, doc);
            region = fixRegion(link, doc);
            titleDto = extractTitle(link, doc);
        }

        Elements select = doc.select(".p3");

        ListIterator<Element> listIterator = select.listIterator();

        if (!listIterator.hasNext()) {
            select = doc.select(".tabla_inebase");
            listIterator = select.listIterator();
        }

        // All downloads links
        while (listIterator.hasNext()) {
            Element next = listIterator.next();

            String lastUpdateString = next.select(".puntero").attr("alt");

            // DATE : example -> "Última modificación: 31/10/2011 - Tamaño: 2086 bytes"
            DateTime parseDateTime = null;
            Matcher matcher = LASTUPDATE_SLASH.matcher(lastUpdateString);
            if (matcher.matches()) {
                if (matcher.groupCount() >= 1) {
                    lastUpdateString = matcher.group(1);

                    DateTimeFormatter fmt = DateTimeFormat.forPattern("dd'/'MM'/'yyyy'").withLocale(Locale.ENGLISH);
                    parseDateTime = fmt.parseDateTime(lastUpdateString);
                }
            } else {
                matcher = LASTUPDATE_DASH.matcher(lastUpdateString);
                if (matcher.matches()) {
                    if (matcher.groupCount() >= 1) {
                        lastUpdateString = matcher.group(1);

                        DateTimeFormatter fmt = DateTimeFormat.forPattern("dd'-'MM'-'yyyy'").withLocale(Locale.ENGLISH);
                        parseDateTime = fmt.parseDateTime(lastUpdateString);
                    }
                }
            }

            // URL
            String href = next.select("a").first().attr("href");
            LinkStat4you linkStat4you = null;

            boolean isPXlink = false;
            matcher = URL_GENERAPX.matcher(href);
            if (matcher.matches()) {
                if (matcher.groupCount() >= 1) {
                    href = matcher.group(1);
                    href += "down=";
                }
                isPXlink = true;
            }

            matcher = URL_DOWNPX.matcher(href);
            if (matcher.matches()) {
                isPXlink = true;
            }

            if (isPXlink) {
                URI uri = CrawlerUtil.stringToUri(link.getURI(), href);
                if (uri != null && history.add(href)) {
                    linkStat4you = new LinkStat4you(link, uri, link.getDepth() + 1);
                    if ((link instanceof LinkStat4you)) {
                        linkStat4you.setCategory(((LinkStat4you) link).getCategory());
                        linkStat4you.getRelativeContextPages().addAll(((LinkStat4you) link).getRelativeContextPages()); // Add Context
                        linkStat4you.setPeriod(period);
                        linkStat4you.setGeographicalValue(region);
                    } else {
                        // If is Force Update, the category is a param of Crawler-Job service.
                        if (getCrawlerInfo().isForceUpdateInfoMode()) {
                            linkStat4you.setCategory(urlCategoryCodeToCategoy(getCrawlerInfo().getForceUpdateInfoMode().getCategory()));
                            linkStat4you.setPeriod(getCrawlerInfo().getForceUpdateInfoMode().getPeriod());
                            linkStat4you.setGeographicalValue(createRegionI10NString(getCrawlerInfo().getForceUpdateInfoMode().getRegion()));
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
        }

        return new Pair<Set<Link>, Set<Link>>(extractedPxToDownloadLinks, extractedPxToDontDownloadLinks);
    }

    public InternationalStringDto extractTitle(Link link, Document doc) {
        LinkStat4you linkStat4you = null;
        if (link instanceof LinkStat4you) {
            linkStat4you = (LinkStat4you) link;
        }

        // First: Try extract from .p1
        Elements select = doc.select(".p1");

        InternationalStringDto internationalStringDto = new InternationalStringDto();

        // Getting Title in spanish (default)
        if (select.hasText() && StringUtils.isNotBlank(select.text())) {
            LocalisedStringDto localisedStringDto = new LocalisedStringDto();
            localisedStringDto.setLocale("es");
            // Default is Spanish -> l0
            localisedStringDto.setLabel(select.text().trim());

            internationalStringDto.addText(localisedStringDto);
            return internationalStringDto;
        }

        // Second: Try extract from .
        select = doc.select("h1");
        // Getting Title in spanish (default)
        if (select.hasText() && StringUtils.isNotBlank(select.text())) {
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

        // Getting Title in english
        // TODO skipped INE english tittle, disabled in this time
        /*
         * try {
         * String urlenglish = link.getURI().toURL().toString();
         * if (urlenglish.contains("&L=0")) {
         * urlenglish = urlenglish.replace("&L=0", "&L=1");
         * } else {
         * urlenglish += "&L=1";
         * }
         * Document docEn = Jsoup.parse(new URL(urlenglish), 60000);
         * select = docEn.select(".p1");
         * if (select.hasText()) {
         * LocalisedStringDto localisedStringDto = new LocalisedStringDto();
         * localisedStringDto.setLocale("en");
         * // Default is Spanish -> l0
         * localisedStringDto.setLabel(select.text().trim());
         * internationalStringDto.addText(localisedStringDto);
         * }
         * // h1
         * } catch (MalformedURLException e) {
         * // nothing
         * } catch (IOException e) {
         * // nothing, continue
         * }
         */
        return null;
    }

    // TODO this is for fix INE PXs that has same metadata part
    // See: http://www.ine.es/jaxi/menu.do?type=pcaxis&path=%2Ft01/p044&file=inebase&L=
    private InternationalStringDto fixRegion(Link link, Document doc) {
        String url = link.getURI().toString();

        // GEOGRAPHICAL VALUE
        Matcher matcher = INE_REGION_PATH_FIX.matcher(url);
        if (matcher.matches()) {
            if (matcher.groupCount() >= 1) {
                return createRegionI10NString(matcher.group(1));
            }
        }
        return null;
    }

    private InternationalStringDto createRegionI10NString(String ineCCAACode) {
        InternationalStringDto internationalStringDto = null;
        try {
            IneCCAACodeEnum ineCCAACodeEnum = IneCCAACodeEnum.fromCode(ineCCAACode);
            internationalStringDto = new InternationalStringDto();

            LocalisedStringDto localisedStringESDto = new LocalisedStringDto();
            localisedStringESDto.setLocale("es");
            localisedStringESDto.setLabel(ineCCAACodeEnum.getValueEs());
            internationalStringDto.addText(localisedStringESDto);

            LocalisedStringDto localisedStringENDto = new LocalisedStringDto();
            localisedStringENDto.setLocale("en");
            localisedStringENDto.setLabel(ineCCAACodeEnum.getValueEn());
            internationalStringDto.addText(localisedStringENDto);

        } catch (Exception e) {
            // Nothing
        }

        return internationalStringDto;
    }

    // TODO this is for fix INE PXs that has same metadata part
    // See: http://www.ine.es/jaxi/menu.do?type=pcaxis&path=%2Ft01/p044&file=inebase&L=
    private String fixPeriod(Link link, Document doc) {
        String url = link.getURI().toString();

        // DATE
        Matcher matcher = INE_YEAR_PATH_FIX.matcher(url);
        if (matcher.matches()) {
            if (matcher.groupCount() >= 1) {
                return matcher.group(1);
            }
        }

        return StringUtils.EMPTY;
    }

}
