package com.stat4you.idxmanager.service.search;

public class FacetConstraint {
	private String code;
	private String label;
	private long count;
	private boolean selected;
	
	public FacetConstraint(String label) {
		this.code = label;
		this.label = label;
	}
	
	public FacetConstraint(String code, String label) {
		this.code = code;
		this.label = label;
	}
	
	public String getCode() {
		return code;
	}
	
	public void setCode(String code) {
		this.code = code;
	}
	
	public String getLabel() {
		return label;
	}
	
	public void setLabel(String label) {
		this.label = label;
	}
	
	public long getCount() {
		return count;
	}
	
	public void setCount(long count) {
		this.count = count;
	}
	
	public boolean isSelected() {
		return selected;
	}
	
	public void setSelected(boolean selected) {
		this.selected = selected;
	}
}
