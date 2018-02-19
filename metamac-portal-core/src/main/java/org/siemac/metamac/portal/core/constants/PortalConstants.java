package org.siemac.metamac.portal.core.constants;

public class PortalConstants {

    public final static String QUOTE             = "\"";
    public final static String SPACE             = " ";
    public final static String COMMA             = ",";
    public final static String SEMICOLON         = ";";
    public final static String EQUALS            = "=";
    public final static String LEFT_PARENTHESES  = "(";
    public final static String RIGHT_PARENTHESES = ")";
    public final static String NEW_LINE          = "\n";
    public final static String LEFT_BRACE        = "[";
    public final static String RIGHT_BRACE       = "]";

    public static enum ResourceType {
        DATASET("dataset"), INDICATOR("indicator"), INDICATOR_INSTANCE("indicatorInstance");

        private String name;

        ResourceType(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }
    }
}
