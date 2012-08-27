package com.stat4you.rest.domain;

import java.util.List;

import org.codehaus.jackson.annotate.JsonPropertyOrder;

import com.stat4you.statistics.dsd.domain.AttributeAttachmentLevelEnum;

@JsonPropertyOrder({
        "title",
        "attachmentLevel",
        "attachemntDimension"})
public class MetadataAttribute {

    private List<String>                 title               = null;
    private AttributeAttachmentLevelEnum attachmentLevel     = null;
    private List<String>                 attachemntDimension = null;

    public List<String> getTitle() {
        return title;
    }

    public void setTitle(List<String> title) {
        this.title = title;
    }

    public AttributeAttachmentLevelEnum getAttachmentLevel() {
        return attachmentLevel;
    }

    public void setAttachmentLevel(AttributeAttachmentLevelEnum attachmentLevel) {
        this.attachmentLevel = attachmentLevel;
    }

    public List<String> getAttachemntDimension() {
        return attachemntDimension;
    }

    public void setAttachemntDimension(List<String> attachemntDimension) {
        this.attachemntDimension = attachemntDimension;
    }

}
