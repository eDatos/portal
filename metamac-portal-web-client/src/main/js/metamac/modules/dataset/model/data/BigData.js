(function () {
    "use strict";

    var ApiRequest = App.dataset.data.ApiRequest,
        Cache = App.dataset.data.BigDataCache;

    App.namespace("App.dataset.data.Data");

    App.dataset.data.BigData = function (options) {
        this.initialize(options);
    };

    App.dataset.data.BigData.prototype = {

        initialize: function (options) {
            this.metadata = options.metadata;
            this.filterDimensions = options.filterDimensions;

            this._updateAjaxManager(9); // neighbours
            this.onUpdateFilter();

            this._bindEvents();
        },

        _bindEvents: function () {
            if (this.filterDimensions != null) {
                this.filterDimensions.on('change:drawable change:zone', _.debounce(this.onUpdateFilter, 20, true), this);
            }
        },

        isAllSelectedDataLoaded: function () {
            var blocks = this.getCache().getAllCacheBlocks();

            var result = true;
            for (var i = 0; i < blocks.length; i++) {
                var block = blocks[i];
                if (!this.getCache().isBlockReady(block)) {
                    result = false;
                }
            }
            return result;
        },

        loadAllSelectedData: function () {
            this.singleRequest = true;
            var blocks = this.getCache().getAllCacheBlocks();
            var promises = _.map(blocks, this._loadCacheBlock, this);
            return $.when.apply($, promises);
        },

        onUpdateFilter: function () {
            this._invalidateCache();
        },

        _invalidateCache: function () {
            this.cache = undefined;
            this.singleRequest = undefined;
        },

        getCache: function () {
            if (!this.cache) {
                this.cache = new Cache(_.extend({}, this.filterDimensions.getTableInfo().getTableSize(), { size: this._calculateCacheSize() }));
                this._updateAjaxManager(this.getCache().getAllCacheBlocks().length);
            }
            return this.cache;
        },

        // We'll approximate a size for the cache based on the max length of the representation codes, 
        // because this is directly related to the API request that we´ll execute later
        // 
        // App.Constants.maxUrlQueryLength > cacheSize * maxRepresentationLength[1] + cacheSize * maxRepresentationLength[2]...
        // App.Constants.maxUrlQueryLength > cacheSize * (maxRepresentationLength[1] +  maxRepresentationLength[2]...)
        // cacheSize < App.Constants.maxUrlQueryLength / (maxRepresentationLength[1] +  maxRepresentationLength[2]...)
        _calculateCacheSize: function () {
            if (this.singleRequest) {
                return Infinity;
            }

            var availableQueryLength = App.Constants.maxUrlQueryLength;
            var summatoryRepresentationLengths = 0;
            this.filterDimensions.each(function (filterDimension) {
                var drawableRepresentations = filterDimension.get('representations').where({ drawable: true });
                if (!drawableRepresentations.length) { return; }
                var maxRepresentationLength = _.max(drawableRepresentations, function (representation) { return representation.id.length; }).id.length + 1;
                if (drawableRepresentations.length == 1) {
                    // If we only have one representation selected, we simply add it to the query
                    availableQueryLength -= maxRepresentationLength * 2;
                } else {
                    // Else, we add it to later divide for it
                    summatoryRepresentationLengths += maxRepresentationLength;
                }
            });

            if (availableQueryLength < 0) {
                console.warn("Too many dimensions");
                return;
            }

            if (!summatoryRepresentationLengths) {
                return; // Use default value
            }

            var cacheSize = Math.floor(availableQueryLength / summatoryRepresentationLengths) || 1;
            return cacheSize;
        },

        _updateAjaxManager: function (queueLimit) {
            if (!this.queueLimiteAjaxManager || this.queueLimiteAjaxManager < queueLimit) {
                this.queueLimiteAjaxManager = queueLimit;
            }
            this.ajaxManager = $.manageAjax.create('DataSourceDatasetCache', {
                queue: 'limit',
                cacheResponse: true,
                queueLimit: this.queueLimiteAjaxManager
            });
        },

        getData: function (selection) {
            var cell = selection.cell || this.filterDimensions.getTableInfo().getCellForCategoryIds(selection.ids);

            var cacheBlock = this.getCache().cacheBlockForCell(cell);
            if (this.getCache().isBlockReady(cacheBlock)) {
                var ids = this.filterDimensions.getTableInfo().getCategoryIdsForCell(cell);
                return cacheBlock.apiResponse.getDataById(ids).value;
            } else {
                this._loadCacheBlock(cacheBlock, true);
            }

            if (!this.singleRequest) {
                // load neighbours
                var neighbourCacheBlocks = this.getCache().neighbourCacheBlocks(cacheBlock);
                _.each(neighbourCacheBlocks, function (cacheBlock) {
                    this._loadCacheBlock(cacheBlock, true);
                }, this);
            }
        },

        getAttributes: function (selection) {
            var cell = selection.cell || this.filterDimensions.getTableInfo().getCellForCategoryIds(selection.ids);

            var self = this;
            return this.getCacheBlock(cell, function (cacheBlock) {
                var ids = self.filterDimensions.getTableInfo().getCategoryIdsForCell(cell);
                return cacheBlock.apiResponse.getDataById(ids).attributes;
            });
        },

        getDatasetAttributes: function () {
            return this.getRootCacheBlock(function (rootCacheBlock) {
                return rootCacheBlock.apiResponse.getDatasetAttributes();
            });
        },

        getDimensionAttributesById: function (dimensionsIds) {
            var cell = this.filterDimensions.getTableInfo().getCellForCategoryIds(dimensionsIds);
            return this.getCacheBlock(cell, function (cacheBlock) {
                return cacheBlock.apiResponse.getDimensionAttributesById(dimensionsIds);
            });
        },

        // Simplified access to root block
        getRootCacheBlock: function (callback) {
            var cell = { x: 0, y: 0 };
            return this.getCacheBlock(cell, callback);
        },

        getCacheBlock: function (cell, callback) {
            var cacheBlock = this.getCache().cacheBlockForCell(cell);
            if (this.getCache().isBlockReady(cacheBlock)) {
                return callback(cacheBlock);
            } else if (cacheBlock) {
                this._loadCacheBlock(cacheBlock, true);
            }
            if (!this.singleRequest) {
                if (cacheBlock) {
                    // load neighbours
                    var neighbourCacheBlocks = this.getCache().neighbourCacheBlocks(cacheBlock);
                    _.each(neighbourCacheBlocks, function (cacheBlock) {
                        this._loadCacheBlock(cacheBlock, true);
                    }, this);
                }
            }
        },

        getNumberData: function (selection) {
            var value = this.getData(selection);
            return App.dataset.data.NumberFormatter.strToNumber(value);
        },

        getStringData: function (selection) {
            var value = this.getData(selection);
            var ids = selection.ids || this.filterDimensions.getTableInfo().getCategoryIdsForCell(selection.cell);
            var decimals = this.metadata.decimalsForSelection(ids);
            return App.dataset.data.NumberFormatter.strNumberToLocalizedString(value, { decimals: decimals });
        },

        _getCategoryIdsForCacheBlock: function (cacheBlock) {
            var region = cacheBlock.getRegion();
            return this.filterDimensions.getTableInfo().getCategoryIdsForRegion(region);
        },

        _loadCacheBlock: function (cacheBlock, limitSimultaneousRequests) {
            var self = this;
            var result = new $.Deferred();
            if (!this.getCache().isBlockReady(cacheBlock)) {
                if (!cacheBlock.isFetching()) {
                    var dimensions = this._getCategoryIdsForCacheBlock(cacheBlock);
                    var apiRequestParams = { metadata: this.metadata, dimensions: dimensions, singleRequest: self.singleRequest };
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

    };

    _.extend(App.dataset.data.BigData.prototype, Backbone.Events);

}());