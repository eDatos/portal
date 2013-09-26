package org.siemac.metamac.portal.rest.external.export.v1_0.service;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import org.siemac.metamac.rest.export.v1_0.domain.ExcelExportation;

@Path("/v1.0")
// IMPORTANT: If a new version of API is added, remember change latest url y urlrewrite.xml in war
public interface DataExportV1_0 {

    /**
     * Exports a dataset to excel
     */
    @POST
    @Path("excel/{agencyID}/{resourceID}/{version}")
    Response exportDatasetToExcel(ExcelExportation excelExportationBody, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @PathParam("version") String version,
            @QueryParam("lang") String lang, @QueryParam("filename") String filename);

    /**
     * Exports a dataset to tsv
     * 
     * @param dimensionsSelection Format: dim=DIM_1:DIM_1_CODE_1|DIM_1_CODE_2:DIM_2:DIM_2_CODE_1|DIM_2_CODE_2|DIM_2_CODE_3. Sample: MOTIVOS_ESTANCIA:000|001:ISLAS_DESTINO_PRINCIPAL:005|006|007
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
    Response exportSvgToImage(String svg, @QueryParam("filename") String filename, @QueryParam("width") Float width, @QueryParam("type") String mimeType);

}