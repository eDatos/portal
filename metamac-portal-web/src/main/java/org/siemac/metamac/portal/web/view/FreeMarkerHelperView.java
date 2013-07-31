package org.siemac.metamac.portal.web.view;

import org.siemac.metamac.core.common.conf.ConfigurationService;
import org.springframework.context.ApplicationContext;
import org.springframework.web.servlet.view.freemarker.FreeMarkerView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/**
 * FreeMarker view implementation to expose additional helpers
 */
public class FreeMarkerHelperView extends FreeMarkerView {

    @Override
    protected void doRender(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response) throws Exception {
        ApplicationContext context = getApplicationContext();
        ConfigurationService configurationService = context.getBean(ConfigurationService.class);

        model.put("applicationVersion", "1.0.0");
        model.put("contextPath", request.getContextPath());
        model.put("apiContext", configurationService.getProperty("metamac.endpoints.statistical_resources.rest.external"));

        super.doRender(model, request, response);
    }

}
