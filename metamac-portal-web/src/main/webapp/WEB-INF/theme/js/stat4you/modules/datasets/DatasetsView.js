(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.modules.datasets.DatasetsView");

    STAT4YOU.modules.datasets.DatasetsView = Backbone.View.extend({

        template : STAT4YOU.templateManager.get('datasets/datasets'),

        _defaults : {
            ellipsis : true,
            showViewMore : false
        },

        events : {
            "click .btn-more" : "viewMore"
        },

        initialize : function (options) {
            if (STAT4YOU.user) {
                this.favourites = STAT4YOU.user.favourites;
            }
            _.defaults(this.options, this._defaults);
            this._bindFavouriteEvents();

            this.collection.on('reset', this.render, this);
            this.collection.on('add', this.addDataset, this);
        },

        _updateFavsInSubviews : function () {
            _.each(this._subviews, function (subview) {
                subview.updateFav();
            });
        },

        _bindFavouriteEvents : function () {
            if (this.favourites) {
                this.favourites.on('add remove reset', this._updateFavsInSubviews, this);
            }
        },


        render : function () {
            this._subviews = [];

            var context = {
                options : this.options,
                hasMore : this.collection.hasMorePages()
            };

            this.$el.html(this.template(context));
            this.collection.each(this.addDataset, this);

            return this;
        },

        addDataset : function (dataset) {
            var view = new STAT4YOU.modules.datasets.DatasetView({dataset : dataset});
            this.$el.find('.datasets').append(view.render().el);
            this._subviews.push(view);
        },

        viewMore : function () {
            this.collection.fetchNextPage();
        }

    });

}());