package org.siemac.metamac.portal.web.listeners;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class ApplicationSetupListener implements ServletContextListener {

    private static Logger LOG = LoggerFactory.getLogger(ApplicationSetupListener.class);

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        LOG.info("Initializing context");

//        Stat4YouConfiguration configuration = Stat4YouConfiguration.instance();
//        String logUrl = configuration.getProperty("stat4you.log.url");
//
//        if (logUrl != null) {
//            LOG.info("Configuring logback with file " + logUrl);
//            // assume SLF4J is bound to logback in the current environment
//            LoggerContext context = (LoggerContext) LoggerFactory.getILoggerFactory();
//            String logConfigurationFile = logUrl;
//            try {
//                JoranConfigurator configurator = new JoranConfigurator();
//                configurator.setContext(context);
//                // Call context.reset() to clear any previous configuration, e.g. default
//                // configuration. For multi-step configuration, omit calling context.reset().
//                context.reset();
//
//                configurator.doConfigure(logConfigurationFile);
//            } catch (JoranException je) {
//                // StatusPrinter will handle this
//            }
//            StatusPrinter.printInCaseOfErrorsOrWarnings(context);
//        }

        LOG.info("Context initialized");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        LOG.info("Destroying context");
        LOG.info("Destroyed context");
    }
}
