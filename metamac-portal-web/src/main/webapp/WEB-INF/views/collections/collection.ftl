[#ftl]
[#include "../helpers/helpers-import.ftl"]
[@layoutPage.page]

    [#include "../includes/collection.html"]

<div class="collection-container"></div>
<script>
    var main;

    var attributes = {
        agency : "${agency}",
        identifier : "${identifier}",
        version : "${version}"
    };

    var collection = new App.modules.collection.Collection(attributes);
    collection.fetch().then(function () {
        var collectionView = new App.modules.collection.CollectionView({model : collection, el : '.collection-container'});
        collectionView.render();
    });

</script>

[/@layoutPage.page]