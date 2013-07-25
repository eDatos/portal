(function () {
    "use strict";

    App.namespace("App.modules.datasets.Datasets");

    App.modules.datasets.Datasets = Backbone.Collection.extend({
        model : App.modules.datasets.Dataset,

        url : function () {
            return App.apiContext + "/datasets";
        }

    });

    App.modules.datasets.Datasets.datasetsFromProvider = function (provider) {
        var datasets = new App.modules.datasets.Datasets();
        datasets.fetchData = {query : "ff_ds_prov_acronym='" + provider + "'", faceted : false, mostRecent : true};
        return datasets;
    };

    _.extend(App.modules.datasets.Datasets.prototype, App.mixins.PaginableCollection);

}());
