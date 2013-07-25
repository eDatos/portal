(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.charts.Charts");

    STAT4YOU.charts.Charts = Backbone.Model.extend({
        url : STAT4YOU.apiContext + '/charts',

        fetchByQuery : function (query, limit, offset) {
            var data = {};
            data.query = query;

            if (limit) {
                data.limit = limit;
            }
            if (offset) {
                data.offset = offset;
            }

            return this.fetch(data);
        }

    });

}());