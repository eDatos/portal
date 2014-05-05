<%@page buffer="none" session="false" taglibs="c,cms,fn" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">

<html><head>
  <!-- Title y metas -->
	<cms:include file="/system/modules/org.siemac.metamac.metamac-portal/elements/site-elements/metamac_title_meta.jsp" />
	
	<cms:enable-ade/>

	<!-- Recursos CSS -->
	<cms:include file="/system/modules/es.gobcan.istac.web/elements/site-elements/css.jsp" />
	
	<!-- Recursos JS -->
	<cms:include file="/system/modules/es.gobcan.istac.web/elements/site-elements/js.jsp" />
	
</head>
<body>
<!-- was there -->
<!-- begin: #contenido -->		    		
<div id="contenido">

	<!-- begin: #cabecera -->
	<cms:include file="/system/modules/es.gobcan.istac.web/elements/site-elements/cabecera.jsp" />		    		
	<!-- end: #cabecera -->
	

	<!-- begin: #anuncio -->	
	<div class="contenido">	    		
		<cms:container name="bannercentercontainer" type="center" width="763" maxElements="1" detailview="false"/>
	</div>
	<!-- end: #anuncio -->
	
	
	<!-- begin: #migas -->	
	<cms:include file="/system/modules/es.gobcan.istac.web/elements/site-elements/nav_bread.jsp" />	
	<!-- end: #migas -->

	<!-- begin: #bloq_interior -->	
	<div id="bloq_interior">	

		<!-- begin: CONTENIDO CENTRAL --> 
		<div class="contenido">
		<cms:container name="centercontainer" type="center" width="763" maxElements="8" detailview="false"/>
		</div>	
		<!-- end:COLUMNA CENTRAL -->

	</div>
	<!-- end: #bloq_interior -->
		
	<!-- begin: pie -->		    		
	<cms:include file="/system/modules/es.gobcan.istac.web/elements/site-elements/pie.jsp" />
	<!-- end: pie -->
		
<!-- end: #contenido -->			
</div>		
</body>
</html>