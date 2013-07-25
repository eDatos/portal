(function () {

    "use strict";

    STAT4YOU.namespace("STAT4YOU.modules.signin");

    STAT4YOU.modules.signin.SigninView = Backbone.View.extend({

        template : STAT4YOU.templateManager.get('signin/signin'),

        events : {
            "click a" : "signin"
        },

        initialize : function () {
            this.$modalBody = this.$(".modal-body");
        },

        show : function () {
            this.render();
            this.$el.modal('show');
        },

        render : function () {
            var msg = this.message || "Iniciar sesión con";
            var context = {
                msg : msg
            };
            this.$modalBody.html(this.template(context));
        },

        // Return a promise to the redirect url, the current view can overwrite this method
        redirectUrl : function () {
            var origin = window.location.protocol + "//" + window.location.host;
            var currentPath = window.location.href.substring(origin.length);
            return $.when(currentPath);
        },

        saveRedirectCookie : function (url) {
            Cookies.set("stat4you.login.redirect", url, { expires : 600 });
        },

        signin : function (e) {
            e.preventDefault();

            var self = this;

            this.redirectUrl()
                .done(function (url) {
                    self.saveRedirectCookie(url);
                    var $target = $(e.currentTarget);
                    var provider = $target.data('provider');

                    var req = STAT4YOU.track({event : 'login', provider : provider});
                    req.always(function () {
                        $target.parent('form').submit();
                    });
                });
        }

    });


}());