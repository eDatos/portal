(function () {
    "use strict";

    App.namespace("App.modules.profile.ProfileUpdateView");

    App.modules.profile.ProfileUpdateView = Backbone.View.extend({

        template : App.templateManager.get('profile/profile-update'),

        events : {
            "submit .profile-update-form" : "submit",
            "click .profile-update-cancel" : "cancel"
        },

        initialize : function (options) {
            this.user = options.user;
            this.modelBinder = new Backbone.ModelBinder();
            this.navBarView = App.navbarView;
            _.bindAll(this, "_userUpdateSuccess", "_userUpdateError");
        },

        render : function (options) {
            options = options || {};
            this.newUser = options.newUser === true;

            if (!this.updatedUser) {
                this.updatedUser = this.user.clone();
            }

            var context = {
                user : this.updatedUser.toJSON(),
                errors : this.errors
            };

            this.$el.html(this.template(context));

            this.modelBinder.unbind();
            this.modelBinder.bind(this.updatedUser, this.el);
        },

        submit : function () {
            var needFullReload = this.user.get('locale') !== this.updatedUser.get('locale');
            var needNavBarReload = this.user.get('username') !== this.updatedUser.get('username');

            this.user.set(this.updatedUser.toJSON());
            var request = this.user.save();

            request.done(_.bind(this._userUpdateSuccess, this, needFullReload, needNavBarReload));
            request.fail(this._userUpdateError);

            return false;
        },

        _userUpdateSuccess : function (needFullReload, needNavBarReload) {
            if (needFullReload) {
                var self = this;
                self._reloadProfilePage();
            } else {
                if (needNavBarReload) {
                    this.navBarView.render();
                }
                this._navigateToRead();
            }
        },

        _redirectFromLogin : function () {
            //If new user, redirect to cookie stored url
            var redirectFromLoginUrl = Cookies.get("App.login.redirect");
            var doRedirect = this.newUser && redirectFromLoginUrl;
            if (doRedirect) {
                window.location = redirectFromLoginUrl;
            } else {
                this.newUser = false;
            }
            return doRedirect;
        },

        _navigateToRead : function () {
            if (!this._redirectFromLogin()) {
                Backbone.history.navigate("", {trigger : true});
            }
        },

        _reloadProfilePage : function () {
            if (!this._redirectFromLogin()) {
                window.location = App.context + "/profile";
            }
        },

        _userUpdateError : function (xhr) {
            var response = $.parseJSON(xhr.responseText);
            this.errors = {};
            _.each(response.errors, function (error) {
                if (!this.errors[error.field]) {
                    this.errors[error.field] = [];
                }
                this.errors[error.field].push(error.code);
            }, this);
            this.render();
        },

        cancel : function () {
            this._navigateToRead();
            return false;
        }

    });

}());