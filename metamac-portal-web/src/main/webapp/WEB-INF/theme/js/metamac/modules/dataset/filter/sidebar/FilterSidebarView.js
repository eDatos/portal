(function () {
    "use strict";

    App.namespace("App.widget.filter.sidebar");

    var FilterSidebarDimensionView = App.widget.filter.sidebar.FilterSidebarDimensionView;

    App.widget.filter.sidebar.FilterSidebarView = Backbone.View.extend({

        template : App.templateManager.get('widget/filter/sidebar/filter-sidebar-view'),

        id : "filterSidebar",
        icon : "icon-filter",
        title : "Filtrar",

        initialize : function (options) {
            this.filterOptions = options.filterOptions;
            this.optionsModel = options.optionsModel;

            //Initialize subviews here to keep state
            var dimensions = this.filterOptions.getDimensions();
            this.subviews = _.map(dimensions, function (dimension) {
                return new FilterSidebarDimensionView({
                    filterOptions : this.filterOptions,
                    dimension : dimension
                });
            }, this);
            _.last(this.subviews).stateModel.set('collapsed', false); // open last subview
        },

        destroy : function () {
            this._unbindEvents();
        },

        events : {
            "resize" : "_onResize"
        },

        _bindEvents : function () {
            this.listenTo(this.filterOptions, "zoneLengthRestriction", this.render);
            _.each(this.subviews, function (subview) {
                this.listenTo(subview.stateModel, 'change:collapsed', _.bind(this._onSubviewChangeCollapsed, this, subview));
            }, this);
        },

        _unbindEvents : function () {
            this.stopListening();
        },

        render : function () {
            this._unbindEvents();
            this._bindEvents();

            var dimensions = this.filterOptions.getDimensions();
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
                subview.stateModel.set('maxHeight', maxHeight);
            });
        }

    });


}());