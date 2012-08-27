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
public class EmexColumnList {

    @XmlElement(name = "col")
    private List<EmexColumn> column          = null;

    @XmlAnyElement
    private List<Element>    unknownElements = null;

    public List<EmexColumn> getColumn() {
        if (column == null) {
            column = new ArrayList<EmexColumn>();
        }
        return column;
    }

    public void setColumn(List<EmexColumn> column) {
        this.column = column;
    }

    public List<Element> getUnknownElements() {
        return unknownElements;
    }

    public void setUnknownElements(List<Element> unknownElements) {
        this.unknownElements = unknownElements;
    }
}
