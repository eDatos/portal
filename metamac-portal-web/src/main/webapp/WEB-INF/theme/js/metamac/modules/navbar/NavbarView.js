(function () {
    "use strict";

    App.namespace("App.modules.navbar.NavbarView");

    App.modules.navbar.NavbarView = Backbone.View.extend({

        template : App.templateManager.get('navbar/navbar'),

        initialize : function (options) {
            this.userModel = options.userModel;
            this.location = options.location || window.location.pathname;
        },

        events : {
            "click .icon-search-min " : "search",
            "click .locale .dropdown-menu a" : "changeLocale",
            "click .navbar-signin" : "signin"
        },

        _toLocaleObj : function (localeId) {
            return {id : localeId, label : I18n.t('app.lang.names.' + localeId)};
        },

        render : function () {
            var context = {};

            var locales = ['es', 'en', 'eu', 'ca'];
            context.locales = _.map(locales, this._toLocaleObj);
            context.currentLocale = this._toLocaleObj(I18n.currentLocale());

            if (this.userModel) {
                context.user = this.userModel.toJSON();
            }

            this.$el.html(this.template(context));
            this.activeMenuByLocation();
        },

        search : function () {
            var $form = this.$el.find(".navbar-search");
            $form.submit();
        },

        activeMenuByLocation : function () {
            var self = this;
            $('.nav.links li', this.$el).each(function (i, li) {
                var $li = $(li),
                    $a = $li.find('a'),
                    href = $a.attr('href');

                var regexp = new RegExp("^" + href + "(/?)[^/]*$", "i");
                if (regexp.test(self.location)) {
                    $li.addClass('active');
                }
            });
        },

        changeLocale : function (e) {
            var href = $(e.currentTarget).attr('href');
            var currentLocation = window.location.href;
            var newUrl = href + "&target=" + currentLocation;
            window.location = newUrl;
            return false;
        },

        signin : function (e) {
            e.preventDefault();
            App.getSigninView().show();
        }

    });

}());



