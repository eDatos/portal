(function () {
    "use strict";

    App.namespace("App.charts.Chart");

    App.charts.Chart = Backbone.Model.extend({
        urlRoot : App.apiContext + '/charts',

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