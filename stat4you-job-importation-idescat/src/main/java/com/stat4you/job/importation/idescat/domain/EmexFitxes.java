package com.stat4you.job.importation.idescat.domain;

import java.util.List;

import javax.xml.bind.Element;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAnyElement;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlRootElement(name = "fitxes")
@XmlType
@XmlAccessorType(XmlAccessType.FIELD)
public class EmexFitxes {

    @XmlAttribute(name = "version")
    private String         version         = null;

    @XmlAttribute(name = "lang")
    private String         lang            = null;

    @XmlAttribute(name = "o")
    private String         operation       = null;

    @XmlAttribute(name = "p")
    private String         parameters      = null;

    @XmlElement(name = "cols")
    private EmexColumnList columns         = null;

    @XmlElement(name = "gg")
    private EmexGroupList  groups          = null;

    @XmlAnyElement
    private List<Element>  unknownElements = null;

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
    }

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public String getParameters() {
        return parameters;
    }

    public void setParameters(String parameters) {
        this.parameters = parameters;
    }

    public EmexColumnList getColumns() {
        return columns;
    }

    public void setColumns(EmexColumnList columns) {
        this.columns = columns;
    }

    public List<Element> getUnknownElements() {
        return unknownElements;
    }

    public void setUnknownElements(List<Element> unknownElements) {
        this.unknownElements = unknownElements;
    }

    public EmexGroupList getGroups() {
        return groups;
    }

    public void setGroups(EmexGroupList groups) {
        this.groups = groups;
    }

}
