package com.stat4you.web.messages;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.Locale;

import org.junit.Test;


public class CookieLocaleResolverTest {

    @Test
    public void simplifyLocaleTest() {
        CookieLocaleResolver cookieLocaleResolver = new CookieLocaleResolver();

        assertEquals("de", cookieLocaleResolver.simplifyLocale(Locale.GERMANY).toString());
        assertEquals(null, cookieLocaleResolver.simplifyLocale(null));
    }

    @Test
    public void isSupportedLocale() {
        CookieLocaleResolver cookieLocaleResolver = new CookieLocaleResolver();
        assertFalse(cookieLocaleResolver.isSupportedLocale(Locale.ENGLISH));

        cookieLocaleResolver.supportedLocales.add("en");
        assertTrue(cookieLocaleResolver.isSupportedLocale(Locale.ENGLISH));
    }
}
