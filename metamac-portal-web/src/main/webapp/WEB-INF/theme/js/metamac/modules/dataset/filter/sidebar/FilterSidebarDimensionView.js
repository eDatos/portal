(function () {
    "use strict";

    App.namespace("App.widget.filter.sidebar");

    var FilterSidebarCategoryView = App.widget.filter.sidebar.FilterSidebarCategoryView;

    App.widget.filter.sidebar.FilterSidebarDimensionView = Backbone.View.extend({

        template : App.templateManager.get('widget/filter/sidebar/filter-sidebar-dimension'),

        initialize : function (options) {
            this.dimension = options.dimension;
            this.filterOptions = options.filterOptions;
            this.optionsModel = options.optionsModel;

            this.stateModel = new App.widget.filter.sidebar.FilterSidebarDimensionStateModel();
            this.searchbar = new App.components.searchbar.SearchbarView({model : this.stateModel, modelAttribute : "categoryFilter"});
        },

        destroy : function () {
            this._unbindEvents();
            this.remove();
        },

        events : {
            "click .filter-sidebar-selectAll" : "_onSelectAll",
            "click .filter-sidebar-unselectAll" : "_onUnselectAll",
            "click .filter-sidebar-dimension-title" : "_onClickTitle"
        },

        _bindEvents : function () {
            this.listenTo(this.stateModel, "change:collapsed", this._onChangeCollapsed);
            this.listenTo(this.stateModel, "change:maxHeight", this._onChangeMaxHeight);
        },

        _unbindEvents : function () {
            this.stopListening();
        },

        _filteredCategoriesIds : function () {
            var self = this;
            return _.chain(this.filterOptions.getCategories(this.dimension.id))
                .filter(function (category) {
                    return self.stateModel.isVisibleWithCategoryFilter(category.label);
                })
                .pluck("id")
                .value();
        },

        _isFixedDimension : function () {
            var zone = this.filterOptions.getZoneFromDimension(this.dimension.id);
            return zone === "fixed";
        },

        render : function () {
            this.delegateEvents();
            this._unbindEvents();
            this._bindEvents();

            var zone = this.filterOptions.getZoneFromDimension(this.dimension.id);
            //var zoneLabel = I18n.t("filter.sidebar.order." + chartType + "." + zone);
            //var zoneFirstLetter = zoneLabel[0];
            var zoneLabel = "";
            var zoneFirstLetter = "";

            var context = {
                zone : zone,
                zoneLabel : zoneLabel,
                zoneFirstLetter : zoneFirstLetter,
                dimension : this.dimension,
                isFixedDimension : this._isFixedDimension(),
                state : this.stateModel.toJSON()
            };

            this.$el.html(this.template(context));

            var categoriesByParent = _.chain(this.dimension.categories)
                .filter(function (category) {
                    return !_.isUndefined(category.parent);
                })
                .groupBy('parent').value();

            var categoriesWithoutParent = _.filter(this.dimension.categories, function (category) {
                return _.isUndefined(category.parent);
            });

            var self = this;
            var $categories = this.$(".filter-sidebar-categories");

            var createCategoryViewTreeNode = function (category, depth) {
                var categoryView = new FilterSidebarCategoryView({
                    filterOptions : self.filterOptions,
                    stateModel : self.stateModel,
                    dimension : self.dimension,
                    category : category,
                    depth : depth || 0
                });
                var views = [categoryView];
                _.each(categoriesByParent[category.id], function (subcategory) {
                    var childViews = createCategoryViewTreeNode(subcategory, depth + 1);
                    categoryView.addSubcategoryViews(childViews);
                    views = views.concat(childViews);
                });
                return views;
            };

            var views = _.chain(categoriesWithoutParent).map(function (category) {
                return createCategoryViewTreeNode(category, 0);
            }).flatten(true).value();

            _.each(views, function (view) {
                view.render();
                $categories.append(view.el);
            });

            this.searchbar.setElement(this.$(".filter-sidebar-dimension-searchbar"));
            this.searchbar.render();

            this._onChangeMaxHeight();

            return this.el;
        },

        getCollapsedHeight : function () {
            return this.$(".filter-sidebar-dimension-title").outerHeight(true);
        },

        _onSelectAll : function (e) {
            e.preventDefault();
            if (this.stateModel.isFiltering()) {
                this.filterOptions.selectCategories(this.dimension.id, this._filteredCategoriesIds());
            } else {
                this.filterOptions.selectAllCategories(this.dimension.id);
            }
        },

        _onUnselectAll : function (e) {
            e.preventDefault();
            if (this.stateModel.isFiltering()) {
                this.filterOptions.unselectCategories(this.dimension.id, this._filteredCategoriesIds());
            } else {
                this.filterOptions.unselectAllCategories(this.dimension.id);
            }
        },

        _onClickTitle : function () {
            this.stateModel.set('collapsed', !this.stateModel.get('collapsed'));
        },

        _onChangeCollapsed : function () {
            this.$el.find('.collapse').toggleClass('in', !this.stateModel.get('collapsed'));
        },

        _onChangeMaxHeight : function () {
            this.$('.collapse').css('max-height', this.stateModel.get('maxHeight'));
        }

    });
}());