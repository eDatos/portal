(function () {
    "use strict";

    App.namespace('App.modules.error.ErrorController');

    App.modules.error.ErrorController = App.Controller.extend({

        initialize : function (options) {
            this.region = options.region;
        },

        showError : function (options) {
            var errorView = new App.modules.error.ErrorView(options);
            this.region.show(errorView);
        }

    });

}());