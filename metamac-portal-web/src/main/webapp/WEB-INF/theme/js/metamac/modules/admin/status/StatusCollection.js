(function () {
    "use strict";
    App.namespace("App.modules.admin.status");

    App.modules.admin.status.StatusCollection = Backbone.Collection.extend({

        model : App.modules.admin.status.StatusModel,

        url : App.context + "/app/admin/status"

    });

}());