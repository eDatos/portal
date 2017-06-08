<%@ page pageEncoding="UTF-8" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<%@ page import="org.siemac.metamac.core.common.exception.MetamacException"%>
<%@ page import="org.siemac.metamac.portal.core.conf.PortalConfiguration"%>
<%@ page import="org.siemac.metamac.core.common.util.ApplicationContextProvider"%>
<%@ page import="org.siemac.metamac.portal.Helpers" %>
<%@ page import="org.siemac.metamac.portal.dto.Permalink" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Date" %>
<%@ page import="java.text.SimpleDateFormat" %>
<html>
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta charset="utf-8">
    <title>Dataset widget</title>

	<%
		ServletContext context = request.getSession().getServletContext();
		String cssPath = context.getRealPath("client/metamac.css");
		File cssFile = new File(cssPath);
		
		String jsPath = context.getRealPath("client/metamac.js");
		File jsFile = new File(jsPath);
		
		Date lastModifiedCss = new Date(cssFile.lastModified());
		Date lastModifiedJs = new Date(jsFile.lastModified());
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
		request.setAttribute("cssDate", dateFormat.format(lastModifiedCss));
		request.setAttribute("jsDate", dateFormat.format(lastModifiedJs));
	%>	
	
    <link rel="stylesheet" href="client/metamac.css?d=${cssDate}"/>

    <style>
        html, body { margin : 0; height: 99%;}
    </style>
    <%
	    String PORTAL_URL_BASE = "";
		String STATISTICAL_RESOURCES_API_URL_BASE = "";
		String SRM_API_URL_BASE = "";
        String PERMALINKS_API_URL_BASE = "";
        String EXPORT_API_URL_BASE = "";
		PortalConfiguration configurationService = ApplicationContextProvider.getApplicationContext().getBean(PortalConfiguration.class);
		try {
	   		PORTAL_URL_BASE = configurationService.retrievePortalExternalUrlBase();
			STATISTICAL_RESOURCES_API_URL_BASE = configurationService.retrieveStatisticalResourcesExternalApiUrlBase();
		    SRM_API_URL_BASE = configurationService.retrieveSrmExternalApiUrlBase();
		    PERMALINKS_API_URL_BASE = configurationService.retrievePortalExternalApisPermalinksUrlBase();
		    EXPORT_API_URL_BASE = configurationService.retrievePortalExternalApisExportUrlBase();       
			
			request.setAttribute("ApiUrlStatisticalVisualizer", PORTAL_URL_BASE);		
			request.setAttribute("ApiUrlStatisticalResources", STATISTICAL_RESOURCES_API_URL_BASE);	
			request.setAttribute("ApiUrlStructuralResources", SRM_API_URL_BASE);
			request.setAttribute("ApiUrlPermalinks", PERMALINKS_API_URL_BASE);
			request.setAttribute("ApiUrlExport", EXPORT_API_URL_BASE);
		} catch (MetamacException e) {
		 	request.setAttribute("ApiUrlStatisticalVisualizer","error"); 
		 	request.setAttribute("ApiUrlStatisticalResources", "error");
		 	request.setAttribute("ApiUrlStructuralResources", "error");
		 	request.setAttribute("ApiUrlPermalinks", "error");
            request.setAttribute("ApiUrlExport", "error");
		}
	%>
    <%
        String permalinkId = request.getParameter("permalink");
        if (permalinkId != null && !permalinkId.isEmpty()) {
            Permalink permalink = Helpers.getPermalink(PERMALINKS_API_URL_BASE, permalinkId);
            response.sendRedirect(Helpers.buildUrl(permalink));   
        }        
    %>
</head>
<body>

<div class="metamac-container"></div>

