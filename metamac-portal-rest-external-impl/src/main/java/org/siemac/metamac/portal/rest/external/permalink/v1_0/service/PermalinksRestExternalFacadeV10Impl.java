package org.siemac.metamac.portal.rest.external.permalink.v1_0.service;

import org.siemac.metamac.rest.permalink.v1_0.domain.Permalink;
import org.springframework.stereotype.Service;

@Service("permalinksRestExternalFacadeV1_0")
public class PermalinksRestExternalFacadeV10Impl implements PermalinksV1_0 {

    @Override
    public Permalink retrievePermalinkById(String id) {
        // TODO Auto-generated method stub

        Permalink p = new Permalink();
        p.setId("aaaaaaa");
        p.setContent("afdjaslfjal");
        return null;
    }

}