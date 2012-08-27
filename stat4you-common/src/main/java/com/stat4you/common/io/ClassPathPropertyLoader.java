package com.stat4you.common.io;

import java.io.InputStream;
import java.net.URL;

public abstract class ClassPathPropertyLoader {

    public static final String PROPERTIES_SUFFIX = ".properties";
    public static final String XML_SUFFIX        = ".xml";

    /**
     * A convenience overload of {@link #loadProperties(String, ClassLoader)} that uses the current thread's context classloader.
     */
    public static URL loadResource(final String name) {
        return loadResource(name, Thread.currentThread().getContextClassLoader());
    }

    /**
     * A convenience overload of {@link #loadProperties(String, ClassLoader)} that uses the current thread's context classloader.
     */
    public static InputStream loadResourceAsStream(final String name) {
        return loadResourceAsStream(name, Thread.currentThread().getContextClassLoader());
    }

    /**
     * Looks up a resource named 'name' in the classpath.
     * <p>
     * The resource must map to a file with ".properties" or ".xml" extention. The name is assumed to be absolute and can use either "/" or "." for package segment separation with an optional leading
     * "/" and optional ".properties" or ".xml" suffix. Thus, the following names refer to the same resource:
     * 
     * <pre>
     * some.pkg.Resource
     * some.pkg.Resource.properties
     * some/pkg/Resource
     * some/pkg/Resource.properties
     * /some/pkg/Resource
     * /some/pkg/Resource.properties
     * </pre>
     * 
     * @param name classpath resource name [may not be null]
     * @param loader classloader through which to load the resource [null is equivalent to the application loader]
     * @return resource
     * @throws IllegalArgumentException if the resource was not found
     */
    public static URL loadResource(String name, ClassLoader loader) {

        URL urlPROP = _loadResource(name, PROPERTIES_SUFFIX, loader);
        if (urlPROP != null) {
            return urlPROP;
        }

        URL urlXML = _loadResource(name, XML_SUFFIX, loader);
        if (urlXML != null) {
            return urlXML;
        }

        throw new IllegalArgumentException("Could not load [" + name + "] as a classloader resource");
    }

    /**
     * Looks up a resource named 'name' in the classpath.
     * <p>
     * The resource must map to a file with ".properties" or ".xml" extention. The name is assumed to be absolute and can use either "/" or "." for package segment separation with an optional leading
     * "/" and optional ".properties" or ".xml" suffix. Thus, the following names refer to the same resource:
     * 
     * <pre>
     * some.pkg.Resource
     * some.pkg.Resource.properties
     * some/pkg/Resource
     * some/pkg/Resource.properties
     * /some/pkg/Resource
     * /some/pkg/Resource.properties
     * </pre>
     * 
     * @param name classpath resource name [may not be null]
     * @param loader classloader through which to load the resource [null is equivalent to the application loader]
     * @return stream
     * @throws IllegalArgumentException if the resource was not found
     */
    public static InputStream loadResourceAsStream(String name, ClassLoader loader) {

        InputStream inputStreamPROP = _loadResourceAsStream(name, PROPERTIES_SUFFIX, loader);
        if (inputStreamPROP != null) {
            return inputStreamPROP;
        }

        InputStream inputStreamXML = _loadResourceAsStream(name, XML_SUFFIX, loader);
        if (inputStreamXML != null) {
            return inputStreamXML;
        }

        throw new IllegalArgumentException("Could not load [" + name + "] as a classloader resource");
    }

    private static URL _loadResource(String name, String sufix, ClassLoader loader) {
        URL url = null;
        try {
            if (loader == null) {
                loader = ClassLoader.getSystemClassLoader();
            }
            
            name = transformName(name, sufix);

            // Returns null on lookup failures:
            url = loader.getResource(name);
        } catch (Exception e) {
            url = null;
        }
        return url;
    }

    private static InputStream _loadResourceAsStream(String name, String sufix, ClassLoader loader) {
        InputStream inputStream = null;
        try {
            if (loader == null) {
                loader = ClassLoader.getSystemClassLoader();
            }
            
            name = transformName(name, sufix);

            // Returns null on lookup failures:
            inputStream = loader.getResourceAsStream(name);
        } catch (Exception e) {
            inputStream = null;
        }
        return inputStream;
    }
    
    private static String transformName(String name, String sufix) {
        if (name == null) {
            throw new IllegalArgumentException("null input: name");
        }

        if (name.startsWith("/")) {
            name = name.substring(1);
        }

        if (name.endsWith(sufix)) {
            name = name.substring(0, name.length() - sufix.length());
        }
        
        name = name.replace('.', '/');

        if (!name.endsWith(sufix)) {
            name = name.concat(sufix);
        }
        return name;
    }
}
