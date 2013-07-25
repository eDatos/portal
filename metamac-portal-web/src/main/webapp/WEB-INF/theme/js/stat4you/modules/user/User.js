(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.modules.user.User");

    var Favourites = STAT4YOU.modules.user.Favourites;

    STAT4YOU.modules.user.User = Backbone.Model.extend({

        urlRoot : STAT4YOU.context + "/api/v1.0/users/",

        idAttribute : 'identifier',

        initialize : function() {
            this.favourites = new Favourites([],{user : this});
        }

    });

}());
