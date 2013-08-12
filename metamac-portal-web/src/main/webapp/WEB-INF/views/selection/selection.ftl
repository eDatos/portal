[#ftl]
[#include "../helpers/helpers-import.ftl"]
[@layoutPage.page]

    [#include "../includes/dataset.html"]

<div class="selection-container"></div>

<script>
    var main;

    var datasetIds = {
        type : "${type}",
        agency : "${agency}",
        identifier : "${identifier}",
        version : "${version}"
    };

    var metadata = new App.dataset.Metadata(datasetIds);
    metadata.fetch().then(function () {
        var filterDimensions = App.modules.dataset.filter.models.FilterDimensions.initializeWithMetadata(metadata);
        main = new App.modules.selection.SelectionView({el : '.selection-container', collection : filterDimensions, metadata : metadata});
        main.render();
    });

</script>

[/@layoutPage.page]