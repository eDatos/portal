[#ftl]
[#macro base]
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-language" content="[@s4yh.locale /]" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

		<title>[@spring.message "app.title" /]</title>

        <link href='http://www.gobiernodecanarias.org/gcc/img/favicon.ico' rel="shortcut icon" type="image/vnd.microsoft.icon"/>
        <link href='http://fonts.googleapis.com/css?family=Droid+Sans:700' rel='stylesheet' type='text/css'>

    [#-- LESS
    <link rel="stylesheet/less" href="[@s4yh.resource "less/bootstrap.less"/]" />
    <script type="text/javascript" src="[@s4yh.resource "less/less-1.3.0.min.js"/]"></script>
    --]

        [@s4yh.css "less/bootstrap.css" /]

        [@s4yh.js "js/libs/libs.min.js" /]

        [@s4yh.js "js/stat4you/stat4you-1.0.0.js" /]
        [@s4yh.js "js/stat4you/libs/HandlebarsHelpers.js" /]
        [@s4yh.js "js/stat4you/modules/TemplateManager.js" /]
        [@s4yh.js "js/libs/jquery.dotdotdot-1.5.0-packed.js" /]

        <script src="${contextPath}/app/messages/${applicationVersion}/es"></script>
        [#if springMacroRequestContext.locale != 'es']
            <script src="${contextPath}/app/messages/${applicationVersion}/${springMacroRequestContext.locale}"></script>
        [/#if]

        <script type="text/javascript">
            STAT4YOU.context = "${contextPath}";
            STAT4YOU.apiContext = STAT4YOU.context + "/api/NOMBRE_API/v1.0/";
            STAT4YOU.resourceContext = "[@s4yh.resource "" /]";
            //TODO change locale
            I18n.defaultLocale = 'es';
            I18n.locale = '[@s4yh.locale /]';
            I18n.fallbacks = true;
        </script>
	</head>
	<body>
    	<div id="page-container" class="container">
    		<div class="row">
  				<div id="first-row-home" class="row pagination-centered">
				    <div id="logo" class="span4">
				        <img alt="stat4you" src="[@s4yh.resource "images/logo_istac.jpg" /]" />
				    </div>
				</div>
			</div>
            <div id="content">
                [#nested]
            </div>
        </div>


        [@s4yh.js "js/stat4you/modules/Nav.js" /]
        [@s4yh.js "js/stat4you/libs/NavigationSearch.js" /]
        [@s4yh.js "js/stat4you/libs/AjaxForm.js" /]
        <script>
            //Active the current menu element
            var nav = new STAT4YOU.modules.Nav({el : ".navbar"});
            STAT4YOU.libs.navigationSearch("#nav-search-form");
        </script>

        [@s4yh.js "js/libs/CFInstall.min.js" /]
        <script>
            CFInstall.check({
                mode: "overlay",
                destination: STAT4YOU.context
            });
        </script>
	</body>
</html>
[/#macro]