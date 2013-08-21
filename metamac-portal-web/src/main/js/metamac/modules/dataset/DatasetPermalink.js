(function () {
    "use strict";

    App.namespace("App.modules.dataset.DatasetPermalink");

    App.modules.dataset.DatasetPermalink = Backbone.Model.extend({
        idAttribute : 'identifier',
        urlRoot : App.context + '/api/v1.0/permalinks'
    });

}());
