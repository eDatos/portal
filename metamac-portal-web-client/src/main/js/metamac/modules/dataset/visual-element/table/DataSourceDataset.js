(function () {
    "use strict";

    App.namespace("App.DataSourceDataset");

    App.DataSourceDataset = function (options) {
        this.dataset = options.dataset;
        this.filterDimensions = options.filterDimensions;
    };

    App.DataSourceDataset.prototype = {

        leftHeaderColumns: function () {
            return 1;
        },

        leftHeaderValues: function () {
            return this.filterDimensions.getTableInfo().leftHeaderValues;
        },

        leftHeaderValuesByDimension: function () {
            return this.filterDimensions.getTableInfo().left.representationsValues;
        },

        leftHeaderDimensionsLengths: function () {
            return this.filterDimensions.getTableInfo().left.representationsLengths;
        },


        leftHeaderDimensionsElements: function (dimension) {
            return this.filterDimensions.getTableInfo().elementsByLeftDimension(this.leftHeaderDimensionsLengths(), dimension);
        },

        leftHeaderDimensionsBlanks: function (dimension) {
            return this.filterDimensions.getTableInfo().blanksByLeftDimension(this.leftHeaderDimensionsLengths(), dimension);
        },

        topHeaderRows: function () {
            return this.filterDimensions.getTableInfo().top.representationsValues.length;
        },

        topHeaderValues: function () {
            return this.filterDimensions.getTableInfo().top.representationsValues;
        },

        cellAtIndex: function (cell) {
            return this.dataset.data.getStringData({ cell: cell });
        },

        cellExists: function (cell) {
            var tableSize = this.filterDimensions.getTableInfo().getTableSize();
            return (cell.y >= 0 && cell.x >= 0) &&
                (tableSize.rows > cell.y && tableSize.columns > cell.x);
        },

        cellHasPrimaryAttributes: function (cell) {
            var cellAttributes = this.dataset.data.getAttributes({ cell: cell });
            return !_.isUndefined(cellAttributes)
                && !_.isUndefined(cellAttributes.primaryMeasureAttributes)
                && _.compact(cellAttributes.primaryMeasureAttributes).length > 0;
        },

        cellAttributesAtIndex: function (cell) {
            return this.dataset.data.getAttributes({ cell: cell });
        },

        cellInfoAtIndex: function (cell) {
            var categoryValues = this.filterDimensions.getTableInfo().getCategoryValuesForCell(cell);
            var formattedCategories = this._formatCategories(categoryValues);
            return {
                attributes: this.cellAttributesAtIndex(cell),
                categories: formattedCategories
            };
        },

        _formatCategories: function (categoryValues) {
            var self = this;
            return _.map(categoryValues, function (value, key) {
                return {
                    dimension: self.filterDimensions.get(key).get('label'),
                    value: value
                };
            });
        },

        datasetAttributes: function () {
            return this.dataset.data.getDatasetAttributes();
        },

        rows: function () {
            return this.filterDimensions.getTableInfo().getTableSize().rows;
        },

        columns: function () {
            return this.filterDimensions.getTableInfo().getTableSize().columns;
        },

        isBlankRow: function (row) {
            var dimensionElements = 0;
            var pos = row;
            // Starts on one because the first one is not nested on another dimension
            for (var dimension = 1; dimension < this.leftHeaderDimensionsLengths().length; dimension++) {

                dimensionElements = this.leftHeaderDimensionsElements(dimension);

                // Check if the current row is the first of this dimension; if not, 'enter' the next nested dimension
                pos = pos % dimensionElements;
                if (pos == dimension - 1)
                    return true;
            }
            return false;
        },

        blankRowsOffset: function (row) {
            var dimensionElements = 0;
            var pos = row;
            var blanks = 0;

            // Starts on one because the first one is not nested on another dimension
            var blanksElementsForDimension = 0;
            for (var dimension = 1; dimension < this.leftHeaderDimensionsLengths().length; dimension++) {

                dimensionElements = this.leftHeaderDimensionsElements(dimension);
                blanksElementsForDimension = this.leftHeaderDimensionsBlanks(dimension);

                blanks += Math.floor(pos / dimensionElements) * blanksElementsForDimension;

                pos = pos % dimensionElements;
                if (pos == 0) { // Blank row
                    return blanks;
                } else { // "Enter" next dimension level
                    pos--;
                    blanks++;
                }
            }
            return blanks;
        },

        /**
         * Return top header tooltip values
         * {dimension.label} : {category.label}
         * @returns {Array}
         */
        topHeaderTooltipValues: function () {
            return this._generateTooltipValues(this.topHeaderValues(), this.filterDimensions.getTableInfo().top.ids);
        },

        /**
         * Return left header tooltips values
         * {dimension.label} : {category.label}
         * @returns {Array}
         */
        leftHeaderTooltipValues: function () {
            var leftHeaderTooltipValuesByDimension = this._generateTooltipValues(this.leftHeaderValuesByDimension(), this.filterDimensions.getTableInfo().left.ids);

            return this._compressLeftHeaderValuesByDimension(leftHeaderTooltipValuesByDimension);
        },

        _compressLeftHeaderValuesByDimension: function (valuesByDimension) {
            var memo = [];
            return [_.flatten(_.reduceRight(valuesByDimension, function (memo, values) {
                return _.map(values, function (value) {
                    return [value].concat(memo);
                });
            }, memo, this))];
        },

        _generateTooltipValues: function (titlesByDimension, dimensionIds) {
            var result = [];

            _.each(titlesByDimension, function (titles, dimensionIndex) {
                result.push(
                    _.map(titlesByDimension[dimensionIndex], function (title) {
                        return { title: title, dimensionId: dimensionIds[dimensionIndex] }
                    })
                );
            });

            return result;
        }

    };

    _.extend(App.DataSourceDataset.prototype, Backbone.Events);

}());
