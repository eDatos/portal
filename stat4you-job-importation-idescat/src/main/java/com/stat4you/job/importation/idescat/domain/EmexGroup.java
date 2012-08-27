package com.stat4you.job.importation.idescat.domain;

import java.util.List;

import javax.xml.bind.Element;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAnyElement;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

@XmlType
@XmlAccessorType(XmlAccessType.FIELD)
public class EmexGroup {

    @XmlAttribute(name = "id")
    private String        id              = null;

    @XmlElement(name = "c")
    private String        name            = null;

    @XmlElement(name = "tt")
    private EmexTableList tables          = null;

    @XmlElement(name = "gg")
    private EmexGroupList groups          = null;

    @XmlAnyElement
    private List<Element> unknownElements = null;

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

    public EmexTableList getTables() {
        return tables;
    }

    public void setTables(EmexTableList tables) {
        this.tables = tables;
    }

    public EmexGroupList getGroups() {
        return groups;
    }

    public void setGroups(EmexGroupList groups) {
        this.groups = groups;
    }

    public List<Element> getUnknownElements() {
        return unknownElements;
    }

    public void setUnknownElements(List<Element> unknownElements) {
        this.unknownElements = unknownElements;
    }

}
