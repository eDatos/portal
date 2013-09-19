(function () {
    "use strict";

    App.namespace("App.DataSourceDataset");

    App.DataSourceDataset = function (options) {
        this.dataset = options.dataset;
        this.filterDimensions = options.filterDimensions;
    };

    App.DataSourceDataset.prototype = {

        leftHeaderColumns : function () {
            return 1;
        },

        leftHeaderValues : function () {
            return this.filterDimensions.getTableInfo().leftHeaderValues;
        },

        topHeaderRows : function () {
            return this.filterDimensions.getTableInfo().top.representationsValues.length;
        },

        topHeaderValues : function () {
            return this.filterDimensions.getTableInfo().top.representationsValues;
        },

        cellAtIndex : function (cell) {
            return this.dataset.data.getStringData({cell : cell});
        },

        cellExists : function (cell) {
            var tableSize = this.filterDimensions.getTableInfo().getTableSize();
            return (cell.y >= 0 && cell.x >= 0) &&
                (tableSize.rows > cell.y && tableSize.columns > cell.x);
        },

        rows : function () {
            return this.filterDimensions.getTableInfo().getTableSize().rows;
        },

        columns : function () {
            return this.filterDimensions.getTableInfo().getTableSize().columns;
        },

        /**
         * Return top header tooltip values
         * {dimension.label} : {category.label}
         * @returns {Array}
         */
        topHeaderTooltipValues : function () {
            return this.topHeaderValues();
        },

        /**
         * Return left header tooltips values
         * {dimension.label} : {category.label}
         * @returns {Array}
         */
        leftHeaderTooltipValues : function () {
            return this.leftHeaderValues();
        }

    };

    _.extend(App.DataSourceDataset.prototype, Backbone.Events);

}());
