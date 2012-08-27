(function () {
    "use strict";

    var ApiResponse = STAT4YOU.dataset.data.ApiResponse;

    STAT4YOU.namespace("STAT4YOU.dataset.data.ApiRequest");

    /**
     * Constructor
     * @param options.metadata
     * @param [options.dimensions]
     * @constructor
     */
    STAT4YOU.dataset.data.ApiRequest = function (options) {
        this.metadata = options.metadata;
        this.dimensions = options.dimensions;
        this.ajaxManager = options.ajaxManager;
    };

    STAT4YOU.dataset.data.ApiRequest.prototype = {

        url : function () {
            return STAT4YOU.apiContext + "/providers/" + this.metadata.getProvider() + "/datasets/" + this.metadata.getIdentifier();
        },

        queryParams : function () {
            var result = {};
            if(this.dimensions){
                //MOTIVOS_ESTANCIA:000|001|002:ISLAS_DESTINO_PRINCIPAL:005|006
                result.dim = _.map(this.dimensions,
                    function (dimension) {
                        return dimension.id + ":" + dimension.representations.join("|");
                    }).join(":");
            }
            result.fields = "-metadata";
            return result;
        },

        isFetching : function () {
            if(this.xhrId) {
                return this.ajaxManager.isFetching(this.xhrId);
            }
            return true;
        },

        fetch : function (callback) {
            var ajaxParams = {
                url : this.url(),
                data : this.queryParams(),
                success : function (response){
                    var apiResponse = new ApiResponse(response);
                    if(_.isFunction(callback)) {
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
