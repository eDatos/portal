package com.stat4you.web.datasetrequest;

import java.util.Locale;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.ModelAndView;

import com.stat4you.web.WebConstants;
import com.stat4you.web.messages.CustomResourceBundleMessageSource;

@Controller
@RequestMapping(value = "/datasetrequest")
public class DatasetRequestController {

    @Autowired
    private MailSender mailSender;

    @Autowired
    private SimpleMailMessage templateMessage;

    @Autowired
    private CustomResourceBundleMessageSource messageSource;

    @Autowired
    private LocaleResolver localeResolver;

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @RequestMapping(method = RequestMethod.GET)
    public String datasetRequest() {
        return WebConstants.VIEW_NAME_DATASETREQUEST;
    }

    @RequestMapping(method = RequestMethod.POST)
    public ModelAndView datasetRequestSubmit(HttpServletRequest request, String email, String comment) {
        boolean error = false;

        //Envío de email
        SimpleMailMessage msg = new SimpleMailMessage(this.templateMessage);
        msg.setText("Correo: " + email + "\n" + comment);
        try {
            this.mailSender.send(msg);
        } catch (MailException e) {
            logger.error("Error enviando mail de petición de dataset", e);
            error = true;
        }

        Locale locale = localeResolver.resolveLocale(request);

        ModelAndView mv = new ModelAndView(WebConstants.VIEW_NAME_DATASETREQUEST);
        if (error) {
            mv.addObject("error", messageSource.getMessage("datasetrequest.form.error", null, locale));
            mv.addObject("email", email);
            mv.addObject("comment", comment);
        } else {
            mv.addObject("success", messageSource.getMessage("datasetrequest.form.success", null, locale));
        }

        return mv;
    }

}
