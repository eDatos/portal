package com.stat4you.common.configuration;

import java.net.URL;
import java.util.Properties;

import org.apache.commons.configuration.CombinedConfiguration;
import org.apache.commons.configuration.Configuration;
import org.apache.commons.configuration.ConfigurationBuilder;
import org.apache.commons.configuration.ConfigurationConverter;
import org.apache.commons.configuration.DefaultConfigurationBuilder;
import org.apache.commons.configuration.SystemConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.stat4you.common.io.ClassPathPropertyLoader;

public class ConfigurationHelper {

    private static Logger        LOGGER                      = LoggerFactory.getLogger(ConfigurationHelper.class);

    private String               systemConfigurationFile     = "stat4you/environment.xml";
    private String               systemConfigurationFileTest = "stat4you/environment-test.xml";
    private String               configurationFile           = "conf/config.xml";
    private String               configurationFileTest       = "conf/config-test.xml";

    private ConfigurationBuilder factory                     = null;
    private Configuration        configuration               = null;

    public ConfigurationHelper() {
        init();
    }

    private void init() {
        try {
            // ENVIRONMENT
            URL environment = null;
            try {
                environment = ClassPathPropertyLoader.loadResource(systemConfigurationFileTest);
            } catch (IllegalArgumentException e) {
                environment = ClassPathPropertyLoader.loadResource(systemConfigurationFile);
            }
            
            // CONFIG
            URL config = null;
            try {
                config = ClassPathPropertyLoader.loadResource(configurationFileTest);
            } catch (IllegalArgumentException e) {
                config = ClassPathPropertyLoader.loadResource(configurationFile);
            }

            LOGGER.debug("Loading environment file: {}", environment);
            LOGGER.debug("Loading configuration file: {}", config);

            SystemConfiguration.setSystemProperties(environment.getFile());
            factory = new DefaultConfigurationBuilder(config);
            CombinedConfiguration conf = (CombinedConfiguration) factory.getConfiguration();
            conf.setThrowExceptionOnMissing(true);
            conf.setForceReloadCheck(true);
            configuration = conf;
        } catch (Exception e) {
            throw new IllegalStateException("Cannot configure properties files", e);
        }
    }
    public Configuration getConfig() {
        return configuration;
    }

    public Properties getProperties() {
        return ConfigurationConverter.getProperties(getConfig());
    }
}
