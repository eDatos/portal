package com.stat4you.web.errors;

import java.util.UUID;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class ErrorsController {

    @RequestMapping(value = "/errors/{code}",  method = RequestMethod.GET)
    public ModelAndView error(@PathVariable("code") String code){
        ModelAndView mv = new ModelAndView("errors/errors");
        mv.addObject("code", code);
        return mv;
    }
    
    public static void main(String[] args) {
        System.out.println(UUID.randomUUID().toString());
    }

}
