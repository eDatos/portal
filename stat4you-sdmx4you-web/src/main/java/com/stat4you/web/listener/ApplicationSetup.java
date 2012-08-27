package com.stat4you.web.listener;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.stat4you.web.Stat4youConfiguration;

public class ApplicationSetup implements ServletContextListener {

    private static Logger LOG = LoggerFactory.getLogger(ApplicationSetup.class);

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        LOG.info("Initializing context");
        Stat4youConfiguration.getInstance(); // initialize data properties loader
        LOG.info("Context initialized");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // TODO Auto-generated method stub

    }

}
