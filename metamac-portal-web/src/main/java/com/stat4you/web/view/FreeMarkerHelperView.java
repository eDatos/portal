package com.stat4you.web.view;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.stat4you.common.configuration.Stat4YouConfiguration;
import org.springframework.web.servlet.view.freemarker.FreeMarkerView;

/**
 * FreeMarker view implementation to expose additional helpers
 */
public class FreeMarkerHelperView extends FreeMarkerView {

    @Override
    protected void doRender(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response) throws Exception {
        String applicationVerison = Stat4YouConfiguration.instance().getProperty("application.version");
        model.put("applicationVersion", applicationVerison);
        model.put("contextPath", request.getContextPath());
        model.put("requestUrl", request.getRequestURL());

        super.doRender(model, request, response);
    }

}
