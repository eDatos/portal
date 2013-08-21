(function () {
    "use strict";

    App.namespace("App.mixins");

    App.mixins.PaginableCollection = {

        _extendFetchOptionsWithPagination : function (options) {
            options = options || {data : this.fetchData};
            var data = {
                limit : this.limit,
                offset : this.offset
            };

            if (options && options.data) {
                _.extend(data, options.data);
            } else {
                options.data = data;
            }

            var result = {
                data : data,
                traditional : true,
                remove : this.offset === 0,
                reset : this.offset === 0
            };

            return result;
        },

        _initializePagination : function () {
            this.limit = this.limit || 10;
            this.offset = this.offset || 0;
        },

        fetchCurrentPage : function (options) {
            this._initializePagination();
            var fetchOptions = this._extendFetchOptionsWithPagination(options);
            return this.fetch(fetchOptions);
        },

        fetchNextPage : function (options) {
            this._initializePagination();
            this.offset = this.offset + this.limit;
            return this.fetchCurrentPage(options);
        },

        hasMorePages : function () {
            this._initializePagination();
            return this.offset + this.limit < this.total;
        },

        parse : function (response) {
            this.total = response.total;
            return response.items;
        }

    };

}());