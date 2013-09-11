package org.siemac.metamac.portal.web.i18n;

import java.util.Locale;
import java.util.Properties;

import org.springframework.context.support.ReloadableResourceBundleMessageSource;

/**
 * Custom class for access to all messages from a ResourceBundleMessageSource
 */
public class CustomResourceBundleMessageSource extends ReloadableResourceBundleMessageSource {

    public Properties getMessages(Locale locale) {

        clearCacheIncludingAncestors();

        PropertiesHolder properties = getMergedProperties(locale);
        return properties.getProperties();
    }

}
