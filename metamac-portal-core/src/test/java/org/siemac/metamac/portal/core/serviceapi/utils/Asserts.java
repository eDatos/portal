package org.siemac.metamac.portal.core.serviceapi.utils;

import static org.junit.Assert.assertEquals;

import org.siemac.metamac.portal.core.domain.Permalink;

public class Asserts {

    // ------------------------------------------------------------------------------------
    // PERMALINK
    // ------------------------------------------------------------------------------------

    public static void assertEqualsPermalink(Permalink expected, Permalink actual) {
        assertEquals(expected.getContent(), actual.getContent());
    }
}
