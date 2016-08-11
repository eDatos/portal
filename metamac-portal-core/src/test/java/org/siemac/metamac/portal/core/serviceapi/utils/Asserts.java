package org.siemac.metamac.portal.core.serviceapi.utils;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

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
            for (int j = 0; j < expected[0].length; j++) {
                assertEquals("Value [" + i + ", " + j + "] not equals", expected[i][j], actual[i][j]);
            }
        }
    }

    public static void assertBytesArray(byte[] expected, byte[] actual) {
        if (!new String(expected).equals(new String(actual))) {
            fail("The bytes aren't the same");
        }
    }
}
