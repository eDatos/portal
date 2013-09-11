(function () {
    "use strict";

    App.namespace("App.modules.profile.ProfileFavouritesView");

    App.modules.profile.ProfileFavouritesView = Backbone.View.extend({

        template : App.templateManager.get('datasets/datasets'),

        _defaults : {
            ellipsis : true,
            pageSize : 3,
            currentPage : 1
        },

        events : {
            "click .btn-more" : "viewMore"
        },

        initialize : function (options) {
            options = _.extend({}, this._defaults, options);

            this.favourites = App.user.favourites;
            this.currentPage = options.currentPage;
            this.pageSize = options.pageSize;

            this.favourites.on('remove', this._removeFavourite, this);
        },

        totalVisibles : function () {
            var total = this.currentPage * this.pageSize;
            return total > this.favourites.length ? this.favourites.length : total;
        },

        _visibles : function () {
            var visibles = this.favourites.toJSON();
            return visibles.slice(0, this.totalVisibles());
        },

        hasMore : function () {
            return this.totalVisibles() < this.favourites.length;
        },

        _initEllipsis : function () {
            if (this.options.ellipsis) {
                $('.dataset-list-el-title').dotdotdot({
                    watch : window
                });
            }
        },

        _initTooltip : function () {
            this.$el.find("a[rel=tooltip]").tooltip();
        },

        _removeTooltip : function () {
            $('.tooltip').remove();
        },

        render : function () {
            this._subviews = [];

            var favourites = this._visibles();
            var context = {
                options : this.options,
                hasMore : this.hasMore()
            };

            this._removeTooltip();
            this.$el.html(this.template(context));

            if (favourites.length > 0) {
                _.each(favourites, function (favourite) {
                    this.appendDataset(favourite.dataset);
                }, this);

                this._initEllipsis();
                this._initTooltip();
            } else {
                this.renderInstruction();
            }

            return this;
        },

        appendDataset : function (dataset, animation) {
            var datasetModel = new App.modules.datasets.Dataset(dataset);
            var view = new App.modules.datasets.DatasetView({dataset : datasetModel});
            view.render();

            if (animation) {
                view.$el.hide();
            }

            this.$el.find('.datasets').append(view.el);
            this._subviews.push(view);
            if (animation) {
                view.$el.fadeIn();
            }
        },

        viewMore : function () {
            var beforeTotal = this.totalVisibles();
            this.currentPage++;
            var afterTotal = this.totalVisibles();

            var newFavourites = this._visibles().slice(beforeTotal, afterTotal);
            var newDatasets = _.pluck(newFavourites, 'dataset');
            var self = this;
            _.each(newDatasets, function (dataset) {
                self.appendDataset(dataset, true);
            });
            this._updateMoreButton();
        },

        _updateMoreButton : function () {
            if (!this.hasMore()) {
                this.$el.find('.btn-more').remove();
            }
        },

        _findSubviewIndex : function (favourite) {
            var subviewIndex = -1;
            var subview;
            var datasetUri = favourite.get('dataset').uri;
            for (var i = 0; i < this._subviews.length; i++) {
                subview = this._subviews[i];
                if (subview.dataset.get('uri') === datasetUri) {
                    subviewIndex = i;
                    break;
                }
            }
            return subviewIndex;
        },

        _removeFavourite : function (favourite) {
            var subviewIndex = this._findSubviewIndex(favourite);
            if (subviewIndex != -1) {
                var subview = this._subviews[subviewIndex];
                subview.$el.fadeOut(_.bind(this._removeFavouriteFadeOutCallback, this, subviewIndex));
            }
        },

        _removeFavouriteFadeOutCallback : function (subviewIndex) {
            this._subviews.splice(subviewIndex, 1);
            this._removeTooltip();
            this._updateMoreButton();
            this._appendNextDataset();

            if(this.totalVisibles() === 0) {
                this.renderInstruction();
            }
        },

        _appendNextDataset : function () {
            var totalVisibles = this.totalVisibles();
            if (this._subviews.length < totalVisibles) {
                var dataset = this.favourites.at(totalVisibles - 1).get('dataset');
                this.appendDataset(dataset, true);
            }
        },

        renderInstruction : function () {
            this.$el.text("No tienes estadísticas favoritas");
        }

    });

}());
