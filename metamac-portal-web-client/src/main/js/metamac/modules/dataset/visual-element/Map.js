(function () {
    'use strict';

    App.namespace('App.VisualElement.Map');

    App.VisualElement.Map = function (options) {
        this.initialize(options);
    };

    App.VisualElement.Map.prototype = {

        initialize: function (options) {
            this.filterDimensions = options.filterDimensions;
            this.dataset = options.dataset;
            this.optionsModel = options.optionsModel;

            this.shapes = new App.Map.Shapes();
            this.mapType = options.mapType;
            this._type = "map";

            this.visible = false; //unnecesary?
        },

        _bindEvents: function () {
            var debounceReload = _.debounce(_.bind(this.reload, this), 20);
            this.listenTo(this.filterDimensions, "loading", this.showLoading());
            this.listenTo(this.filterDimensions, "change:drawable change:zone", debounceReload);
        },

        _unbindEvents: function () {
            this.stopListening();
        },

        reload: function () {
            this.destroy();
            this.load();
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
                if (this.$title) { this.$title.hide(); }
            if (!this.assertAllDimensionsHaveSelections()) {
                return;
            }

            this.visible = true;
            this.showLoading();

            var normCodes = this._getGeographicDimensionNormCodes();
            var allNormCodes = this._getAllGeographicDimensionNormCodes();

            var actions = {
                data: _.bind(this._loadData, this),
                shapes: _.bind(this.shapes.fetchShapes, this.shapes, normCodes),
                allShapes: _.bind(this.shapes.fetchShapes, this.shapes, allNormCodes),
                container: _.bind(this.shapes.fetchContainer, this.shapes, normCodes)
            };

            async.parallel(actions, function (err, result) {
                if (!err) {
                    self._geoJson = result.shapes;
                    self._container = result.container;
                    self._allGeoJson = result.allShapes;
                    self._dataJson = result.data;
                    self._loadCallback();
                }
            });
        },

        _loadData: function (cb) {
            var self = this;
            this.dataset.data.loadAllSelectedData()
                .done(function () {
                    var fixedPermutation = self.getFixedPermutation();
                    var geographicDimension = self._getGeographicDimension();
                    var geographicDimensionSelectedRepresentations = self._getGeographicSelectedRepresentations();

                    var result = {};
                    _.each(geographicDimensionSelectedRepresentations, function (geographicRepresentation) {
                        var normCode = geographicRepresentation.get("normCode");
                        if (normCode) {
                            var currentPermutation = {};
                            currentPermutation[geographicDimension.id] = geographicRepresentation.id;
                            _.extend(currentPermutation, fixedPermutation);

                            var value = self.dataset.data.getNumberData({ ids: currentPermutation });
                            if (_.isNumber(value)) {
                                result[normCode] = { value: value };
                            }
                        }
                    });
                    cb(null, result);
                })
                .fail(function () {
                    cb("Error fetching data");
                });
        },

        render: function () {
            if (this.visible) {
                this._mapContainerView.render();
            }
        },

        destroy: function () {
            this.visible = false;

            if (this._mapContainerView && this._mapContainerView.renderTo) {
                this._mapContainerView.destroy();
            }

            if (this._mapModel) {
                this._mapModel.off('change', this._handleTransform);
                this._mapModel.off('change:currentRangesNum', this._handleRangesNum);
                this._mapModel.off('zoomExit', this._handleZoomExit);
                this._listenersSetted = false;
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
            if (this.$title) { this.$title.show(); }
            this.render();
            this.hideLoading();
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
                dataset: this.dataset,
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
                showRightsHolder: this.showRightsHolderText()
            });
        },

        _setUpListeners: function () {
            if (!this._listenersSetted) {
                this._listenersSetted = true;
                this._mapModel.on('change:currentScale', this._handleTransform, this);
                this._mapModel.on('change:currentRangesNum', this._handleRangesNum, this);
                this._mapModel.on('zoomExit', this._handleZoomExit, this);
            }
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