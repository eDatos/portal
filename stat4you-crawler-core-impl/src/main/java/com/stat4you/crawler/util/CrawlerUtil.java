package com.stat4you.crawler.util;

import static org.quartz.CronScheduleBuilder.cronSchedule;
import static org.quartz.JobBuilder.newJob;
import static org.quartz.TriggerBuilder.newTrigger;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URI;
import java.nio.charset.Charset;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.apache.droids.api.ContentEntity;
import org.apache.droids.api.Link;
import org.apache.droids.net.RegexURLFilter;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.mime.MediaType;
import org.apache.tika.parser.txt.CharsetDetector;
import org.apache.tika.parser.txt.CharsetMatch;
import org.apache.tika.utils.CharsetUtils;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.joda.time.DateTime;
import org.joda.time.format.ISODateTimeFormat;
import org.quartz.CronTrigger;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.impl.SchedulerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.stat4you.common.Stat4YouConstants;
import com.stat4you.common.configuration.Stat4YouConfiguration;
import com.stat4you.crawler.conf.CrawlerDataloader;
import com.stat4you.crawler.droids.enums.CrawlerProvider;
import com.stat4you.crawler.droids.job.EustatDroidJob;
import com.stat4you.crawler.droids.job.IbestatDroidJob;
import com.stat4you.crawler.droids.job.IneDroidJob;
import com.stat4you.crawler.droids.job.IstacDroidJob;


public class CrawlerUtil {

    private static final Logger log = LoggerFactory.getLogger(CrawlerUtil.class);
    
    public static final String   PX_MIME_TYPE_TEXT_PLAIN = "text/plain";
    public static final String   PX_MIME_TYPE_APP_UNKNOW = "application/unknow";                                                                                                                     
    public static final String   PX_MIME_TYPE_APP_PX     = "application/px";                                                                                                                         
                                                                                                                                                                                                                                                                                                                                                                                                       

    private static Set<String>   mimetypesPX;

    public static final String   PX_SUFFIX               = ".px";
    public static final String   PX_INE_DOWN              = "&down=";
    public static final String   DEFAULT_PROVIDER        = "DEFAULT_PROVIDER";

    // Use the widest, most common charset as our default.
    private static final String  DEFAULT_CHARSET         = "windows-1252";
    // TIKA-357 - use bigger buffer for meta tag sniffing (was 4K)
    private static final int     META_TAG_BUFFER_SIZE    = 8192;
    private static final Pattern HTTP_EQUIV_PATTERN      = Pattern.compile("(?is)<meta\\s+http-equiv\\s*=\\s*['\\\"]\\s*" + "Content-Type['\\\"]\\s+content\\s*=\\s*['\\\"]" + "([^'\\\"]+)['\\\"]");

    static {
        mimetypesPX = new HashSet<String>();
        mimetypesPX.add(PX_MIME_TYPE_TEXT_PLAIN);
        mimetypesPX.add(PX_MIME_TYPE_APP_UNKNOW);
        mimetypesPX.add(PX_MIME_TYPE_APP_PX);
    }

    /**
     * Check if a uri is a PX uri
     * @param baseLink
     * @param entity
     * @return
     */
    public static Boolean isPxFile(Link baseLink, ContentEntity entity) {
        String uri = baseLink.getURI().toString().toLowerCase();
        if (mimetypesPX.contains(entity.getMimeType()) && (StringUtils.contains(uri, CrawlerUtil.PX_SUFFIX) || uri.endsWith("&down="))) {
            return Boolean.TRUE;
        }
        return Boolean.FALSE;
    }

