<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="cms" uri="http://www.opencms.org/taglib/cms" %>

<fmt:setLocale value="<%= request.getLocale() %>" />
<cms:formatter var="content" val="value">
    <div>
	    <c:choose>
		    <c:when test="${content.value.ApiUrlStatisticalResources == ''
		    	|| content.value.ApiUrlStructuralResources == ''
		    	|| content.value.ApiUrlStatisticalVisualizer == ''}">
		    	<h3>Error - Propiedad no configurada</h3>
	            <p class="justificado">Lo sentimos, alguna de las propiedades no ha sido configurada correctamente.</p>
	       	</c:when>
			<c:otherwise>
			    <c:choose>
					<c:when test="${!resourceEmpty}">
						<div class="dataset-header-info">
			            	<h1 class="dataset-header-title">${resourceName}</h1>
			            	<c:choose>
			            		<c:when test="${resourceDescription != ''}">
			            			<div><p>${resourceDescription}<p></div>
			            		</c:when>
			            	</c:choose>
			            </div>                	
		            </c:when>
		        </c:choose>		    	   
		        <div class="metamac-container">Cargando...</div>
		
		        <script>
		            LazyLoad=function(a){function b(b,c){var d,e=a.createElement(b);for(d in c)c.hasOwnProperty(d)&&e.setAttribute(d,c[d]);return e}function c(a){var b,c,d=j[a];d&&(b=d.callback,c=d.urls,c.shift(),k=0,c.length||(b&&b.call(d.context,d.obj),j[a]=null,l[a].length&&e(a)))}function d(){var b=navigator.userAgent;h={async:a.createElement("script").async===!0},(h.webkit=/AppleWebKit\//.test(b))||(h.ie=/MSIE|Trident/.test(b))||(h.opera=/Opera/.test(b))||(h.gecko=/Gecko\//.test(b))||(h.unknown=!0)}function e(e,k,m,n,o){var p,q,r,s,t,u,v=function(){c(e)},w="css"===e,x=[];if(h||d(),k)if(k="string"==typeof k?[k]:k.concat(),w||h.async||h.gecko||h.opera)l[e].push({urls:k,callback:m,obj:n,context:o});else for(p=0,q=k.length;q>p;++p)l[e].push({urls:[k[p]],callback:p===q-1?m:null,obj:n,context:o});if(!j[e]&&(s=j[e]=l[e].shift())){for(i||(i=a.head||a.getElementsByTagName("head")[0]),t=s.urls,p=0,q=t.length;q>p;++p)u=t[p],w?r=h.gecko?b("style"):b("link",{href:u,rel:"stylesheet"}):(r=b("script",{src:u}),r.async=!1),r.className="lazyload",r.setAttribute("charset","utf-8"),h.ie&&!w&&"onreadystatechange"in r&&!("draggable"in r)?r.onreadystatechange=function(){/loaded|complete/.test(r.readyState)&&(r.onreadystatechange=null,v())}:w&&(h.gecko||h.webkit)?h.webkit?(s.urls[p]=r.href,g()):(r.innerHTML='@import "'+u+'";',f(r)):r.onload=r.onerror=v,x.push(r);for(p=0,q=x.length;q>p;++p)i.appendChild(x[p])}}function f(a){var b;try{b=!!a.sheet.cssRules}catch(d){return k+=1,200>k?setTimeout(function(){f(a)},50):b&&c("css"),void 0}c("css")}function g(){var a,b=j.css;if(b){for(a=m.length;--a>=0;)if(m[a].href===b.urls[0]){c("css");break}k+=1,b&&(200>k?setTimeout(g,50):c("css"))}}var h,i,j={},k=0,l={css:[],js:[]},m=a.styleSheets;return{css:function(a,b,c,d){e("css",a,b,c,d)},js:function(a,b,c,d){e("js",a,b,c,d)}}}(this.document);
		        </script>
		
		        <script>
		            LazyLoad.css('<cms:link>/system/modules/org.siemac.metamac.metamac-portal/resources/metamac.css</cms:link>', function () {
		                LazyLoad.js('<cms:link>/system/modules/org.siemac.metamac.metamac-portal/resources/metamac.js</cms:link>', function () {
		                    I18n.defaultLocale = "es";
		                    I18n.locale = "<%= request.getLocale().toString().substring(0, 2) %>";
							
		                    // http://estadisticas.arte-consultores.com/statistical-resources/apis/statistical-resources
		                    App.endpoints["statistical-resources"] = "${content.value.ApiUrlStatisticalResources}/v1.0";
		                    
		                    // http://estadisticas.arte-consultores.com/structural-resources-internal/apis/structural-resources-internal
		                    App.endpoints["structural-resources"] = "${content.value.ApiUrlStructuralResources}/v1.0";
		                    
		                    // http://estadisticas.arte-consultores.com/statistical-visualizer
		                    App.endpoints["statistical-visualizer"] = "${content.value.ApiUrlStatisticalVisualizer}";
		                    
		                    App.showHeader = ${resourceEmpty};
		                    
		                    App.queryParams["agency"] = '<%= request.getParameter("agencyId") %>';
		                    App.queryParams["identifier"] = '<%= request.getParameter("resourceId") %>';		                    
		                    App.queryParams["version"] = '<%= request.getParameter("version") %>';
		
		                    console.log("starting app");
		
		                    App.start();
		                    
		                    LazyLoad.js("${content.value.ApiUrlStatisticalVisualizer}/js/authentication.js", function() {
		                    	LazyLoad.js("//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-501fc6f600bacbe9");
		                    });		                    
		                });
		            });		            
		        </script>
	        </c:otherwise>
	    </c:choose>
    </div>
</cms:formatter>