(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.modules.datasets.Datasets");

    STAT4YOU.modules.datasets.Datasets = Backbone.Collection.extend({
        model : STAT4YOU.modules.datasets.Dataset,

        url : function () {
            return STAT4YOU.apiContext + "/datasets";
        }

    });

    STAT4YOU.modules.datasets.Datasets.datasetsFromProvider = function (provider) {
        var datasets = new STAT4YOU.modules.datasets.Datasets();
        datasets.fetchData = {query : "ff_ds_prov_acronym='" + provider + "'", faceted : false, mostRecent : true};
        return datasets;
    };

    _.extend(STAT4YOU.modules.datasets.Datasets.prototype, STAT4YOU.mixins.PaginableCollection);

}());
