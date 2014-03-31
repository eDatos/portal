package org.siemac.metamac.portal.rest.external.authentication;

import net.tanesha.recaptcha.ReCaptchaImpl;
import net.tanesha.recaptcha.ReCaptchaResponse;
import nl.captcha.Captcha;

import org.apache.cxf.jaxrs.ext.RequestHandler;
import org.apache.cxf.jaxrs.impl.HttpHeadersImpl;
import org.apache.cxf.jaxrs.model.ClassResourceInfo;
import org.apache.cxf.message.Message;
import org.siemac.metamac.portal.core.conf.PortalConfiguration;
import org.siemac.metamac.portal.core.constants.PortalConfigurationConstants;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import java.util.List;

public class CaptchaFilter implements RequestHandler {

    @Context
    private HttpServletRequest  request;

    @Autowired
    private PortalConfiguration portalConfiguration;

    private String getSingleHeader(HttpHeaders headers, String name) {
        List<String> values = headers.getRequestHeader(name);
        if (values != null && values.size() > 0) {
            return values.get(0);
        }
        return null;
    }

    @Override
    public Response handleRequest(Message m, ClassResourceInfo resourceClass) {
        boolean captchaEnabled = portalConfiguration.getConfig().getBoolean(PortalConfigurationConstants.CAPTCHA_ENABLE);
        String captchaProvider = portalConfiguration.getConfig().getString(PortalConfigurationConstants.CAPTCHA_PROVIDER);

        if (!captchaEnabled) {
            return null;
        }

        if ("POST".equals(request.getMethod())) {
            boolean valid = false;
            if (PortalConfigurationConstants.CAPTCHA_PROVIDER_GOBCAN.equals(captchaProvider)) {
                valid = validateCaptchaGobcan(m);
            } else if (PortalConfigurationConstants.CAPTCHA_PROVIDER_RECAPTCHA.equals(captchaProvider)) {
                valid = validateRecaptchaGobcan(m);
            } else if (PortalConfigurationConstants.CAPTCHA_PROVIDER_SIMPLE.equals(captchaProvider)) {
                valid = validateSimple(m);
            }

            if (!valid) {
                return Response.status(Response.Status.UNAUTHORIZED).build();
            }
        }

        return null;
    }

    private boolean validateSimple(Message m) {
        HttpHeaders headers = new HttpHeadersImpl(m);
        Object simpleCaptchaAnswer = request.getSession().getAttribute(Captcha.NAME);
        String responseSimple = getSingleHeader(headers, "captcha_simple_response");

        boolean valid = false;
        if (responseSimple != null) {
            if (simpleCaptchaAnswer != null) {
                Captcha captcha = (Captcha) simpleCaptchaAnswer;
                valid = captcha.isCorrect(responseSimple);
            }
        }
        return valid;
    }

    private boolean validateRecaptchaGobcan(Message m) {
        HttpHeaders headers = new HttpHeadersImpl(m);
        String challengeRecaptcha = getSingleHeader(headers, "recaptcha_challenge");
        String responseRecaptcha = getSingleHeader(headers, "recaptcha_response");

        boolean valid = false;

        if (challengeRecaptcha != null && responseRecaptcha != null) {
            String remoteAddr = request.getRemoteAddr();

            ReCaptchaImpl reCaptcha = new ReCaptchaImpl();
            reCaptcha.setPrivateKey(portalConfiguration.getProperty(PortalConfigurationConstants.CAPTCHA_PRIVATE_KEY));
            ReCaptchaResponse reCaptchaResponse = reCaptcha.checkAnswer(remoteAddr, challengeRecaptcha, responseRecaptcha);

            valid = reCaptchaResponse.isValid();
        }
        return valid;
    }

    private boolean validateCaptchaGobcan(Message m) {
        HttpHeaders headers = new HttpHeadersImpl(m);
        Object gobcanCaptchaAnswer = request.getSession().getAttribute("captcha_gobcan");
        String responseGobcan = getSingleHeader(headers, "captcha_gobcan");

        boolean valid = false;
        if (gobcanCaptchaAnswer != null) {
            valid = gobcanCaptchaAnswer.toString().equals(responseGobcan);
        }
        return valid;
    }
}
