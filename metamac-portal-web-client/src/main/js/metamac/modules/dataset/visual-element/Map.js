(function () {
    'use strict';

    App.namespace('App.VisualElement.Map');

    App.VisualElement.Map = function (options) {
        this.initialize(options);
    };

    App.VisualElement.Map.prototype = {

        initialize: function (options) {
            this.filterDimensions = options.filterDimensions;
            this.data = options.data;
            this.optionsModel = options.optionsModel;

            this.shapes = new App.Map.Shapes();
            this.mapType = options.mapType;
            this._type = "map";

            this.visible = false; //unnecesary?
        },

        _bindEvents: function () {
            var debounceReload = _.debounce(_.bind(this.reload, this), 200);
            this.listenTo(this.filterDimensions, "loading", this.showLoading);
            this.listenTo(this.filterDimensions, "change:drawable change:zone", debounceReload);
        },

        _unbindEvents: function () {
            this.stopListening();
        },

        reload: function () {
            this.destroy();
            this.load();
           /*  this.showLoading();

            this._dataJson = this._loadData();
            this._geoJson = this._findDrawableShapes();
            this._calculateRanges();
            this._mapContainerView.reload(this._dataJson, this._geoJson); */
        },

        _findDrawableShapes: function () {
            var normCodes = this._getGeographicDimensionNormCodes();
            return _.filter(this._allGeoJson, function(shape) {
                return !shape || _.contains(normCodes, shape.normCode);
            });
        },

        updatingDimensionPositions: function (oldElement) {
            if (!oldElement || oldElement._type !== "map") {
                this._applyVisualizationRestrictions();
                this.resetDimensionsLimits();

                this.filterDimensions.zones.get('left').set('fixedSize', 1);
                this.filterDimensions.zones.get('top').set('fixedSize', 0);
            }
        },

        _applyVisualizationRestrictions: function () {
            if (this._mustApplyVisualizationRestrictions()) {
                this._moveAllDimensionsToZone('fixed');
                this._forceGeographicDimensionInZone('left');

                this._applyVisualizationPreselections();
            }

            this._updateMustApplyVisualizationRestrictions();
        },

        _applyVisualizationPreselections: function () {
            this._preselectMostRecentTimeRepresentation();
            this._preselectMostPopulatedGeographicLevelRepresentations();
        },


        load: function () {
            var self = this;
            this._bindEvents();
            if (!this.assertAllDimensionsHaveSelections()) {
                return;
            }

            this.visible = true;
            this.showLoading();

            var allNormCodes = this._getAllGeographicDimensionNormCodes();

            this._dataJson = this._loadData();
            var actions = {};

            if (!this._allGeoJson) {
                actions["allShapes"] = _.bind(this.shapes.fetchShapes, this.shapes, allNormCodes);
            }

            if (!this._container) {
                actions["container"] = _.bind(this.shapes.fetchContainer, this.shapes);
            }

            async.parallel(actions, function (err, result) {
                if (!err) {
                    if (result.allShapes) {
                        self._allGeoJson = result.allShapes;
                    }
                    if (result.container) {
                        self._container = result.container;
                    }
                    self._geoJson = self._findDrawableShapes();
                    self._loadCallback();
                }
            });
        },

        _loadData: function () {
            var fixedPermutation = this.getFixedPermutation();
            var geographicDimension = this._getGeographicDimension();
            var geographicDimensionSelectedRepresentations = this._getGeographicSelectedRepresentations();

            var result = {};
            var self = this;
            _.each(geographicDimensionSelectedRepresentations, function (geographicRepresentation) {
                var normCode = geographicRepresentation.get("normCode");
                if (normCode) {
                    var currentPermutation = {};
                    currentPermutation[geographicDimension.id] = geographicRepresentation.id;
                    _.extend(currentPermutation, fixedPermutation);

                    var value = self.data.getNumberData({ ids: currentPermutation });
                    if (_.isNumber(value)) {
                        result[normCode] = { value: value };
                    }
                }
            });
            return result;
        },

        render: function () {
            if (this.visible) {
                this._mapContainerView.render();
            }
        },

        destroy: function () {
            this.visible = false;

            if (this._mapContainerView) {
                this._mapContainerView.destroy();
            }

            if (this._mapModel) {
                this._mapModel.off('change', this._handleTransform);
                this._mapModel.off('change:currentRangesNum', this._handleRangesNum);
                this._mapModel.off('zoomExit', this._handleZoomExit);
            }

            this._unbindEvents();
        },

        _getGeographicDimension: function () {
            return this.filterDimensions.dimensionsAtZone('left').at(0);
        },

        _getGeographicSelectedRepresentations: function () {
            return this._getGeographicDimension().get('representations').where({ drawable: true });
        },

        _getGeographicDimensionNormCodes: function () {
            var selectedRepresentations = this._getGeographicSelectedRepresentations();
            return _.invoke(selectedRepresentations, "get", "normCode");
        },

        _getAllGeographicDimensionNormCodes: function () {
            return _.invoke(this._getGeographicDimension().get('representations').models, "get", "normCode");
        },

        _loadCallback: function () {
            this._initModel();
            this._calculateRanges();
            this._initContainerView();
            this._initTitleView();

            this._setUpListeners();
            this.showTitle();
            this.render();
        },

        _initTitleView: function () {
            this.$title = $('<h3></h3>').prependTo(this.$el);
            this.updateTitle();
        },

        _initModel: function () {
            this._mapModel = new App.Map.MapModel();
        },

        _initContainerView: function () {
            this._mapContainerView = new App.Map.MapContainerView({
                el: this.el,
                data: this.data,
                filterDimensions: this.filterDimensions,
                mapModel: this._mapModel,
                geoJson: this._geoJson,
                allGeoJson: this._allGeoJson,
                container: this._container,
                dataJson: this._dataJson,
                width: $(this.el).width(),
                height: $(this.el).height(),
                mapType: this.mapType,
                title: this.getTitle(),
                rightsHolder: this.getRightsHolderText(),
                showRightsHolder: this.showRightsHolderText(),
                callback: _.bind(this.hideLoading, this)
            });
        },

        _setUpListeners: function () {
            this._mapModel.on('change:currentScale', this._handleTransform, this);
            this._mapModel.on('change:currentRangesNum', this._handleRangesNum, this);
            this._mapModel.on('zoomExit', this._handleZoomExit, this);
        },

        _calculateRanges: function () {
            var values = _.map(this._dataJson, function (value) {
                return value.value;
            });

            this.maxValue = _.max(values);
            this.minValue = _.min(values);

            this._mapModel.set("minValue", this.minValue);
            this._mapModel.set("maxValue", this.maxValue);
            this._mapModel.set("values", values);
        },

        _handleTransform: function () {
            this._mapContainerView.transform();
        },

        _handleRangesNum: function () {
            this._mapContainerView.updateRanges();
        },

        _handleZoomExit: function () {
            this._mapContainerView.zoomExit();
        }

    };

    _.defaults(App.VisualElement.Map.prototype, App.VisualElement.Base.prototype);
    _.extend(App.VisualElement.Map.prototype, Backbone.Events);

}());