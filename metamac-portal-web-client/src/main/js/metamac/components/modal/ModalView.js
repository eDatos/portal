(function () {
    "use strict";

    App.namespace('App.components.modal.ModalView');

    App.components.modal.ModalView = Backbone.Marionette.Layout.extend({

        template : "components/modal/modal",

        initialize : function () {
            this.title = this.options.title;
            this.contentView = this.options.contentView;
        },

        regions : {
            content: ".modal-content"
        },

        events : {
            "click .modal-backdrop" : "onClickBackdrop"
        },

        serializeData : function () {
            var context = {
                title : this.title
            };
            console.log("context", context);
            return context;
        },

        onRender : function () {
            this.content.show(this.contentView);
        },

        show : function () {
            this.render();
            $("body").append(this.$el);
        },

        onClickBackdrop : function () {
            this.close();
        }

    });

}());