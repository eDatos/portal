(function () {
    "use strict";
    STAT4YOU.namespace("STAT4YOU.modules.admin.status");

    STAT4YOU.modules.admin.status.StatusModel = Backbone.Model.extend({

        idAttribute : "name",

        parse : function (response) {
            response.fireDate = new Date(response.fireDate);
            return response;
        }

    });

}());