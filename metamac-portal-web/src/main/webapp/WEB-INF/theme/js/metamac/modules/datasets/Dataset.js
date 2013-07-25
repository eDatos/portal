(function () {
    "use strict";

    App.namespace("App.modules.datasets.Dataset");

    App.modules.datasets.Dataset = Backbone.Model.extend({
        idAttribute : 'uri',

        url : function () {
            return App.apiContext + "/datasets/" + this.get('providerAcronym') + "-" + this.get("identifier");
        }

    });

}());
