package com.stat4you.common.uri;

public class UriDefinition implements Comparable<UriDefinition> {

    private String  resource        = null;
    private boolean versionable     = false;
    private String  prefix 			= null;

    public String getResource() {
        return resource;
    }

    public void setResource(String resource) {
        this.resource = resource;
    }

    public boolean isVersionable() {
        return versionable;
    }

    public void setVersionable(boolean versionable) {
        this.versionable = versionable;
    }      

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

	@Override
	public int compareTo(UriDefinition arg0) {
		return prefix.compareTo(arg0.getPrefix());
	}

	
}
