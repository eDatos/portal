(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.modules.navbar.UserModel");

    STAT4YOU.modules.navbar.UserModel = Backbone.Model.extend({
        urlRoot : STAT4YOU.context + "/apis/users/v1.0/users/",
        idAttribute : 'identifier'
    });

}());
