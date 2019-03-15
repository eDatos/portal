(function () {
    "use strict";

    App.namespace("App.datasource.helper.DatasourceHelperFactory");

    var HELPERS = {
        "dataset": new App.datasource.helper.DatasetHelper(),
        "query": new App.datasource.helper.QueryHelper(),
        "indicator": new App.datasource.helper.IndicatorHelper(),
        "indicatorInstance": new App.datasource.helper.IndicatorSystemHelper()
    };

    App.datasource.helper.DatasourceHelperFactory = {
        
        getHelper: function (type) {
            return HELPERS[type];
        }

    };

}());