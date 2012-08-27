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
public class EmexTableList {

    @XmlElement(name = "t")
    private List<EmexTable> table           = null;

    @XmlAnyElement
    private List<Element>   unknownElements = null;

    public List<EmexTable> getTable() {
        if (table == null) {
            table = new ArrayList<EmexTable>();
        }
        return table;
    }

    public void setTable(List<EmexTable> table) {
        this.table = table;
    }

    public List<Element> getUnknownElements() {
        return unknownElements;
    }

    public void setUnknownElements(List<Element> unknownElements) {
        this.unknownElements = unknownElements;
    }
}
