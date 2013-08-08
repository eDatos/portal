(function () {
    "use strict";

    App.namespace("App.widget.filter.sidebar");

    var FilterSidebarCategoryView = App.widget.filter.sidebar.FilterSidebarCategoryView;

    App.widget.filter.sidebar.FilterSidebarDimensionView = Backbone.View.extend({

        template : App.templateManager.get('widget/filter/sidebar/filter-sidebar-dimension'),

        initialize : function (options) {
            this.filterDimensions = options.filterDimensions;
            this.filterDimension = options.filterDimension;
            this.optionsModel = options.optionsModel;

            this.stateModel = new App.widget.filter.sidebar.FilterSidebarDimensionStateModel();
            this.searchbar = new App.components.searchbar.SearchbarView({model : this.filterDimension, modelAttribute : "filterQuery"});
        },

        destroy : function () {
            this._unbindEvents();
            this.remove();
        },

        events : {
            "click .filter-sidebar-selectAll" : "_onSelectAll",
            "click .filter-sidebar-unselectAll" : "_onDeselectAll",
            "click .filter-sidebar-dimension-title" : "_onClickTitle"
        },

        _bindEvents : function () {
            this.listenTo(this.filterDimension, "change:open", this._onChangeOpen);
            //this.listenTo(this.stateModel, "change:maxHeight", this._onChangeMaxHeight);
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
            return this.filterDimension.get('zone') === 'fixed';
        },

        render : function () {
            this.delegateEvents();
            this._unbindEvents();
            this._bindEvents();

            var context = {
                dimension : this.filterDimension.toJSON(),
                isFixedDimension : this._isFixedDimension(),
                state : this.stateModel.toJSON()
            };
            this.$el.html(this.template(context));

            var self = this;
            var filterRepresentations = this.filterDimension.get('representations');
            var views = filterRepresentations.map(function (filterRepresentation) {
                var view = new FilterSidebarCategoryView({
                    filterDimension : self.filterDimension,
                    filterRepresentation : filterRepresentation
                });
                return view;
            });

            var $categories = this.$(".filter-sidebar-categories");
            _.each(views, function (view) {
                view.render();
                $categories.append(view.el);
            });

            this.searchbar.setElement(this.$(".filter-sidebar-dimension-searchbar"));
            this.searchbar.render();

            this.setMaxHeight(this.maxHeight);
            this._onChangeOpen();

            return this.el;
        },

        getCollapsedHeight : function () {
            return this.$(".filter-sidebar-dimension-title").outerHeight(true);
        },

        _onSelectAll : function (e) {
            e.preventDefault();
            this.filterDimension.get('representations').selectVisible();
        },

        _onDeselectAll : function (e) {
            e.preventDefault();
            this.filterDimension.get('representations').deselectVisible();
        },

        _onClickTitle : function (e) {
            e.preventDefault();
            this.filterDimension.toggle('open');
        },

        _onChangeOpen : function () {
            this.$el.find('.collapse').toggleClass('in', this.filterDimension.get('open'));
        },

        setMaxHeight : function (maxHeight) {
            this.maxHeight = maxHeight;
            this.$('.collapse').css('max-height', maxHeight);
        }

    });
}());