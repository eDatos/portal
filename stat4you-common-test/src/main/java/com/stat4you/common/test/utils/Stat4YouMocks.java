package com.stat4you.common.test.utils;

import org.apache.commons.lang.RandomStringUtils;

import com.stat4you.common.dto.InternationalStringDto;
import com.stat4you.common.dto.LocalisedStringDto;

/**
 * Mocks
 */
public class Stat4YouMocks {

    /**
     * Mock a simple String
     */
    public static String mockString(int count) {
        return RandomStringUtils.randomAlphanumeric(count);
    }

    /**
     * Mock a InternationalString with locales "en" and "es"
     */
    public static InternationalStringDto mockInternationalString() {
        InternationalStringDto internationalStringDto = new InternationalStringDto();
        LocalisedStringDto es = new LocalisedStringDto();
        es.setLabel(mockString(10) + " en Español");
        es.setLocale("es");
        LocalisedStringDto en = new LocalisedStringDto();
        en.setLabel(mockString(10) + " in English");
        en.setLocale("en");
        internationalStringDto.addText(es);
        internationalStringDto.addText(en);
        return internationalStringDto;
    }
}
