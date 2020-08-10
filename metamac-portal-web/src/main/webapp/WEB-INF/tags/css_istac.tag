<%@ tag description="CSS ISTAC" pageEncoding="UTF-8"%>
<%@ attribute name="baseURL" required="true"  rtexprvalue="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<link href="https://www.gobiernodecanarias.org/gcc/img/favicon.ico" rel="shortcut icon"/>
<c:if test="${!empty portalStyleCssUrl}">
    <link href="<c:out value='${portalStyleCssUrl}'/>" media='screen' rel='stylesheet' type='text/css' />
</c:if>

<!--[if IE]>
<link rel="stylesheet" type="text/css" href="//www.gobiernodecanarias.org/gcc/css/ie.css" />
<![endif]-->