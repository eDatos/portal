(function () {
    'use strict';

    App.namespace('App.VisualElement.Map');

    App.VisualElement.Map = function (options) {
        this.initialize(options);
    };

    App.VisualElement.Map.prototype = {

        initialize : function (options) {
            this.filterDimensions = options.filterDimensions;
            this.dataset = options.dataset;
            this.shapes = new App.Map.Shapes();


            this.visible = false; //unnecesary?
        },

        _bindEvents : function () {
            var self = this;
            this.listenTo(this.filterDimensions, "change", function () {
                self.destroy();
                self.load();
            });
        },

        _unbindEvents : function () {
            this.stopListening();
        },

        updatingDimensionPositions : function () {
            this.filterDimensions.zones.get('left').set('fixedSize', 1);
            this.filterDimensions.zones.get('top').set('fixedSize', 1);
            this._forceGeographicDimensionInLeftZone();
        },

        _forceGeographicDimensionInLeftZone : function () {
            var geographicDimensions = this.filterDimensions.where({type : "GEOGRAPHIC_DIMENSION"});
            if (geographicDimensions.length == 0) {
                throw new Error("No geographic dimension");
            }
            var geographicDimension = geographicDimensions[0];
            this.filterDimensions.zones.setDimensionZone('left', geographicDimension);
        },

        load : function () {
            var self = this;
            this._bindEvents();
            this.visible = true;

            var normCodes = this._getGeographicDimensionNormCodes();

            var actions = {
                data : _.bind(this._loadData, this),
                shapes : _.bind(this.shapes.fetchShapes, this.shapes, normCodes),
                container : _.bind(this.shapes.fetchContainer, this.shapes, normCodes)
            };

            async.parallel(actions, function (err, result) {
                if (!err) {
                    self._geoJson = result.shapes;
                    self._container = result.container;
                    self._dataJson = result.data;
                    self._loadCallback();
                }
            });
        },

        _loadData : function (cb) {
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

                            var value = self.dataset.data.getNumberData({ids :currentPermutation});
                            if (_.isNumber(value)) {
                                result[normCode] = {value : value};
                            }
                        }
                    });
                    cb(null, result);
                })
                .fail(function () {
                    cb("Error fetching data");
                });
        },

        render : function () {
            if (this.visible) {
                this._mapContainerView.render();
            }
        },

        destroy : function () {
            this.visible = false;

            if (this._mapContainerView) {
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

        _getGeographicDimension : function () {
            return this.filterDimensions.dimensionsAtZone('left').at(0);
        },

        _getGeographicSelectedRepresentations : function () {
            return this._getGeographicDimension().get('representations').where({selected : true});
        },

        _getGeographicDimensionNormCodes : function () {
            var selectedRepresentations = this._getGeographicSelectedRepresentations();
            return _.invoke(selectedRepresentations, "get", "normCode");
        },

        _loadCallback : function () {
            this._initModel();
            this._calculateRanges();
            this._initContainerView();

            this._setUpListeners();
            this.render();
        },

        _initModel : function () {
            this._mapModel = new App.Map.MapModel();
        },

        _initContainerView : function () {
            this._mapContainerView = new App.Map.MapContainerView({
                el : this.el,
                dataset : this.dataset,
                filterDimensions : this.filterDimensions,
                mapModel : this._mapModel,
                geoJson : this._geoJson,
                container : this._container,
                dataJson : this._dataJson,
                width : $(this.el).width(),
                height : $(this.el).height()
            });
        },

        _setUpListeners : function () {
            if (!this._listenersSetted) {
                this._listenersSetted = true;
                this._mapModel.on('change', this._handleTransform, this);
                this._mapModel.on('change:currentRangesNum', this._handleRangesNum, this);
                this._mapModel.on('zoomExit', this._handleZoomExit, this);
            }
        },

        _calculateRanges : function () {
            var values = _.map(this._dataJson, function (value) {
                return value.value;
            });

            this.maxValue = _.max(values);
            this.minValue = _.min(values);

            this._mapModel.set("minValue", this.minValue);
            this._mapModel.set("maxValue", this.maxValue);
            this._mapModel.set("values", values);
        },

        _handleTransform : function () {
            this._mapContainerView.transform();
        },

        _handleRangesNum : function () {
            this._mapContainerView.updateRanges();
        },

        _handleZoomExit : function () {
            this._mapContainerView.zoomExit();
        }

    };

    _.defaults(App.VisualElement.Map.prototype, App.VisualElement.Base.prototype);
    _.extend(App.VisualElement.Map.prototype, Backbone.Events);

}());