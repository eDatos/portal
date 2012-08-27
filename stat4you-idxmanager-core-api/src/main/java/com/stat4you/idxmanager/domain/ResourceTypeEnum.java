package com.stat4you.idxmanager.domain;

public enum ResourceTypeEnum {

	DSET("DSET","Dataset"),
	PROV("PROV","Provider");
	
	private String type;
	private String text;
	
	private ResourceTypeEnum(String type, String text) {
		this.type = type;
		this.text = text;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
}
