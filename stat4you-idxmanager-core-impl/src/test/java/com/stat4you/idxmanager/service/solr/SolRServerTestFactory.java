package com.stat4you.idxmanager.service.solr;

import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.embedded.EmbeddedSolrServer;
import org.apache.solr.core.CoreContainer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.FactoryBean;

public class SolRServerTestFactory implements FactoryBean<SolrServer> {

    protected static Logger logger = LoggerFactory.getLogger(SolRServerTestFactory.class);

    @Override
    public SolrServer getObject() throws Exception {
        System.setProperty("solr.solr.home", SolRServerTestFactory.class.getResource("/solr").getPath());
        CoreContainer.Initializer initializer = new CoreContainer.Initializer();
        CoreContainer coreContainer = initializer.initialize();
        EmbeddedSolrServer server = new EmbeddedSolrServer(coreContainer, "");
        return server;
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
