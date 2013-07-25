(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.charts.Chart");

    STAT4YOU.charts.Chart = Backbone.Model.extend({
        urlRoot : STAT4YOU.apiContext + '/charts',

        fetchByQuery : function (query, limit, offset) {
            var data = {};
            data.query = query;

            if (limit) {
                data.limit = limit;
            }
            if (offset) {
                data.offset = offset;
            }

            this.fetch(data);
        }


    });

}());