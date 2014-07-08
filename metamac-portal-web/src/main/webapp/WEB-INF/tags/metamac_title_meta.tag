<%@ tag description="Título y meta tags" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ tag import="org.siemac.metamac.portal.Helpers" %>
<%@ tag import="org.siemac.metamac.portal.dto.Collection" %>
<%@ tag import="org.siemac.metamac.portal.dto.Dataset" %>
<%@ tag import="org.siemac.metamac.portal.dto.Query" %>

<%@ tag import="org.siemac.metamac.core.common.exception.MetamacException"%>
<%@ tag import="org.siemac.metamac.portal.core.conf.PortalConfiguration"%>
<%@ tag import="org.siemac.metamac.core.common.util.ApplicationContextProvider"%>

<%@tag import="java.util.logging.Logger"%>
<%@tag import="java.util.logging.Level"%>
	
	<%
		String PORTAL_URL_BASE = "";
		String STATISTICAL_RESOURCES_API_URL_BASE = "";
		String SRM_API_URL_BASE = "";
		Boolean internalPortal = null;
		String ORGANISATION = "";
				
		PortalConfiguration configurationService = ApplicationContextProvider.getApplicationContext().getBean(PortalConfiguration.class);
		try {
			   
		    String INSTALLATION_TYPE = configurationService.retrieveInstallationType();
		    internalPortal = INSTALLATION_TYPE.equals("INTERNAL");
			request.setAttribute("InstallationType", INSTALLATION_TYPE);
			
			ORGANISATION = configurationService.retrieveOrganisation();
			request.setAttribute("Organisation", ORGANISATION);
			
			if (ORGANISATION.equals("ISTAC")) {
			    request.setAttribute("AddthisCode","#pubid=ra-501fc6f600bacbe9");
			    request.setAttribute("titlePrefix","ISTAC | ");
			} else if (ORGANISATION.equals("DREM")) {
			    request.setAttribute("titlePrefix","DREM | ");
			}
		    
		    PORTAL_URL_BASE = configurationService.retrievePortalExternalUrlBase(); // TODO exists internal?
		    if (INSTALLATION_TYPE.equals("INTERNAL")) {
		        STATISTICAL_RESOURCES_API_URL_BASE = configurationService.retrieveStatisticalResourcesInternalApiUrlBase();
		        SRM_API_URL_BASE = configurationService.retrieveSrmInternalApiUrlBase();
		    } else if (INSTALLATION_TYPE.equals("EXTERNAL")) {	        
		        STATISTICAL_RESOURCES_API_URL_BASE = configurationService.retrieveStatisticalResourcesExternalApiUrlBase();
		        SRM_API_URL_BASE = configurationService.retrieveSrmExternalApiUrlBase();
			}
			
			request.setAttribute("ApiUrlStatisticalVisualizer", PORTAL_URL_BASE);		
			request.setAttribute("ApiUrlStatisticalResources", STATISTICAL_RESOURCES_API_URL_BASE);	
			request.setAttribute("ApiUrlStructuralResources", SRM_API_URL_BASE);
		
		} catch (MetamacException e) {
		 	request.setAttribute("ApiUrlStatisticalVisualizer","error"); 
		 	request.setAttribute("ApiUrlStatisticalResources", "error");
		 	request.setAttribute("ApiUrlStructuralResources", "error");
		}
	%>
	<%               
 
	  	String resourceType = request.getParameter("resourceType");
	    String agencyId = request.getParameter("agencyId");
	    String resourceId = request.getParameter("resourceId");
	    String version = request.getParameter("version");
	        
	    request.setAttribute("resourceEmpty", true);
	    String resourceName = "";
	    String resourceDescription = "";
	    
	    // Java 1.6 don't allow switchs on String
	    if ("collection".equals(resourceType)) {
            Collection collection = Helpers.getCollection(STATISTICAL_RESOURCES_API_URL_BASE, internalPortal, agencyId, resourceId);     	  	
    	    if (collection != null) {	        
    	        request.setAttribute("resourceEmpty", false);
    	        request.setAttribute("resourceName", Helpers.localizeText(collection.getName()));
    	        request.setAttribute("resourceDescriptionOnlyText", Helpers.html2text(Helpers.localizeText(collection.getDescription())));
    	        request.setAttribute("resourceDescription", Helpers.localizeText(collection.getDescription()));
                
    	        request.setAttribute("collection", collection);
                request.setAttribute("numberOfFixedDigitsInNumeration", Helpers.numberOfFixedDigitsInNumeration(collection));
                request.setAttribute("nodes", collection.getData().getNodes().getNodes());
    	    }
	    } else if ("dataset".equals(resourceType)) {
	        Dataset dataset = Helpers.getDataset(STATISTICAL_RESOURCES_API_URL_BASE, internalPortal, agencyId, resourceId, version);
	        
	        if (dataset != null) {
		        request.setAttribute("resourceEmpty", false);
		        request.setAttribute("resourceName", Helpers.localizeText(dataset.getName()));
		        request.setAttribute("resourceDescriptionOnlyText", Helpers.html2text(Helpers.localizeText(dataset.getDescription())));
    	        request.setAttribute("resourceDescription", Helpers.localizeText(dataset.getDescription()));
	        }
	    } else if ("query".equals(resourceType)) {
	        Query query = Helpers.getQuery(STATISTICAL_RESOURCES_API_URL_BASE, internalPortal, agencyId, resourceId);
	        
	        if (query != null) {
		        request.setAttribute("resourceEmpty", false);
		        request.setAttribute("resourceName", Helpers.localizeText(query.getName()));
		        request.setAttribute("resourceDescriptionOnlyText", Helpers.html2text(Helpers.localizeText(query.getDescription())));
    	        request.setAttribute("resourceDescription", Helpers.localizeText(query.getDescription()));  
	        }  
	    } else {	
	        request.setAttribute("resourceName", "Visualizador estadístico");
	        request.setAttribute("resourceDescription", "Visualizador estadístico");
	        request.setAttribute("resourceDescriptionOnlyText", "Visualizador estadístico");
	    }
	%>	
   	<title>${titlePrefix}${resourceName}</title>
   	
   	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
   	    
    <meta name="description" content="${resourceDescriptionOnlyText}" />

    <meta property="og:title" content="ISTAC | ${resourceName}"/>
    <meta property="og:description" content="${resourceDescriptionOnlyText}"/>
       
    <meta itemprop="name" content="ISTAC | ${resourceName}" />
	<meta itemprop="description" content="${resourceDescriptionOnlyText}" />
	
  	<meta name="keywords" content="" />
  	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  	<meta name="robots" content="index, follow" />
  	<meta name="revisit-after" content="7 days" />

  	<style>
  	    .chromeFrameInstallDefaultStyle {
            width: 100% !important;
            height: 460px !important;
            position: relative !important;
            left: 0 !important;
            top: 0 !important;
            margin: 0 !important;
        }
    </style>