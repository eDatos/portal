(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.modules.datasets.Dataset");

    STAT4YOU.modules.datasets.Dataset = Backbone.Model.extend({
        idAttribute : 'uri',

        url : function () {
            return STAT4YOU.apiContext + "/datasets/" + this.get('providerAcronym') + "-" + this.get("identifier");
        }

    });

}());
