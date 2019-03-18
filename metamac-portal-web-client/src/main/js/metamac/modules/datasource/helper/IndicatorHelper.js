(function () {
    "use strict";

    App.namespace("App.datasource.helper.IndicatorHelper");

    App.datasource.helper.IndicatorHelper = function () {
    };

    App.datasource.helper.IndicatorHelper.prototype = {

        getBaseUrl: function () {
            return App.endpoints["indicators"];
        },

        buildUrlIdentifierPart: function (identifier) {
            return '/indicators/' + identifier.identifier;
        },

        typedMetadataResponseToMetadataResponse: function (response) {
            return App.datasource.helper.ApiIndicatorResponseToApiResponse.indicatorMetadataResponseToMetadataResponse(response);
        },

        getParametersForMetadataUrl: function () {
            return "";
        },

        getParametersForDataUrl: function() {
            return '/data';
        },

        typedApiResponseToApiResponse: function(response) {
            return App.datasource.helper.ApiIndicatorResponseToApiResponse.indicatorResponseToResponse(response);
        },

        typedResponseToObservations: function(response) {
            return App.datasource.helper.ApiIndicatorResponseToApiResponse.indicatorResponseToObservations(response);
        }

    };

}());