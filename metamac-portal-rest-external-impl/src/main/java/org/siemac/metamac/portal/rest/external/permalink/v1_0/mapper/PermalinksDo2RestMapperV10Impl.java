package org.siemac.metamac.portal.rest.external.permalink.v1_0.mapper;

import javax.annotation.PostConstruct;

import org.siemac.metamac.core.common.conf.ConfigurationService;
import org.siemac.metamac.portal.rest.external.RestExternalConstants;
import org.siemac.metamac.rest.common.v1_0.domain.ResourceLink;
import org.siemac.metamac.rest.permalinks.v1_0.domain.Permalink;
import org.siemac.metamac.rest.utils.RestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PermalinksDo2RestMapperV10Impl implements PermalinksDo2RestMapperV10 {

    @Autowired
    private ConfigurationService configurationService;

    private String               permalinksApiExternalEndpointV10;

    @PostConstruct
    public void init() throws Exception {
        // ENDPOINTS
        // Permalinks external Api V1.0
        String permalinksApiExternalEndpoint = configurationService.retrievePortalExternalApisPermalinksUrlBase();
        permalinksApiExternalEndpointV10 = RestUtils.createLink(permalinksApiExternalEndpoint, RestExternalConstants.API_VERSION_1_0);
    }

    @Override
    public Permalink toPermalink(org.siemac.metamac.portal.core.domain.Permalink source) throws Exception {
        if (source == null) {
            return null;
        }
        Permalink target = new Permalink();
        target.setKind(RestExternalConstants.KIND_PERMALINK);
        target.setId(source.getCode());
        target.setContent(source.getContent());
        target.setSelfLink(toPermalinkSelfLink(source));
        return target;
    }

    private ResourceLink toPermalinkSelfLink(org.siemac.metamac.portal.core.domain.Permalink source) {
        ResourceLink target = new ResourceLink();
        target.setKind(RestExternalConstants.KIND_PERMALINK);
        target.setHref(toPermalinkLink(source));
        return target;
    }

    private String toPermalinkLink(org.siemac.metamac.portal.core.domain.Permalink source) {
        String link = RestUtils.createLink(permalinksApiExternalEndpointV10, RestExternalConstants.LINK_SUBPATH_PERMALINK);
        link = RestUtils.createLink(link, source.getCode());
        return link;
    }

}