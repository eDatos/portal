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
            if (value) {
                this.closeOpenDimensions(model);
            }
        },

        closeOpenDimensions: function (model) {
            if (this.accordion) { //Accordion behaviour in dimensions
                var openDimensions = this.where({ open: true });
                var otherOpenDimension = _.find(openDimensions, function (openDimension) {
                    return !model || openDimension.id !== model.id;
                });
                if (otherOpenDimension) {
                    otherOpenDimension.set({ open: false });
                }
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
                representations.invoke('set', { selected: false }, { trigger: false });
                _.each(dimensionToImport.selectedCategories, function (category) {
                    if (!_.isUndefined(representations.get(category))) {
                        representations.get(category).set({ selected: true });
                    }
                });
                representations._bindEvents();
                representations._updateDrawables();

            }, this);
            this.zones.applyFixedSizeRestriction();
        },

        exportJSON: function () {
            var exportResult = {};
            this.each(function (dimension) {
                var selectedCategories = dimension.get('representations').where({ selected: true });
                var selectedCategoriesIds = _.pluck(selectedCategories, 'id');
                var zone = dimension.get('zone');
                var position = zoneOffsets[zone.id] + zone.get('dimensions').indexOf(dimension);
                exportResult[dimension.id] = {
                    position: position,
                    visibleLabelType: dimension.get('visibleLabelType'),
                    selectedCategories: selectedCategoriesIds
                }
            });
            return exportResult;
        },


        hasMultidataset: function () {
            return this.metadata.hasMultidataset();
        },

        getMultidatasetId: function () {
            return this.metadata.identifier().multidatasetId;
        }

    }, {
            initializeWithMetadata: function (metadata) {
                return new App.modules.dataset.filter.models.FilterDimensions(undefined, { metadata: metadata, parse: true });
            }
        });

}());