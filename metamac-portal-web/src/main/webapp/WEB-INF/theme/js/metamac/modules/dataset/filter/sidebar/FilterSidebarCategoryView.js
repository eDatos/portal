(function () {
    "use strict";

    App.namespace("App.widget.filter.sidebar");

    App.widget.filter.sidebar.FilterSidebarCategoryView = Backbone.View.extend({

        template : App.templateManager.get('widget/filter/sidebar/filter-sidebar-category'),

        className : "filter-sidebar-category",

        initialize : function (options) {
            this.filterOptions = options.filterOptions;
            this.stateModel = options.stateModel;
            this.dimension = options.dimension;
            this.category = options.category;
            this.depth = options.depth;

            var eventSufix = "dimension:" + this.dimension.id + ":category:" + this.category.id;

            this.listenTo(this.filterOptions, "select:" + eventSufix, this.render);
            this.listenTo(this.filterOptions, "unselect:" + eventSufix, this.render);
            this.listenTo(this.stateModel, "change:categoryFilter", this.onChangeCategoryFilter);

            this.subcategoryViews = [];

            this.visible = true;
            this.expanded = true;
        },

        events : {
            "click .filter-sidebar-category-label" : "toggleModelState",
            "click .category-state" : "toggleModelState",
            "click .category-expand" : "toggleExpanded"
        },

        setVisible : function (visible) {
            if (visible !== this.visible) {
                this.visible = visible;
                this.$el.toggle(visible);
            }
        },

        onChangeCategoryFilter : function () {
            var visible = this.stateModel.isVisibleWithCategoryFilter(this.category.label);
            this.setVisible(visible);
        },

        toggleExpanded : function (e) {
            e.preventDefault();
            this.expanded = !this.expanded;
            _.each(this.subcategoryViews, function (view) {
                view.setVisible(this.expanded);
            }, this);
            this.render();
        },

        toggleModelState : function () {
            this.filterOptions.toggleCategoryState(this.dimension.id, this.category.id);
            return false;
        },

        _hasSubcategories : function () {
            return this.subcategoryViews.length > 0;
        },

        render : function () {
            var category = this.filterOptions.getCategory(this.dimension.id, this.category.id);
            var context = {
                category : category,
                hasSubcategories : this._hasSubcategories(),
                expanded : this.expanded,
                depth : this.depth
            };
            this.$el.html(this.template(context));
            this.$el.css("padding-left", this.depth * 35);

            return this.el;
        },

        addSubcategoryViews : function (views) {
            if (!_.isArray(views)) {
                views = [views];
            }
            this.subcategoryViews = this.subcategoryViews.concat(views);
        }

    });
}());