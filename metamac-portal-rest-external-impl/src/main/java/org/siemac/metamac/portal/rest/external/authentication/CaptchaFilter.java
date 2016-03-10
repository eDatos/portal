package org.siemac.metamac.portal.rest.external.authentication;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;

import net.tanesha.recaptcha.ReCaptchaImpl;
import net.tanesha.recaptcha.ReCaptchaResponse;
import nl.captcha.Captcha;

import org.apache.commons.lang.StringUtils;
import org.apache.cxf.jaxrs.ext.RequestHandler;
import org.apache.cxf.jaxrs.impl.HttpHeadersImpl;
import org.apache.cxf.jaxrs.model.ClassResourceInfo;
import org.apache.cxf.message.Message;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.conf.PortalConfiguration;
import org.siemac.metamac.portal.core.constants.PortalConfigurationConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class CaptchaFilter implements RequestHandler {

    private static final Logger LOG = LoggerFactory.getLogger(CaptchaFilter.class);

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
        boolean captchaEnabled = true;
        String captchaProvider = StringUtils.EMPTY;

        try {
            captchaEnabled = portalConfiguration.retrieveCaptchaEnable();
        } catch (MetamacException e) {
            LOG.error("Property CaptchaEnabled not configured: ", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
        }

        try {
            captchaProvider = portalConfiguration.retrieveCaptchaProvider();
        } catch (MetamacException e) {
            if (captchaEnabled) {
                LOG.error("Property captchaProvider not configured and captcha is enabled: ", e);
                return Response.status(Response.Status.UNAUTHORIZED).build();
            }
        }

        if (!captchaEnabled) {
            return null;
        }

        if ("POST".equals(request.getMethod())) {
            boolean valid = false;
            if (PortalConfigurationConstants.CAPTCHA_PROVIDER_GOBCAN.equals(captchaProvider)) {
                valid = validateCaptchaGobcan(m);
            } else if (PortalConfigurationConstants.CAPTCHA_PROVIDER_RECAPTCHA.equals(captchaProvider)) {
                try {
                    valid = validateRecaptchaGobcan(m);
                } catch (MetamacException e) {
                    LOG.error("Property captchaProviderKey not configured and captchaProvider is RECAPTCHA: ", e);
                    return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
                }
            } else if (PortalConfigurationConstants.CAPTCHA_PROVIDER_SIMPLE.equals(captchaProvider)) {
                valid = validateSimple(m);
            }

            if (!valid) {
                LOG.error("Captcha no valid. Captcha provider = {}, Message {}", captchaProvider, m);
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

    private boolean validateRecaptchaGobcan(Message m) throws MetamacException {
        HttpHeaders headers = new HttpHeadersImpl(m);
        String challengeRecaptcha = getSingleHeader(headers, "recaptcha_challenge");
        String responseRecaptcha = getSingleHeader(headers, "recaptcha_response");

        boolean valid = false;

        if (challengeRecaptcha != null && responseRecaptcha != null) {
            String remoteAddr = request.getRemoteAddr();

            ReCaptchaImpl reCaptcha = new ReCaptchaImpl();

            reCaptcha.setPrivateKey(portalConfiguration.retrieveCaptchaPrivateKey());

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
