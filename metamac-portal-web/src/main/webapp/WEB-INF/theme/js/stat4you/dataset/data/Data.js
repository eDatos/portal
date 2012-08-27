(function () {
    "use strict";

    var ApiRequest = STAT4YOU.dataset.data.ApiRequest;

    STAT4YOU.namespace("STAT4YOU.dataset.data.Data");

    STAT4YOU.dataset.data.Data = function (options) {
        this.metadata = options.metadata;
        this.filterOptions = options.filterOptions;
    };

    STAT4YOU.dataset.data.Data.prototype = {

        isAllSelectedDataLoaded : function () {
            return !_.isUndefined(this.apiResponse);
        },

        loadAllSelectedData : function () {
            var self = this;

            if(!this.request) {
                this.request = new ApiRequest({metadata : this.metadata});
                this.request.fetch(function (apiResponse) {
                    self.apiResponse = apiResponse;
                    self.trigger("hasNewData");
                });
            }
        },

        updateFilterOptions : function () {
            //noOp
        },

        _getApiResponse : function () {
            if(this.apiResponse){
                return this.apiResponse;
            }else{
                this.loadAllSelectedData();
            }
        },

        getDataById : function (ids) {
            var apiResponse = this._getApiResponse();
            if(apiResponse){
                return apiResponse.getDataById(ids).value;
            }
        },

        getDataByCell : function (cell) {
            var apiResponse = this._getApiResponse();
            if(apiResponse){
                var ids = this.filterOptions.getCategoryIdsForCell(cell);
                return this.getDataById(ids);
            }
        }


    };

    _.extend(STAT4YOU.dataset.data.Data.prototype, Backbone.Events);

}());