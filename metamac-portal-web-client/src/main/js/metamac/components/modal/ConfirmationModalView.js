(function () {
    "use strict";

    App.namespace('App.components.modal.ConfirmationModalView');

    App.components.modal.ConfirmationModalView = Backbone.View.extend({

        template: App.templateManager.get("components/modal/modal-confirmation"),

        events: {
            "click .button-confirm": "confirm",
            "click .button-reject": "reject"
        },

        initialize: function () {
            this.question = this.options.question;
            this.onConfirm = this.options.onConfirm || (() => {});
            this.onReject = this.options.onReject || (() => {});
        },

        confirm: function() {
            this.onConfirm();
        },

        reject: function() {
            this.onReject();
        },

        render: function () {
            const context = {
                question: this.question
            }
            this.$el.html(this.template(context));
        },
    });

}());