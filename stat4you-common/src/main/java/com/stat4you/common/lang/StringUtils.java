package com.stat4you.common.lang;

public class StringUtils {

	/**
	 * Concat strings
	 */
    public static String concat(Object... args) {
        if (args == null || args.length ==  0) {
            return null;
        }
        
        StringBuilder sb = new StringBuilder();
        for (Object arg : args) {
            sb.append(arg);
        }
        return sb.toString();        
    }
}
