package com.stat4you.crawler.service.impl;

import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;

import com.stat4you.crawler.droids.enums.CrawlerProvider;
import com.stat4you.crawler.util.CrawlerInfo;
import com.stat4you.crawler.util.ForceUpdateInfo;


public interface CrawlerService {

    /**
     * Run a crawler and import Job for the <code>crawlerProvider</code> immediately if not exist a crawler Job executing now.
     * @param crawlerProvider
     * @return true if the Job has been planned successfully, otherwise false.
     * @throws ApplicationException
     */
    public boolean forceFireJob(CrawlerProvider crawlerProvider) throws ApplicationException;
    
    
    public boolean fireCrawlerJob(CrawlerProvider crawlerProvider, ForceUpdateInfo forceUpdateInfo) throws ApplicationException;
    

    /**
     * 
     * @param directoryPath
     * @return true if the Job has been planned successfully, otherwise false.
     * @throws ApplicationException
     */
    public boolean fireImportOffLineJob(String directoryPath) throws ApplicationException;
    
    /**
     * Run a import offline Job with a specific path.
     * @param directoryPath
     * @param isForcemode: if true throw a JOB regardless of whether there is one running on the same path, is false not throw if a Job is running on the same path.
     * @return true if the Job has been planned successfully, otherwise false.
     * @throws ApplicationException
     */
    public boolean fireImportOffLineJob(String directoryPath, CrawlerInfo crawlerInfo, boolean isForcemode) throws ApplicationException;
    
    /**
     * Launch offline importation of Digital Agenda for Europe csvs
     * @param directoryPath
     * @throws ApplicationException
     */
    public boolean fireImportOffLineDigitalAgendaEuropeCsvJob(String directoryPath) throws ApplicationException;
    
}
