package com.stat4you.web.feedback;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.stat4you.web.WebConstants;


@Controller()
@RequestMapping(value="/feedback")
public class FeedbackController {


    public String form(){
        return WebConstants.VIEW_NAME_FEEDBACK_FORM;
    }

}
