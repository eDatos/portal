package com.stat4you.common.configuration;

import java.util.Properties;

import com.stat4you.common.Stat4YouConstants;

public class Stat4YouConfiguration {

    private static Stat4YouConfiguration instance = null;
    private ConfigurationHelper          configurationHelper;

    public static Stat4YouConfiguration instance() {
        if (instance == null) {
            instance = new Stat4YouConfiguration();
        }
        return instance;
    }

    private Stat4YouConfiguration() {
        configurationHelper = new ConfigurationHelper();
    }

    public String getProperty(String key) {
        return configurationHelper.getProperties().getProperty(key);
    }

    public Properties getProperties() {
        return configurationHelper.getProperties();
    }
    
    public String getDataDirectory() {
        return getProperty(Stat4YouConstants.PROP_DATA_URL);
    }
}
