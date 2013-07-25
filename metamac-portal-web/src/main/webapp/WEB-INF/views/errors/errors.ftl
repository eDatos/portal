[#ftl]
[#include "/inc/includes.ftl"]

<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta http-equiv="Content-language" content="es" />

    <title>Stat4You - Error</title>

    <link rel="icon" type="image/vnd.microsoft.icon" href="[@s4yh.resource "images/s4yFavicon.ico" /]"/>

    [@s4yh.css "assets/css/main.css" /]
    [#include "/includes/libs.html"]

    <script type="text/javascript">
        STAT4YOU.context = "[@spring.url '' /]";
        STAT4YOU.apiContext = STAT4YOU.context + "/api/NOMBRE_API/v1.0/";
        STAT4YOU.resourceContext = "[@s4yh.resource "" /]";
    </script>
</head>

<body class="error-page">

<div id="page-container" class="container">

    <div id="first-row-home" class="row pagination-centered">
        <div id="logo" class="span4 offset4">
            <a href="[@spring.url "/" /]">
                <img alt="stat4you" src="[@s4yh.resource "images/stat4you.png" /]" alt="Stat4you"/>
            </a>
        </div>
    </div>

    <div class="error-page-msg">
    [#if code == "404"]
            <h2>[@spring.message "page.errors.error404" /]</h2>
        [#else]
            <h2>[@spring.message "page.errors.error500" /]</h2>
        [/#if]
    </div>

    <div class="row pagination-centered">
        <div class="span6 offset3">
            <form id="home-search" class="search-form ajax-form" method="get" action="[@spring.url '/search'/]">
                <div class="search-box">
                    <input id="home-search-input" type="text" name="q"/>
                </div>
                <div class="search-button">
                    <input id="search-button" class="btn btn-primary" type="submit" value="[@spring.message 'search.button' /]" />
                </div>
            </form>


        </div>
    </div>

    <div class="pagination-centered">
        <hr />
        <p>
            <a href="[@spring.url "/legal" /]">[@spring.message 'app.legal' /]</a>
        </p>
        <p>[@s4yh.messageEscape 'app.copyrigth' /]</p>
    </div>
</div>

<script type="text/javascript">
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-30024362-2']);
    _gaq.push(['_setDomainName', 'stat4you.com']);
    _gaq.push(['_setAllowLinker', true]);
    _gaq.push(['_trackPageview']);

    (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
</script>


[@s4yh.js "js/stat4you/libs/AjaxForm.js" /]
[@s4yh.js "js/stat4you/libs/jira.js" /]

</body>
</html>