[#ftl]

[#macro base]

<!DOCTYPE html>
<html lang="[@s4yh.locale /]">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" />
    <meta charset='utf-8'>

    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Matamac</title>

    <link rel="icon" type="image/vnd.microsoft.icon" href="[@s4yh.resource "images/s4yFavicon.ico" /]"/>

    [@s4yh.css "assets/css/main.css" /]
    [#include "../includes/libs.html"]

    <script src="${contextPath}/app/messages/${applicationVersion}/es"></script>
    [#if springMacroRequestContext.locale != 'es']
        <script src="${contextPath}/app/messages/${applicationVersion}/${springMacroRequestContext.locale}"></script>
    [/#if]

    <script type="text/javascript">
        STAT4YOU.context = "${contextPath}";
        STAT4YOU.apiContext = STAT4YOU.context + "/api/v1.0";
        STAT4YOU.resourceContext = "[@s4yh.resource "" /]";
        STAT4YOU.configuration = {};
        I18n.defaultLocale = 'es';
        I18n.locale = '[@s4yh.locale /]';
        I18n.fallbacks = true;
    </script>
</head>
<body>

[#nested]

</body>
</html>
[/#macro]