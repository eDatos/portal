package com.stat4you.common.uri;

import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.apache.commons.configuration.Configuration;
import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.XMLConfiguration;

import com.stat4you.common.Stat4YouConstants;

public class UriFactory {

    private static Map<String, UriDefinition> resources           = null;
    private static Set<String>                normalizedResources = null; // LowerCase + Trim para evitar recursos duplicados
    private static UriDefinition[]            resourcesArray      = null;
    private static final String               URI_SEPARATOR       = ":";
    
	static {
		resources = new HashMap<String, UriDefinition>();
		normalizedResources = new HashSet<String>();
		
        String dataUrl = System.getProperty(Stat4YouConstants.PROP_DATA_URL, "/");
        dataUrl = dataUrl + Stat4YouConstants.PATH_CONF_URI_RECURSOS;

        Set<String> uris = new HashSet<String>();

        Configuration configuration;
		try {
			configuration = new XMLConfiguration(dataUrl);
		} catch (ConfigurationException e) {
            throw new RuntimeException(e);
		}
        int size = configuration.getList("uris.uri.resource").size();
        int size2 = configuration.getList("uris.uri.prefix").size();
        
        size = size > size2? size : size2;

        for (int i = 0; i < size; i++) {
        	if(
        	   !(configuration.containsKey("uris.uri(" + i + ").resource") && 
        		 configuration.containsKey("uris.uri(" + i + ").versionable") &&
        		 configuration.containsKey("uris.uri(" + i + ").prefix"))
        	){
        		String resourceContent = "";
				Iterator<String> iterator = configuration.getKeys("uris.uri(" + i + ")");
        		while(iterator.hasNext()) {
        			String s = iterator.next().toString();
        			resourceContent += "\n\t" + s + " : " + configuration.getString(s);
        		}
        		throw new IllegalArgumentException(" XML resources document contains bad defined resources [" + resourceContent + "]");
        	}
            
        		
        	String resource = configuration.getString("uris.uri(" + i + ").resource");
            Boolean versionable = configuration.getBoolean("uris.uri(" + i + ").versionable");
            String uri = configuration.getString("uris.uri(" + i + ").prefix");

            if (!uri.endsWith(URI_SEPARATOR)) {
                uri = uri + URI_SEPARATOR;
            }

            if (normalizedResources.contains(resource.toLowerCase().trim())) {
                throw new IllegalArgumentException("Resource defined twice (" + resource +")");
            }
            if (uris.contains(uri.toLowerCase().trim())) {
                throw new IllegalArgumentException("Uri defined twice (" + uri +")");
            }

            uris.add(uri.toLowerCase().trim());

            UriDefinition ud = new UriDefinition();
            ud.setResource(resource);
            ud.setVersionable(versionable);
            ud.setPrefix(uri);
            resources.put(resource, ud);
            normalizedResources.add(resource.toLowerCase().trim());
           
        }
        resourcesArray = resources.values().toArray(new UriDefinition[resources.size()]);
        Arrays.sort(resourcesArray);
	}
	
	public static String getUri(UriData uriData) {
	    return getUri(uriData.getResource(), uriData.getUuid(), uriData.getVersion());
	}
	
    public static String getUri(String resource, String uuid, Integer version) {
    	UriDefinition c = resources.get(resource);
    	if(c != null) {
    		if(c.isVersionable() && (version != null)) {
    		    return com.stat4you.common.lang.StringUtils.concat(c.getPrefix(), uuid, URI_SEPARATOR, version);
    		} else {
                return com.stat4you.common.lang.StringUtils.concat(c.getPrefix(), uuid);
    		}
    	}
    	throw new IllegalArgumentException(" Resource [" + resource + "] not found in XML resources document");
    }

    @SuppressWarnings({ "rawtypes", "unchecked" })
	public static UriData getUriData(String uri) {
    	int i = Arrays.binarySearch(resourcesArray, uri, 
			new Comparator() {
				@Override
				public int compare(Object arg0, Object arg1) {
					if(((String)arg1).startsWith(((UriDefinition)arg0).getPrefix())) {
						return 0;
					} else {
					    return ((UriDefinition)arg0).getPrefix().compareTo((String)arg1);
					}
				}
	        }
    	);
    	if (i >= 0) {
    		UriDefinition ud = resourcesArray[i];
    		String id = uri.substring(ud.getPrefix().length());
    		Integer version = null;
    		if (ud.isVersionable()) {
    			int j = id.lastIndexOf(URI_SEPARATOR);
    			if(j >= 0) {
    				version = Integer.parseInt(id.substring(j+1));
    				id = id.substring(0, j);
    			}
    		} else if (id.contains(URI_SEPARATOR)) {		// Uri no versionable que contiene una version
    			throw new IllegalArgumentException(" Version not expected in resource [" + ud.getResource() + "]");
    		}
    		UriData udata = new UriData();
    		udata.setResource(ud.getResource());
    		udata.setUuid(id);
    		udata.setVersion(version);
    		return udata;
    	}
    	throw new IllegalArgumentException(" No matching resources for Uri [" + uri + "] in XML resources document");
    }

}
