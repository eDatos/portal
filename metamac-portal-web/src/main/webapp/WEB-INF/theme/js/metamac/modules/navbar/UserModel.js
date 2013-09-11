(function () {
    "use strict";

    App.namespace("App.modules.navbar.UserModel");

    App.modules.navbar.UserModel = Backbone.Model.extend({
        urlRoot : App.context + "/apis/users/v1.0/users/",
        idAttribute : 'identifier'
    });

}());
