(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.modules.profile");

    var ProfileReadView = STAT4YOU.modules.profile.ProfileReadView;
    var ProfileUpdateView = STAT4YOU.modules.profile.ProfileUpdateView;

    STAT4YOU.modules.profile.ProfileRouter = Backbone.Router.extend({

        initialize : function (options) {
            this.readView = options.readView;
            this.updateView = options.updateView;
        },

        routes : {
            "newUser" : "newUser",
            "update" : "update",
            "" : "read"
        },

        newUser : function () {
            this.updateView.render({newUser : true});
        },

        update : function () {
            this.updateView.render();
        },

        read : function () {
            this.readView.render();
        }

    });

}());