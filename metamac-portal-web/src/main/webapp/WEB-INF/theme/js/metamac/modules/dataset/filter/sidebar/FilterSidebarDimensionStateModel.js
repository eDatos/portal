(function () {
    "use strict";

    App.namespace("App.widget.filter.sidebar");

    App.widget.filter.sidebar.FilterSidebarDimensionStateModel = Backbone.Model.extend({

        defaults : {
            "categoryFilter" : "",
            "collapsed" : true,
            "maxHeight" : 150
        },

        isFiltering : function () {
            var categoryFilter = this.get("categoryFilter");
            return categoryFilter.trim().length > 0;
        },

        isVisibleWithCategoryFilter : function (str) {
            var categoryFilter = this.get("categoryFilter");
            var visible = !this.isFiltering() || (str.toLowerCase().indexOf(categoryFilter.toLowerCase()) >= 0);
            return visible;
        }

    });
}());