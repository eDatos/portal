<%@ tag description="CSS DREM" pageEncoding="UTF-8" %>
<%@ attribute name="baseURL" required="true" rtexprvalue="true" %>

<link rel="shortcut icon" href="//estatistica.gov-madeira.pt/templates/jsn_epic_pro/favicon.ico" />
<c:if test="${!empty portalStyleCssUrl}">
    <link href="<c:out value='${portalStyleCssUrl}'/>" rel='stylesheet' type='text/css' />
</c:if>

<!--[if IE]>
<link rel="stylesheet" type="text/css" href="//www.gobiernodecanarias.org/gcc/css/ie.css" />
<![endif]-->
<link href="${baseURL}/css/base_drem.css" rel="stylesheet" type="text/css">