[#ftl]
[#include "../helpers/helpers-import.ftl"]
[@layoutPage.page]

[#include "../includes/dataset.html"]

<div id="dataset-container"></div>
<script>
    var main;

    var fetchOptions = {
        agency : "${agency}",
        identifier : "${identifier}",
        version : "${version}"
    };

    App.dataset.Metadata.fetch(fetchOptions).then(function (metadata) {
        var attributes = {};
        main = new App.modules.dataset.Main({el : '#dataset-container', metadata : metadata, attributes : attributes});
    });
</script>

<script type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js#pubid=ra-501fc6f600bacbe9"></script>

[/@layoutPage.page]