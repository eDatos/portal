package org.siemac.metamac.portal.core.serviceapi.utils;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.util.Arrays;

import org.siemac.metamac.portal.core.domain.Permalink;

public class Asserts {

    // ------------------------------------------------------------------------------------
    // PERMALINK
    // ------------------------------------------------------------------------------------

    public static void assertEqualsPermalink(Permalink expected, Permalink actual) {
        assertEquals(expected.getContent(), actual.getContent());
    }

    // ------------------------------------------------------------------------------------
    // MISC
    // ------------------------------------------------------------------------------------

    public static void assertArrayEquals(String[][] expected, String[][] actual) {
        if (expected == null && actual == null) {
            return;
        }
        if (expected.length != actual.length) {
            fail("The array lengths of the first dimensions aren't the same.");
        }

        for (int i = 0; i < expected.length; i++) {
            assertTrue(". Array no." + i + " in expected and actual aren't the same.", Arrays.equals(expected[i], actual[i]));
        }
    }
}
