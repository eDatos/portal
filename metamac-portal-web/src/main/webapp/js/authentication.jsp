<%@ page import="org.siemac.metamac.core.common.conf.ConfigurationService"%>
<%@ page import="org.siemac.metamac.core.common.util.ApplicationContextProvider"%>
<%@ page import="org.siemac.metamac.portal.core.constants.PortalConfigurationConstants"%>
<%@ page contentType="text/javascript"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
    ConfigurationService configurationService = ApplicationContextProvider.getApplicationContext().getBean(ConfigurationService.class);
    String CAPTCHA_PROVIDER = configurationService.getProperty(PortalConfigurationConstants.CAPTCHA_PROVIDER);
    request.setAttribute("captchaProvider", CAPTCHA_PROVIDER);
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
</c:choose>