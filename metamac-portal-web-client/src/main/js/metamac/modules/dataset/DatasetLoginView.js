(function () {
    "use strict";

    App.namespace('App.modules.dataset.DatasetLoginView');

    App.modules.dataset.DatasetLoginView = Backbone.View.extend({

        template: App.templateManager.get("dataset/dataset-login"),
        templateResult: App.templateManager.get("dataset/dataset-message"),

        events: {
            "submit": "onSubmit"
        },

        initialize: function () {
            this.filterDimensions = this.options.filterDimensions;
        },

        onSubmit: function(e) {
            e.preventDefault();
            const credentials = {
                login: document.getElementById("username").value,
                password: document.getElementById("password").value
            }
            this.login(credentials).done(val => {
                sessionStorage.setItem("authToken", val.token);
                this.renderSuccess();
            });
        },

        render: function () {
            const context = {
                registerUrl: App.endpoints["register"]
            }
            this.$el.html(this.template(context));
        },

        login: function (credentials) {
            return metamac.authentication.ajax({
                url: App.endpoints["user-resources"] + "/login",
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(credentials)
            });
        },

        renderSuccess: function () {
            const context = {
                statusMessage: I18n.t("login.modal.success")
            }
            this.$el.html(this.templateResult(context));
        }

    });

}());