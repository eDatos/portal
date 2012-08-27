package com.stat4you.common.criteria;

import java.util.ArrayList;
import java.util.List;

/**
 * Restriction of the type "OR"
 */
public final class Stat4YouCriteriaDisjunctionRestriction implements Stat4YouCriteriaRestriction {

    private static final long                serialVersionUID = 6464642917880768114L;

    private List<Stat4YouCriteriaRestriction> restrictions     = new ArrayList<Stat4YouCriteriaRestriction>();

    public List<Stat4YouCriteriaRestriction> getRestrictions() {
        return restrictions;
    }
    
    public void addRestriction(Stat4YouCriteriaRestriction restriction) {
        restrictions.add(restriction);
    }
}