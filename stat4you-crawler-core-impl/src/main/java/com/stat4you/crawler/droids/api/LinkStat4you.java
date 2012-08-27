package com.stat4you.crawler.droids.api;

import java.net.URI;
import java.util.LinkedList;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.droids.LinkTask;
import org.apache.droids.api.Link;
import org.joda.time.DateTime;

import com.stat4you.common.dto.InternationalStringDto;

public class LinkStat4you extends LinkTask {

    /**
	 * 
	 */
    private static final long      serialVersionUID = -1039555921779488294L;

    private String                 category;

    private DateTime               pxLastUpdate;

    private String                 period;

    private InternationalStringDto geographicalValue;

    private InternationalStringDto title;

    private LinkedList<String>          relativeContextPages = new LinkedList<String>();

    public DateTime getPxLastUpdate() {
        return pxLastUpdate;
    }

    public void setPxLastUpdate(DateTime pxLastUpdate) {
        this.pxLastUpdate = pxLastUpdate;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public InternationalStringDto getGeographicalValue() {
        return geographicalValue;
    }

    public void setGeographicalValue(InternationalStringDto geographicalValue) {
        this.geographicalValue = geographicalValue;
    }

    public InternationalStringDto getTitle() {
        return title;
    }

    public void setTitle(InternationalStringDto title) {
        this.title = title;
    }
    
    public LinkedList<String> getRelativeContextPages() {
        return relativeContextPages;
    }

    public LinkStat4you(Link from, URI uri, int depth) {
        super(from, uri, depth);
    }

    public LinkStat4you(Link from, URI uri, int depth, int weight) {
        super(from, uri, depth, weight);
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37).append(getURI()).toHashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;

        LinkStat4you other = (LinkStat4you) obj;

        return new EqualsBuilder().append(getURI(), other.getURI()).isEquals();
    }

    @Override
    public String toString() {
        return "LinkStat4you [getId()=" + getId() + "], category=" + category + ", pxLastUpdate=" + pxLastUpdate + "]";
    }

}
