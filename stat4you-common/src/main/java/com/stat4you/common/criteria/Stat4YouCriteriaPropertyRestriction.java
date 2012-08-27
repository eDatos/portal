package com.stat4you.common.criteria;

import java.math.BigDecimal;
import java.util.Date;

@SuppressWarnings({"rawtypes"})
public final class Stat4YouCriteriaPropertyRestriction implements Stat4YouCriteriaRestriction {

    public enum OperationType {
        EQ, IEQ, NE, GT, GE, LE, LT, IS_NULL, IS_NOT_NULL, LIKE, ILIKE;
    }

    private static final long serialVersionUID = -8407544674579619709L;

    private String            propertyName     = null;

    private OperationType     operationType    = OperationType.EQ;

    private String            stringValue      = null;
    private Integer           integerValue     = null;
    private Long              longValue        = null;
    private Double            doubleValue      = null;
    private BigDecimal        bigDecimalValue  = null;
    private Boolean           booleanValue     = null;
    private Date              dateValue        = null;
    private Date              dateTimeValue    = null;
    private Enum              enumValue        = null;

    
    public Stat4YouCriteriaPropertyRestriction() {
    }

    public Stat4YouCriteriaPropertyRestriction(String propertyName, String stringValue, OperationType operationType) {
        this.propertyName = propertyName;
        this.stringValue = stringValue;
        this.operationType = operationType;
    }
    
    public Stat4YouCriteriaPropertyRestriction(String propertyName, Boolean booleanValue, OperationType operationType) {
        this.propertyName = propertyName;
        this.booleanValue = booleanValue;
        this.operationType = operationType;
    }
    
    public Stat4YouCriteriaPropertyRestriction(String propertyName, Enum enumValue, OperationType operationType) {
        this.propertyName = propertyName;
        this.enumValue = enumValue;
        this.operationType = operationType;
    }
    
    /**
     * @return the property name
     */
    public String getPropertyName() {
        return this.propertyName;
    }

    /**
     * @param propertyName the property name to set
     */
    public void setPropertyName(String propertyName) {
        this.propertyName = propertyName;
    }

    /**
     * @return the operation type
     */
    public OperationType getOperationType() {
        return operationType;
    }

    /**
     * @param operationType the operation type to set
     */
    public void setOperationType(OperationType operationType) {
        this.operationType = operationType;
    }

    /**
     * @return the string value
     */
    public String getStringValue() {
        return this.stringValue;
    }

    /**
     * @param stringValue the string value to set
     */
    public void setStringValue(String stringValue) {
        this.stringValue = stringValue;
    }

    /**
     * @return the integer value
     */
    public Integer getIntegerValue() {
        return this.integerValue;
    }

    /**
     * @param integerValue the integer value to set
     */
    public void setIntegerValue(Integer integerValue) {
        this.integerValue = integerValue;
    }

    /**
     * @return the long value
     */
    public Long getLongValue() {
        return longValue;
    }

    /**
     * @param longValue the long value to set
     */
    public void setLongValue(Long longValue) {
        this.longValue = longValue;
    }


    /**
     * @return the double value
     */
    public Double getDoubleValue() {
        return doubleValue;
    }

    /**
     * @param doubleValue the double value to set
     */
    public void setDoubleValue(Double doubleValue) {
        this.doubleValue = doubleValue;
    }
    
    /**
     * @return the bigDecimalValue
     */
    public BigDecimal getBigDecimalValue() {
        return bigDecimalValue;
    }

    /**
     * @param bigDecimalValue the bigDecimalValue to set
     */
    public void setBigDecimalValue(BigDecimal bigDecimalValue) {
        this.bigDecimalValue = bigDecimalValue;
    }

    
    /**
     * @return the long value
     */
    public Boolean getBooleanValue() {
        return this.booleanValue;
    }

    /**
     * @param booleanValue the boolean value to set
     */
    public void setBooleanValue(Boolean booleanValue) {
        this.booleanValue = booleanValue;
    }

    /**
     * @return the date value
     */
    public Date getDateValue() {
        return this.dateValue;
    }

    /**
     * @param dateValue the date value to set
     */
    public void setDateValue(Date dateValue) {
        this.dateValue = dateValue;
    }

    /**
     * @return the date time value
     */
    public Date getDateTimeValue() {
        return this.dateTimeValue;
    }

    /**
     * @param dateTimeValue the date time value to set
     */
    public void setDateTimeValue(Date dateTimeValue) {
        this.dateTimeValue = dateTimeValue;
    }

    /**
     * @return the enumValue
     */
    public Enum getEnumValue() {
        return enumValue;
    }

    /**
     * @param enumValue the enumValue to set
     */
    public void setEnumValue(Enum enumValue) {
        this.enumValue = enumValue;
    }
}
