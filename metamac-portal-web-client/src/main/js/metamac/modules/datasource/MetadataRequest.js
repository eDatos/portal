(function () {
    "use strict";

    App.namespace("App.datasource.MetadataRequest");

    App.datasource.MetadataRequest = function (datasourceIdentifier) {
        this.initialize(datasourceIdentifier);
    };

    App.datasource.MetadataRequest.prototype = {

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
            return this.helper.getBaseUrl() + this.helper.buildUrlIdentifierPart(this.datasourceIdentifier.getIdentifier()) + this.helper.getParametersForMetadataUrl();
        },

        getMetadataResponse: function() {
            return new App.datasource.model.MetadataResponse({ datasourceIdentifier: this.datasourceIdentifier, datasourceHelper: this.helper, response: this.response});
        }

    };

}());