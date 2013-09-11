(function () {
    "use strict";

    App.namespace("App.modules.comments.Comments");

    var Comment = App.modules.comments.Comment;

    App.modules.comments.Comments = Backbone.Collection.extend({

        initialize : function (models, options) {
            this.resourceUri = options.resourceUri;
        },

        url : App.apiContext + '/comments',

        model : Comment,

        limit : 10,

        fetch : function (options) {
            if (!options) {
                options = {};
            }
            if (!options.data) {
                options.data = {};
            }

            _.defaults(options.data, {
                query : "resource='" + this.resourceUri + "'",
                limit : this.limit
            });
            Backbone.Collection.prototype.fetch.call(this, options);
        },

        _offsetToPage : function (offset) {
            return Math.floor(offset / this.limit);
        },

        currentPage : function () {
            return this._offsetToPage(this.offset);
        },

        lastPage : function () {
            return this._offsetToPage(this.total - 1);
        },

        parse : function (response) {
            this.total = response.total;
            this.offset = response.offset;
            this.limit = response.limit;

            return response.items;
        },

        fetchPage : function (page) {
            if (page >= 0 && page <= this.lastPage()) {
                var offset = page * this.limit;
                this.fetch({ data : {offset : offset}});
            }
        }

    });

}());
