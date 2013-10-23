(function () {
    "use strict";

    App.namespace('App.widget.filter.sidebar.FilterSidebarDimensionActionsView');

    App.widget.filter.sidebar.FilterSidebarDimensionActionsView = Backbone.View.extend({

        template : App.templateManager.get('dataset/filter/sidebar/filter-sidebar-dimension-actions'),

        initialize : function (options) {
            this.filterDimension = options.filterDimension;
        },

        destroy : function () {
            this._unbindEvents();
        },

        events : {
            "click .filter-sidebar-selectAll" : "_onSelectAll",
            "click .filter-sidebar-unselectAll" : "_onDeselectAll",
            "click .filter-sidebar-reverse" : "_onReverse"
        },

        _bindEvents : function () {
            var throttleRender = _.throttle(this.render, 40);
            this.listenTo(this.filterDimension, 'change:zone', throttleRender);
        },

        _unbindEvents : function () {
            this.stopListening();
        },

        _isFixedDimension : function () {
            var zone = this.filterDimension.get('zone');
            if (zone) {
                return zone.id === 'fixed';
            }
        },

        _isTimeDimension : function () {
            return this.filterDimension.get("type") === "TIME_DIMENSION";
        },

        render : function (){
            this._unbindEvents();
            this._bindEvents();
            var context = {
                isFixedDimension : this._isFixedDimension(),
                isTimeDimension : this._isTimeDimension()
            };
            this.$el.html(this.template(context));
        },

        _onSelectAll : function (e) {
            e.preventDefault();
            this.filterDimension.get('representations').selectVisible();
        },

        _onDeselectAll : function (e) {
            e.preventDefault();
            this.filterDimension.get('representations').deselectVisible();
        },

        _onReverse : function (e) {
            e.preventDefault();
            this.filterDimension.get('representations').reverse();
        }

    });

}());