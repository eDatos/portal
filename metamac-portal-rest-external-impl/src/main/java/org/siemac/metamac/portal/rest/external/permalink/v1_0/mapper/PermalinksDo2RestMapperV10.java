package org.siemac.metamac.portal.rest.external.permalink.v1_0.mapper;

import org.siemac.metamac.rest.permalink.v1_0.domain.Permalink;

public interface PermalinksDo2RestMapperV10 {

    public Permalink toPermalink(org.siemac.metamac.portal.core.domain.Permalink source) throws Exception;
}
