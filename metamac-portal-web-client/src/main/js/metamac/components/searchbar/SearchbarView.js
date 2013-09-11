(function () {
    "use strict";

    App.namespace("App.components.searchbar");

    App.components.searchbar.SearchbarView = Backbone.View.extend({

        template : App.templateManager.get("components/searchbar/searchbar"),

        initialize : function (options) {
            this.modelAttribute = options.modelAttribute;
        },

        events : {
            "change input" : "onChangeSearchInput",
            "click .searchbar-clear" : "onClearSearchInput"
        },

        _bindEvents : function () {
            this.listenTo(this.model, 'change:' + this.modelAttribute, this.onChangeModelAttribute);
        },

        _unbindEvents : function () {
            this.stopListening();
        },

        destroy : function () {
            this._unbindEvents();
            this.remove();
        },

        render : function () {
            this._unbindEvents();
            this._bindEvents();

            var context = {
                value : this.model.get(this.modelAttribute)
            };
            this.$el.html(this.template(context));
            this.$searchInput = this.$("input");
            this.$searchInput.keyup(_.bind(this.onChangeSearchInput, this));
        },

        updateModelAttribute : function (value) {
            this.model.set(this.modelAttribute, value);
        },

        onClearSearchInput : function (e) {
            e.preventDefault();
            this.$searchInput.val('');
            this.updateModelAttribute('');
        },

        onChangeSearchInput : function () {
            var value = this.$searchInput.val();
            this.updateModelAttribute(value);
        },

        onChangeModelAttribute : function () {
            var inputValue = this.$searchInput.val();
            var modelValue = this.model.get(this.modelAttribute);
            if (inputValue !== modelValue) {
                this.$searchInput.val(modelValue);
            }
        }

    });

}());