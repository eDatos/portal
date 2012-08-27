package com.stat4you.crawler.util;


public class FileRepositoryContent {


    private String id = null;
    private String path = null;
    private String pxUpdate = null;
    
    // LUCENE DOCUMENT
    public static final String LUCENE_MOEL_ID = "id";
    public static final String LUCENE_MODEL_PATH = "path";
    public static final String LUCENE_MODEL_PX_UPDATE = "px_update";
    
    
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    
    public String getPath() {
        return path;
    }
    
    public void setPath(String path) {
        this.path = path;
    }

    public FileRepositoryContent() {
    }
    
    public String getPxUpdate() {
        return pxUpdate;
    }
    
    public void setPxUpdate(String pxUpdate) {
        this.pxUpdate = pxUpdate;
    }
}
