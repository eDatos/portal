<%@ page buffer="none" session="false"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="cms" uri="http://www.opencms.org/taglib/cms" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page import="org.opencms.jsp.util.CmsJspContentAccessBean" %>
<%@ page import="org.opencms.jsp.util.CmsJspStandardContextBean" %>
<%@ page import="org.opencms.jsp.util.CmsJspVfsAccessBean" %>
<%@ page import="org.opencms.file.CmsPropertyDefinition" %>
<%@ page import="org.opencms.jsp.CmsJspActionElement" %>
<%@ page import="org.opencms.file.CmsObject" %>
<%@ page import="org.siemac.metamac.portal.Helpers" %>
<%@ page import="org.siemac.metamac.portal.dto.Collection" %>
<%@ page import="org.siemac.metamac.portal.dto.Dataset" %>
<%@ page import="org.siemac.metamac.portal.dto.Query" %>

	<%               
		String ATTRIBUTES_PAGE = "metamac.html";	
	
		// This page is accesible in http://localhost:8082/opencms/opencms/istac/metamac/collection.html?agencyId=ISTAC&resourceId=C00031A_000002&type=collection
		CmsJspActionElement cms = new CmsJspActionElement(pageContext, request, response);
	    CmsObject cmso = cms.getCmsObject();
	    CmsJspVfsAccessBean vfsAccessBean = CmsJspVfsAccessBean.create(cmso);
	    String currentFolder = cms.info("opencms.request.folder");
	     	        
	  	// ${content.value.ApiUrlStatisticalResources}
	  	CmsJspContentAccessBean contentAccessBean = (CmsJspContentAccessBean) vfsAccessBean.getReadXml().get(currentFolder + ATTRIBUTES_PAGE);
	  	String apiUrlStatisticalResources = contentAccessBean.getValue().get("ApiUrlStatisticalResources").toString();
	  	Boolean internalPortal = new Boolean(contentAccessBean.getValue().get("InternalPortal").toString());
	  	
	  	String resourceType = request.getParameter("resourceType");
	    String agencyId = request.getParameter("agencyId");
	    String resourceId = request.getParameter("resourceId");
	    String version = request.getParameter("version");
	        
	    request.setAttribute("resourceEmpty", true);
	    String resourceName = "";
	    String resourceDescription = "";
	    
	    // Java 1.6 don�t allow switchs on String
	    if ("collection".equals(resourceType)) {
            Collection collection = Helpers.getCollection(apiUrlStatisticalResources, internalPortal, agencyId, resourceId);     	  	
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
	        Dataset dataset = Helpers.getDataset(apiUrlStatisticalResources, internalPortal, agencyId, resourceId, version);
	        
	        if (dataset != null) {
		        request.setAttribute("resourceEmpty", false);
		        request.setAttribute("resourceName", Helpers.localizeText(dataset.getName())); 
		        request.setAttribute("resourceDescriptionOnlyText", Helpers.html2text(Helpers.localizeText(dataset.getDescription())));
    	        request.setAttribute("resourceDescription", Helpers.localizeText(dataset.getDescription()));
	        }
	    } else if ("query".equals(resourceType)) {
	        Query query = Helpers.getQuery(apiUrlStatisticalResources, internalPortal, agencyId, resourceId);
	        
	        if (query != null) {
		        request.setAttribute("resourceEmpty", false);
		        request.setAttribute("resourceName", Helpers.localizeText(query.getName()));
		        request.setAttribute("resourceDescriptionOnlyText", Helpers.html2text(Helpers.localizeText(query.getDescription())));
    	        request.setAttribute("resourceDescription", Helpers.localizeText(query.getDescription()));
	        }  
	    } else {	
	        CmsJspStandardContextBean contextBean = CmsJspStandardContextBean.getInstance(request);
	        request.setAttribute("resourceName", cmso.readPropertyObject(
		            cmso.getRequestContext().getUri(),
	                CmsPropertyDefinition.PROPERTY_TITLE,
	                true).getValue());
	        request.setAttribute("resourceDescription", cmso.readPropertyObject(
		            cmso.getRequestContext().getUri(),
	                CmsPropertyDefinition.PROPERTY_DESCRIPTION,
	                true).getValue());
	        request.setAttribute("resourceDescriptionOnlyText", cmso.readPropertyObject(
		            cmso.getRequestContext().getUri(),
	                CmsPropertyDefinition.PROPERTY_DESCRIPTION,
	                true).getValue());
	    }
	%>

   	<title>ISTAC | ${resourceName}</title>
   	
   	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
   	    
    <meta name="description" content="${resourceDescriptionOnlyText}" />

    <meta property="og:title" content="ISTAC | ${resourceName}"/>
    <meta property="og:description" content="${resourceDescriptionOnlyText}"/>
       
    <meta itemprop="name" content="ISTAC | ${resourceName}">
	<meta itemprop="description" content="${resourceDescriptionOnlyText}">
	
  	<meta name="keywords" content="<cms:property name="Keywords" file="search" default="" />">
  	<meta http-equiv="Content-Type" content="text/html; charset=${cms:vfs(pageContext).requestContext.encoding}">
  	<meta name="robots" content="index, follow">
  	<meta name="revisit-after" content="7 days">

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