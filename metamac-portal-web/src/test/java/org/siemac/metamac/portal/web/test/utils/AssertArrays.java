package org.siemac.metamac.portal.web.test.utils;

import java.util.Arrays;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

public class AssertArrays {

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
