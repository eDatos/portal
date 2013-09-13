package org.siemac.metamac.portal.rest.external.permalink.v1_0.service;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import org.siemac.metamac.rest.permalinks.v1_0.domain.Permalink;

@Path("/v1.0")
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
    Permalink retrievePermalinkByIdXml(@PathParam("id") String id);

    /**
     * Retrieve content of permalink by id
     * 
     * @param id Id
     * @return Content in JSON format
     */
    @GET
    @Produces("application/json")
    @Path("/permalinks/{id}")
    Response retrievePermalinkByIdJson(@PathParam("id") String id);

    /**
     * Create new permalink
     */
    @POST
    @Consumes({"application/xml", "application/json"})
    @Produces({"application/xml", "application/json"})
    @Path("/permalinks")
    public Permalink createPermalink(Permalink permalink);

}