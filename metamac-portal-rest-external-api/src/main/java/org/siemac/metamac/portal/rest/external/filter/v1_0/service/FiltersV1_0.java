package org.siemac.metamac.portal.rest.external.filter.v1_0.service;

import org.siemac.metamac.rest.permalinks.v1_0.domain.Permalink;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;

@Path("/v1.0")
public interface FiltersV1_0 {

    /**
     * Create new filter
     */
    @POST
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    @Path("/filters")
    Response saveFilter(Permalink permalink) throws IOException;
}
