(function () {
    "use strict";

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
                this._getUserAccount().done(val => {
                    const context = {
                        username : val.name + ' ' + val.surname1 + ' ' + (val.surname2 || '')
                    };
                    this.$el.html(this.template(context));
                }).fail(() => {
                    const context = {
                        username : ""
                    };
                    this.$el.html(this.template(context));
                });
            } else {
                const context = {
                    username : ""
                };
                this.$el.html(this.template(context));
            }
        },

        clickLogin: function (e) {
            e.preventDefault();
            if(sessionStorage.getItem("authToken")) {
                this._getUserAccount().done(val => {
                    this._showLogoutModal();
                }).fail(() => {
                    this._showLoginModal();
                });
            } else {
                this._showLoginModal();
            }
        },

        _getUserAccount: function () {
            return metamac.authentication.ajax({
                url: App.endpoints["user-resources"] + "/account",
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("authToken")
                },
                method: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            });
        },

        _showLoginModal: function () {
            let modalContentView = new App.modules.dataset.DatasetLoginView({ filterDimensions: this.filterDimensions });
            var title = I18n.t("login.modal.title");
            this.modal = new App.components.modal.ModalView({ title: title, contentView: modalContentView });
            this.modal.show();
        },

        _showLogoutModal: function () {
            let modalContentView = new App.components.modal.ConfirmationModalView({
                question: I18n.t("logout.modal.question"),
                onConfirm: this._onLogoutConfirmed(),
                onReject: this._onLogoutRejected()
            });
            var title = I18n.t("logout.modal.title");
            this.modal = new App.components.modal.ModalView({ title: title, contentView: modalContentView });
            this.modal.show();
        },

        _onLogoutConfirmed: function () {
            const self = this;
            return () => {
                sessionStorage.removeItem("authToken");
                self.render();
                self.modal.close();
            }
        },

        _onLogoutRejected: function () {
            const self = this;
            return () => {
                self.modal.close();
            }
        }
    });

}());