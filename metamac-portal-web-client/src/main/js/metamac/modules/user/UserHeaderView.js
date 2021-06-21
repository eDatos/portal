(function () {
    "use strict";

    var UserUtils = App.modules.user.UserUtils;

    App.namespace("App.modules.user");

    App.modules.user.UserHeaderView = Backbone.View.extend({

        template : App.templateManager.get("user/user-header"),

        events : {
            "click #button-user": "clickUser",
            "click #button-logout": "clickLogout"
        },

        initialize: function () {
            this.listenTo(App, "logout", this._onLogout());
            this.modal = null;
            this.isLogged = false;
        },

        _onLogout: function () {
            var self = this;
            return function () {
                if(self.isLogged) {
                    self.isLogged = false;
                    var context = {
                        username : "",
                        isLogged: self.isLogged
                    };
                    self.$el.html(self.template(context));
                }
            }
        },

        render: function () {
            var self = this;
            UserUtils.getAccount().then(function(account) {
                self.isLogged = true;
                var context = {
                    username : account.name + ' ' + account.surname1 + ' ' + (account.surname2 || ''),
                    isLogged: self.isLogged
                };
                self.$el.html(self.template(context));
            }).catch(function() {
                self.isLogged = false;
                var context = {
                    username : "",
                    isLogged: self.isLogged
                };
                self.$el.html(self.template(context));
            });
        },

        clickUser: function (e) {
            e.preventDefault();
            UserUtils.getAccount().then(function() {
                window.open(App.endpoints["external-users-web"], '_blank').focus();
            }).catch(function() {
                UserUtils.login();
            });
        },

        clickLogout: function (e) {
            e.preventDefault();
            this._showLogoutModal();
        },

        _showLogoutModal: function () {
            var modalContentView = new App.components.modal.ConfirmationModalView({
                question: I18n.t("logout.modal.question"),
                onConfirm: this._onLogoutConfirmed(),
                onReject: this._onLogoutRejected()
            });
            var title = I18n.t("logout.modal.title");
            this.modal = new App.components.modal.ModalView({ title: title, contentView: modalContentView });
            this.modal.show();
        },

        _onLogoutConfirmed: function () {
            var self = this;
            return function() {
                UserUtils.logout().finally(function () {
                    self.modal.close();
                });
            }
        },

        _onLogoutRejected: function () {
            var self = this;
            return function() {
                self.modal.close();
            }
        }
    });

}());