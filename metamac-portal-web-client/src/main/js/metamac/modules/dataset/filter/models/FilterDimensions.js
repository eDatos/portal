(function () {
    "use strict";

    App.namespace('App.modules.dataset.filter.models.FilterDimensions');

    var FilterZone = App.modules.dataset.filter.models.FilterZone;

    var zoneOffsets = { left: 0, top: 20, fixed: 40, axisy: 60 };

    App.modules.dataset.filter.models.FilterDimensions = Backbone.Collection.extend({

        model: App.modules.dataset.filter.models.FilterDimension,

        initialize: function (models, options) {
            this.metadata = options.metadata;
            this.reset(this.metadata.getDimensionsAndRepresentations(), _.extend({ silent: true }, options));
            this._initializeZones();

            this.at(0).set('open', true); //open the first dimension
            this._bindEvents();

            this.accordion = true; //accordion behaviour
            this.valuesToIgnore = [];
        },

        _bindEvents: function () {
            this.listenTo(this, 'change:open', this._onChangeOpen);
            this.listenTo(this, 'change:drawable change:zone change:visibleLabelType', this._invalidateTableInfo);
            this.listenTo(this, 'reverse', this._invalidateTableInfo);
        },

        _initializeZones: function () {
            this.zones = App.modules.dataset.filter.models.FilterZones.initialize(this, this.metadata.getDimensionsPosition());
        },

        dimensionsAtZone: function (zoneId) {
            return this.zones.get(zoneId).get('dimensions');
        },

        isFixedZone: function (zoneId) {
            return this.zones.get(zoneId).isFixed();
        },

        getAllFixedDimensionsCopy: function () {
            var fixedDimensions = [];
            this.zones.getFixedZones().forEach(function (zone) {
                fixedDimensions = fixedDimensions.concat(_.clone(zone.get('dimensions').models));
            });
            return fixedDimensions;
        },

        getAllFixedDimensionsCopyByType: function (type) {
            return _(this.getAllFixedDimensionsCopy()).filter(function (dimension) {
                return dimension.get("type") == type;
            });
        },

        getAllNonFixedDimensionsCopyByType: function (type) {
            return this.filter(function (dimension) {
                return dimension.get("type") == type && !dimension.isFixedDimension();
            });
        },

        getDimensionsWithoutSelections: function () {
            return this.filter(function (dimension) {
                return dimension.get('representations').where({ selected: true }).length == 0;
            });
        },

        getDimensionsWithSomeRepresentationNotSelected: function () {
            return this.filter(function (dimension) {
                return dimension.get('representations').where({ selected: false }).length > 0;
            });
        },

        getTableInfo: function () {
            if (!this.tableInfo) {
                this.tableInfo = new App.modules.dataset.filter.models.FilterTableInfo({ filterDimensions: this });
            }
            return this.tableInfo;
        },

        _invalidateTableInfo: function () {
            this.tableInfo = undefined;
        },

        _onChangeOpen: function (model, value) {
            if (value && this.accordion) {
                var openDimensions = this.where({ open: true });
                if (openDimensions.length > 1) {
                    this._closeDimensions(model, openDimensions);
                }
            }
        },

        closeOpenDimensions: function (model) {
            if (this.accordion) { //Accordion behaviour in dimensions
                var openDimensions = this.where({ open: true });
                this._closeDimensions(model, openDimensions);
            }
        },

        _closeDimensions: function (model, dimensions) {
            var otherOpenDimensions = _.find(dimensions, function (openDimension) {
                return !model || openDimension.id !== model.id;
            });
            if (otherOpenDimensions) {
                otherOpenDimensions.set({ open: false });
            }
        },

        _zoneIdFromPosition: function (position) {
            if (position < 20) return 'left';
            if (position < 40) return 'top';
            if (position >= 60 && position < 80) return 'axisy';
            return 'fixed';
        },

        importGeographicSelection: function (selection) {
            var geographicDimension = this.where({ type: "GEOGRAPHIC_DIMENSION" });
            if (!geographicDimension || geographicDimension.length > 1) {
                console.warn("Something went wrong, no appropiate geographicDimensions ", geographicDimension);
            } else {
                var json = {};
                geographicDimension = geographicDimension[0];
                var zone = geographicDimension.get('zone');
                var position = zoneOffsets[zone.id] + zone.get('dimensions').indexOf(geographicDimension);
                json[geographicDimension.id] = {
                    position: position,
                    selectedCategories: selection.split("|")
                }
                this.importJSON(json);
            }
        },

        canDrawLineVisualizations: function () {
            var timeDimensions = this.where({ type: "TIME_DIMENSION" });
            return timeDimensions && timeDimensions.length > 0;
        },

        canDrawMapVisualizations: function () {
            return this.metadata.identifier().type != App.Constants.visualization.type.INDICATOR
                && this.metadata.identifier().type != App.Constants.visualization.type.INDICATOR_INSTANCE;
        },

        importJSON: function (json) {

            var dimensionsToImport = _.chain(json).map(function (value, key) {
                value.id = key;
                return value;
            }).sortBy('position').value();

            _.each(dimensionsToImport, function (dimensionToImport) {
                var dimension = this.get(dimensionToImport.id);
                if (!dimension) throw new Error("invalid dimension");

                // visibleLabelType
                dimension.set('visibleLabelType', dimensionToImport.visibleLabelType);

                //zone
                var zoneId = this._zoneIdFromPosition(dimensionToImport.position);
                this.zones.setDimensionZone(zoneId, dimension, { force: true });

                //selectedRepresentations
                var representations = dimension.get('representations');
                representations._unbindEvents();

                _.each(dimensionToImport.categories, function (category) {
                    if (!_.isUndefined(representations.get(category.id))) {
                        representations.get(category.id).set({ 
                            selected: category.selected,
                            drawable: category.drawable
                         });
                    }
                });

                this._calculateSelectedGeographicLevel(dimension, representations);
                this._calculateSelectedTemporalGranularity(dimension, representations);
                
                representations._bindEvents();
                representations.trigger("change:drawable");
            }, this);
            this.zones.applyFixedSizeRestriction();
        },

        _calculateSelectedGeographicLevel: function (dimension, representations) {
            var selectedLevels = _.uniq(_.map(representations.where({ selected: true, drawable: true }), function(representation) {
                return representation.get('level');
            }));
            if (dimension.get('type') === "GEOGRAPHIC_DIMENSION" && selectedLevels.length === 1) {
                representations.setSelectedGeographicLevel(selectedLevels[0]);
            }
        },

        _calculateSelectedTemporalGranularity: function (dimension, representations) {
            var selectedGranularities = _.uniq(_.map(representations.where({ selected: true, drawable: true }), function(representation) {
                return representation.get('temporalGranularity');
            }));
            if (dimension.get('type') === "TIME_DIMENSION" && selectedGranularities.length === 1) {
                representations.setSelectedTemporalGranularity(selectedGranularities[0]);
            }
        },

        exportJSON: function () {
            var exportResult = {};
            this.each(function (dimension) {
                var zone = dimension.get('zone');
                var position = zoneOffsets[zone.id] + zone.get('dimensions').indexOf(dimension);
                var categories = _.map(dimension.get('representations').models, function(representation) {
                    return { 
                        id: representation.id,
                        selected: representation.get('selected'),
                        drawable: representation.get('drawable')
                    } 
                });
                exportResult[dimension.id] = {
                    position: position,
                    visibleLabelType: dimension.get('visibleLabelType'),
                    categories: categories
                }
            });
            return exportResult;
        },


        hasMultidataset: function () {
            return this.metadata.hasMultidataset();
        },

        getMultidatasetId: function () {
            return this.metadata.identifier().multidatasetId;
        },

        filterDimensionsByValues: function (valuesToIgnore) {
            this.valuesToIgnore = valuesToIgnore;
            this.trigger('change:filterByValues', valuesToIgnore);
        },

        getValuesToIgnore() {
            return this.valuesToIgnore;
        },

        importValuesToIgnore(valuesToIgnore) {
            if (Array.isArray(valuesToIgnore)) {
                this.trigger('onImportValuesToIgnore', valuesToIgnore);
                this.filterDimensionsByValues(valuesToIgnore);
            }
        }

    }, {
            initializeWithMetadata: function (metadata) {
                return new App.modules.dataset.filter.models.FilterDimensions(undefined, { metadata: metadata, parse: true });
            }
        });

}());