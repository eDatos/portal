(function () {
    "use strict";

    App.namespace("App.modules.datasets.DatasetView");

    App.modules.datasets.DatasetView = Backbone.View.extend({

        className : 'dataset-list-el',

        template : App.templateManager.get('datasets/dataset'),

        initialize : function (options) {
            if (App.user) {
                this.favourites = App.user.favourites;
            }
            this.lastFav = false;
            this.dataset = options.dataset;
        },

        events : {
            "click .fav" : "clickFav"
        },

        isFav : function () {
            var isFav = false;
            if (this.favourites) {
                isFav = this.favourites.isFav(this.dataset.toJSON());
            }
            this.lastFav = isFav;
            return isFav;
        },

        favChange : function () {
            var lastFav = this.lastFav;
            var fav = this.isFav();
            return lastFav !== fav;
        },

        render : function () {
            $('.tooltip').remove();

            var context = {
                dataset : this.dataset.toJSON(),
                user : App.user,
                isFavourite : this.isFav()
            };

            this.$el.html(this.template(context));
            var $title = this.$('.dataset-list-el-title');
            if (_.isFunction($title.dotdotdot)) {
                $title.dotdotdot({watch : window});
            }

            var $tooltip = this.$el.find("a[rel=tooltip]");
            if (_.isFunction($tooltip.tooltip)) {
                $tooltip.tooltip();
            }

            return this;
        },

        updateFav : function () {
            if (this.favChange()) {
                this.render();
            }
        },

        clickFav : function (e) {
            var self = this;
            App.doActionIfRegistered(function () {
                if (self.favourites) {
                    self.favourites.toggle(self.dataset.get('uri'));
                }
            });
            return false;
        }

    });

}());
