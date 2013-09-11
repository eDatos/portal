(function () {
    "use strict";

    App.namespace("App.modules.profile");

    var ProfileReadView = App.modules.profile.ProfileReadView;
    var ProfileUpdateView = App.modules.profile.ProfileUpdateView;

    App.modules.profile.ProfileRouter = Backbone.Router.extend({

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