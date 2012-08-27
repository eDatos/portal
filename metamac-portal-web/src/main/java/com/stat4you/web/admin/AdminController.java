package com.stat4you.web.admin;

import com.stat4you.scheduler.Stat4youJob;
import com.stat4you.scheduler.Stat4youJobBuilder;
import com.stat4you.scheduler.Stat4youSchedulerService;
import com.stat4you.statistics.dsd.service.DsdService;
import com.stat4you.web.BaseController;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.stat4you.crawler.droids.enums.CrawlerProvider;
import com.stat4you.crawler.service.impl.CrawlerService;
import com.stat4you.idxmanager.service.indexation.IdxManagerService;
import com.stat4you.job.importation.idescat.IdescatImportationPobJob;

/**
 */
@Controller
@RequestMapping(value = "/app/admin")
public class AdminController extends BaseController {

    @Autowired
    private IdxManagerService        idxManagerService;

    @Autowired
    private CrawlerService           crawlerService;

    @Autowired
    private DsdService               dsdService;

    @Autowired
    private Stat4youSchedulerService schedulerService = null;

    @RequestMapping(method = RequestMethod.GET)
    public ModelAndView admin() {
        ModelAndView mv = new ModelAndView("admin/admin");
        return mv;
    }

    @RequestMapping(value = "/solr", method = RequestMethod.GET)
    public String solr() throws Exception {
        idxManagerService.reloadIndex();

        return "redirect:/app/admin";
    }

    @RequestMapping(value = "/crawler/remote/{provider}", method = RequestMethod.GET)
    public String crawler(@PathVariable("provider") String provider) throws Exception {
        CrawlerProvider crawlerProvider = string2CrawlerProvider(provider);
        if (crawlerProvider != null) {
            crawlerService.forceFireJob(crawlerProvider);
        }
        return "redirect:/app/admin";
    }

    @RequestMapping(value = "/crawler/local", method = RequestMethod.GET)
    public String localCrawlerPx(@RequestParam("path") String path) throws ApplicationException {
        crawlerService.fireImportOffLineJob(path);
        return "redirect:/app/admin";
    }

    @RequestMapping(value = "/crawler/daelocal", method = RequestMethod.GET)
    public String localCrawlerDigitalAgendaEurope(@RequestParam("path") String path) throws ApplicationException {
        crawlerService.fireImportOffLineDigitalAgendaEuropeCsvJob(path);
        return "redirect:/app/admin";
    }

    @RequestMapping(value = "/discardDatasetDraft", method = RequestMethod.GET)
    public String discardDatasetDraft(@RequestParam("uri") String uri) throws ApplicationException {
        dsdService.discardDatasetDraft(getServiceContext(), uri);
        return "redirect:/app/admin";
    }

    @RequestMapping(value = "/indexDatasetPublished", method = RequestMethod.GET)
    public String indexDatasetPublished(@RequestParam("uri") String uri) throws Exception {
        idxManagerService.indexDatasetPublished(uri);
        return "redirect:/app/admin";
    }
    
    @RequestMapping(value = "/job/remote/idescat", method = RequestMethod.GET)
    public String scheduleJobIdescat() throws Exception {
        Stat4youJob job = Stat4youJobBuilder.newJob(IdescatImportationPobJob.class)
                                            .withIdentity("idescat-pob", "idescat")
                                            .build();
                                            
         
        schedulerService.createJob(job);
        schedulerService.fireJob(job);
        return "redirect:/app/admin";
    }

    private CrawlerProvider string2CrawlerProvider(String provider) {
        CrawlerProvider crawlerProvider = null;
        if (provider.equals("istac")) {
            crawlerProvider = CrawlerProvider.CRW_ISTAC;
        } else if (provider.equals("ine")) {
            crawlerProvider = CrawlerProvider.CRW_INE;
        } else if (provider.equals("eustat")) {
            crawlerProvider = CrawlerProvider.CRW_EUSTAT;
        } else if (provider.equals("ibestat")) {
            crawlerProvider = CrawlerProvider.CRW_IBESTAT;
        }
        return crawlerProvider;
    }

}
