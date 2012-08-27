package com.stat4you.idxmanager.service.solr;

import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.FactoryBean;

import com.stat4you.common.configuration.Stat4YouConfiguration;

public class SolRServerFactory implements FactoryBean<SolrServer> {

    protected static Logger logger = LoggerFactory.getLogger(SolRServerFactory.class);

    @Override
    public SolrServer getObject() throws Exception {
        String solrUrl = Stat4YouConfiguration.instance().getProperties().getProperty("stat4you.idxmanager.solr.endpoint");
        logger.info("Getting properties for solr");
        logger.info("   - solrUrl = " + solrUrl);
        return new HttpSolrServer(solrUrl);
    }

    @Override
    public Class<?> getObjectType() {
        return SolrServer.class;
    }

    @Override
    public boolean isSingleton() {
        return true;
    }

}
