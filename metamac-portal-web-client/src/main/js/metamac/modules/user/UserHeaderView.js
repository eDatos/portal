(function () {
    "use strict";

    var UserUtils = App.modules.user.UserUtils;

    App.namespace("App.modules.user");

    App.modules.user.UserHeaderView = Backbone.View.extend({

        template : App.templateManager.get("user/user-header"),

        events : {
            "click .button-login": "clickLogin"
        },

        initialize : function () {
            this.listenTo(App, "login", this.render);
            this.modal = null;
        },

        render : function () {
            if(sessionStorage.getItem("authToken")) {
                var self = this;
                UserUtils.getAccount().then(function(val) {
                    var context = {
                        username : val.name + ' ' + val.surname1 + ' ' + (val.surname2 || ''),
                        tooltip : I18n.t("logout.modal.tooltip")
                    };
                    self.$el.html(self.template(context));
                }).catch(function() {
                    var context = {
                        username : "",
                        tooltip : I18n.t("login.modal.tooltip")
                    };
                    self.$el.html(self.template(context));
                });
            } else {
                var context = {
                    username : "",
                    tooltip : I18n.t("login.modal.tooltip")
                };
                this.$el.html(this.template(context));
            }
        },

        clickLogin: function (e) {
            e.preventDefault();
            var self = this;
            if(sessionStorage.getItem("authToken")) {
                UserUtils.getAccount().done(function(val) {
                    self._showLogoutModal();
                }).fail(function() {
                    self._showLoginModal();
                });
            } else {
                self._showLoginModal();
            }
        },

        _showLoginModal: function () {
            var modalContentView = new App.modules.dataset.DatasetLoginView({ filterDimensions: this.filterDimensions });
            var title = I18n.t("login.modal.title");
            this.modal = new App.components.modal.ModalView({ title: title, contentView: modalContentView });
            this.modal.show();
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
                sessionStorage.removeItem("authToken");
                self.render();
                self.modal.close();
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