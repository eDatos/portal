package org.siemac.metamac.portal.rest.external.export.v1_0.service;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.siemac.metamac.rest.export.v1_0.domain.ExcelExportation;
import org.siemac.metamac.rest.export.v1_0.domain.PlainTextExportation;
import org.siemac.metamac.rest.export.v1_0.domain.PxExportation;

@Path("/v1.0")
// IMPORTANT: If a new version of API is added, remember change latest url y urlrewrite.xml in war
public interface DataExportV1_0 {

    /**
     * Exports a dataset to excel
     */
    @POST
    @Path("excel/{agencyID}/{resourceID}/{version}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    Response exportDatasetToExcel(ExcelExportation excelExportationBody, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @PathParam("version") String version,
            @QueryParam("lang") String lang, @QueryParam("filename") String filename);

    @POST
    @Path("excel/{agencyID}/{resourceID}/{version}")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    Response exportDatasetToExcelForm(@FormParam("jsonBody") String jsonBody, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @PathParam("version") String version,
            @QueryParam("lang") String lang, @QueryParam("filename") String filename);

    /**
     * Exports a dataset to tsv. Returns a zip containing two tsv files: one file with observations and attributes with observation attachment level and another one with attributes with dataset
     * and dimension attachment level
     */
    @POST
    @Path("tsv/{agencyID}/{resourceID}/{version}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    Response exportDatasetToTsv(PlainTextExportation plainTextExportation, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @PathParam("version") String version,
            @QueryParam("lang") String lang, @QueryParam("filename") String filename);

    @POST
    @Path("tsv/{agencyID}/{resourceID}/{version}")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    Response exportDatasetToTsv(@FormParam("jsonBody") String jsonBody, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @PathParam("version") String version,
            @QueryParam("lang") String lang, @QueryParam("filename") String filename);

    /**
     * Exports a dataset to csv comma separated. Returns a zip containing two tsv files: one file with observations and attributes with observation attachment level and another one with attributes
     * with dataset
     * and dimension attachment level
     */
    @POST
    @Path("csv_comma/{agencyID}/{resourceID}/{version}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    Response exportDatasetToCsvComma(PlainTextExportation plainTextExportation, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID,
            @PathParam("version") String version, @QueryParam("lang") String lang, @QueryParam("filename") String filename);

    @POST
    @Path("csv_comma/{agencyID}/{resourceID}/{version}")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    Response exportDatasetToCsvComma(@FormParam("jsonBody") String jsonBody, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @PathParam("version") String version,
            @QueryParam("lang") String lang, @QueryParam("filename") String filename);

    /**
     * Exports a dataset to tsv. Returns a zip containing two tsv files: one file with observations and attributes with observation attachment level and another one with attributes with dataset
     * and dimension attachment level
     */
    @POST
    @Path("csv_semicolon/{agencyID}/{resourceID}/{version}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    Response exportDatasetToCsvSemicolon(PlainTextExportation plainTextExportation, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID,
            @PathParam("version") String version, @QueryParam("lang") String lang, @QueryParam("filename") String filename);

    @POST
    @Path("csv_semicolon/{agencyID}/{resourceID}/{version}")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    Response exportDatasetToCsvSemicolon(@FormParam("jsonBody") String jsonBody, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID,
            @PathParam("version") String version, @QueryParam("lang") String lang, @QueryParam("filename") String filename);

    /**
     * Exports a dataset to px
     */
    @POST
    @Path("px/{agencyID}/{resourceID}/{version}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    Response exportDatasetToPx(PxExportation pxExportationBody, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @PathParam("version") String version,
            @QueryParam("lang") String lang, @QueryParam("filename") String filename);

    @POST
    @Path("px/{agencyID}/{resourceID}/{version}")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    Response exportDatasetToPxForm(@FormParam("jsonBody") String jsonBody, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @PathParam("version") String version,
            @QueryParam("lang") String lang, @QueryParam("filename") String filename);

    /**
     * Exports svg to image
     */
    @POST
    @Path("image")
    @Consumes({MediaType.WILDCARD})
    Response exportSvgToImage(String svg, @QueryParam("filename") String filename, @QueryParam("width") Float width, @QueryParam("type") String mimeType);

    /**
     * Exports svg to image
     */
    @POST
    @Path("image")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    Response exportSvgToImageForm(@FormParam("svg") String svg, @QueryParam("filename") String filename, @QueryParam("width") Float width, @QueryParam("type") String mimeType);

}