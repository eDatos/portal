(function () {
    'use strict';

    var GeoJsonConverter = App.Map.GeoJsonConverter;
    var Constants = App.Constants;

    App.namespace('App.Map.MapView');

    App.Map.MapView = Backbone.View.extend({
        _defaultSeriesOptions: {
            mapData: null,
            joinBy: ['code', 'code'],
            data: null
        },

        // Esta fontFamily debe ser siempre equivalente a @istacFontFamilySansSerifFamily
        _defaultMapOptions: {
            chart: {
                className: 'map',
                animation: false,
            },

            title: {
                text: null,
                y: 30
            },

            legend: {
                enabled: true,
                layout: 'horizontal',
                floating: false,
                // align: 'left', // don't use, bugged
                y: -5,
                x: 0,
                backgroundColor: Constants.colors.istacWhite,
                borderColor: Constants.colors.istacGreyMedium,
                borderWidth: 1,
                borderRadius: 5,
                shadow: true,
                itemStyle: {
                    "fontWeight": "normal",
                    "fontSize": "11px",

                },
                padding: 6,
                itemMarginTop: 3,
                itemMarginBottom: 3,
                itemDistance: 6
            },

            colorAxis: {
                minColor: Constants.colors.istacBlueWhite,
                maxColor: Constants.colors.istacBlueDark
            },

            plotOptions: {
                map: {
                    color: Constants.colors.istacYellow,
                    states: {
                        hover: {
                            color: Constants.colors.istacYellow
                        }
                    }
                },
                mapbubble: {
                    color: Constants.colors.istacYellow
                }
            },

            series: [],

            credits: {
                position: {
                    y: 0
                }
            },

            tooltip: {}
        },


        initialize: function (options) {
            this._dataset = options.dataset;
            this._filterDimensions = options.filterDimensions;
            this._width = options.width;
            this._height = options.height;
            this._shapeList = options.shapeList;
            this._allShapeList = options.allShapeList;
            this._container = options.container;
            this._dataJson = options.dataJson;
            this.mapType = options.mapType;
            this.title = options.title;
            this.rightsHolder = options.rightsHolder;
            this.showRightsHolder = options.showRightsHolder;

            this.tooltipDelegate = new App.Map.TooltipDelegate(options);
            // _.bindAll(this, "_calculateColor");

            this._onResize = _.debounce(_.bind(this._onResize, this), 200);
            this._updateDataClasses = _.debounce(_.bind(this._updateDataClasses, this), 100);

            this._defaultMapOptions.title.text = this._dataset.metadata.getTitle();
            this._defaultMapOptions.tooltip.formatter = _.partial(function (formatter, mapView) {
                return mapView.tooltipDelegate._getLabelFromNormCode(this.point.code) + ': ' + this.point.value;
            }, _, this);
        },

        events: {
            "mousewheel": "_handleMousewheel",
            "dblclick": "_handleDblclick",
            "resize": "_onResize"
        },

        render: function () {
            this._createMapContent();
            this.delegateEvents();
        },

        destroy: function () {
            if (this.map) {
                this.map.destroy();
            }

            this.undelegateEvents();
        },

        transform: function () {
            var currentScale = this.model.get("currentScale");
            var oldScale = this.model.get("oldScale");
            var x = this.model.get("x");
            var y = this.model.get("y");
            var animationDelay = this.model.get("animationDelay");
            this.map.mapZoom(oldScale / currentScale);
        },

        _tooltipFormatter: function () {
            return point.properties.label + ':::' + point.value;
        },

        zoomExit: function () {
            this._centerAndZoom();
        },

        updateRanges: function () {
            this._updateDataClasses();
        },

        canRender: function () {
            return this._shapeListOrderByHierarchy().length > 0;
        },

        _calculateOriginAndScale: function () {
            this._origin = this._calculateNewOriginAndBounds();
            this._scale = this._calculateNewScale({ x: this._minX, y: this._minY }, { x: 0, y: 0 }, this._origin);
        },

        _calculateNewOriginAndBounds: function () {
            var coordinates = _.chain(this._shapeList).compact().pluck("shape").flatten().value();

            var xCoordinates = _.filter(coordinates, function (num, i) {
                return i % 2 === 0;
            });
            var yCoordinates = _.filter(coordinates, function (num, i) {
                return i % 2 !== 0;
            });

            this._maxX = _.max(xCoordinates);
            this._minX = _.min(xCoordinates);
            this._maxY = _.max(yCoordinates);
            this._minY = _.min(yCoordinates);

            var originX = this._minX + (this._maxX - this._minX) / 2;
            var originY = this._minY + (this._maxY - this._minY) / 2;
            return [originX, originY];
        },

        _shapeListOrderByHierarchy: function () {
            return _.chain(this._shapeList).compact().sortBy(function (shape) {
                return -shape.hierarchy; //reverse order
            }).value();
        },

        _allShapeListOrderByHierarchy: function () {
            return _.chain(this._allShapeList).compact().sortBy(function (shape) {
                return -shape.hierarchy; //reverse order
            }).value();
        },


        _createMapContent: function () {

            var geoJson = GeoJsonConverter.shapeListToGeoJson(this._shapeListOrderByHierarchy());
            var allGeoJson = GeoJsonConverter.shapeListToGeoJson(this._allShapeListOrderByHierarchy(), { contour: true });
            var containerGeoJson = GeoJsonConverter.shapeListToGeoJson([this._container], { contour: true });

            var mapData = this._getMapDataFromGeoJson(geoJson);
            var allMapData = this._getMapDataFromGeoJson(allGeoJson);
            var containerMapData = this._getMapDataFromGeoJson(containerGeoJson);

            var data = this._getData();

            var worldContainerSerie = _.defaults(
                {
                    id: "worldContainerSerie",
                    name: "WorldContainer",
                    mapData: containerMapData,
                    nullColor: Constants.colors.istacGreyLight
                },
                this._defaultSeriesOptions);

            var featuresContainerSerie = _.defaults(
                {
                    id: "featuresContainerSerie",
                    name: "FeaturesContainer",
                    mapData: allMapData,
                    nullColor: Constants.colors.istacGreyMedium
                },
                this._defaultSeriesOptions);

            this._defaultMapOptions.series = [];
            this._defaultMapOptions.series.push(
                worldContainerSerie,
                featuresContainerSerie
            );

            switch (this.mapType) {
                case 'map':
                    var choroplethDataSerie = _.defaults(
                        {
                            id: "choroplethDataSerie",
                            name: this.title,
                            mapData: mapData,
                            data: data
                        },
                        this._defaultSeriesOptions);

                    this._defaultMapOptions.legend.enabled = true;

                    this._defaultMapOptions.series.push(choroplethDataSerie);
                    break;

                case 'mapbubble':
                    var bubbleDataSerie = _.defaults(
                        {
                            id: "bubbleDataSerie",
                            name: this.title,
                            mapData: mapData,
                            data: data,
                            type: 'mapbubble',
                            showInLegend: false
                        },
                        this._defaultSeriesOptions);

                    this._defaultMapOptions.legend.enabled = false;

                    this._defaultMapOptions.series.push(bubbleDataSerie);
                    break;
            }

            this._defaultMapOptions.chart.renderTo = this.el;
            this._defaultMapOptions.colorAxis.dataClasses = this._generateDataClasses();

            this._defaultMapOptions.credits.text = this.rightsHolder;
            if (!this.showRightsHolder) {
                this._defaultMapOptions.credits.style = {
                    color: App.Constants.colors.hideCredits
                }
            }

            this.map = new Highmaps.Map(this._defaultMapOptions);

            this._centerAndZoom();
        },

        _getData: function () {
            return _.map(_.pairs(this._dataJson), function (item) {
                return { "code": item[0], "value": item[1].value, "z": item[1].value };
            });
        },

        _getMapDataFromGeoJson: function (geoJson) {
            var self = this;
            var features = _.map(geoJson.features, function (item) {
                item.properties.code = item.id;
                return item;
            });
            geoJson.features = features;
            return Highmaps.geojson(geoJson);
        },

        _updateDataClasses: function () {
            if (this.map) {
                var axis = this.map.colorAxis[0];
                if (this.model.get('mapType') == 'map') {
                    axis.update({
                        dataClasses: this._generateDataClasses()
                    }, false);
                }

                this.map.redraw();

                // TODO: METAMAC-2032 this a workaround to solve the problem when updating dataclasses
                this.map.mapZoom(1.000000001);
                this._redrawLegend();
            }
        },

        _centerAndZoom: function () {
            if (this.map && this.map.get('featuresContainerSerie')) {
                var featuresContainerSerie = this.map.get('featuresContainerSerie');
                if (featuresContainerSerie.maxX
                    && featuresContainerSerie.maxY
                    && featuresContainerSerie.minX
                    && featuresContainerSerie.minY) {
                    // featuresContainerSerie.points[0].zoomTo();
                    // this.map.redraw();

                    this._zoomToSerie(this.map.get('featuresContainerSerie'));
                }
            }
        },

        _zoomToSerie: function (serie) {
            // IDEA: Eliminate magic number
            serie.xAxis.setExtremes(
                serie.minX - 0.5,
                serie.maxX + 0.5,
                false
            );
            serie.yAxis.setExtremes(
                serie.minY - 0.5,
                serie.maxY + 0.5,
                false
            );
            this.map.redraw();
        },

        _generateDataClasses: function () {
            var dataClasses = [];
            var rangeLimits = this.model.createRangeLimits();
            for (var i = 0; i < rangeLimits.length - 1; i++) {
                dataClasses[i] = { from: rangeLimits[i], to: rangeLimits[i + 1] };
            }
            return dataClasses;
        },

        _redrawLegend: function () {
            this.map.legend.destroy();
            this.map.legend.render();
        },

        _offsetFromMouseEvent: function (e) {
            var offset = this.$el.offset();
            var xOffset = e.pageX - (offset.left + this._width / 2);
            var yOffset = e.pageY - (offset.top + this._height / 2);
            return { left: xOffset, top: yOffset };
        },

        _handleMousewheel: function (e, delta, deltaX, deltaY) {
            var offset = this._offsetFromMouseEvent(e);
            this.model.zoomMouseWheel({ delta: deltaY, xOffset: offset.left, yOffset: offset.top });
            return false;
        },

        _handleDblclick: function (e) {
            var offset = this._offsetFromMouseEvent(e);
            this.model.zoomMouseWheel({ delta: 1, xOffset: offset.left, yOffset: offset.top });
        },

        _onResize: function () {
            this.map.reflow();
        }

    });

}());