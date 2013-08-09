[#ftl]
[#include "../helpers/helpers-import.ftl"]
[@layoutPage.page]

[#include "../includes/dataset.html"]

<div id="dataset-container"></div>
<script>
    var main;

    var fetchOptions = {
        type : "${type}",
        agency : "${agency}",
        identifier : "${identifier}",
        version : "${version}"
    };

    App.dataset.Metadata.fetch(fetchOptions).then(function (metadata) {
        var attributes = {};
        main = new App.modules.dataset.Main({el : '#dataset-container', metadata : metadata, attributes : attributes});
    });
</script>

[/@layoutPage.page]