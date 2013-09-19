(function () {
    'use strict';

    App.namespace('App.Map.MapContainerView');

    App.Map.MapContainerView = Backbone.View.extend({

        _errorTemplate : App.templateManager.get('dataset/map/map-error'),

        initialize : function (options) {
            this._dataset = options.dataset;
            this._filterDimensions = options.filterDimensions;
            this._mapModel = options.mapModel;
            this._width = options.width;
            this._height = options.height;
            this.geoJson = options.geoJson;
            this.container = options.container;
            this.dataJson = options.dataJson;

            this.$el.empty();
            this._initInternalViews();
        },

        render : function () {
            if (this.mapView.canRender()) {
                this.zoomView.render();
                //this.leyendView.render();
                //this.rangesView.render();
                this.mapView.render();
            } else {
                this.$el.html(this._errorTemplate());
            }
        },

        destroy : function () {
            this.mapView.destroy();
            this.zoomView.destroy();
            this.rangesView.destroy();
        },

        transform : function () {
            this.mapView.transform();
            this.zoomView.transform();
        },

        updateRanges : function () {
            this.mapView.updateRanges();
            this.rangesView.updateRanges();
        },

        zoomExit : function () {
            this.mapView.zoomExit();
        },

        _initInternalViews : function () {
            this._initMapView();
            this._initZoomView();
            this._initLeyendView();
            this._initRangesView();
        },

        _initMapView : function () {
            //TODO: Need to create a container DIV and set the width and height of the elements
            var $mapContainer = $('<div class="svgContainer"></div>').appendTo(this.$el);
            this.mapView = new App.Map.MapView({
                el : $mapContainer,
                dataset : this._dataset,
                filterDimensions : this._filterDimensions,
                model : this._mapModel,
                shapeList : this.geoJson,
                container : this.container,
                dataJson : this.dataJson,
                width : this._width,
                height : this._height
            });
        },

        _initZoomView : function () {
            var $elZoom = $('<div id="zoom-container"/>').appendTo(this.$el);
            this.zoomView = new App.Map.ZoomView({
                el : $elZoom.get(0),
                model : this._mapModel,
                width : this._width,
                height : this._height
            });
        },

        _initLeyendView : function () {
/*            var legendView = App.Map.LegendView({
                el : this._svg,
                model : this._mapModel
            });*/
        },

        _initRangesView : function () {
            var $elRanges = $('<div id="ranges-container"/>').appendTo(this.$el);
            this.rangesView = new App.Map.RangesView({
                el : $elRanges.get(0),
                model : this._mapModel,
                width : this._width,
                height : this._height
            });
        }

    });

})();