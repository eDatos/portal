package org.siemac.metamac.portal.core.exporters;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

public enum SvgExportSupportedMimeType {
    PNG("image/png"),
    JPEG("image/jpeg"),
    PDF("application/pdf"),
    SVG("image/svg+xml");

    private static final Map<String, SvgExportSupportedMimeType> lookup = new HashMap<String, SvgExportSupportedMimeType>();
    private String                                      type;

    static {
        for (SvgExportSupportedMimeType m : EnumSet.allOf(SvgExportSupportedMimeType.class))
            lookup.put(m.getType(), m);
    }


    private SvgExportSupportedMimeType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public static SvgExportSupportedMimeType get(String type) {
        return lookup.get(type);
    }
}