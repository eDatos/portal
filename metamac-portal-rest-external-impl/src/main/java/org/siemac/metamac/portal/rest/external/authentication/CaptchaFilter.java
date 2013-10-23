package org.siemac.metamac.portal.rest.external.authentication;

import net.tanesha.recaptcha.ReCaptchaImpl;
import net.tanesha.recaptcha.ReCaptchaResponse;
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
    private HttpServletRequest request;

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

        if (!captchaEnabled) {
            return null;
        }

        if ("POST".equals(request.getMethod())) {
            boolean valid = false;

            HttpHeaders headers = new HttpHeadersImpl(m);
            String challenge = getSingleHeader(headers, "recaptcha_challenge");
            String response = getSingleHeader(headers, "recaptcha_response");

            if (challenge != null && response != null) {
                String remoteAddr = request.getRemoteAddr();

                ReCaptchaImpl reCaptcha = new ReCaptchaImpl();
                reCaptcha.setPrivateKey(portalConfiguration.getProperty(PortalConfigurationConstants.CAPTCHA_PRIVATE_KEY));
                ReCaptchaResponse reCaptchaResponse = reCaptcha.checkAnswer(remoteAddr, challenge, response);

                valid = reCaptchaResponse.isValid();
            }

            if (!valid) {
                return Response.status(Response.Status.UNAUTHORIZED).build();
            }
        }


        return null;
    }

}
