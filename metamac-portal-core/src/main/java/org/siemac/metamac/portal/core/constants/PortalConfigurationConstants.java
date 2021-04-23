package org.siemac.metamac.portal.core.constants;

import org.siemac.metamac.core.common.constants.shared.ConfigurationConstants;

public class PortalConfigurationConstants extends ConfigurationConstants {

    // DataSource
    public static final String DB_URL                                 = "metamac.portal.db.url";
    public static final String DB_USERNAME                            = "metamac.portal.db.username";
    public static final String DB_PASSWORD                            = "metamac.portal.db.password";
    public static final String DB_DIALECT                             = "metamac.portal.db.dialect";
    public static final String DB_DRIVER_NAME                         = "metamac.portal.db.driver_name";

    public static final String CAPTCHA_PROVIDER                       = "metamac.portal.rest.external.authentication.captcha.provider";
    public static final String CAPTCHA_ENABLE                         = "metamac.portal.rest.external.authentication.captcha.enable";
    public static final String CAPTCHA_PUBLIC_KEY                     = "metamac.portal.rest.external.authentication.captcha.public_key";
    public static final String CAPTCHA_PRIVATE_KEY                    = "metamac.portal.rest.external.authentication.captcha.private_key";

    public static final String CAPTCHA_PROVIDER_GOBCAN                = "gobcan";
    public static final String CAPTCHA_PROVIDER_RECAPTCHA             = "recaptcha";
    public static final String CAPTCHA_PROVIDER_SIMPLE                = "simple";

    // VISUALIZER STYLES
    public static final String PORTAL_AGRICULTURE_STYLE_HEADER_URL    = "metamac.portal.agriculture.style.header.url";
    public static final String PORTAL_AGRICULTURE_STYLE_CSS_URL       = "metamac.portal.agriculture.style.css.url";
    public static final String PORTAL_AGRICULTURE_STYLE_FOOTER_URL    = "metamac.portal.agriculture.style.footer.url";

    public static final String PORTAL_ENVIRONMENT_STYLE_HEADER_URL    = "metamac.portal.environment.style.header.url";
    public static final String PORTAL_ENVIRONMENT_STYLE_CSS_URL       = "metamac.portal.environment.style.css.url";
    public static final String PORTAL_ENVIRONMENT_STYLE_FOOTER_URL    = "metamac.portal.environment.style.footer.url";

    public static final String PORTAL_TOURISM_STYLE_HEADER_URL        = "metamac.portal.tourism.style.header.url";
    public static final String PORTAL_TOURISM_STYLE_CSS_URL           = "metamac.portal.tourism.style.css.url";
    public static final String PORTAL_TOURISM_STYLE_FOOTER_URL        = "metamac.portal.tourism.style.footer.url";

    public static final String PORTAL_PUBLIC_SERVICE_STYLE_HEADER_URL = "metamac.portal.publicservice.style.header.url";
    public static final String PORTAL_PUBLIC_SERVICE_STYLE_CSS_URL    = "metamac.portal.publicservice.style.css.url";
    public static final String PORTAL_PUBLIC_SERVICE_STYLE_FOOTER_URL = "metamac.portal.publicservice.style.footer.url";
}
