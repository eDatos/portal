package org.siemac.metamac.portal.web.diffusion.urlrewrite;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.tuckey.web.filters.urlrewrite.extend.RewriteMatch;
import org.tuckey.web.filters.urlrewrite.extend.RewriteRule;

public class PortalRewriteRule extends RewriteRule {

    public RewriteMatch matches(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
        return new PortalRewriteMatch();
    }
}
