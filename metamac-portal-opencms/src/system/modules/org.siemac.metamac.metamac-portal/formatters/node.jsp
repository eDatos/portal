<%@ page import="org.siemac.metamac.rest.statistical_resources.v1_0.domain.Chapter" %>
<%@ page import="org.siemac.metamac.rest.statistical_resources.v1_0.domain.CollectionNode" %>
<%@ page import="org.siemac.metamac.rest.statistical_resources.v1_0.domain.Table" %>
<%@ page import="java.util.List" %>
<%
    List<CollectionNode> nodes = (List<CollectionNode>) request.getAttribute("nodes");
    for (CollectionNode node : nodes) {
        if (node instanceof Chapter) {
            Chapter chapter = (Chapter) node;
%>

<li>
    <%= chapter.getName().getTexts().get(0).getValue() %>
    <ul>
        <% request.setAttribute("nodes", chapter.getNodes().getNodes());%>
        <jsp:include page="./node.jsp"/>
    </ul>
</li>

<%
} else {
    Table table = (Table) node;
%>

<li>
    <%= table.getName().getTexts().get(0).getValue()%>
</li>

<%
        }
    }
%>