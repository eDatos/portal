package com.stat4you.web.dsd.px;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.stat4you.web.BaseController;
import com.stat4you.web.WebConstants;

@Controller
public class PxController extends BaseController {

    /**
     * Go page to upload a px file
     */
    @RequestMapping(value = "/dsd/px/new", method = RequestMethod.GET)
    public String setupForm(Model model) {
        return WebConstants.VIEW_NAME_PX;
    }

    /**
     * Uploaded px file
     */
    @RequestMapping(value = "/dsd/px/upload", method = RequestMethod.POST)
    public String uploadPx(@RequestParam("file") MultipartFile file) throws Exception {

        if (!file.isEmpty()) {
            // InputStream pxFile = file.getInputStream();

            // Transform

            // Go edit dataset TODO
            return WebConstants.VIEW_NAME_DATASET_EDIT;
        } else {
            // TODO Mostrar error
            return WebConstants.VIEW_NAME_PX;
        }
    }

}