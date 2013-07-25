(function () {
    "use strict";

    App.namespace("App.DataSourceDataset");

    App.DataSourceDataset = function (options) {
        this.dataset = options.dataset;
        this.filterOptions = options.filterOptions;
    };

    App.DataSourceDataset.prototype = {

        leftHeaderColumns : function () {
            return this.filterOptions.tableInfo.left.representationsValues.length;
        },

        leftHeaderValues : function () {
            return this.filterOptions.tableInfo.left.representationsValues;
        },

        topHeaderRows : function () {
            return this.filterOptions.tableInfo.top.representationsValues.length;
        },

        topHeaderValues : function () {
            return this.filterOptions.tableInfo.top.representationsValues;
        },

        cellAtIndex : function (cell) {
            return this.dataset.data.getDataByCell(cell);
        },

        cellExists : function (cell) {
            var tableSize = this.filterOptions.getTableSize();
            return (cell.y >= 0 && cell.x >= 0) &&
                (tableSize.rows > cell.y && tableSize.columns > cell.x);
        },

        rows : function () {
            return this.filterOptions.getTableSize().rows;
        },

        columns : function () {
            return this.filterOptions.getTableSize().columns;
        },


        /**
         * Return top header tooltip values
         * {dimension.label} : {category.label}
         * @returns {Array}
         */
        topHeaderTooltipValues : function () {
            var values = this.topHeaderValues();
            var dimensions = this.filterOptions.getTopDimensions();

            var tooltips = [];
            for (var i = 0; i < values.length; i++) {
                tooltips[i] = [];
                for (var j = 0; j < values[i].length; j++) {
                    if (dimensions[i]) {
                        tooltips[i][j] = dimensions[i].label + " : " + values[i][j];
                    }
                }
            }
            return tooltips;
        },

        /**
         * Return left header tooltips values
         * {dimension.label} : {category.label}
         * @returns {Array}
         */
        leftHeaderTooltipValues : function () {
            var values = this.leftHeaderValues();
            var dimensions = this.filterOptions.getLeftDimensions();

            var tooltips = [];
            for (var i = 0; i < values.length; i++) {
                tooltips[i] = [];
                for (var j = 0; j < values[i].length; j++) {
                    if(dimensions[i]) {
                        tooltips[i][j] = dimensions[i].label + " : " + values[i][j];
                    }
                }
            }
            return tooltips;
        }

    };

    _.extend(App.DataSourceDataset.prototype, Backbone.Events);

}());
