package org.siemac.metamac.portal.rest.external.authentication;

import org.apache.cxf.jaxrs.ext.RequestHandler;
import org.apache.cxf.jaxrs.model.ClassResourceInfo;
import org.apache.cxf.message.Message;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;
import java.net.URI;
import java.util.Collections;

import static org.siemac.metamac.portal.rest.external.RestExternalConstantsPrivate.AUTHENTICATED_SESSION_ATTRIBUTE;

public class CaptchaFilter implements RequestHandler {

    @Context
    private HttpServletRequest  request;

    RestTemplate restTemplate = new RestTemplate();

    @Override
    public Response handleRequest(Message m, ClassResourceInfo resourceClass) {
        Object isAuthenticated = request.getSession().getAttribute(AUTHENTICATED_SESSION_ATTRIBUTE);
        if(isAuthenticated != null && ((boolean) isAuthenticated)) {
            return null;
        }

        UriBuilder urlBuilder = UriBuilder.fromUri("http://localhost:8084/api/captcha/validate");
        for(Object paramKey : Collections.list(request.getParameterNames())) {
            urlBuilder.queryParam(paramKey.toString(), request.getParameter(paramKey.toString()));
        }
        URI url = urlBuilder.build();

        ResponseEntity<Boolean> response = restTemplate.getForEntity(url, boolean.class);
        if(response.getStatusCode() == HttpStatus.OK) {
            if(response.getBody()) {
                return null;
            } else {
                return Response.status(Response.Status.UNAUTHORIZED).build();
            }
        } else {
            return Response.status(response.getStatusCode().value()).build();
        }
    }
}
