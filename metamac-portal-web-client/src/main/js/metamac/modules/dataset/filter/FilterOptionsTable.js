(function () {
    "use strict";

    App.namespace("App.widget.FilterOptionsTable");

    App.widget.FilterOptionsTable = function () {
        throw "This is only a mixin";
    };

    App.widget.FilterOptionsTable.prototype = {

        _initializeTableInfo : function () {
            var self = this;
            var fixedPermutations = {};
            var fixedDimensions = this.getFixedDimensions();

            _.each(fixedDimensions, function (dimension) {
                var categories = self.getSelectedCategories(dimension.id);
                fixedPermutations[dimension.id] = categories[0].id; // Las dimensiones fijas tienen un único valor seleccionado
            });

            this.tableInfo = {
                top : this._initializeTableInfoForDimensions(this.getTopDimensions()),
                left : this._initializeTableInfoForDimensions(this.getLeftDimensions()),
                fixed : fixedPermutations
            };
        },

        _initializeTableInfoForDimensions : function (dimensions) {
            var self = this;
            if (dimensions.length > 0) {
                var result = {
                    ids : [],
                    representationsValues : [],
                    representationsIds : [],
                    representationsLengths : []
                };

                _.each(dimensions, function (dimension) {
                    result.ids.push(dimension.id);
                    var representations = self.getSelectedCategories(dimension.id);

                    if (dimension.type === "TIME_DIMENSION") {
                        representations = _.sortBy(representations,function (representation) {
                            return representation.normCode;
                        }).reverse();
                    }

                    result.representationsValues.push(_.pluck(representations, "label"));
                    result.representationsIds.push(_.pluck(representations, "id"));
                    result.representationsLengths.push(representations.length);
                });

                result.representationsMult = App.Table.Utils.rightProductAcumulate(result.representationsLengths);
                return result;
            } else {
                // Empty header should have at least an empty element
                return {
                    ids : [undefined],
                    representationsValues : [
                        [""]
                    ],
                    representationsIds : [
                        [undefined]
                    ],
                    representationsLengths : [1],
                    representationsMult : [1]
                };
            }
        },


        /**
         *  @param {Number} cell.x
         *  @param {Number} cell.y
         *
         *  @return { dim1 : ['cat1', 'cat2'], dim2 : ['cat1'] }
         */
        getCategoryIdsForCell : function (cell) {
            var permutation = {},
                i, index, representation, dimensionId;

            for (i = 0; i < this.tableInfo.left.ids.length; i++) {
                index = (Math.floor(cell.y / this.tableInfo.left.representationsMult[i])) % this.tableInfo.left.representationsLengths[i];
                representation = this.tableInfo.left.representationsIds[i][index];
                dimensionId = this.tableInfo.left.ids[i];
                if (dimensionId) {
                    permutation[dimensionId] = representation;
                }
            }

            for (i = 0; i < this.tableInfo.top.ids.length; i++) {
                index = (Math.floor(cell.x / this.tableInfo.top.representationsMult[i])) % this.tableInfo.top.representationsLengths[i];
                representation = this.tableInfo.top.representationsIds[i][index];
                dimensionId = this.tableInfo.top.ids[i];
                if (dimensionId) {
                    permutation[dimensionId] = representation;
                }
            }

            _.extend(permutation, this.tableInfo.fixed);

            return permutation;
        },

        getCellForCategoryIds : function (ids) {
            var self = this;
            var result = {x : 0, y : 0};
            _.each(ids, function (category, dimensionId) {


                var dimension = self._getDimension(dimension);
                if (dimension) {
                    var zone = self._getZoneFromPosition(dimension.position);

                    if (zone === "left" || zone === "top") {
                        var dimensionIndex = _.indexOf(self.tableInfo[zone].ids, dimension.id);
                        var representationIndex = _.indexOf(self.tableInfo[zone].representationsIds[dimensionIndex], category);
                        var mult = self.tableInfo[zone].representationsMult[dimensionIndex];

                        if (zone === "left") {
                            result.y = result.y + mult * representationIndex;
                        } else if (zone === "top") {
                            result.x = result.x + mult * representationIndex;
                        }
                    }
                }
            });
            return result;
        },

        /**
         *  @param {Number} region.left.begin
         *  @param {Number} region.left.end
         *  @param {Number} region.top.begin
         *  @param {Number} region.top.end
         *
         *  @return { dim1 : ['cat1', 'cat2'], dim2 : ['cat1'] }
         */
        getCategoryIdsForRegion : function (region) {
            var permutations = [];
            for (var x = region.left.begin; x < region.left.end; x++) {
                for (var y = region.top.begin; y < region.top.end; y++) {
                    permutations.push(this.getCategoryIdsForCell({x : x, y : y}));
                }
            }

            var result = {};
            _.each(permutations, function (permutation) {
                _.each(permutation, function (representation, dimension) {
                    if (!result[dimension]) {
                        result[dimension] = [];
                    }
                    result[dimension].push(representation);
                });
            });

            result = _.map(result, function (representation, dimension) {
                return {id : dimension, representations : _.unique(representation)};
            });

            return result;
        },

        _dimensionsTotalSize : function (representationsLength) {
            var size = _.reduce(representationsLength, function (mem, value) {
                return mem * value;
            }, 1);
            return size;
        },

        /**
         *
         * @return {Object}
         */
        getTableSize : function () {
            return {
                columns : this._dimensionsTotalSize(this.tableInfo.top.representationsLengths),
                rows : this._dimensionsTotalSize(this.tableInfo.left.representationsLengths)
            };
        }

    };

}());