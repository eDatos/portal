(function () {
    "use strict";

    var UserUtils = App.modules.user.UserUtils;

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
            UserUtils.login(credentials).then(function(val) {
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

        renderSuccess: function () {
            var context = {
                statusMessage: I18n.t("login.modal.success")
            }
            this.$el.html(this.templateResult(context));
        }

    });

}());