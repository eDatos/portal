(function () {
    "use strict";

    App.namespace("App.datasource.helper.IndicatorSystemHelper");

    App.datasource.helper.IndicatorSystemHelper = function () {
    };

    App.datasource.helper.IndicatorSystemHelper.prototype = {

        getBaseUrl: function () {
            return App.endpoints["indicators"];
        },

        buildUrlIdentifierPart: function (identifier) {
            return '/indicatorsSystems/' + identifier.indicatorSystem + '/indicatorsInstances/' + identifier.identifier;
        },

        typedMetadataResponseToMetadataResponse: function (response) {
            return App.dataset.data.ApiIndicatorResponseToApiResponse.indicatorMetadataResponseToMetadataResponse(response);
        },

        getParametersForMetadataUrl: function () {
            return "";
        },

        getParametersForDataUrl: function() {
            return '/data';
        },

        typedApiResponseToApiResponse: function(response) {
            return App.dataset.data.ApiIndicatorResponseToApiResponse.indicatorResponseToResponse(response);
        },

        typedResponseToObservations: function(response) {
            return App.dataset.data.ApiIndicatorResponseToApiResponse.indicatorResponseToObservations(response);
        }

    };

}());