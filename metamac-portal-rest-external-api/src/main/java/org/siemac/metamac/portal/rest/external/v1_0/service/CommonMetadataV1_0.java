package org.siemac.metamac.common_metadata.rest.external.v1_0.service;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import org.siemac.metamac.rest.common_metadata.v1_0.domain.Configuration;
import org.siemac.metamac.rest.common_metadata.v1_0.domain.Configurations;

@Path("v1.0")
// IMPORTANT: If a new version of API is added, remember change latest url y urlrewrite.xml in war
public interface CommonMetadataV1_0 {

    /**
     * Find configurations
     * 
     * @param query Clause to filter results by metadata <br/>
     *            - Logical operators: AND, OR <br/>
     *            - Comparison operators: EQ, IEQ, LIKE, ILIKE, NE, LT, LE, GT, GE, IS_NULL, IS_NOT_NULL, IN <br/>
     *            - Metadata to filter: ID, URN, CONTACT_URN, STATUS <br/>
     *            - Example: (ID LIKE "ISTAC" AND CONTACT_URN EQ "urn:contact:1") OR (CONTACT_URN EQ "urn:contact:2")
     * @param orderBy Clause to order the results by metadata <br/>
     *            - Order operators: ASC, DESC<br/>
     *            - Metadata to order: ID<br/>
     *            - Example: ID ASC<br/>
     * @return List of configurations
     */
    @GET
    @Produces("application/xml")
    @Path("configurations")
    Configurations findConfigurations(@QueryParam("query") String query, @QueryParam("orderBy") String orderBy);

    /**
     * Retrieve configuration by id
     * 
     * @param id Id
     * @return Configuration
     */
    @GET
    @Produces("application/xml")
    @Path("configurations/{id}")
    Configuration retrieveConfigurationById(@PathParam("id") String id);
}