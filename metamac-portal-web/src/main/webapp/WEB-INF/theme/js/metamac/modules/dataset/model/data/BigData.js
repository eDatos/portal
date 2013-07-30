(function () {
    "use strict";

    var ApiRequest = App.dataset.data.ApiRequest,
        Cache = App.dataset.data.BigDataCache;

    App.namespace("App.dataset.data.Data");

    App.dataset.data.BigData = function (options) {
        this.metadata = options.metadata;
        this.filterOptions = options.filterOptions;
        this._initializeAjaxManager();
        this.updateFilterOptions();
    };

    App.dataset.data.BigData.prototype = {

        isAllSelectedDataLoaded : function () {
            var blocks = this.cache.getAllCacheBlocks();

            var result = true;
            for (var i = 0; i < blocks.length; i++) {
                var block = blocks[i];
                if (!this.cache.isBlockReady(block)) {
                    result = false;
                }
            }
            return result;
        },

        loadAllSelectedData : function () {
            var self = this;
            var blocks = this.cache.getAllCacheBlocks();
            var promises = _.map(blocks, this._loadCacheBlock, this);
            return $.when.apply($, promises);
        },

        updateFilterOptions : function () {
            this._initializeCache();
        },

        _initializeCache : function () {
            this.cache = new Cache(this.filterOptions.getTableSize());
        },

        _initializeAjaxManager : function () {
            this.ajaxManager = $.manageAjax.create('DataSourceDatasetCache', {
                queue : 'limit',
                cacheResponse : true,
                queueLimit : 9 // neighbours
            });
        },

        getData : function (selection) {
            var cell = selection.cell || this.filterOptions.getCellForCategoryIds(selection.ids);

            var cacheBlock = this.cache.cacheBlockForCell(cell);
            if (this.cache.isBlockReady(cacheBlock)) {
                var ids = this.filterOptions.getCategoryIdsForCell(cell);
                return cacheBlock.apiResponse.getDataById(ids).value;
            } else {
                this._loadCacheBlock(cacheBlock, true);
            }

            // load neighbours
            var neighbourCacheBlocks = this.cache.neighbourCacheBlocks(cacheBlock);
            _.each(neighbourCacheBlocks, function (cacheBlock) {
                this._loadCacheBlock(cacheBlock, true);
            }, this);
        },

        getNumberData : function (selection) {
            var value = this.getData(selection);
            return App.dataset.data.NumberFormatter.strToNumber(value);
        },

        getStringData : function (selection) {
            var value = this.getData(selection);
            var ids = selection.ids || this.filterOptions.getCategoryIdsForCell(selection.cell);
            var decimals = this.metadata.decimalsForSelection(ids);
            return App.dataset.data.NumberFormatter.strNumberToLocalizedString(value, {decimals : decimals});
        },

        _getCategoryIdsForCacheBlock : function (cacheBlock) {
            var region = cacheBlock.getRegion();
            return this.filterOptions.getCategoryIdsForRegion(region);
        },

        _loadCacheBlock : function (cacheBlock, limitSimultaneousRequests) {
            var self = this;
            var result = new $.Deferred();
            if (!this.cache.isBlockReady(cacheBlock)) {
                if (!cacheBlock.isFetching()) {
                    var dimensions = this._getCategoryIdsForCacheBlock(cacheBlock);
                    var apiRequestParams = {metadata : this.metadata, dimensions : dimensions};
                    if (limitSimultaneousRequests) {
                        apiRequestParams.ajaxManager = this.ajaxManager;
                    }
                    cacheBlock.apiRequest = new ApiRequest(apiRequestParams);
                    cacheBlock.apiRequest.fetch(function (apiResponse) {
                        cacheBlock.apiResponse = apiResponse;
                        self.trigger("hasNewData");
                        result.resolve();
                    });
                }
            } else {
                result.resolve();
            }

            return result.promise();
        }

    };

    _.extend(App.dataset.data.BigData.prototype, Backbone.Events);

}());