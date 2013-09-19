<%@page buffer="none" session="false" taglibs="c,cms,fmt" %>
<fmt:setLocale value="${cms.locale}" />
<cms:formatter var="content" val="value">
<div>
    <div class="metamac-container">Cargando...</div>

    <script>
        <!-- @include ../resources/lazyload.js -->
    </script>

    <script>
        LazyLoad.css('<cms:link>/system/modules/org.siemac.metamac.metamac-portal/resources/metamac.css</cms:link>', function () {
            LazyLoad.js('<cms:link>/system/modules/org.siemac.metamac.metamac-portal/resources/metamac.js</cms:link>', function () {
                I18n.defaultLocale = "es";
                I18n.locale = "es";

                App.apiContext = "http://estadisticas.arte-consultores.com/metamac-statistical-resources-external-web/apis/statistical-resources/v1.0";
                App.endpoints["statistical-resources"] = "http://estadisticas.arte-consultores.com/metamac-statistical-resources-external-web/apis/statistical-resources/v1.0";
                App.endpoints["srm"] = "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0";

                App.start();
            });
        });
    </script>
</div>
</cms:formatter>