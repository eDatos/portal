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


    App.modules.dataset.DatasetApplication.start({datasetIdentifier : datasetIdentifier});

</script>

[/@layoutPage.page]