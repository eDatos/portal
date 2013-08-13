(function () {
    "use strict";

    App.namespace("App.widget.filter.sidebar");

    var FilterSidebarCategoryView = App.widget.filter.sidebar.FilterSidebarCategoryView;

    App.widget.filter.sidebar.FilterSidebarDimensionView = Backbone.View.extend({

        template : App.templateManager.get('widget/filter/sidebar/filter-sidebar-dimension'),

        initialize : function (options) {
            this.filterDimension = options.filterDimension;
            this.resetLastIndex();
            this.collapsable = _(options).has('collapsable') ? options.collapsable : true;
        },

        destroy : function () {
            if (this.subviews) {
                _.invoke(this.subviews, 'destroy');
            }
            this._unbindEvents();
            this.remove();
        },

        close : function () {
            this.remove();
        },

        events : {
            "click .filter-sidebar-dimension-title" : "_onClickTitle"
        },

        _bindEvents : function () {
            this.listenTo(this.filterDimension, "change:visible", this.resetLastIndex);
            this.listenTo(this.filterDimension, "change:open", this._onChangeOpen);
        },

        _unbindEvents : function () {
            this.stopListening();
        },

        render : function () {
            this.delegateEvents();
            this._unbindEvents();
            this._bindEvents();

            var context = {
                dimension : this.filterDimension.toJSON()
            };

            this.$el.html(this.template(context));

            this.subviews = [];

            var filterRepresentations = this.filterDimension.get('representations');
            var $categories = this.$(".filter-sidebar-categories");
            this.representationsSubviews = filterRepresentations.map(function (filterRepresentation) {
                var view = new FilterSidebarCategoryView({
                    filterSidebarDimensionView : this,
                    filterDimension : this.filterDimension,
                    filterRepresentation : filterRepresentation
                });
                view.render();
                $categories.append(view.el);
                return view;
            }, this);
            this.subviews = this.subviews.concat(this.representationsSubviews);

            this.searchbarView = new App.components.searchbar.SearchbarView({
                model : this.filterDimension,
                modelAttribute : "filterQuery",
                el : this.$(".filter-sidebar-dimension-searchbar")
            });
            this.searchbarView.render();
            this.subviews.push(this.searchbarView);

            this.actionsView = new App.widget.filter.sidebar.FilterSidebarDimensionActionsView({
                filterDimension : this.filterDimension,
                el : this.$('.filter-sidebar-dimension-actions')
            });
            this.actionsView.render();
            this.subviews.push(this.actionsView);

            if (this.filterDimension.get('hierarchy')) {
                var hierarchyLevel = this.filterDimension.getMaxHierarchyLevel() + 1;
                var levelsModels = _(hierarchyLevel).times(function (n) {
                    return {id : n, title : 'Nivel ' + (n + 1)};
                });
                this.levelsCollection = new Backbone.Collection(levelsModels);

                this.levelView = new App.components.select.views.SelectView({
                    collection : this.levelsCollection,
                    selectionModel : this.filterDimension,
                    name : 'filterLevel',
                    el : this.$('.filter-sidebar-dimension-levels')
                });
                this.levelView.render();
                this.subviews.push(this.levelView);
            }

            this.setMaxHeight(this.maxHeight);
            this._onChangeOpen(this.filterDimension);

            return this.el;
        },

        getCollapsedHeight : function () {
            return this.$(".filter-sidebar-dimension-title").outerHeight(true);
        },

        _onClickTitle : function (e) {
            e.preventDefault();
            if (this.collapsable) {
                this.filterDimension.toggle('open');
            }
        },

        _onChangeOpen : function (model) {
            if (model.id === this.filterDimension.id) {
                this.$el.find('.collapse').toggleClass('in', this.filterDimension.get('open'));
            }
        },

        setMaxHeight : function (maxHeight) {
            this.maxHeight = maxHeight;
            this.$('.collapse').css('max-height', maxHeight);
        },

        resetLastIndex : function () {
            this.lastIndex = -1;
        }

    });
}());