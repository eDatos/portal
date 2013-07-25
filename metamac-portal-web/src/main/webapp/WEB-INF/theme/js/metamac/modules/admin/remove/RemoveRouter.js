(function () {
    "use strict";

    App.namespace("App.admin.remove");

    App.admin.remove.RemoveRouter = Backbone.Router.extend({

        initialize : function (options) {
            this.el = options.el;

            this.model = new App.admin.remove.RemoveStateModel({limit : 50});
            this.view = new App.admin.remove.RemoveView({ el : this.el, deleteFormModel : this.model });
        },

        routes : {
            "" : "defaultRoute"
        },

        defaultRoute : function () {
            this.view.render();
        }

    });

}());