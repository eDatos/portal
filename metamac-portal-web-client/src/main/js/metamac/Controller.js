(function () {
    "use strict";

    App.namespace('App.Controller');

    App.Controller = function (options) {
        this.initialize(options);
    };

    _.extend(App.Controller.prototype, {

        initialize : function (options) {

        }

    });

    App.Controller.extend = Backbone.Model.extend;
    _.extend(App.Controller.prototype, Backbone.Events);
}());