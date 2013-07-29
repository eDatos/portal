(function () {
    "use strict";

    var ApiRequest = App.dataset.data.ApiRequest;

    App.namespace("App.dataset.data.Data");

    App.dataset.data.Data = function (options) {
        this.metadata = options.metadata;
        this.filterOptions = options.filterOptions;
    };

    App.dataset.data.Data.prototype = {

        loadAllSelectedData : function () {
            var self = this;
            var deferred = new $.Deferred();

            if (!this.request) {
                this.request = new ApiRequest({metadata : this.metadata});
                this.request.fetch(function (apiResponse) {
                    self.apiResponse = apiResponse;
                    deferred.resolve();
                    self.trigger("hasNewData");
                });
            } else {
                deferred.resolve();
            }

            return deferred.promise();
        },

        //TODO deprecate method, will be removed soon
        updateFilterOptions : function () {

        },

        //TODO deprecate method, will be removed soon
        isAllSelectedDataLoaded : function () {
            return !_.isUndefined(this.apiResponse);
        },

        _getApiResponse : function () {
            if (this.apiResponse) {
                return this.apiResponse;
            } else {
                this.loadAllSelectedData();
            }
        },

        getDataById : function (ids) {
            var apiResponse = this._getApiResponse();
            if (apiResponse) {
                var decimals = this.metadata.decimalsForSelection(ids);
                var value = apiResponse.getDataById(ids).value;
                console.log(value, App.dataset.data.NumberFormatter.strNumberToLocalizedString(value, {decimals : decimals}));
                return App.dataset.data.NumberFormatter.strNumberToLocalizedString(value, {decimals : decimals});
            }
        },

        getNumberDataById : function (ids) {
            return App.dataset.data.NumberFormatter.strToNumber(this.getDataById(ids));
        },

        getDataByCell : function (cell) {
            var apiResponse = this._getApiResponse();

            if (apiResponse) {
                var ids = this.filterOptions.getCategoryIdsForCell(cell);
                return this.getDataById(ids);
            }
        }

    };

    _.extend(App.dataset.data.Data.prototype, Backbone.Events);

}());