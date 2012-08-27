package com.stat4you.job.importation.idescat.test.http;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpRequest;
import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;

public class HttpUtil {

    private HttpUtil() {
    }

    public static Map<String, String> parseParams(HttpRequest request) {
        try {
            Map<String, String> paramsMap = new HashMap<String, String>();
            List<NameValuePair> params = URLEncodedUtils.parse(new URI(request.getRequestLine().getUri()), "UTF-8");
            for (NameValuePair nameValuePair : params) {
                paramsMap.put(nameValuePair.getName(), nameValuePair.getValue());
            }
            return paramsMap;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
