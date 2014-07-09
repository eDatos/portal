package org.siemac.metamac.portal.core.constants;

import org.siemac.metamac.core.common.constants.shared.ConfigurationConstants;

public class PortalConfigurationConstants extends ConfigurationConstants {

    // DataSource
    public static final String DB_URL                     = "metamac.portal.db.url";
    public static final String DB_USERNAME                = "metamac.portal.db.username";
    public static final String DB_PASSWORD                = "metamac.portal.db.password";
    public static final String DB_DIALECT                 = "metamac.portal.db.dialect";
    public static final String DB_DRIVER_NAME             = "metamac.portal.db.driver_name";

    public static final String CAPTCHA_PROVIDER           = "metamac.portal.rest.external.authentication.captcha.provider";
    public static final String CAPTCHA_ENABLE             = "metamac.portal.rest.external.authentication.captcha.enable";
    public static final String CAPTCHA_PUBLIC_KEY         = "metamac.portal.rest.external.authentication.captcha.public_key";
    public static final String CAPTCHA_PRIVATE_KEY        = "metamac.portal.rest.external.authentication.captcha.private_key";

    public static final String CAPTCHA_PROVIDER_GOBCAN    = "gobcan";
    public static final String CAPTCHA_PROVIDER_RECAPTCHA = "recaptcha";
    public static final String CAPTCHA_PROVIDER_SIMPLE    = "simple";
}