    /**
     * TIKA-332: Check for meta http-equiv tag with charset info in
     * HTML content.
     * <p>
     * TODO: Move this into core, along with CharsetDetector
     */
    public static String getEncoding(InputStream stream, Metadata metadata) throws IOException {
        stream.mark(META_TAG_BUFFER_SIZE);
        char[] buffer = new char[META_TAG_BUFFER_SIZE];
        InputStreamReader isr = new InputStreamReader(stream, "us-ascii");
        int bufferSize = isr.read(buffer);
        stream.reset();

        if (bufferSize != -1) {
            String metaString = new String(buffer, 0, bufferSize);
            Matcher m = HTTP_EQUIV_PATTERN.matcher(metaString);
            if (m.find()) {
                // TIKA-349: flexible handling of attributes
                // We have one or more x or x=y attributes, separated by ';'
                String[] attrs = m.group(1).split(";");
                for (String attr : attrs) {
                    String[] keyValue = attr.trim().split("=");
                    if ((keyValue.length == 2) && keyValue[0].equalsIgnoreCase("charset")) {
                        // TIKA-459: improve charset handling.
                        String charset = CharsetUtils.clean(keyValue[1]);
                        if (CharsetUtils.isSupported(charset)) {
                            metadata.set(Metadata.CONTENT_ENCODING, charset);
                            return charset;
                        }
                    }
                }
            }
        }

        // No (valid) charset in a meta http-equiv tag, see if it's in the passed content-encoding
        // hint, or the passed content-type hint.
        CharsetDetector detector = new CharsetDetector();
        String incomingCharset = metadata.get(Metadata.CONTENT_ENCODING);
        String incomingType = metadata.get(Metadata.CONTENT_TYPE);
        if (incomingCharset == null && incomingType != null) {
            // TIKA-341: Use charset in content-type
            MediaType mt = MediaType.parse(incomingType);
            if (mt != null) {
                String charset = mt.getParameters().get("charset");
                if ((charset != null) && Charset.isSupported(charset)) {
                    incomingCharset = charset;
                }
            }
        }

        if (incomingCharset != null) {
            detector.setDeclaredEncoding(incomingCharset);
        }

        // TIKA-341 without enabling input filtering (stripping of tags) the
        // short HTML tests don't work well.
        detector.enableInputFilter(true);
        detector.setText(stream);
        for (CharsetMatch match : detector.detectAll()) {
            if (Charset.isSupported(match.getName())) {
                metadata.set(Metadata.CONTENT_ENCODING, match.getName());

                // TIKA-339: Don't set language, as it's typically not a very good
                // guess, and it can create ambiguity if another (better) language
                // value is specified by a meta tag in the HTML (or via HTTP response
                // header).
                /*
                 * String language = match.getLanguage();
                 * if (language != null) {
                 * metadata.set(Metadata.CONTENT_LANGUAGE, match.getLanguage());
                 * metadata.set(Metadata.LANGUAGE, match.getLanguage());
                 * }
                 */

                break;
            }
        }

        String encoding = metadata.get(Metadata.CONTENT_ENCODING);
        if (encoding == null) {
            if (Charset.isSupported(DEFAULT_CHARSET)) {
                encoding = DEFAULT_CHARSET;
            } else {
                encoding = Charset.defaultCharset().name();
            }

            metadata.set(Metadata.CONTENT_ENCODING, encoding);
        }

        return encoding;
    }
    
    
    public static void addCronTrigers() throws SchedulerException {
        Scheduler sched = SchedulerRepository.getInstance().lookup(Stat4YouConstants.JOB_SCHEDULER); // get a reference to a scheduler
        // JOB CRAWLERS
        
        // ISTAC
        JobDetail jobIstac = newJob(IstacDroidJob.class).withIdentity("job"+ CrawlerProvider.CRW_ISTAC.name() + "Droid", "crawlerDroid").build();

        CronTrigger triggerIstac = newTrigger().withIdentity("trigger"+ CrawlerProvider.CRW_ISTAC.name() + "Droid", "crawlerDroid").withSchedule(cronSchedule(Stat4YouConfiguration.instance().getProperty("stat4you.crawler.droids.provider.istac.cronexp"))).build();
        if (sched.getTrigger(triggerIstac.getKey()) == null) {            
            sched.scheduleJob(jobIstac, triggerIstac);
            log.info("Job for ISTAC scheduled at (cron expression): " + triggerIstac.getCronExpression());
        } else {
            sched.rescheduleJob(triggerIstac.getKey(), triggerIstac);
            log.info("Job for ISTAC rescheduled at (cron expression): " + triggerIstac.getCronExpression());
        }
        
        // IBESTAT
        JobDetail jobIbestat = newJob(IbestatDroidJob.class).withIdentity("job"+ CrawlerProvider.CRW_IBESTAT.name() + "Droid", "crawlerDroid").build();

        CronTrigger triggerIbestat = newTrigger().withIdentity("trigger"+ CrawlerProvider.CRW_IBESTAT.name() + "Droid", "crawlerDroid").withSchedule(cronSchedule(Stat4YouConfiguration.instance().getProperty("stat4you.crawler.droids.provider.ibestat.cronexp"))).build();
        if (sched.getTrigger(triggerIbestat.getKey()) == null) {
            sched.scheduleJob(jobIbestat, triggerIbestat);
            log.info("Job for IBESTAT scheduled at (cron expression): " + triggerIbestat.getCronExpression());
        } else {
            sched.rescheduleJob(triggerIbestat.getKey(), triggerIbestat);
            log.info("Job for IBESTAT rescheduled at (cron expression): " + triggerIbestat.getCronExpression());
        }
       
        // EUSGTAT
        JobDetail jobEustat = newJob(EustatDroidJob.class).withIdentity("job"+ CrawlerProvider.CRW_EUSTAT.name() + "Droid", "crawlerDroid").build();

        CronTrigger triggerEustat = newTrigger().withIdentity("trigger"+ CrawlerProvider.CRW_EUSTAT.name(), "crawlerDroid").withSchedule(cronSchedule(Stat4YouConfiguration.instance().getProperty("stat4you.crawler.droids.provider.eustat.cronexp"))).build();
        if (sched.getTrigger(triggerEustat.getKey()) == null) {
            sched.scheduleJob(jobEustat, triggerEustat);
            log.info("Job for EUSTAT scheduled at (cron expression): " + triggerEustat.getCronExpression());
        } else {
            sched.rescheduleJob(triggerEustat.getKey(), triggerEustat);
            log.info("Job for EUSTAT rescheduled at (cron expression): " + triggerEustat.getCronExpression());
        }
        
        // INE
        JobDetail jobIne = newJob(IneDroidJob.class).withIdentity("job"+ CrawlerProvider.CRW_INE.name() + "Droid", "crawlerDroid").build();

        CronTrigger triggerIne = newTrigger().withIdentity("trigger"+ CrawlerProvider.CRW_INE.name() + "Droid", "crawlerDroid").withSchedule(cronSchedule(Stat4YouConfiguration.instance().getProperty("stat4you.crawler.droids.provider.ine.cronexp"))).build();
        if (sched.getTrigger(triggerIne.getKey()) == null) {
            sched.scheduleJob(jobIne, triggerIne);
            log.info("Job for INE scheduled at (cron expression): " + triggerIne.getCronExpression());
        } else {
            sched.rescheduleJob(triggerIne.getKey(), triggerIne);
            log.info("Job for INE rescheduled at (cron expression): " + triggerIne.getCronExpression()); 
        }        
    }
    
