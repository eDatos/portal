(function () {
    "use strict";

    var ApiResponse = App.dataset.data.ApiResponse;

    App.namespace("App.dataset.data.ApiIndicatorRequest");

    /**
     * Constructor
     * @param options.metadata
     * @param [options.dimensions]
     * @constructor
     */
    App.dataset.data.ApiIndicatorRequest = function (options) {
        this.metadata = options.metadata;
        this.dimensions = options.dimensions;
        this.ajaxManager = options.ajaxManager;
    };

    App.dataset.data.ApiIndicatorRequest.prototype = {

        url: function () {
            return App.endpoints["indicators"] + this.metadata.urlIdentifierPart() + '/' + 'data';
        },

        queryParams: function () {
            var result = {};
            if (this.dimensions) {
                result.representation = _.map(this.dimensions,
                    function (dimension) {
                        return dimension.id + "[" + dimension.representations.join("|") + "]";
                    }).join(",");
            }
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
                    var apiResponse = new ApiResponse(response, metadata, App.Constants.api.type.INDICATOR);
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