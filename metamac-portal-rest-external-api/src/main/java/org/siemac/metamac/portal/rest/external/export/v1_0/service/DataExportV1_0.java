package org.siemac.metamac.portal.rest.external.export.v1_0.service;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

@Path("/v1.0")
// IMPORTANT: If a new version of API is added, remember change latest url y urlrewrite.xml in war
public interface DataExportV1_0 {

    /**
     * Exports a dataset to excel
     */
    @POST
    @Path("excel/{agencyID}/{resourceID}/{version}")
    Response exportDatasetToExcel(@PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @PathParam("version") String version, @QueryParam("lang") String lang,
            @FormParam("selection") String datasetSelectionJson, @QueryParam("filename") String filename);

    /**
     * Exports a dataset to tsv
     */
    @GET
    @Path("tsv/{agencyID}/{resourceID}/{version}")
    Response exportDatasetToTsv(@PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @PathParam("version") String version,
            @QueryParam("dim") String dimensionsSelection, @QueryParam("filename") String filename);

    /**
     * Exports svg to image
     */
    @POST
    @Path("image")
    Response exportSvgToImage(@FormParam("svg") String svg, @QueryParam("filename") String filename, @QueryParam("width") Float width, @QueryParam("type") String mimeType);

}