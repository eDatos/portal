package com.stat4you.common.uri;

public class UriData implements Cloneable {

    private String  resource = null;
    private String  uuid     = null;
    private Integer version  = null;

    public String getResource() {
        return resource;
    }

    public void setResource(String resource) {
        this.resource = resource;
    }

    public String getUuid() {
		return uuid;
	}
    
    public void setUuid(String uuid) {
		this.uuid = uuid;
	}
    
    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    @Override
    public String toString() {
        return UriFactory.getUri(resource, uuid, version);
    }
}