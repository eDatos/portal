package com.stat4you.job.importation.idescat.test.http;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URL;
import java.util.Locale;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpException;
import org.apache.http.HttpRequest;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.MethodNotSupportedException;
import org.apache.http.entity.InputStreamEntity;
import org.apache.http.entity.StringEntity;
import org.apache.http.protocol.HttpContext;
import org.apache.http.protocol.HttpRequestHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class IdescatHttpRequestHandler implements HttpRequestHandler {

    private static Logger LOG = LoggerFactory.getLogger(IdescatHttpRequestHandler.class);

    @Override
    public void handle(HttpRequest request, HttpResponse response, HttpContext context) throws HttpException, IOException {
        try {
            String method = request.getRequestLine().getMethod().toUpperCase(Locale.ENGLISH);
            if (!"GET".equals(method) && !"HEAD".equals(method)) {
                throw new MethodNotSupportedException(method + " not supported by " + getClass().getName());
            }
            URI requestURI = new URI(request.getRequestLine().getUri());

            Map<String, String> params = HttpUtil.parseParams(request);
            String lang = params.get("lang");
            String id = params.get("id");
            String posicio = params.get("posicio");

            String fileName = null;
            ClassLoader cl = IdescatHttpRequestHandler.class.getClassLoader();
            if (requestURI.getPath().endsWith("dades.xml")) {
                fileName = "emex/dades/dades";
            } else if (requestURI.getPath().endsWith("cerca.xml")) {
                fileName = "pob/cerca/cerca";
            }

            if (StringUtils.isNotBlank(lang)) {
                fileName += "-lang_" + lang;
            }
            if (StringUtils.isNotBlank(id)) {
                fileName += "-id_" + id;
            }
            if (StringUtils.isNotBlank(posicio)) {
                fileName += "-posicio_" + posicio;
            }
            
            fileName += ".xml";
            
            URL  fileUrl = cl.getResource(fileName);
            
            fileUrl = cl.getResource(fileName);

            if (fileUrl != null) {
                File file = new File(fileUrl.getFile());
                String fileString = org.apache.commons.io.FileUtils.readFileToString(file);
                fileString = fileString.replaceAll("\\[HOST\\]", LocalHttpServerSingleton.getLocalHttpServer().getServiceAddress().getHostName());
                fileString = fileString.replaceAll("\\[PORT\\]", LocalHttpServerSingleton.getLocalHttpServer().getServiceAddress().getPort()+"");
                
                
                InputStreamEntity entity = new InputStreamEntity(new ByteArrayInputStream(fileString.getBytes()), fileString.getBytes().length);
                if (requestURI.getPath().endsWith(".xml")) {
                    entity.setContentType("text/xml");
                    entity.setChunked(true);
                }
                response.setEntity(entity);
            } else {
                response.setStatusCode(HttpStatus.SC_NOT_FOUND);
                StringEntity entity = new StringEntity(requestURI + " not found", "UTF-8");
                entity.setContentType("text/html");
                response.setEntity(entity);
            }
        } catch (Exception e) {
            LOG.error("Error processing request: " + request, e);
            response.setStatusCode(HttpStatus.SC_INTERNAL_SERVER_ERROR);
        }

    }

}