    /**
     * Transform category in provider to category in Stat4You
     */
    public static String toCategoryStat4You(String provider, String categoryInProvider) throws ApplicationException {
        return CrawlerDataloader.instance().getCategory(provider, categoryInProvider);
    }
    
    /**
     * Filters valid Links from forceModeFilter 
     * @param forceModeFilter
     * @param extractLinks
     * @return the filters links
     */
    public static Set<Link> filterLinksForForceMode(RegexURLFilter forceModeFilter, Set<Link> extractLinks) {
        Map<String, Link> filtered = new LinkedHashMap<String, Link>();
        for (Link outlink : extractLinks) {
            String id = outlink.getId();
            if (accept(forceModeFilter, id) && !filtered.containsKey(id)) {
                filtered.put(id, outlink);
            }
        }
        return new HashSet<Link>(filtered.values());
    }

    private static boolean accept(RegexURLFilter forceModeFilter, String urlString) {
        if (urlString == null) {
            return false;
        }
        urlString = forceModeFilter.filter(urlString);
        if (urlString == null) {
            return false;
        }
        return true;
    }
    
    /**
     * Transform a String into an URI.
     * 
     * @param target the URI in String format.
     * @return the URI or null if the URI is not valid.
     */
    public static URI stringToUri(URI baseUri, String target) {
        URI result = null;
        try {
            target = target.replaceAll("\\s", "%20");
            if (!target.toLowerCase().startsWith("javascript") && !target.contains(":/")) {
                result = baseUri.resolve(target.split("#")[0]);
                
            } else if (!target.toLowerCase().startsWith("javascript")) {
                result = new URI(target.split("#")[0]);
            }
            if (result != null) {
                result = new URI(NormalizeURL.normalize(result.toString()));
            }
        } catch (Exception e) {
//             log.error("URI not valid: " + target);
        }

        return result;
    }
    
    /**
     * Transform string from ISO8601 standard to Joda DateTime
     * @param datetime
     * @return
     */
    public static DateTime transformISODateTimeLexicalRepresentationToDateTime(String datetime) {
        if (StringUtils.isEmpty(datetime)) {
            return null;
        }
        
        return ISODateTimeFormat.dateTime().parseDateTime(datetime);
    }
    
    /**
     * Transform Joda DateTime to string in ISO8601 standard 
     * @param datetime
     * @return
     */
    public static String transformDateTimeToISODateTimeLexicalRepresentation(DateTime datetime) {
        if (datetime == null) {
            return null;
        }
        
        return datetime.toString();
    }
}
