[#ftl]
[#include "../helpers/helpers-import.ftl"]
[@layoutPage.page]

    [#include "../includes/dataset.html"]

<div class="selection-container"></div>

<script>
    var main;

    var fetchOptions = {
        type : "${type}",
        agency : "${agency}",
        identifier : "${identifier}",
        version : "${version}"
    };

    App.dataset.Metadata.fetch(fetchOptions).then(function (metadata) {
        var filterDimensions = App.modules.dataset.filter.models.FilterDimensions.initializeWithMetadata(metadata);
        main = new App.modules.selection.SelectionView({el : '.selection-container', collection : filterDimensions});
        main.render();
    });

</script>

[/@layoutPage.page]