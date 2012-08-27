package com.stat4you.job.importation.idescat.domain;

import java.util.List;

import javax.xml.bind.Element;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAnyElement;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;

@XmlType
@XmlAccessorType(XmlAccessType.FIELD)
public class EmexRow {

    @XmlAttribute(name = "id")
    private String               id              = null;

    @XmlElement(name = "c")
    private String               name            = null;

    @XmlElement(name = "calt")
    private String               alternativeName = null;

    @XmlElement(name = "u")
    private String               units           = null;

    @XmlElement(name = "r")
    private String               timeReference   = null;

    @XmlElement(name = "updated")
    private XMLGregorianCalendar updated         = null;

    @XmlElement(name = "v")
    private String               values          = null;

    @XmlAnyElement
    private List<Element>        unknownElements = null;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAlternativeName() {
        return alternativeName;
    }

    public void setAlternativeName(String alternativeName) {
        this.alternativeName = alternativeName;
    }

    public String getUnits() {
        return units;
    }

    public void setUnits(String units) {
        this.units = units;
    }

    public String getTimeReference() {
        return timeReference;
    }

    public void setTimeReference(String timeReference) {
        this.timeReference = timeReference;
    }

    public XMLGregorianCalendar getUpdated() {
        return updated;
    }

    public void setUpdated(XMLGregorianCalendar updated) {
        this.updated = updated;
    }

    public String getValues() {
        return values;
    }

    public void setValues(String values) {
        this.values = values;
    }

    public List<Element> getUnknownElements() {
        return unknownElements;
    }

    public void setUnknownElements(List<Element> unknownElements) {
        this.unknownElements = unknownElements;
    }

}
