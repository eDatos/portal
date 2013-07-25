package org.siemac.metamac.portal.web.view;

import org.springframework.web.servlet.view.freemarker.FreeMarkerView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/**
 * FreeMarker view implementation to expose additional helpers
 */
public class FreeMarkerHelperView extends FreeMarkerView {

//    private String getExposedConfigurationJson() throws IOException {
//        String[] properties = new String[]{
//                "application.version",
//                "map.version",
//                "stat4you.fluentd.enable",
//                "stat4you.fluentd.external",
//                "stat4you.fluentd.tag"
//        };
//
//        Stat4YouConfiguration configuration = Stat4YouConfiguration.instance();
//        Map<String, String> exposedProperties = new HashMap<String, String>();
//        for(String key : properties) {
//            exposedProperties.put(key, configuration.getProperty(key));
//        }
//        return asJson(exposedProperties);
//    }

    @Override
    protected void doRender(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response) throws Exception {
//        String applicationVerison = Stat4YouConfiguration.instance().getProperty("application.version");
        model.put("applicationVersion", "1.0.0");
        model.put("contextPath", request.getContextPath());
//        model.put("requestUrl", request.getRequestURL());
//        model.put("configuration", getExposedConfigurationJson());
//
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String userJson = null;
//        if(authentication != null && authentication.isAuthenticated()){
//            UserHolder userHolder = ApplicationContextProvider.getApplicationContext().getBean(UserHolder.class);
//            User user = userHolder.getUser();
//            userJson = asJson(user);
//        }
//
//        model.put("user", userJson);

        super.doRender(model, request, response);
    }

}
