package com.stat4you.job.importation.idescat.domain;

import java.util.List;

import javax.xml.bind.Element;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAnyElement;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

@XmlType
@XmlAccessorType(XmlAccessType.FIELD)
public class EmexRowList {

    @XmlElement(name = "f")
    private List<EmexRow> row             = null;

    @XmlAnyElement
    private List<Element> unknownElements = null;

    public List<EmexRow> getRow() {
        return row;
    }

    public void setRow(List<EmexRow> row) {
        this.row = row;
    }

    public List<Element> getUnknownElements() {
        return unknownElements;
    }

    public void setUnknownElements(List<Element> unknownElements) {
        this.unknownElements = unknownElements;
    }

}
