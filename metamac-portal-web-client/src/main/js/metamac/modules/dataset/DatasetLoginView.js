(function () {
    "use strict";

    App.namespace('App.modules.dataset.DatasetLoginView');

    App.modules.dataset.DatasetLoginView = Backbone.View.extend({

        template: App.templateManager.get("dataset/dataset-login"),
        templateResult: App.templateManager.get("components/modal/modal-message"),

        events: {
            "submit": "onSubmit"
        },

        initialize: function () {
            this.filterDimensions = this.options.filterDimensions;
        },

        onSubmit: function(e) {
            e.preventDefault();
            var credentials = {
                login: document.getElementById("username").value,
                password: document.getElementById("password").value
            }
            var self = this;
            this.login(credentials).done(function(val) {
                sessionStorage.setItem("authToken", val.token);
                self.renderSuccess();
                App.trigger("login");
            });
        },

        render: function () {
            var context = {
                registerUrl: App.endpoints["external-users-web"] + '/signup'
            }
            this.$el.html(this.template(context));
        },

        login: function (credentials) {
            return metamac.authentication.ajax({
                url: App.endpoints["external-users"] + "/login",
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(credentials)
            });
        },

        renderSuccess: function () {
            var context = {
                statusMessage: I18n.t("login.modal.success")
            }
            this.$el.html(this.templateResult(context));
        }

    });

}());