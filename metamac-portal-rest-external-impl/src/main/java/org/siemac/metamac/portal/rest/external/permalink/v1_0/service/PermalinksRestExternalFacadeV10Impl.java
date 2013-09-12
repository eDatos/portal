package org.siemac.metamac.portal.rest.external.permalink.v1_0.service;

import org.siemac.metamac.rest.permalink.v1_0.domain.Permalink;
import org.springframework.stereotype.Service;

@Service("permalinksRestExternalFacadeV10")
public class PermalinksRestExternalFacadeV10Impl implements PermalinksV1_0 {

    @Override
    public Permalink retrievePermalinkById(String id) {
        // TODO API retrievePermalinkById

        Permalink p = new Permalink();
        p.setId("aaaaaaa");
        p.setContent("afdjaslfjal");
        return p;
    }

}