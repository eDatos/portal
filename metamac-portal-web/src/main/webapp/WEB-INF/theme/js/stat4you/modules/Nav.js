(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.modules.Nav");

    STAT4YOU.modules.Nav = function (options) {
        this.initialize(options);
    };

    STAT4YOU.modules.Nav.prototype = {

        initialize : function (options) {
            this.$el = (options.el instanceof $) ? options.el : $(options.el);
            this.location = options.location || window.location.pathname;

            this.activeMenuByLocation();
            this.attachSearchFormEvents();
            this.attachChangeLocaleEvents();
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

        attachSearchFormEvents : function () {
            var $form = this.$el.find(".navbar-search");
            var $iconSearch = $form.find('.icon-search-min');

            $iconSearch.click(function () {
                $form.trigger('submit');
            });
        },

        attachChangeLocaleEvents : function () {
            var $locale = this.$el.find(".locale");
            var $links = $locale.find(".dropdown-menu a").click(function(){
                var href = $(this).attr('href');
                var currentLocation = window.location.href;
                var newUrl = href + "&target=" + currentLocation;
                window.location = newUrl;
                return false;
            });
        }
    };

}());



