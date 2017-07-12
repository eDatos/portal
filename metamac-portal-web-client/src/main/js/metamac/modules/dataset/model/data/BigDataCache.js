(function () {
    "use strict";

    App.namespace("App.dataset.data.BigDataCache");

    var BigDataCacheBlock = App.dataset.data.BigDataCacheBlock;

    App.dataset.data.BigDataCache = function (options) {
        // This rows = 1, columns = 1 is a workaround to allow petitions to the Api even when the dimensions are misconstructed, to be able to get other data from the request
        this.rows = options.rows ? options.rows : 1;
        this.columns = options.columns ? options.columns : 1;
        this.size = options.size || 30;
        this.capacity = options.capacity || 50;

        this.simultaneousRequests = options.simultaneousRequests || 9;

        this.lru = new LRUCache(this.capacity);

        this.ajaxManager = $.manageAjax.create('dataset.data.BigDataCache', {
            queue: 'limit',
            cacheResponse: true,
            queueLimit: 9
        });

        this.initialize();
    };

    App.dataset.data.BigDataCache.prototype = {

        // Initialize de cache matrix
        initialize: function () {
            this.initializeCacheBlockSize();
            this.cacheSize = {};
            this.cacheSize.rows = Math.ceil(this.rows / this.cacheBlockSize.rows);
            this.cacheSize.columns = Math.ceil(this.columns / this.cacheBlockSize.columns);

            this.cache = new Array(this.cacheSize.rows);
            for (var i = 0; i < this.cacheSize.rows; i++) {
                this.cache[i] = new Array(this.cacheSize.columns);
                for (var j = 0; j < this.cacheSize.columns; j++) {
                    this._initializeCacheBlock(i, j);
                }
            }
        },

        _initializeCacheBlock: function (i, j) {
            var options = {};
            options.index = { x: j, y: i };
            options.origin = { x: j * this.cacheBlockSize.columns, y: i * this.cacheBlockSize.rows };
            options.size = { width: this.cacheBlockSize.columns, height: this.cacheBlockSize.rows };
            this.cache[i][j] = new BigDataCacheBlock(options);
        },

        initializeCacheBlockSize: function () {
            this.cacheBlockSize = {};
            if (this.rows > this.size && this.columns > this.size) {
                this.cacheBlockSize.rows = this.size;
                this.cacheBlockSize.columns = this.size;
            } else if (this.rows > this.size) {
                this.cacheBlockSize.rows = Math.ceil(this.size * this.size / this.columns);
                this.cacheBlockSize.columns = this.columns;

                if (this.cacheBlockSize.rows > this.rows) {
                    this.cacheBlockSize.rows = this.rows;
                }
            } else if (this.columns > this.size) {
                this.cacheBlockSize.rows = this.rows;
                this.cacheBlockSize.columns = Math.ceil(this.size * this.size / this.rows);

                if (this.cacheBlockSize.columns > this.columns) {
                    this.cacheBlockSize.columns = this.columns;
                }
            } else {
                this.cacheBlockSize.rows = this.rows;
                this.cacheBlockSize.columns = this.columns;
            }
        },

        _cacheIndexForCell: function (cell) {
            return {
                x: Math.floor(cell.x / this.cacheBlockSize.columns),
                y: Math.floor(cell.y / this.cacheBlockSize.rows)
            };
        },

        // Retrieve a cacheBlock by a Cell
        cacheBlockForCell: function (cell) {
            var cacheIndex = this._cacheIndexForCell(cell);
            return this._cacheBlockForIndex(cacheIndex);
        },

        _blockKeyForLru: function (cacheBlock) {
            return cacheBlock.index.x + "#" + cacheBlock.index.y;
        },

        _updateLRU: function (cacheBlock) {
            var lruKey = this._blockKeyForLru(cacheBlock);

            var current = this.lru.get(lruKey);
            if (!current) {
                var removed = this.lru.put(lruKey, cacheBlock);
                if (removed) {
                    this.cache[removed.value.index.y][removed.value.index.x].clearData();
                }
            }
        },

        // Retrieve a cacheBlock by cacheIndex.
        // The cacheBlock returned is always initialized with index and origin
        _cacheBlockForIndex: function (cacheIndex) {
            if (cacheIndex.x >= 0 && cacheIndex.x < this.cacheSize.columns &&
                cacheIndex.y >= 0 && cacheIndex.y < this.cacheSize.rows) {

                var cacheBlock = this.cache[cacheIndex.y][cacheIndex.x];
                if (!cacheBlock) {
                    var options = {};
                    options.index = { x: cacheIndex.x, y: cacheIndex.y };
                    options.origin = { x: cacheIndex.x * this.cacheBlockSize.columns, y: cacheIndex.y * this.cacheBlockSize.rows };
                    options.size = { width: this.cacheBlockSize.columns, height: this.cacheBlockSize.rows };
                    cacheBlock = this.cache[cacheIndex.y][cacheIndex.x] = new BigDataCacheBlock(options);
                }

                this._updateLRU(cacheBlock);
                return cacheBlock;
            }
        },

        neighbourCacheBlocks: function (block) {
            var result = [];

            result.push(this._cacheBlockForIndex({ x: block.index.x, y: block.index.y - 1 }));
            result.push(this._cacheBlockForIndex({ x: block.index.x + 1, y: block.index.y - 1 }));
            result.push(this._cacheBlockForIndex({ x: block.index.x + 1, y: block.index.y }));
            result.push(this._cacheBlockForIndex({ x: block.index.x + 1, y: block.index.y + 1 }));
            result.push(this._cacheBlockForIndex({ x: block.index.x, y: block.index.y + 1 }));
            result.push(this._cacheBlockForIndex({ x: block.index.x - 1, y: block.index.y + 1 }));
            result.push(this._cacheBlockForIndex({ x: block.index.x - 1, y: block.index.y }));
            result.push(this._cacheBlockForIndex({ x: block.index.x - 1, y: block.index.y - 1 }));

            return _.compact(result);
        },

        getAllCacheBlocks: function () {
            return _.flatten(this.cache, true);
        },

        isBlockReady: function (cacheBlock) {
            if (_.isUndefined(cacheBlock)) {
                return false;
            }
            return cacheBlock.isReady();
        }
    };

}());
