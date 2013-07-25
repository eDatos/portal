(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.modules.search.SearchResultsCollection");

    STAT4YOU.modules.search.SearchResultsCollection = Backbone.Collection.extend({

        initialize : function (models, options) {
            this.limit = 25;
            this.offset = 0;
            this.total = 0;
        },

        fetchParams : function () {
            var queryParts = [];
            _.each(this.fetchData, function (values, key) {
                if (_.isArray(values)) {
                    _.each(values, function (value) {
                        queryParts.push(key + "='" + value + "'");
                    });
                } else {
                    queryParts.push(key + "='" + values + "'");
                }
            });
            var query = queryParts.join("&");

            var data = {
                query : query,
                limit : this.limit,
                offset : this.offset,
                faceted : true
            };

            return {
                data : data,
                traditional : true,
                remove : this.offset === 0,
                reset : this.offset === 0
            };
        },

        setQuery : function (queryModel) {
            this.offset = 0;
            this.fetchData = queryModel.toURLParameters();
            this.fetch(this.fetchParams());
            STAT4YOU.track({event : 'search', query : queryModel.get('query')});
        },

        fetchNextPage : function () {
            this.offset = this.offset + this.limit;
            this.fetch(this.fetchParams());
        },

        hasMorePages : function () {
            return this.offset + this.limit < this.total;
        },

        url : function () {
            return STAT4YOU.apiContext + "/datasets";
        },

        parse : function (response) {
            this.total = response.total;
            if (response.faceted) {
                this.trigger("change:facets", response.facets);
            }

            return response.items;
        }
    });

    _.extend(STAT4YOU.modules.search.SearchResultsCollection.prototype, STAT4YOU.mixins.FetchEventsForCollection);

}());

