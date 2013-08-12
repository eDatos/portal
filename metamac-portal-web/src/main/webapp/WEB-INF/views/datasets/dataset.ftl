[#ftl]
[#include "../helpers/helpers-import.ftl"]
[@layoutPage.page]

    [#include "../includes/dataset.html"]

<div id="dataset-container"></div>
<script>
    var main;

    var datasetIdentifier = {
        type : "${type}",
        agency : "${agency}",
        identifier : "${identifier}",
        version : "${version}"
    };

    var metadata = new App.dataset.Metadata(datasetIdentifier);
    metadata.fetch().then(function () {
        var attributes = {};
        main = new App.modules.dataset.Main({el : '#dataset-container', metadata : metadata, attributes : attributes});
    });

</script>

[/@layoutPage.page]