(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.admin.remove");

    STAT4YOU.admin.remove.RemoveRouter = Backbone.Router.extend({

        initialize : function (options) {
            this.el = options.el;

            this.model = new STAT4YOU.admin.remove.RemoveStateModel({limit : 50});
            this.view = new STAT4YOU.admin.remove.RemoveView({ el : this.el, deleteFormModel : this.model });
        },

        routes : {
            "" : "defaultRoute"
        },

        defaultRoute : function () {
            this.view.render();
        }

    });

}());