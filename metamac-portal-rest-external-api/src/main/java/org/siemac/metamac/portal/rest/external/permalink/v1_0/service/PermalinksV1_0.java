package org.siemac.metamac.portal.rest.external.permalink.v1_0.service;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import org.siemac.metamac.rest.permalink.v1_0.domain.Permalink;

@Path("/permalinks/v1.0")
// IMPORTANT: If a new version of API is added, remember change latest url y urlrewrite.xml in war
public interface PermalinksV1_0 {

    /**
     * Retrieve permalink by id
     * 
     * @param id Id
     * @return Permalink
     */
    @GET
    @Produces("application/xml")
    @Path("/permalinks/{id}")
    Permalink retrievePermalinkById(@PathParam("id") String id);
}