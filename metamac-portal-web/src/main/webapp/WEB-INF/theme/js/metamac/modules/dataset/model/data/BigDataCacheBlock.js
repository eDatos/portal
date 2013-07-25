(function () {
    "use strict";

    App.namespace("App.dataset.data.BigDataCacheBlock");

    App.dataset.data.BigDataCacheBlock = function (options) {
        this.index = options.index;
        this.origin = options.origin;
        this.size = options.size;
    };

    App.dataset.data.BigDataCacheBlock.prototype = {

        isFetching : function () {
            return !_.isUndefined(this.apiRequest)
                && _.isUndefined(this.apiResponse)
                && this.apiRequest.isFetching();
        },

        isReady : function () {
            return !_.isUndefined(this.apiRequest)
                && !_.isUndefined(this.apiResponse);
        },

        getRegion : function () {
            return {
                left : {
                    begin : this.origin.x,
                    end : this.origin.x + this.size.width
                },
                top : {
                    begin : this.origin.y,
                    end : this.origin.y + this.size.height
                }
            };
        },

        clearData : function () {
            this.apiRequest = undefined;
            this.apiResponse = undefined;
        }
    };

}());
