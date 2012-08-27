package com.stat4you.web.listener;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.joran.JoranConfigurator;
import ch.qos.logback.core.joran.spi.JoranException;
import ch.qos.logback.core.util.StatusPrinter;

import com.stat4you.common.configuration.Stat4YouConfiguration;

public class ApplicationSetup implements ServletContextListener {

    private static Logger LOG = LoggerFactory.getLogger(ApplicationSetup.class);

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        LOG.info("Initializing context");

        Stat4YouConfiguration.instance(); // initialize data properties loader

        // assume SLF4J is bound to logback in the current environment
        LoggerContext context = (LoggerContext) LoggerFactory.getILoggerFactory();
        String logConfigurationFile = Stat4YouConfiguration.instance().getDataDirectory() + "/common/conf/dynamic/logback.xml";
        try {
            JoranConfigurator configurator = new JoranConfigurator();
            configurator.setContext(context);
            // Call context.reset() to clear any previous configuration, e.g. default
            // configuration. For multi-step configuration, omit calling context.reset().
            context.reset();

            configurator.doConfigure(logConfigurationFile);
        } catch (JoranException je) {
            // StatusPrinter will handle this
        }

        StatusPrinter.printInCaseOfErrorsOrWarnings(context);

        LOG.info("Context initialized");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        LOG.info("Destroying context");

        LoggerContext context = (LoggerContext) LoggerFactory.getILoggerFactory();
        context.stop();

        LOG.info("Destroyed context");
    }
}
