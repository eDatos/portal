(function () {
    "use strict";

    App.namespace('App.modules.error.ErrorView');

    App.modules.error.ErrorView = Backbone.Marionette.ItemView.extend({

        templates : {
            "404" : "error/404",
            "500" : "error/500",
            "default" : "error/500"
        },

        initialize : function (options) {
            options || (options = {});
            var errorCode = options.errorCode;
            var existsTemplate = (errorCode && this.templates[errorCode]);
            var templateName = existsTemplate ? errorCode : "default";
            this.template = this.templates[templateName];
        }


    });

}());