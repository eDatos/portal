package com.stat4you.common.criteria;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public final class Stat4YouCriteria implements Serializable {

    private static final long          serialVersionUID = -394681740134241621L;

    /**
     * Paginator configuration
     */
    private Stat4YouCriteriaPaginator   paginator        = null;

    /**
     * Result orders
     */
    private List<Stat4YouCriteriaOrder> ordersBy         = new ArrayList<Stat4YouCriteriaOrder>();

    /**
     * Search restriction
     */
    private Stat4YouCriteriaRestriction restriction      = null;

    public Stat4YouCriteriaPaginator getPaginator() {
        return paginator;
    }

    public void setPaginator(Stat4YouCriteriaPaginator paginator) {
        this.paginator = paginator;
    }

    /**
     * Gets the list of orders
     */
    public List<Stat4YouCriteriaOrder> getOrdersBy() {
        return ordersBy;
    }

    /**
     * Sets the list of orders
     */
    public void setOrdersBy(List<Stat4YouCriteriaOrder> ordersBy) {
        this.ordersBy = ordersBy;
    }
    /**
     * Gets the search restriction
     */
    public Stat4YouCriteriaRestriction getRestriction() {
        return this.restriction;
    }

    /**
     * Sets the search restriction
     */
    public void setRestriction(Stat4YouCriteriaRestriction restriction) {
        this.restriction = restriction;
    }
}