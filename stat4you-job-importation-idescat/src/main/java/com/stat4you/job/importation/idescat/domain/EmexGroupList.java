package com.stat4you.job.importation.idescat.domain;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.Element;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAnyElement;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

@XmlType
@XmlAccessorType(XmlAccessType.FIELD)
public class EmexGroupList {

    @XmlElement(name = "g")
    private List<EmexGroup> group           = null;

    @XmlAnyElement
    private List<Element>   unknownElements = null;

    public List<EmexGroup> getGroup() {
        if (group == null) {
            group = new ArrayList<EmexGroup>();
        }
        return group;
    }

    public void setGroup(List<EmexGroup> group) {
        this.group = group;
    }

    public List<Element> getUnknownElements() {
        return unknownElements;
    }

    public void setUnknownElements(List<Element> unknownElements) {
        this.unknownElements = unknownElements;
    }

}
