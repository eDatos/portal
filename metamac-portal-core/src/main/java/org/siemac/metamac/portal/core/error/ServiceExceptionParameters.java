package org.siemac.metamac.portal.core.error;

import org.siemac.metamac.core.common.exception.CommonServiceExceptionParameters;

public class ServiceExceptionParameters extends CommonServiceExceptionParameters {

    private static final String PREFIX_PARAMETER_PORTAL = "parameter.portal";

    public static final String  PERMALINK_PREFIX        = "permalink";
    public static final String  PERMALINK               = createCode(PERMALINK_PREFIX);
    public static final String  PERMALINK_CODE          = createCode(PERMALINK_PREFIX, "code");
    public static final String  PERMALINK_CONTENT       = createCode(PERMALINK_PREFIX, "content");

    public static final String  DATASET                 = createCode("dataset");
    public static final String  DATASET_SELECTION       = createCode("dataset_selection");
    public static final String  STREAM                  = createCode("stream");

    private static String createCode(String fieldCode) {
        return PREFIX_PARAMETER_PORTAL + "." + fieldCode;
    }

    private static String createCode(String classCode, String fieldCode) {
        return PREFIX_PARAMETER_PORTAL + "." + classCode + "." + fieldCode;
    }
}
