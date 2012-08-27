package com.stat4you.common.criteria;


public class Stat4YouCriteriaOrder {

    public enum OrderTypeEnum {
        DESC, ASC;

        public String value() {
            return name();
        }

        public static OrderTypeEnum fromValue(String v) {
            return valueOf(v);
        }
    }

    protected String        protertyName = null;

    protected OrderTypeEnum type         = null;

    /**
     * Gets the value of the attribute property.
     * 
     * @return
     *         possible object is {@link String }
     */
    public String getPropertyName() {
        return protertyName;
    }

    /**
     * Sets the value of the attribute property.
     * 
     * @param value
     *            allowed object is {@link String }
     */
    public void setPropertyName(String protertyName) {
        this.protertyName = protertyName;
    }

    /**
     * Gets the value of the type property.
     * 
     * @return
     *         possible object is {@link OrderTypeEnum }
     */
    public OrderTypeEnum getType() {
        return type;
    }

    /**
     * Sets the value of the type property.
     * 
     * @param value
     *            allowed object is {@link OrderTypeEnum }
     */
    public void setType(OrderTypeEnum value) {
        this.type = value;
    }
}