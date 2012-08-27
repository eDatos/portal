(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.widget.FilterOptions");

    var Restriction = STAT4YOU.widget.FilterOptionsDimensionRestriction;

    STAT4YOU.widget.FilterOptions = function (options) {
        this.initialize(options);
    };

    STAT4YOU.widget.FilterOptions.prototype = {

        initialize : function (options) {
            this.metadata = options.metadata;
            this._initializeDimensions();
            this._initializeDimensionsMap();
            this._initializePositionLimits();
            this._initializePositions();
            this._initializeDimensionRestrictions();
            this._initializeTableInfo();

            this.setSelectedCategoriesRestriction({});
        },

        /**
         * Inicializa las dimension en función de los metadata
         *
         * @private
         */
        _initializeDimensions : function () {
            // Array for better access with number
            this.dimensions = this.metadata.getDimensionsAndRepresentations();

            for (var i = 0; i < this.dimensions.length; i++) {
                var dimension = this.dimensions[i];

                dimension.number = i;
                for (var j = 0; j < dimension.representations.length; j++) {
                    var representation = dimension.representations[j];
                    representation.number = j;
                }
            }
        },

        _initializeDimensionsMap : function () {
            // Map for better access with ID
            var self = this;
            this.dimensionsMap = {};
            _.each(this.dimensions, function (dimension) {
                self.dimensionsMap[dimension.id] = dimension;
            });
        },

        /**
         * Constantes para los limits de las posiciones de las dimensiones
         *
         * @private
         */
        _initializePositionLimits : function () {
            this.positionLimit = {
                left : {
                    begin : 0,
                    end : 19
                },
                sectors : {
                    begin : 0,
                    end : 0
                },
                horizontal : {
                    begin : 0,
                    end : 0
                },
                columns : {
                    begin : 20,
                    end : 20
                },
                lines : {
                    begin : 20,
                    end: 20
                },
                top : {
                    begin : 20,
                    end : 39
                },
                fixed : {
                    begin : 40,
                    end : 59
                }
            };
        },

        /**
         *  Inicializa las posiciones de las dimensions para una tabla. La mitad a la izquierda y la mitad en la
         *  parte superior
         *
         *  @private
         */
        _initializePositions : function () {
            var middle = Math.ceil(this.dimensions.length / 2);

            var left = this.dimensions.slice(0, middle);
            var top = this.dimensions.slice(middle);

            for (var i = 0; i < left.length; i++) {
                left[i].position = this.positionLimit.left.begin + i;
            }

            for (var i = 0; i < top.length; i++) {
                top[i].position = this.positionLimit.top.begin + i;
            }
        },

        /**
         *  Inicializa las restricciones de las dimensiones
         *
         *  @private
         */
        _initializeDimensionRestrictions : function () {
            _.each(this.dimensions, function (dimension) {
                var categoriesIds = _.pluck(dimension.representations, "id");
                dimension.restriction = new Restriction({categories : categoriesIds});
            });
        },

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
            }
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
                    result.representationsValues.push(_.pluck(representations, "label"));
                    result.representationsIds.push(_.pluck(representations, "id"));
                    result.representationsLengths.push(representations.length);
                });

                result.representationsMult = STAT4YOU.Table.Utils.rightProductAcumulate(result.representationsLengths);
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
         * @private
         *
         * @param dimensions
         * @return {*}
         */
        _simplifyDimensions : function (dimensions) {
            var self = this;
            //TODO Extend
            return _.map(dimensions, function (dimension) {
                return self._simplifyDimension(dimension);
            });
        },

        _simplifyDimension : function (dimension){
            var result = _.pick(dimension, "id", "number", "label");
            result.categories = this._simplifyCategories(dimension);
            return result;
        },

        _simplifyCategories : function (dimension) {
            var self = this;
            return _.map(dimension.representations, function (category) {
                return self._simplifyCategory(dimension, category);
            });
        },

        _simplifyCategory : function (dimension, category) {
            var result = _.extend({}, category);
            result.state = dimension.restriction.isCategorySelected(category.id) ? 1 : 0;
            return result;
        },

        /**
         * Obtiene las dimensiones
         * @return {*}
         */
        getDimensions : function () {
            return this._simplifyDimensions(this.dimensions);
        },

        _isValidZone : function (zone) {
            return (zone === "left") ||
                (zone === "sectors") ||
                (zone === "horizontal") ||
                (zone === "columns") ||
                (zone === "lines") ||
                (zone === "top") ||
                (zone === "fixed");
        },

        _getDimensionsInZone : function (zone) {
            if(!this._isValidZone(zone)){
                throw "Invalid Zone";
            }
            var zoneLimits = this.positionLimit[zone];
            return _.filter(this.dimensions, function (dimension) {
                return dimension.position >= zoneLimits.begin && dimension.position <= zoneLimits.end
            });
        },

        _getDimensionsNotInZone : function (zone) {
            var zoneLimits = this.positionLimit[zone];
            return _.filter(this.dimensions, function (dimension) {
                return dimension.position < zoneLimits.begin || dimension.position > zoneLimits.end
            });
        },

        _sortDimensionsByPosition : function (dimensions) {
            return _.sortBy(dimensions, function (dimension) { return dimension.position; });
        },

        /**
         * Obtiene las dimensiones en la izquierda
         *
         * @return {*}
         */
        getLeftDimensions : function () {
            var leftDimensions = this._getDimensionsInZone("left");
            leftDimensions = this._sortDimensionsByPosition(leftDimensions);
            return this._simplifyDimensions(leftDimensions);
        },

        getSectorsDimension : function () {
            return this.getLeftDimensions()[0];
        },

        getHorizontalDimension : function () {
            return this.getLeftDimensions()[0];
        },

        getColumnsDimension : function () {
            return this.getTopDimensions()[0];
        },

        getLinesDimension : function () {
            return this.getTopDimensions()[0];
        },

        /**
         * Obtiene las dimensiones en la parte izquierda
         *
         * @return {*}
         */
        getTopDimensions : function () {
            var topDimensions = this._getDimensionsInZone("top");
            topDimensions = this._sortDimensionsByPosition(topDimensions);
            return this._simplifyDimensions(topDimensions);
        },

        /**
         * Obtiene las dimensiones fijas
         * @return {*}
         */
        getFixedDimensions : function () {
            var fixedDimensions = this._getDimensionsInZone("fixed");
            fixedDimensions = this._sortDimensionsByPosition(fixedDimensions);
            return this._simplifyDimensions(fixedDimensions);
        },

        /**
         * @return {Number} Número de dimensiones
         */
        getDimensionsSize : function () {
            return this.dimensions.length();
        },

        _getDimension : function (dimension) {
            if (_.isString(dimension)) {
                return this.dimensionsMap[dimension];
            } else if (_.isNumber(dimension)) {
                return this.dimensions[dimension];
            }
        },

        /**
         * @param {String|Number} dimension
         */
        getDimension : function (dimension) {
            var result = this._getDimension(dimension);
            return this._simplifyDimension(result);
        },

        /**
         * @param {String|Number} param
         */
        getCategories : function (param) {
            var self = this;
            if (param !== undefined) {
                var dimension = this._getDimension(param);
                if (dimension) {
                    return this._simplifyCategories(dimension);
                }
            } else {
                return _.map(this.dimensions, function (dimension) {
                    return self._simplifyCategories(dimension);
                });
            }
        },

        /**
         *
         * @param {String|Number} dimension
         * @param {String|Number} category
         */
        getCategory : function (dimension, category) {
            var dimension = this._getDimension(dimension);
            if (dimension) {
                var result;
                if (_.isString(category)) {
                    result = _.find(dimension.representations, function (representation) {
                        return representation.id === category;
                    });
                } else if (_.isNumber(category)) {
                    result = dimension.representations[category];
                }
                return this._simplifyCategory(dimension, result);
            }
        },

        /**
         * @dimension {String|Number} dimension
         */
        getSelectedCategories : function (dimension) {
            if (dimension !== undefined) {
                var _dimension = this._getDimension(dimension);
                if (_dimension) {
                    var categories = this.getCategories(dimension);
                    return _.filter(categories, function (category) {
                        return category.state === 1;
                    });
                }
            }
        },

        /**
         * Activa o desactiva una categoria
         * @param {String|Number} dimension
         */
        toggleCategoryState : function (dimension, category) {
            var _dimension = this._getDimension(dimension);
            var _category = this.getCategory(dimension, category);

            _dimension.restriction.toggleCategorySelection(_category.id);
            //TODO initializeTableInfo()
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
            var result = {x: 0, y : 0};
            _.each(ids, function (category, dimension) {
                var dimension = self._getDimension(dimension);
                if(dimension){
                    var zone = self._getZoneFromPosition(dimension.position);

                    if(zone === "left" || zone === "top"){
                        var dimensionIndex = _.indexOf(self.tableInfo[zone].ids, dimension.id);
                        var representationIndex = _.indexOf(self.tableInfo[zone].representationsIds[dimensionIndex], category);
                        var mult = self.tableInfo[zone].representationsMult[dimensionIndex];

                        if(zone === "left"){
                            result.y = result.y + mult * representationIndex;
                        }else if(zone === "top"){
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
        },

        _getZoneFromPosition : function (position) {
            if (position >= this.positionLimit.left.begin && position <= this.positionLimit.left.end) {
                return "left";
            } else if (position >= this.positionLimit.top.begin && position <= this.positionLimit.top.end) {
                return "top";
            } else if (position >= this.positionLimit.fixed.begin && position <= this.positionLimit.fixed.end) {
                return "fixed";
            }
        },

        _removeDimensionCurrentZone : function (dimension, silent) {
            var currentPosition = dimension.position;
            var zone = this._getZoneFromPosition(dimension.position);
            dimension.position = -1;

            _.each(this._getDimensionsInZone(zone), function (dimension) {
                if (dimension.position > currentPosition) {
                    dimension.position = dimension.position - 1;
                }
            });
            this._initializeTableInfo();

            if(!silent){
                this.trigger('change');
            }
        },

        _appendDimensionToZone : function (dimension, zone, silent) {
            var dimensionsInZone = this._getDimensionsInZone(zone);
            var maxDimension = _.max(dimensionsInZone, function (dimension) {
                return dimension.position;
            });
            dimension.position = maxDimension ? maxDimension.position + 1 : this.positionLimit[zone].begin;

            this._applySelectedCategoriesRestriction();

            this._initializeTableInfo();

            if(!silent) {
                this.trigger('change');
            }
        },

        /**
         * @param {Number|String} dimension
         * @param {String} zone top|left|fixed
         */
        changeDimensionZone : function (dimension, zone, silent) {
            var dimension = this._getDimension(dimension);

            this._removeDimensionCurrentZone(dimension, true);
            this._appendDimensionToZone(dimension, zone, true);

            if(!silent){
                this.trigger('change');
            }
        },

        /**
         * Intercambia la posición de dos dimensiones
         * @param {String|Number} dimension1
         * @param {String|Number} dimension2
         * @param {boolean} [silent] if true don't trigger change event
         */
        swapDimensions : function (dimension1, dimension2, silent) {
            var dimension1 = this._getDimension(dimension1);
            var dimension2 = this._getDimension(dimension2);
            var aux = dimension1.position;

            //Intercambia la posición
            dimension1.position = dimension2.position;
            dimension2.position = aux;

            this._applySelectedCategoriesRestriction();

            if(!silent){
                this.trigger('change');
            }
        },

        /**
         * @param {Number} restriction.top
         * @param {Number} restriction.left
         */
        setZoneLengthRestriction : function (restriction) {
            var self = this;
            var leftDimensions = this.getLeftDimensions();
            var dimensionsToMove, n;

            // Apply Left Restriction
            if (restriction.left < leftDimensions.length) {
                // mover a otra zona
                dimensionsToMove = leftDimensions.slice(restriction.left);
                _.each(dimensionsToMove, function (dimension) {
                    self.changeDimensionZone(dimension.number, "top");
                });
            } else if (restriction.left > leftDimensions.length) {
                // faltan dimensiones
                n = restriction.left - leftDimensions.length;
                dimensionsToMove = _.first(this._getDimensionsNotInZone("left"), n);
                _.each(dimensionsToMove, function (dimension) {
                    self.changeDimensionZone(dimension.number, "left");
                });
            }

            // Apply Top Restriction
            var topDimensions = this.getTopDimensions();
            if (restriction.top < topDimensions.length) {
                // mover a otra zona
                dimensionsToMove = topDimensions.slice(restriction.top);
                _.each(dimensionsToMove, function (dimension) {
                    self.changeDimensionZone(dimension.number, "fixed");
                });
            } else if (restriction.top > topDimensions.length) {
                // faltan dimensiones
                n = restriction.top - topDimensions.length;
                dimensionsToMove = _.first(this._getDimensionsInZone("fixed"), n);
                _.each(dimensionsToMove, function (dimension) {
                    self.changeDimensionZone(dimension.number, "top");
                });
            }
            this.trigger('zoneLengthRestriction', {restriction : restriction});
        },

        /**
         * Establece el número máximo de elementos que se pueden seleccionar
         * en una zona
         * @param {Number} [restriction.left]
         * @param {Number} [restriction.sectors]
         * @param {Number} [restriction.horizontal]
         * @param {Number} [restriction.columns]
         * @param {Number} [restriction.lines]
         * @param {Number} [restriction.top]
         */
        setSelectedCategoriesRestriction : function (restriction) {
            this._selectedCategoriesRestriction = _.extend(restriction, {fixed : 1});
            this._applySelectedCategoriesRestriction();
            this.trigger('selectedCategoriesRestriction', {restriction : restriction});
        },

        _applySelectedCategoriesRestriction : function () {
            var self = this;
            _.each(this._selectedCategoriesRestriction, function (restriction, zone) {
                var dimensions = self._getDimensionsInZone(zone);
                _.each(dimensions, function (dimension){
                    dimension.restriction.setRestriction(restriction);
                });
            });
        },

        /**
         * Crea una nueva instancia de filterOptions
         */
        clone : function () {
            var cloned = new STAT4YOU.widget.FilterOptions({metadata : this.metadata});
            cloned.reset(this);
            return cloned;
        },

        /**
         * Copia todos los valores del filter options al
         * @param filterOptions
         */
        reset : function (filterOptions){
            this.metadata = filterOptions.metadata;
            this.positionLimit = _.clone(filterOptions.positionLimit);
            this._selectedCategoriesRestriction = _.extend({}, filterOptions._selectedCategoriesRestriction);

            this.dimensions = _.map(filterOptions.dimensions, function (dimension) {
                var newDimension = _.pick(dimension, "id", "label", "number", "position");

                newDimension.representations = _.map(dimension.representations, function (representation) {
                    return _.clone(representation);
                });
                newDimension.restriction = dimension.restriction.clone();

                return newDimension;
            });
            this._initializeDimensionsMap();
            this._initializeTableInfo();
            this.trigger('reset');
        },


        selectAllCategories : function (dimension) {
            var dim = this._getDimension(dimension);
            dim.restriction.selectAll();
        },

        unselectAllCategories : function (dimension) {
            var dim = this._getDimension(dimension);
            dim.restriction.unselectAll();
        },

        areAllCategoriesSelected : function (dimension) {
            var dim = this._getDimension(dimension);
            return dim.restriction.areAllSelected();
        }

    };

    _.extend(STAT4YOU.widget.FilterOptions.prototype, Backbone.Events);

}());
