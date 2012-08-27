package com.stat4you.web.dsd.px;
import org.springframework.web.multipart.MultipartFile;
 
public class PxForm {
 
    private MultipartFile file;
    
    public MultipartFile getFile() {
        return file;
    }
    
    public void setFile(MultipartFile file) {
        this.file = file;
    }
}