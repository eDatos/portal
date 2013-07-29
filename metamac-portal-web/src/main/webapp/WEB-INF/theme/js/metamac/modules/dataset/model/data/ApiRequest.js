(function () {
    "use strict";

    var ApiResponse = App.dataset.data.ApiResponse;

    App.namespace("App.dataset.data.ApiRequest");

    /**
     * Constructor
     * @param options.metadata
     * @param [options.dimensions]
     * @constructor
     */
    App.dataset.data.ApiRequest = function (options) {
        this.metadata = options.metadata;
        this.dimensions = options.dimensions;
        this.ajaxManager = options.ajaxManager;
    };

    App.dataset.data.ApiRequest.prototype = {

        url : function () {
            //return App.apiContext + "/datasets/" + this.metadata.getProvider() + "/" + this.metadata.getIdentifier() + "/001.000";
            return App.apiContext + "/datasets/ISTAC/" + this.metadata.getIdentifier() + "/001.000";
        },

        queryParams : function () {
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

        isFetching : function () {
            if (this.xhrId) {
                return this.ajaxManager.isFetching(this.xhrId);
            }
            return true;
        },

        fetch : function (callback) {
            var ajaxParams = {
                url : this.url(),
                data : this.queryParams(),
                success : function (response) {
                    var apiResponse = new ApiResponse(response);
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