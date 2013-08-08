(function () {
    "use strict";

    var ApiRequest = App.dataset.data.ApiRequest;

    App.namespace("App.dataset.data.Data");

    App.dataset.data.Data = function (options) {
        this.metadata = options.metadata;
        this.filterDimensions = options.filterDimensions;
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

        _idsFromSelection : function (selection) {
            return selection.ids || this.filterDimensions.getTableInfo().getCategoryIdsForCell(selection.cell);
        },

        /**
         * @param selection.ids
         * @param selection.cell
         */
        getData : function (selection) {
            var apiResponse = this._getApiResponse();
            if (apiResponse) {
                var ids = this._idsFromSelection(selection);
                return apiResponse.getDataById(ids).value;
            }
        },

        getNumberData : function (selection) {
            var value = this.getData(selection);
            return App.dataset.data.NumberFormatter.strToNumber(value);
        },

        getStringData : function (selection) {
            var value = this.getData(selection);
            var decimals = this.metadata.decimalsForSelection(this._idsFromSelection(selection));
            return App.dataset.data.NumberFormatter.strNumberToLocalizedString(value, {decimals : decimals});
        }

    };

    _.extend(App.dataset.data.Data.prototype, Backbone.Events);

}());