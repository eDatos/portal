package com.stat4you.crawler.conf;

import com.stat4you.common.configuration.Stat4YouConfiguration;

// TODO sustituir por uno general que se ponga en la web en el applicationContext.xml
public class PropertyPlaceholderConfigurer extends org.springframework.beans.factory.config.PropertyPlaceholderConfigurer {

    public PropertyPlaceholderConfigurer() {
        setProperties(Stat4YouConfiguration.instance().getProperties());
    }
}
