(function () {
    "use strict";

    App.namespace("App.modules.search.SearchHeaderView");

    App.modules.search.SearchHeaderView = Backbone.View.extend({

        headerTemplate : App.templateManager.get("search/search-header"),
        activeProviderTemplate : App.templateManager.get("search/search-active-provider"),

        events : {
            "submit .search-form" : "submitSearchForm",
            "keyup .search-form-query" : "keyupQuery"
        },

        initialize : function (options) {
            this.queryModel = options.queryModel;
            this.activeProviderModel = options.activeProviderModel;

            this.listenTo(this.queryModel, "change:query", this.modelChangeQuery);
            this.listenTo(this.activeProviderModel, "change", this.renderActiveProvider);

            this.debouncedSearchForm = _.debounce(this.submitSearchForm, App.modules.search.SearchHeaderView.KEYUP_DELAY);
        },

        render : function () {
            this.$el.html(this.headerTemplate());
            this.renderActiveProvider();
            this.$queryInput = this.$('.search-form-query');
            this.$queryForm = this.$('.search-form');
        },

        renderActiveProvider : function () {
            var context = {
                visible : this.activeProviderModel.activeProvider !== undefined,
                activeProvider : this.activeProviderModel.toJSON()
            };
            this.$(".search-active-provider").html(this.activeProviderTemplate(context));
        },

        modelChangeQuery : function () {
            var currentVal = this.$queryInput.val();
            var newVal = this.queryModel.get('query');

            if (currentVal !== newVal) {
                this.$queryInput.val(newVal);
            }
        },

        submitSearchForm : function () {
            var value = this.$queryInput.val();
            this.queryModel.set('query', value);
            return false;
        },

        keyupQuery : function () {
            this.debouncedSearchForm();
            return false;
        }

    });

    App.modules.search.SearchHeaderView.KEYUP_DELAY = 300;

}());