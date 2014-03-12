<%@ page import="org.siemac.metamac.rest.common.v1_0.domain.InternationalString" %>
<%@ page import="org.siemac.metamac.rest.statistical_resources.v1_0.domain.Chapter" %>
<%@ page import="org.siemac.metamac.rest.statistical_resources.v1_0.domain.CollectionNode" %>
<%@ page import="org.siemac.metamac.rest.statistical_resources.v1_0.domain.Table" %>
<%@ page import="java.util.List" %>
<%@ page import="org.siemac.metamac.portal.Helpers" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<ul class="capitulos">
    <%
        Integer nodeDepth = (Integer)request.getAttribute("nodeDepth");
        if (nodeDepth == null) {
            nodeDepth = 1;
        } else {
            nodeDepth = nodeDepth + 1;
        }
        request.setAttribute("nodeDepth", nodeDepth);
        request.setAttribute("openClass", "open");

        List<CollectionNode> nodes = (List<CollectionNode>) request.getAttribute("nodes");
        for (CollectionNode node : nodes) {
            if (node instanceof Chapter) {
                Chapter chapter = (Chapter) node;
    %>

    <li class="dimension dimension-depth-${nodeDepth} ${openClass}">
        <span class="dimension-title">
        	<% if (chapter.getNodes() != null) { %>
            	<c:if test="${nodeDepth > 2}"><a href="#" class="tree-icon"></a></c:if>
            <% } %>
            <%= Helpers.localizeText(chapter.getName()) %>
        </span>
        <div class="dimension-description">
	        <c:if test="${nodeDepth <= 2}">
	        	<%= Helpers.localizeText(chapter.getDescription()) %>
	        </c:if>
	    </div>
        <% if (chapter.getNodes() != null) { 
            request.setAttribute("nodes", chapter.getNodes().getNodes());
        %>        
        	<jsp:include page="./collection-node.jsp"/>
			<%
    			request.setAttribute("nodeDepth", nodeDepth); //reset node depth
			%>
		<% } %>
    </li>

    <%
    } else {
        Table table = (Table) node;
        Integer numeration = (Integer)request.getAttribute("numeration");
        if (numeration == null) {
            numeration = 1;
        } else {
            numeration = numeration + 1;
        }
        request.setAttribute("numeration", numeration);
        Integer numberOfFixedDigitsInNumeration = (Integer)request.getAttribute("numberOfFixedDigitsInNumeration");
        request.setAttribute("numerationFixed", String.format("%0"+ numberOfFixedDigitsInNumeration +"d", numeration));
    %>

    <li>
        <i class="icon-collection-table"></i>
        <span class="item-numeration">${numerationFixed}</span>
        <a class="nouline" href="<%= Helpers.tableViewUrl(table) %>"><%= Helpers.localizeText(table.getName()) %>
        </a>
    </li>

    <%
            }
        }
    %>
</ul>