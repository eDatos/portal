(function () {
    "use strict";

    App.namespace("App.charts.Charts");

    App.charts.Charts = Backbone.Model.extend({
        url : App.apiContext + '/charts',

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