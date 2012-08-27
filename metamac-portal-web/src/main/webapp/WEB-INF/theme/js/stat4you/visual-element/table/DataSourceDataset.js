(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.DataSourceDataset");

    STAT4YOU.DataSourceDataset = function (options) {
        this.dataset = options.dataset;
        this.filterOptions = options.filterOptions;
    };

    STAT4YOU.DataSourceDataset.prototype = {

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
        }

    };

    _.extend(STAT4YOU.DataSourceDataset.prototype, Backbone.Events);

}());
