(function () {
    "use strict";

    App.namespace('App.components.modal.InformationModalView');

    App.components.modal.InformationModalView = Backbone.View.extend({

        template: App.templateManager.get("components/modal/modal-message"),

        initialize: function () {
            this.message = this.options.message;
        },

        render: function () {
            this.$el.html(this.template());
            this.$el.find("#message-container")[0].innerHTML = this.message;
        }
    });

}());