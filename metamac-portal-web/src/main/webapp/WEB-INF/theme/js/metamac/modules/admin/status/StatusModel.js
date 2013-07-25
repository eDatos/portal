(function () {
    "use strict";
    App.namespace("App.modules.admin.status");

    App.modules.admin.status.StatusModel = Backbone.Model.extend({

        idAttribute : "name",

        parse : function (response) {
            response.fireDate = new Date(response.fireDate);
            return response;
        }

    });

}());