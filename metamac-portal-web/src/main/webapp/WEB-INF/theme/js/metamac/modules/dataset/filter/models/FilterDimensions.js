(function () {
    "use strict";

    App.namespace('App.modules.dataset.filter.models.FilterDimensions');

    var FilterZone = App.modules.dataset.filter.models.FilterZone;

    App.modules.dataset.filter.models.FilterDimensions = Backbone.Collection.extend({

        model : App.modules.dataset.filter.models.FilterDimension,

        initialize : function (models, options) {
            this.metadata = options.metadata;
            this.reset(this.metadata.getDimensionsAndRepresentations(), _.extend({silent : true}, options));
            this._initializeZones();

            this.at(0).set('open', true); //open the first dimension
            this._bindEvents();
        },

        _bindEvents : function () {
            this.listenTo(this, 'change:open', this._onChangeOpen);
            this.listenTo(this, 'change:selected change:zone', this._invalidateTableInfo);
        },

        _initializeZones : function () {
            this.zones = App.modules.dataset.filter.models.FilterZones.initialize(this, this.metadata.getDimensionsPosition());
        },

        dimensionsAtZone : function (zoneId) {
            return this.zones.get(zoneId).get('dimensions');
        },

        getTableInfo : function () {
            if (!this.tableInfo) {
                this.tableInfo = new App.modules.dataset.filter.models.FilterTableInfo({filterDimensions : this});
            }
            return this.tableInfo;
        },

        _invalidateTableInfo : function () {
            this.tableInfo = undefined;
        },

        _onChangeOpen : function (model, value) {
            if (value) { //Accordion behaviour in dimensions
                var openDimensions = this.where({open : true});
                if (openDimensions.length > 1) {
                    var otherOpenDimension = _.find(openDimensions, function (openDimension) {
                        return openDimension.id !== model.id;
                    });
                    otherOpenDimension.set({open : false});
                }
            }
        },

        _zoneIdFromPosition : function (position) {
            if (position < 20) return 'left';
            if (position < 40) return 'top';
            return 'fixed';
        },

        importJSON : function (json) {

            var dimensionsToImport = _.chain(json).map(function (value, key) {
                value.id = key;
                return value;
            }).sortBy('position').value();

            _.each(dimensionsToImport, function (dimensionToImport) {
                var dimension = this.get(dimensionToImport.id);
                if (!dimension) throw new Error("invalid dimension");

                //zone
                var zoneId = this._zoneIdFromPosition(dimensionToImport.position);
                this.zones.setDimensionZone(zoneId, dimension, {force : true});


                //selectedRepresentations
                var representations = dimension.get('representations');
                representations._unbindEvents();
                representations.invoke('set', {selected : false}, {trigger : false});
                _.each(dimensionToImport.selectedCategories, function (category) {
                    representations.get(category).set({selected : true});
                });
                representations._bindEvents();

            }, this);
            this.zones.applyFixedSizeRestriction();
        },

        exportJSON : function () {
            var exportResult = {};
            var zoneOffsets = {left : 0, top : 20, fixed : 40};
            this.each(function (dimension) {
                var selectedCategories = dimension.get('representations').where({selected : true});
                var selectedCategoriesIds = _.pluck(selectedCategories, 'id');
                var zone = dimension.get('zone');
                var position = zoneOffsets[zone.id] + zone.get('dimensions').indexOf(dimension);
                exportResult[dimension.id] = {
                    position : position,
                    selectedCategories : selectedCategoriesIds
                }
            });
            return exportResult;
        }

    }, {
        initializeWithMetadata : function (metadata) {
            return new App.modules.dataset.filter.models.FilterDimensions(undefined, {metadata : metadata, parse : true});
        }
    });

}());