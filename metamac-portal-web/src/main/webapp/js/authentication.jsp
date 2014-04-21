<%@page import="org.siemac.metamac.core.common.exception.MetamacException"%>
<%@ page import="org.siemac.metamac.core.common.conf.ConfigurationService"%>
<%@ page import="org.siemac.metamac.core.common.util.ApplicationContextProvider"%>
<%@ page import="org.siemac.metamac.portal.core.constants.PortalConfigurationConstants"%>
<%@ page contentType="text/javascript"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
 try {
	PortalConfiguration configurationService = ApplicationContextProvider.getApplicationContext().getBean(PortalConfiguration.class);
    String CAPTCHA_PROVIDER = configurationService.retrieveCaptchaProvider();
    request.setAttribute("captchaProvider", CAPTCHA_PROVIDER);
 } catch (MetamacException e) {
    request.setAttribute("captchaProvider", "error");
 }
%>
<c:choose>
	<c:when test="${captchaProvider == 'recaptcha'}">
		<jsp:include page="/include/authentication-recaptcha.jsp" />
	</c:when>
	<c:when test="${captchaProvider == 'gobcan'}">
		<jsp:include page="/include/authentication-gobcan.jsp" />
	</c:when>
	<c:when test="${captchaProvider == 'simple'}">
		<jsp:include page="/include/authentication-simple.jsp" />
	</c:when>
	<c:otherwise>
	   (function () {
           alert("Error loading captcha provider");
        }());
	</c:otherwise>	
</c:choose>