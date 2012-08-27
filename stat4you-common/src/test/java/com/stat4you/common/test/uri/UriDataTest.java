package com.stat4you.common.test.uri;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.fail;

import org.junit.BeforeClass;
import org.junit.Test;

import com.stat4you.common.Stat4YouConstants;
import com.stat4you.common.uri.UriData;
import com.stat4you.common.uri.UriFactory;


public class UriDataTest {

    @BeforeClass
    public static void setupClass() {
        System.setProperty(Stat4YouConstants.PROP_DATA_URL, ".");
    }
    
    @Test
    public void testUriData() {
        UriData uriData = UriFactory.getUriData("stat4you:dsd:provider:1");
        assertEquals("1", uriData.getUuid());
        assertEquals("dsd.provider", uriData.getResource());
        assertNull(uriData.getVersion());
    }
    
    @Test
    public void testUriDataErrorUnexpectedVersion() {
        try {
            UriFactory.getUriData("stat4you:dsd:provider:1:1");
            fail("Version not supported");
        } catch (IllegalArgumentException e) {
        }
    }
    
    @Test
    public void testUriDataMyResourceWithoutVersion() {
    	
   		UriData uriData = UriFactory.getUriData("stat4you:myCompactResource:resoc1:345673456363456");
   		assertEquals("345673456363456", uriData.getUuid());
        assertEquals("myResourceWithVeryLargeName.resourceWithLargeName", uriData.getResource());
        assertNull(uriData.getVersion());
    	
    }
    
    @Test
    public void testUriDataMyResourceWithVersion() {
    	
   		UriData uriData = UriFactory.getUriData("stat4you:myCompactResource:resoc1:345673456363456:3435");
   		assertEquals("345673456363456", uriData.getUuid());
        assertEquals("myResourceWithVeryLargeName.resourceWithLargeName", uriData.getResource());
        assertEquals(3435, uriData.getVersion().intValue());
    }
    
    @Test
    public void testUriDataToUri() {
    	
    	String uri = UriFactory.getUri("myResourceWithVeryLargeName.resourceWithLargeName", "23489236498246", null);
   		assertEquals("stat4you:myCompactResource:resoc1:23489236498246", uri);
   		String uri2 = UriFactory.getUri("myResourceWithVeryLargeName.resourceWithLargeName", "23489236498246", 3456);
   		assertEquals("stat4you:myCompactResource:resoc1:23489236498246:3456", uri2);
    }
}
