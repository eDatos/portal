(function () {
    "use strict";

    var ApiRequest = STAT4YOU.dataset.data.ApiRequest,
        Cache = STAT4YOU.dataset.data.BigDataCache;

    STAT4YOU.namespace("STAT4YOU.dataset.data.Data");

    STAT4YOU.dataset.data.BigData = function (options) {
        this.metadata = options.metadata;
        this.filterOptions = options.filterOptions;
        this._initializeAjaxManager();
        this.updateFilterOptions();
    };


    STAT4YOU.dataset.data.BigData.prototype = {

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

        getDataById : function (ids) {
            var cell = this.filterOptions.getCellForCategoryIds(ids);
            return this.getDataByCell(cell);
        },

        getNumberDataById : function (ids) {
            return STAT4YOU.dataset.data.NumberFormatter.strToNumber(this.getDataById(ids));
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
        },

        getDataByCell : function (cell) {
            var value;

            var cacheBlock = this.cache.cacheBlockForCell(cell);
            if (this.cache.isBlockReady(cacheBlock)) {
                var ids = this.filterOptions.getCategoryIdsForCell(cell);
                value = cacheBlock.apiResponse.getDataById(ids).value;
            } else {
                this._loadCacheBlock(cacheBlock, true);
            }

            // load neighbours
            var neighbourCacheBlocks = this.cache.neighbourCacheBlocks(cacheBlock);
            _.each(neighbourCacheBlocks, function (cacheBlock) {
                this._loadCacheBlock(cacheBlock, true);
            }, this);

            return value;
        }

    };

    _.extend(STAT4YOU.dataset.data.BigData.prototype, Backbone.Events);

}());