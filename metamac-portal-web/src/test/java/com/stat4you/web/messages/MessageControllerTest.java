package com.stat4you.web.messages;

import org.junit.Test;

import java.util.*;

import static org.junit.Assert.*;

/**
 */
public class MessageControllerTest {

    @Test
    public void testGetJsObjects() {

        Set<String> keys = new HashSet<String>();
        keys.add("a.b.c");
        keys.add("a.b.c.d.e.f");
        keys.add("b.c.d");
        keys.add("b.c");
        keys.add("f");


        List<String> objects = MessagesController.getJsObjects(keys);
        assertEquals(7, objects.size());
        assertEquals("[\"a\"]", objects.get(0));
        assertEquals("[\"a\"][\"b\"]", objects.get(1));
        assertEquals("[\"a\"][\"b\"][\"c\"]", objects.get(2));
        assertEquals("[\"a\"][\"b\"][\"c\"][\"d\"]", objects.get(3));
        assertEquals("[\"a\"][\"b\"][\"c\"][\"d\"][\"e\"]", objects.get(4));
        assertEquals("[\"b\"]", objects.get(5));
        assertEquals("[\"b\"][\"c\"]", objects.get(6));
    }

    @Test
    public void testGetJSEntity() {
        Set<String> keys = new HashSet<String>();
        keys.add("entity.dataset.state.DRAFT");

        List<String> objects = MessagesController.getJsObjects(keys);
        assertEquals(3, objects.size());
        assertEquals("[\"entity\"]", objects.get(0));
        assertEquals("[\"entity\"][\"dataset\"]", objects.get(1));
        assertEquals("[\"entity\"][\"dataset\"][\"state\"]", objects.get(2));
    }

    @Test
    public void testObjectDeclaration() {
        String locale = "es";
        Set<String> keys = new HashSet<String>();
        keys.add("entity.dataset.state.DRAFT");

        String result = MessagesController.objectDeclaration(locale, keys);
        String[] resultLines = result.split("\n");

        assertEquals("I18n.translations." + locale + "[\"entity\"]={};", resultLines[0]);
        assertEquals("I18n.translations." + locale + "[\"entity\"][\"dataset\"]={};", resultLines[1]);
        assertEquals("I18n.translations." + locale + "[\"entity\"][\"dataset\"][\"state\"]={};", resultLines[2]);
    }

    @Test
    public void testObjectValues() {
        String locale = "en";
        Properties messages = new Properties();
        messages.put("entity.dataset.state.DRAFT", "borrador");
        String result = MessagesController.objectValues(locale, messages);
        assertEquals("I18n.translations." + locale + "[\"entity\"][\"dataset\"][\"state\"][\"DRAFT\"]='borrador';\n", result);
    }

    @Test
    public void testSingleQuotesValues() {
        String locale = "en";
        Properties messages = new Properties();
        messages.put("entity.dataset.state.DRAFT", "value 'con' singlequote");
        String result = MessagesController.objectValues(locale, messages);
        assertEquals("I18n.translations." + locale + "[\"entity\"][\"dataset\"][\"state\"][\"DRAFT\"]='value \\'con\\' singlequote';\n", result);
    }

}
