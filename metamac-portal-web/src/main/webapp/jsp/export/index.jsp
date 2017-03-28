<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>APIs de Exportaciones</title>
 
  <link href="<%=org.siemac.metamac.portal.web.WebUtils.getFavicon()%>" rel="shortcut icon"/>
  
  <c:set var="apiStyleCssUrl" value="<%=org.siemac.metamac.portal.web.WebUtils.getApiStyleCssUrl()%>" />

  <c:if test="${!empty apiStyleCssUrl}">
    <link href="<c:out value='${apiStyleCssUrl}'/>" media='screen' rel='stylesheet' type='text/css' />
  </c:if>
  
</head>
<body>
    <c:set var="apiStyleHeaderUrl" value="<%=org.siemac.metamac.portal.web.WebUtils.getApiStyleHeaderUrl()%>" />
    <c:set var="apiStyleFooterUrl" value="<%=org.siemac.metamac.portal.web.WebUtils.getApiStyleFooterUrl()%>" />
    
    <c:set var="exportApiBaseURL" value="<%=org.siemac.metamac.portal.web.WebUtils.getExportApiBaseURL()%>" />
    
    <c:if test="${!empty apiStyleHeaderUrl}">
       <c:import charEncoding="UTF-8" url="${apiStyleHeaderUrl}" />
    </c:if>
    
    <div class="version-list">
       <h1>APIs de Exportaciones</h1>
       <h2>Versiones</h2>
       <ul>
           <li>
               <h3 class="version-title"><a href="${exportApiBaseURL}/latest" alt="Última versión de la API">/latest</a></h3>
               <div class="version-description">
                   <p><strong>latest</strong> es la palabra clave reservada con la que se puede acceder a la última versión de la API</p>                      
               </div>
           </li>
           
           <li>
               <h3 class="version-title"><a href="${exportApiBaseURL}/v1.0" alt="Versión 1.0">/v1.0</a></h3>
               <div class="version-description">
                    <p>Versión 1.0 de la API</p>    
               </div>
           </li>
       </ul>
   </div>

    <c:if test="${!empty apiStyleFooterUrl}">
       <c:import charEncoding="UTF-8" url="${apiStyleFooterUrl}" />
    </c:if>
</body>
</html>
