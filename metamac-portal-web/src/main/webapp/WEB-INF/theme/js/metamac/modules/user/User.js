(function () {
    "use strict";

    App.namespace("App.modules.user.User");

    var Favourites = App.modules.user.Favourites;

    App.modules.user.User = Backbone.Model.extend({

        urlRoot : App.context + "/api/v1.0/users/",

        idAttribute : 'identifier',

        initialize : function() {
            this.favourites = new Favourites([],{user : this});
        }

    });

}());
