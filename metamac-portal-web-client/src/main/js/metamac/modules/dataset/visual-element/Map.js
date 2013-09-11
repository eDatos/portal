(function () {
    'use strict';

    App.namespace('App.VisualElement.Map');

    App.VisualElement.Map = function (options) {
        this.initialize(options);
    };

    App.VisualElement.Map.prototype = {

        initialize : function (options) {
            this.el = options.el;
            this.$el = $(this.el);
            this.filterOptions = options.filterOptions;
            this.dataset = options.dataset;
            this.shapes = new App.Map.Shapes();
            this.visible = false;
        },

        _bindEvents : function () {
            var self = this;
            this.listenTo(this.filterOptions, "change", function () {
                self.destroy();
                self.load();
            });
        },

        _unbindEvents : function () {
            this.stopListening();
        },

        load : function () {
            this._bindEvents();
            this.visible = true;
            var self = this;

            var dataReq = this.dataset.data.loadAllSelectedData();
            var normCodes = this._getNormCodes();

            var shapesReq = this.shapes.fetchShapes(normCodes)
                .done(function (shapes) {
                    self._geoJson = shapes;
                });

            var containerReq = this.shapes.fetchContainer(normCodes)
                .done(function (shape) {
                    self._container = shape;
                });

            $.when(dataReq, shapesReq, containerReq).then(function () {
                self._loadCallback();
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

        updatingDimensionPositions : function () {
            this.filterOptions.setZoneLengthRestriction({left : {value : 1, type : "GEOGRAPHIC_DIMENSION"}, top : 0});
            this.filterOptions.setSelectedCategoriesRestriction({map : -1});
        },

        _getNormCodes : function () {
            var dimension = this.filterOptions.getMapDimension();
            var selectedCategories = this.filterOptions.getSelectedCategories(dimension.id);
            return _.pluck(selectedCategories, 'normCode');
        },

        _checkDataAndShapes : function () {
            if (this._areDataAndShapesLoaded()) {
                this._loadCallback();
            }
        },

        _areDataAndShapesLoaded : function () {
            return (this.dataset.data.isAllSelectedDataLoaded() && this._geoJson && this._container);
        },

        _loadCallback : function () {
            this._dataJson = this._getData();

            this._initModel();
            this._calculateRanges();
            this._initContainerView();
            this._setUpListeners();
            this.render();
            this.trigger('didLoadVe');
        },

        _getData : function () {
            var self = this;

            var fixedPermutation = this.getFixedPermutation();
            var mapDimension = this.filterOptions.getMapDimension();
            var mapDimensionsSelectedCagegories = this.filterOptions.getSelectedCategories(mapDimension.number);

            var result = {};
            _.each(mapDimensionsSelectedCagegories, function (mapCategory) {
                if (mapCategory.normCode) {
                    var currentPermutation = {};
                    currentPermutation[mapDimension.id] = mapCategory.id;
                    _.extend(currentPermutation, fixedPermutation);

                    var value = self.dataset.data.getNumberDataById(currentPermutation);
                    if (_.isNumber(value)) {
                        result[mapCategory.normCode] = {value : value};
                    }
                }
            });
            return result;
        },

        _initModel : function () {
            this._mapModel = new App.Map.MapModel();
        },

        _initContainerView : function () {
            this._mapContainerView = new App.Map.MapContainerView({
                el : this.el,
                dataset : this.dataset,
                filterOptions : this.filterOptions,
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