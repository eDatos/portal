(function () {
    "use strict";

    App.namespace("App.datasource.DataRequest");

    App.datasource.DataRequest = function (datasourceIdentifier) {
        this.initialize(datasourceIdentifier);
    };

    App.datasource.DataRequest.prototype = {

        initialize : function (datasourceIdentifier) {
            this.datasourceIdentifier = datasourceIdentifier;

            var helperFactory = new App.datasource.helper.HelperFactory();
            this.helper = helperFactory.getHelper(this.datasourceIdentifier.getIdentifier().type);
        },

        fetch: function (callback) {
            var self = this;
            $.ajax({
                url: self._url(),
                dataType: 'jsonp',
                jsonp: "_callback"
            }).success(function (response) {
                self.response = response;
                callback(null, "done")
            });
        },

        _url: function() {
            return this.helper.getBaseUrl() + this.helper.buildUrlIdentifierPart(this.datasourceIdentifier.getIdentifier()) + this.helper.getParametersForDataUrl();
        },

        getDataResponse: function(metadata, filterDimensions) {
            return new App.dataset.data.ApiResponse(this.response, metadata, this.helper, filterDimensions);
        }

    };

}());