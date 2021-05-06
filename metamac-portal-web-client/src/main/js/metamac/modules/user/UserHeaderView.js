(function () {
    "use strict";

    App.namespace("App.modules.user");

    App.modules.user.UserHeaderView = Backbone.View.extend({

        template : App.templateManager.get("user/user-header"),

        events : {
            "click .button-login": "clickLogin"
        },

        initialize : function () {

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
                    // TODO: Log out
                }).fail(() => {
                    this._showLoginModal();
                });
            } else {
                this._showLoginModal();
            }
        },

        onLogin: function(self) {
            return function() {
                self.render();
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
            let modalContentView = new App.modules.dataset.DatasetLoginView({ filterDimensions: this.filterDimensions, onLogin: this.onLogin(this)  });
            var title = I18n.t("login.modal.title");
            var modal = new App.components.modal.ModalView({ title: title, contentView: modalContentView });
            modal.show();
        }
    });

}());