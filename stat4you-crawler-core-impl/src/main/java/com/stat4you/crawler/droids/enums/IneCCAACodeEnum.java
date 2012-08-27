package com.stat4you.crawler.droids.enums;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public enum IneCCAACodeEnum implements Serializable {

    CCAA_00("00", "Total Nacional", "National Total"),
    CCAA_01("01", "Andalucía", "Andalucía"),
    CCAA_02("02", "Aragón", "Aragón"),
    CCAA_03("03", "Principado de Asturias", "Principado de Asturias"),
    CCAA_04("04", "Illes Balears", "Illes Balears"),
    CCAA_05("05", "Canarias", "Canarias"),
    CCAA_06("06", "Cantabria", "Cantabria"),
    CCAA_07("07", "Castilla y León", "Castilla y León"),
    CCAA_08("08", "Castilla - La Mancha", "Castilla - La Mancha"),
    CCAA_09("09", "Cataluña", "Cataluña"),
    CCAA_10("10", "Comunitat Valenciana", "Comunitat Valenciana"),
    CCAA_11("11", "Extremadura", "Extremadura"),
    CCAA_12("12", "Galicia", "Galicia"),
    CCAA_13("13", "Comunidad de Madrid", "Comunidad de Madrid"),
    CCAA_14("14", "Región de Murcia", "Región de Murcia"),
    CCAA_15("15", "Comunidad Foral de Navarra", "Comunidad Foral de Navarra"),
    CCAA_16("16", "País Vasco", "País Vasco"),
    CCAA_17("17", "La Rioja", "La Rioja"),
    CCAA_18("18", "Ceuta", "Ceuta"),
    CCAA_19("19", "Melilla", "Melilla")  
    ;

    private static Map<String, IneCCAACodeEnum> identifierMap = new HashMap<String, IneCCAACodeEnum>();

    static {
        for (IneCCAACodeEnum value : IneCCAACodeEnum.values()) {
            identifierMap.put(value.getCode(), value);
        }
    }

    private String                             code;
    private String                             valueEs;
    private String                             valueEn;

    /**
     */
    private IneCCAACodeEnum(String code, String valueEs, String valueEn) {
        this.code = code;
        this.valueEs = valueEs;
        this.valueEn = valueEn;
    }

    public static IneCCAACodeEnum fromCode(String code) {
        IneCCAACodeEnum result = identifierMap.get(code);
        if (result == null) {
            throw new IllegalArgumentException("No CCAA for code: " + code);
        }
        return result;
    }

    public String getValueEn() {
        return valueEn;
    }
    
    public String getValueEs() {
        return valueEs;
    }
    
    public String getCode() {
        return code;
    }       
        
    public String getName() {
        return name();
    }
}
