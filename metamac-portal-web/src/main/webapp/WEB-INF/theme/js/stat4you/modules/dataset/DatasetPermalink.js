(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.modules.dataset.DatasetPermalink");

    STAT4YOU.modules.dataset.DatasetPermalink = Backbone.Model.extend({
        idAttribute : 'identifier',
        urlRoot : STAT4YOU.context + '/api/v1.0/permalinks'
    });

}());
