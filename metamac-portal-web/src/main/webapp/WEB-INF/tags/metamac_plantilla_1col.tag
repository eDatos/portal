<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<%@ attribute name="baseURL" required="true" rtexprvalue="true" %>
<%@ tag description="Simple Wrapper Tag" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<html>
<head>
  <!-- Title y metas -->
	<t:metamac_title_meta></t:metamac_title_meta>
	
	<!-- Recursos CSS -->
	<c:choose>
	    <c:when test="${Organisation == 'ISTAC'}">
			<t:css_istac baseURL="${baseURL}"></t:css_istac>
	    </c:when>
	    <c:when test="${Organisation == 'DREM'}">
	        <t:css_drem baseURL="${baseURL}"></t:css_drem>
	    </c:when>
	</c:choose>
</head>
<body>
<!-- was there -->
<!-- begin: #contenido -->		    		
<div id="contenido">

	<!-- begin: #cabecera -->
	<c:choose>
	    <c:when test="${Organisation == 'ISTAC'}">
			<t:cabecera_istac/>
	    </c:when>
	    <c:when test="${Organisation == 'DREM'}">
	        <t:cabecera_drem/>
	    </c:when>
	</c:choose>
	<!-- end: #cabecera -->

	<!-- begin: #bloq_interior -->	
	<div id="bloq_interior">	
		<!-- begin: CONTENIDO CENTRAL --> 
		<div class="contenido">
			<jsp:doBody/>
		</div>	
		<!-- end:COLUMNA CENTRAL -->
	</div>
	<!-- end: #bloq_interior -->
		
	<!-- begin: pie -->			
	<c:choose>
	    <c:when test="${Organisation == 'ISTAC'}">
			<t:pie_istac/>
	    </c:when>
	    <c:when test="${Organisation == 'DREM'}">
	        <t:pie_drem/>
	    </c:when>
	</c:choose>
	<!-- end: pie -->
		
<!-- end: #contenido -->			
</div>		
</body>
</html>