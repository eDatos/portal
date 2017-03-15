(function () {
    "use strict";

    App.namespace('App.components.ToggleableView');

    App.components.ToggleableView = Backbone.View.extend({

        template : App.templateManager.get('components/toggleable/toggleable'),

        initialize : function () {
            _.extend(this, _.pick(this.options, 'selectionModel', 'name', 'activeValue', 'inactiveValue'));
        },

        destroy : function () {

        },

        events : {
            "change" : "onChangeSelect",
            "click button" : "onChangeSelect"
        },

        bindEvents : function () {
            this.listenTo(this.selectionModel, 'change:' + this.name, this.render);
        },

        unbindEvents : function () {
            this.stopListening();
        },

        isToggledOn : function () {
            var selection = this.selectionModel.get(this.name);
            if (this.activeValue.id === selection) return true;
            if (this.inactiveValue.id === selection) return false;
        },

        toggleValue : function() {
            if (this.isToggledOn()) {
                this.selectionModel.set(this.name, this.inactiveValue.id);
            } else {
                this.selectionModel.set(this.name, this.activeValue.id);
            }
        },


        render : function () {
            this.unbindEvents();
            this.bindEvents();
            var context = {
                name : this.name,
                isToggledOn : this.isToggledOn()
            };
            this.$el.html(this.template(context));
        },

        onChangeSelect : function () {
            this.toggleValue();
        }

    });

}());