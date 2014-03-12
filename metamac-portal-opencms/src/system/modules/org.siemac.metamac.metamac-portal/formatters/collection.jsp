<%@ page pageEncoding="UTF-8" %><%@ page import="org.apache.cxf.jaxrs.client.JAXRSClientFactory" %>
<%@ page import="org.siemac.metamac.portal.Helpers" %>
<%@ page import="org.siemac.metamac.rest.statistical_resources.v1_0.domain.Collection" %>
<%@ page import="org.siemac.metamac.statistical_resources.rest.external.v1_0.service.StatisticalResourcesV1_0" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="cms" uri="http://www.opencms.org/taglib/cms" %>
<%@ page import="org.opencms.jsp.util.CmsJspContentAccessBean" %>

<fmt:setLocale value="${cms.locale}" />
<cms:formatter var="content" val="value">
    <div>

        <%
	    	// ${content.value.ApiUrlStatisticalResources}
	    	CmsJspContentAccessBean contentAccessBean = (CmsJspContentAccessBean) pageContext.getAttribute("content");
	    	String apiUrlStatisticalResources = contentAccessBean.getValue().get("ApiUrlStatisticalResources").toString();
	    
            //test http://localhost:8082/opencms/opencms/istac/metamac/index.html?agencyId=ISTAC&resourceId=C00031A_000002
            Collection collection = null;
            try {
                //String statisticalResourcesEndpoint = "http://estadisticas.arte-consultores.com/statistical-resources/apis/statistical-resources";
                String statisticalResourcesEndpoint = apiUrlStatisticalResources;
                StatisticalResourcesV1_0 statisticalResourcesV1_0 = JAXRSClientFactory.create(statisticalResourcesEndpoint, StatisticalResourcesV1_0.class, null, true);
                String agencyId = request.getParameter("agencyId");
                String resourceId = request.getParameter("resourceId");
                List<String> lang = new ArrayList<String>();
                String fields = "";
                collection = statisticalResourcesV1_0.retrieveCollection(agencyId, resourceId, lang, fields);
                if (collection != null) {
                    request.setAttribute("collection", collection);
                    request.setAttribute("numberOfFixedDigitsInNumeration", Helpers.numberOfFixedDigitsInNumeration(collection));
                }
            } catch (Exception e) {

            }
        %>

        <c:choose>
            <c:when test="${collection != null}">
            	<h2 class="tit_conten_1_col"><%= Helpers.localizeText(collection.getName()) %></h2>
            	<div class="collection-description"><%= Helpers.localizeText(collection.getDescription()) %></div>                	
                <%
                        request.setAttribute("nodes", collection.getData().getNodes().getNodes());
                %>
                <cms:include page="./collection-node.jsp" />
            </c:when>
			<c:otherwise>
            	<h2 class="tit_conten_1_col">Control de Errores</h2>
            	<div class="contenido">
            		<c:choose>
	            		<c:when test="${content.value.ApiUrlStatisticalResources == ''}">	                	                    
		                    <h3>Error - Propiedad no configurada</h3>
		                    <p class="justificado">Lo sentimos, la propiedad ApiUrlStatisticalResource no ha sido configurada correctamente.</p>		                    	                    
		        		</c:when>
			        	<c:otherwise>
			        		<h3>Error 404 - Documento No Encontrado</h3>
		                    <p class="justificado">Lo sentimos, el Documento al que está intentado acceder no está disponible.
		                        Esto puede ocurrir por varios  motivos:</p>
		                    <ul>
		                        <li>El documento no existe en el Servidor del Gobierno de Canarias.</li>
		                        <li>El documento puede no estar disponible "Temporalmente".</li>
		                        <li>Ha introducido un URL incorrecto. Compruebe y asegúrese de que está bien escrito.</li>
		                    </ul>
			        	</c:otherwise>
		        	</c:choose>
		        	<p class="nota"><strong>Atención:</strong> Si desea informar, por favor, hágalo desde Contacto.</p>	                
	        	</div>
            </c:otherwise>
        </c:choose>

    </div>

    <script>
        <!-- @include ../resources/lazyload.js -->
    </script>

    <script>
        LazyLoad.css('<cms:link>/system/modules/org.siemac.metamac.metamac-portal/resources/metamac.css</cms:link>', function () {
            LazyLoad.js('<cms:link>/system/modules/org.siemac.metamac.metamac-portal/resources/metamac.js</cms:link>', function () {

                // Tree behaviour
                $(".tree-icon").click(function (e) {
                    e.preventDefault();
                    var $icon = $(this);
                    var $parentDimension = $icon.closest(".dimension");
                    $parentDimension.toggleClass("open");
                    $parentDimension.toggleClass("close");
                });

            });
        });
    </script>


</cms:formatter>