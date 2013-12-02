<%@ page import="org.apache.cxf.jaxrs.client.JAXRSClientFactory" %>
<%@ page import="org.siemac.metamac.rest.statistical_resources.v1_0.domain.Chapter" %>
<%@ page import="org.siemac.metamac.rest.statistical_resources.v1_0.domain.Collection" %>
<%@ page import="org.siemac.metamac.rest.statistical_resources.v1_0.domain.CollectionNode" %>
<%@ page import="org.siemac.metamac.statistical_resources.rest.external.v1_0.service.StatisticalResourcesV1_0" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<fmt:setLocale value="${cms.locale}" />
<cms:formatter var="content" val="value">
    <div>
        <%!
            public int numberOfFixedDigitsInNumeration(Collection collection) {
                Integer totalIndicatorInstances = countIndicatorInstances(collection.getData().getNodes().getNodes());
                int fixedDigits = totalIndicatorInstances.toString().length();
                if (fixedDigits < 2) {
                    fixedDigits = 2;
                }
                return fixedDigits;
            }

            public int countIndicatorInstances(List<CollectionNode> nodes) {
                int total = 0;
                if (nodes != null) {
                    for(CollectionNode node : nodes){
                        if (node instanceof Chapter) {
                            Chapter chapter = (Chapter)node;
                            total += countIndicatorInstances(chapter.getNodes().getNodes());
                        } else {
                            total += 1;
                        }
                    }
                }
                return total;
            }
        %>


        <%
            //test http://localhost:8082/opencms/opencms/istac/metamac/index.html?agencyId=ISTAC&resourceId=C00031A_000001
            Collection collection = null;
            try {
                String statisticalResourcesEndpoint = "http://estadisticas.arte-consultores.com/metamac-statistical-resources-external-web/apis/statistical-resources";
                StatisticalResourcesV1_0 statisticalResourcesV1_0 = JAXRSClientFactory.create(statisticalResourcesEndpoint, StatisticalResourcesV1_0.class, null, true);
                String agencyId = request.getParameter("agencyId");
                String resourceId = request.getParameter("resourceId");
                List<String> lang = new ArrayList<String>();
                String fields = "";
                collection = statisticalResourcesV1_0.retrieveCollection(agencyId, resourceId, lang, fields);
                if (collection != null) {
                    request.setAttribute("collection", collection);
                    request.setAttribute("numberOfFixedDigitsInNumeration", numberOfFixedDigitsInNumeration(collection));
                }
            } catch (Exception e) {

            }
        %>

        <c:choose>
            <c:when test="${collection != null}">
                <%
                    request.setAttribute("nodes", collection.getData().getNodes().getNodes());
                %>
                <jsp:include page="./node.jsp" />
            </c:when>
            <c:otherwise>
                error
            </c:otherwise>
        </c:choose>

    </div>

</cms:formatter>