package org.siemac.metamac.portal.web.controllers;

import org.siemac.metamac.portal.web.i18n.CustomResourceBundleMessageSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.*;

/**
 */
@Controller
public class MessagesController {

    @Autowired
    private CustomResourceBundleMessageSource messageSource;

    @RequestMapping(value = "/app/messages/{version}/{locale}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<String> getMessages(@PathVariable String locale) throws Exception {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.add("Content-Type", "application/javascript; charset=utf-8");

        //TODO: filter available locales

        Properties messages = messageSource.getMessages(new Locale(locale));
        StringBuffer sb = new StringBuffer();

        Set<String> keys = messages.stringPropertyNames();

        //locale
        sb.append("I18n.translations = I18n.translations || {};\n");
        sb.append("I18n.translations." + locale + " = {};\n");
        sb.append(objectDeclaration(locale, keys));
        sb.append(objectValues(locale, messages));

        return new ResponseEntity<String>(sb.toString(), responseHeaders, HttpStatus.OK);
    }

    protected static String objectDeclaration(String locale, Set<String> keys) {
        List<String> jsObjects = getJsObjects(keys);
        StringBuffer sb = new StringBuffer();
        for(String jsObject : jsObjects){
            sb.append("I18n.translations." + locale + jsObject + "={};\n");
        }
        return sb.toString();
    }

    protected static String objectValues(String locale, Properties messages) {
        StringBuffer sb = new StringBuffer();
        Set<String> keys = messages.stringPropertyNames();
        for (String key : keys) {
            String stringAccessKey = idKeyToStringAccess(key);
            String value = messages.getProperty(key);
            value = value.replaceAll("\n", "\\\\n");
            value = value.replaceAll("'", "\\\\'");
            sb.append("I18n.translations." + locale + stringAccessKey + "=");

            if(value.startsWith("[")){
                sb.append(value);
            }else{
                sb.append("'" + value + "'");
            }

            sb.append(";\n");
        }
        return sb.toString();
    }

    protected static String idKeyToStringAccess(String key){
        String[] split = key.split("\\.");
        StringBuffer sb = new StringBuffer();
        for(String part : split){
            sb.append("[\"" + part + "\"]");
        }
        return sb.toString();
    }


    protected static List<String> getJsObjects(Set<String> keys){

        Set<String> objects = new HashSet<String>();
        for(String key : keys){
            String[] split = key.split("\\.");

            //El último elemento no hay que declararlo
            if(split.length > 1){
                String fullKey = "";
                for(int i = 0; i < split.length - 1; i++){
                    fullKey += "[\"" + split[i] + "\"]";
                    objects.add(fullKey);
                }
            }
        }

        List<String> objectsList = new ArrayList<String>(objects);
        Collections.sort(objectsList);

        return objectsList;
    }



}