<script>
	LazyLoad=function(a){function b(b,c){var d,e=a.createElement(b);for(d in c)c.hasOwnProperty(d)&&e.setAttribute(d,c[d]);return e}function c(a){var b,c,d=j[a];d&&(b=d.callback,c=d.urls,c.shift(),k=0,c.length||(b&&b.call(d.context,d.obj),j[a]=null,l[a].length&&e(a)))}function d(){var b=navigator.userAgent;h={async:a.createElement("script").async===!0},(h.webkit=/AppleWebKit\//.test(b))||(h.ie=/MSIE|Trident/.test(b))||(h.opera=/Opera/.test(b))||(h.gecko=/Gecko\//.test(b))||(h.unknown=!0)}function e(e,k,m,n,o){var p,q,r,s,t,u,v=function(){c(e)},w="css"===e,x=[];if(h||d(),k)if(k="string"==typeof k?[k]:k.concat(),w||h.async||h.gecko||h.opera)l[e].push({urls:k,callback:m,obj:n,context:o});else for(p=0,q=k.length;q>p;++p)l[e].push({urls:[k[p]],callback:p===q-1?m:null,obj:n,context:o});if(!j[e]&&(s=j[e]=l[e].shift())){for(i||(i=a.head||a.getElementsByTagName("head")[0]),t=s.urls,p=0,q=t.length;q>p;++p)u=t[p],w?r=h.gecko?b("style"):b("link",{href:u,rel:"stylesheet"}):(r=b("script",{src:u}),r.async=!1),r.className="lazyload",r.setAttribute("charset","utf-8"),h.ie&&!w&&"onreadystatechange"in r&&!("draggable"in r)?r.onreadystatechange=function(){/loaded|complete/.test(r.readyState)&&(r.onreadystatechange=null,v())}:w&&(h.gecko||h.webkit)?h.webkit?(s.urls[p]=r.href,g()):(r.innerHTML='@import "'+u+'";',f(r)):r.onload=r.onerror=v,x.push(r);for(p=0,q=x.length;q>p;++p)i.appendChild(x[p])}}function f(a){var b;try{b=!!a.sheet.cssRules}catch(d){return k+=1,200>k?setTimeout(function(){f(a)},50):b&&c("css"),void 0}c("css")}function g(){var a,b=j.css;if(b){for(a=m.length;--a>=0;)if(m[a].href===b.urls[0]){c("css");break}k+=1,b&&(200>k?setTimeout(g,50):c("css"))}}var h,i,j={},k=0,l={css:[],js:[]},m=a.styleSheets;return{css:function(a,b,c,d){e("css",a,b,c,d)},js:function(a,b,c,d){e("js",a,b,c,d)}}}(this.document);
    
	    function getQueryParams(params) {
        	var reg = new RegExp("(^|&)"+ params +"=([^&]*)(&|$)");    
        	var r = window.location.search.substr(1).match(reg);
        	if ( r != null) return unescape(r[2]); 
	        return null;
    	}
</script>                

<script>

LazyLoad.js('client/metamac.js?d=${jsDate}', function () {

	I18n.defaultLocale = "es";
    I18n.locale = "es";

    App.queryParams["agency"] = getQueryParams("agencyId");
    App.queryParams["identifier"] = getQueryParams("resourceId");
    App.queryParams["version"] = getQueryParams("version");
	App.queryParams["type"] = getQueryParams("resourceType");
	App.queryParams["indicatorSystem"] = getQueryParams("indicatorSystem");
    App.config["chromeFrameObject"] = getQueryParams("chromeFrameObject");
	App.config["widget"] = true;

	App.endpoints["statistical-resources"] = "${ApiUrlStatisticalResources}/v1.0";
    App.endpoints["structural-resources"] = "${ApiUrlStructuralResources}/v1.0";
    App.endpoints["permalinks"] = "${ApiUrlPermalinks}/v1.0";
    App.endpoints["export"] = "${ApiUrlExport}/v1.0";
    App.endpoints["statistical-visualizer"] = "${ApiUrlStatisticalVisualizer}";
    App.endpoints["shared-statistical-visualizer"] = getQueryParams("sharedVisualizerUrl");
    App.endpoints["indicators"] = "${ApiUrlIndicators}/v1.0";
    

    App.start();

    LazyLoad.js("js/authentication.js?d=${jsDate}", function() {
    	LazyLoad.js("//s7.addthis.com/js/300/addthis_widget.js");
    });
    
});
</script>
</body>
</html>