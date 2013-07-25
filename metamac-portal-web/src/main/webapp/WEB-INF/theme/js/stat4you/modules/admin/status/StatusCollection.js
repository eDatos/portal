(function () {
    "use strict";
    STAT4YOU.namespace("STAT4YOU.modules.admin.status");

    STAT4YOU.modules.admin.status.StatusCollection = Backbone.Collection.extend({

        model : STAT4YOU.modules.admin.status.StatusModel,

        url : STAT4YOU.context + "/app/admin/status"

    });

}());