package com.stat4you.rest.transform;


public class OrderingStackElement {
    private String codeId = null;
    private int dimNum = -1;

    public OrderingStackElement(String codeId, int dimNum) {
        super();
        this.codeId = codeId;
        this.dimNum = dimNum;
    }
    
    public String getCodeId() {
        return codeId;
    }
    
    public void setCodeId(String codeId) {
        this.codeId = codeId;
    }
    
    public int getDimNum() {
        return dimNum;
    }
    
    public void setDimNum(int dimNum) {
        this.dimNum = dimNum;
    }
}


