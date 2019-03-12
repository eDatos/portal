(function () {
    "use strict";

    App.namespace("App.datasource.helper.HelperFactory");

    App.datasource.helper.HelperFactory = function () {
        this.helpers = {
            "dataset": new App.datasource.helper.DatasetHelper(),
            "query": new App.datasource.helper.QueryHelper(),
            "indicator": new App.datasource.helper.IndicatorHelper(),
            "indicatorInstance": new App.datasource.helper.IndicatorSystemHelper()
        };
    };

    App.datasource.helper.HelperFactory.prototype = {
        
        getHelper: function (type) {
            return this.helpers[type];
        }

    };

}());