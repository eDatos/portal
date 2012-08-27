package com.stat4you.common.test.utils;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

import org.joda.time.DateTime;

import com.stat4you.common.dto.InternationalStringDto;
import com.stat4you.common.dto.LocalisedStringDto;

/**
 * Asserts to tests
 */
public class Stat4YouAsserts {

    public static void assertEqualsInternationalString(InternationalStringDto expected, InternationalStringDto actual) {
        if (actual == null && expected == null) {
            return;
        } else if ((actual != null && expected == null) || (actual == null && expected != null)) {
            fail();
        }
        assertEquals(expected.getTexts().size(), actual.getTexts().size());
        for (LocalisedStringDto localisedStringDtoExpected : expected.getTexts()) {
            assertEquals(localisedStringDtoExpected.getLabel(), actual.getLocalisedLabel(localisedStringDtoExpected.getLocale()));
        }
    }

    public static void assertEqualsInternationalString(InternationalStringDto internationalStringDto, String locale1, String label1, String locale2, String label2) {
        int count = 0;
        if (locale1 != null) {
            assertEquals(label1, internationalStringDto.getLocalisedLabel(locale1));
            count++;
        }
        if (locale2 != null) {
            assertEquals(label2, internationalStringDto.getLocalisedLabel(locale2));
            count++;
        }
        assertEquals(count, internationalStringDto.getTexts().size());
    }

    public static void assertEqualsDate(DateTime expected, DateTime actual, String pattern) {
        assertEquals(expected.toString(pattern), actual.toString(pattern));
    }
    
    public static void assertEqualsDay(DateTime expected, DateTime actual) {
        assertEqualsDate(expected, actual, "ddMMyyyy");
    }
}
