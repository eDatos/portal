(function () {
    "use strict";

    App.namespace('App.components.modal.InformationModalView');

    App.components.modal.InformationModalView = Backbone.View.extend({

        template: App.templateManager.get("components/modal/modal-message"),

        initialize: function () {
            this.message = this.options.message;
        },

        render: function () {
            var context = {
                statusMessage: this.message
            };
            this.$el.html(this.template(context));
        }
    });

}());