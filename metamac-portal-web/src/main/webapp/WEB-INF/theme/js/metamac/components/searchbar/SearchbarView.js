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

        render : function () {
            var context = {};
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
            this.model.set(this.modelAttribute, value);
            this.updateModelAttribute(value);
        }

    });

}());