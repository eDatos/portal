<%@page buffer="none" session="false" taglibs="c,cms,fmt" %>
<fmt:setLocale value="${cms.locale}" />
<fmt:bundle basename="es/gobcan/istac/metamac/messages">
<cms:formatter var="content" val="value">


<div>
    <div class="dataset-container">Cargando...</div>

    <script>
        <!-- @include ../resources/lazyload.js -->
    </script>

    <script>
        LazyLoad.css('<cms:link>/system/modules/es.gobcan.istac.metamac/resources/metamac.css</cms:link>', function () {
            LazyLoad.js('<cms:link>/system/modules/es.gobcan.istac.metamac/resources/metamac.js</cms:link>', function () {

                App.apiContext = "http://estadisticas.arte-consultores.com/metamac-statistical-resources-external-web/apis/statistical-resources/v1.0";
                var datasetIdentifier = {
                    type : "dataset",
                    agency : "ISTAC",
                    identifier : "C00031A_000002",
                    version : "001.000"
                };
                App.modules.dataset.DatasetApplication.start({datasetIdentifier : datasetIdentifier});

            });
        });
    </script>
</div>

</cms:formatter>
</fmt:bundle>