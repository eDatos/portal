package com.stat4you.sdmx4you.web.sdmxupload;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.stat4you.web.BaseController;
import com.stat4you.web.WebConstants;

@RequestMapping("/upload")
@Controller
public class SdmxUploadController extends BaseController {

    @RequestMapping(method=RequestMethod.GET)
    public ModelAndView index(){
        ModelAndView modelAndView = new ModelAndView(WebConstants.VIEW_NAME_SDMXUPLOAD);
        return modelAndView;
    }
    
    @RequestMapping(method = RequestMethod.POST)
    public ModelAndView upload(@RequestParam("file") MultipartFile file) throws Exception {
        ModelAndView modelAndView = new ModelAndView(WebConstants.VIEW_NAME_SDMXUPLOAD_RESULT);
        if (file.isEmpty()) {
            modelAndView.addObject("error", "el fichero llegó vacio");
        }
        return modelAndView;
    }
    
}
