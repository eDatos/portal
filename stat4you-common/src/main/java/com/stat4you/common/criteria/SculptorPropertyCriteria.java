package com.stat4you.common.criteria;

import org.fornax.cartridges.sculptor.framework.domain.Property;

public class SculptorPropertyCriteria {
    
    private Property<?> property;
    private Object value;
    
    public SculptorPropertyCriteria(Property<?> property, Object value) {
        this.property = property;
        this.value = value;
    }
    
    public Property<?> getProperty() {
        return property;
    }
    
    public void setProperty(Property<?> property) {
        this.property = property;
    }
    
    public Object getValue() {
        return value;
    }
    
    public void setValue(Object value) {
        this.value = value;
    }
}