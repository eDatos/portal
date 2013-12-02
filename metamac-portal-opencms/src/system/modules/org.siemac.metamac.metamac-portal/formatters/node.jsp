<%@ page import="org.siemac.metamac.rest.common.v1_0.domain.InternationalString" %>
<%@ page import="org.siemac.metamac.rest.statistical_resources.v1_0.domain.Chapter" %>
<%@ page import="org.siemac.metamac.rest.statistical_resources.v1_0.domain.CollectionNode" %>
<%@ page import="org.siemac.metamac.rest.statistical_resources.v1_0.domain.Table" %>
<%@ page import="java.util.List" %>

<%!
    public String localizeTitle(InternationalString internationalString) {
        return internationalString.getTexts().get(0).getValue();
    }
%>

<ul class="capitulos">
    <%
        Integer nodeDepth = (Integer)request.getAttribute("nodeDepth");
        if (nodeDepth == null) {
            request.setAttribute("nodeDepth", 1);
        } else {
            request.setAttribute("nodeDepth", nodeDepth + 1);
        }

        request.setAttribute("openClass", "open");

        List<CollectionNode> nodes = (List<CollectionNode>) request.getAttribute("nodes");
        for (CollectionNode node : nodes) {
            if (node instanceof Chapter) {
                Chapter chapter = (Chapter) node;
    %>

    <li class="dimension dimension-depth-${nodeDepth} ${openClass}">
        <span class="dimension-title">
            <c:if test="${nodeDepth > 2}"><a href="#" class="tree-icon"></a></c:if>
            <%= localizeTitle(chapter.getName()) %>
        </span>
        <% request.setAttribute("nodes", chapter.getNodes().getNodes());%>
        <jsp:include page="./node.jsp"/>
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
        <i class="icon-table"></i>
        <span class="item-numeration">${numerationFixed}</span>
        <a class="nouline" href="#"><%= localizeTitle(table.getName()) %>
        </a>
    </li>

    <%
            }
        }
    %>
</ul>