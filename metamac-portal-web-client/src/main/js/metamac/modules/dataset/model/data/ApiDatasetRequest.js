(function () {
    "use strict";

    var ApiResponse = App.dataset.data.ApiResponse;

    App.namespace("App.dataset.data.ApiDatasetRequest");

    /**
     * Constructor
     * @param options.metadata
     * @param [options.dimensions]
     * @constructor
     */
    App.dataset.data.ApiDatasetRequest = function (options) {
        this.metadata = options.metadata;
        this.dimensions = options.dimensions;
        this.ajaxManager = options.ajaxManager;
    };

    App.dataset.data.ApiDatasetRequest.prototype = {

        url: function () {
            return App.endpoints["statistical-resources"] + this.metadata.urlIdentifierPart() + '.json';
        },

        queryParams: function () {
            var result = {};
            if (this.dimensions) {
                //MOTIVOS_ESTANCIA:000|001|002:ISLAS_DESTINO_PRINCIPAL:005|006
                result.dim = _.map(this.dimensions,
                    function (dimension) {
                        return dimension.id + ":" + dimension.representations.join("|");
                    }).join(":");
            }
            result.fields = "-metadata";
            result._type = "json";
            return result;
        },

        fetch: function (callback) {
            var metadata = this.metadata;
            var ajaxParams = {
                url: this.url(),
                dataType: 'jsonp',
                jsonp: '_callback',
                data: this.queryParams(),
                success: function (response) {
                    var apiResponse = new ApiResponse(response, metadata, App.Constants.api.type.dataset);
                    if (_.isFunction(callback)) {
                        callback(apiResponse);
                    }
                }
            };

            var result;
            if (this.ajaxManager) {
                this.xhrId = result = this.ajaxManager.add(ajaxParams);
            } else {
                result = $.ajax(ajaxParams);
            }
            return result;
        }

    };


}());