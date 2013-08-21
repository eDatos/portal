(function () {
    "use strict";

    App.namespace("App.widget.filter.sidebar");

    var FilterSidebarDimensionView = App.widget.filter.sidebar.FilterSidebarDimensionView;

    App.widget.filter.sidebar.FilterSidebarView = Backbone.View.extend({

        template : App.templateManager.get('dataset/filter/sidebar/filter-sidebar-view'),

        id : "filterSidebar",
        icon : "icon-filter",
        title : "Filtrar",

        initialize : function (options) {
            this.filterDimensions = options.filterDimensions;
            this.optionsModel = options.optionsModel;

            //Initialize subviews here to keep state

            this.subviews = this.filterDimensions.map(function (dimension) {
                return new FilterSidebarDimensionView({
                    filterDimensions : this.filterDimensions,
                    filterDimension : dimension
                });
            }, this);

            //_.last(this.subviews).stateModel.set('collapsed', false); // open last subview
        },

        destroy : function () {
            _.invoke(this.subviews, 'destroy');
            this._unbindEvents();
        },

        events : {
            "resize" : "_onResize"
        },

        _bindEvents : function () {
            _.invoke(this.subviews, '_bindEvents');
        },

        _unbindEvents : function () {
            _.invoke(this.subviews, '_unbindEvents');
        },

        render : function () {
            this._unbindEvents();
            this._bindEvents();

            this.$el.html(this.template());
            var $dimensions = this.$('.filter-sidebar-dimensions');
            _.each(this.subviews, function (subview) {
                $dimensions.append(subview.render());
            }, this);

            this._onResize();
        },

        _onSubviewChangeCollapsed : function (changedView) {
            if (!changedView.stateModel.get('collapsed')) {
                _.chain(this.subviews)
                    .filter(function (subview) {
                        return changedView.cid !== subview.cid;
                    }).each(function (subview) {
                        subview.stateModel.set('collapsed', true);
                    });
            }
        },

        _onResize : function () {
            var totalCollapsedHeight = _.reduce(this.subviews, function (memo, subview) {
                return memo + subview.getCollapsedHeight();
            }, 0);
            var maxHeight = this.$el.height() - totalCollapsedHeight;
            _.each(this.subviews, function (subview) {
                subview.setMaxHeight(maxHeight);
            });
        }

    });


}());