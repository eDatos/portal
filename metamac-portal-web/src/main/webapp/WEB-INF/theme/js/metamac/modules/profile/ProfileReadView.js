(function () {
    "use strict";

    App.namespace("App.modules.profile");

    var ProfileFavouritesView = App.modules.profile.ProfileFavouritesView;
    var Datasets = App.modules.datasets.Datasets;

    App.modules.profile.ProfileReadView = Backbone.View.extend({

        template : App.templateManager.get('profile/profile-read'),

        initialize : function (options) {
            this.user = options.user;
            this.favourites = options.favourites;
            this.datasets = new Datasets();

            this.favourites.on('reset', this._renderFavourites, this);
        },

        render : function () {
            var user = this.user.toJSON();
            if (user.locale) {
                user.localeLabel = I18n.t('app.lang.names.' + user.locale);
            }

            this.$el.html(this.template({user : user}));

            var favs$el = this.$el.find('.favs');

            this.favsView = new ProfileFavouritesView({
                el : favs$el,
                collection : this.datasets,
                showViewMore : true,
                favs : this.favourites, pageSize : 10,
                ellipsis : true
            });

            this.favourites.fetch({reset : true});
        },

        _renderFavourites : function () {
            this.datasets.reset(this.favourites.pluck('dataset'));
            this.favsView.collection = this.datasets;
            this.favsView.render();
        }


    });

}());