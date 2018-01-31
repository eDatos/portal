<%@ tag description="CSS ISTAC" pageEncoding="UTF-8"%>
<%@ attribute name="baseURL" required="true"  rtexprvalue="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<link href="//www.gobiernodecanarias.org/gcc/css/estilos.css" rel="stylesheet" type="text/css" media="screen" />		
<link href="//www.gobiernodecanarias.org/gcc/css/imprime.css" rel="stylesheet" type="text/css" media="print" />
<link href="//www.gobiernodecanarias.org/gcc/css/voz.css" rel="stylesheet" type="text/css" media="aural" />
<link href="//www.gobiernodecanarias.org/gcc/img/favicon.ico" rel="shortcut icon"/>
<link href="${baseURL}/css/gobcanoverwrite.css" rel="stylesheet" type="text/css">
<c:if test="${!empty portalStyleCssUrl}">
    <link href="<c:out value='${portalStyleCssUrl}'/>" media='screen' rel='stylesheet' type='text/css' />
</c:if>

<!--[if IE]>
<link rel="stylesheet" type="text/css" href="//www.gobiernodecanarias.org/gcc/css/ie.css" />
<![endif]-->