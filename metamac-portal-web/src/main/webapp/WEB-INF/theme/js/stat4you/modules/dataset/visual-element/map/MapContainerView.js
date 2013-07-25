(function () {
    'use strict';

    STAT4YOU.namespace('STAT4YOU.Map.MapContainerView');

    STAT4YOU.Map.MapContainerView = Backbone.View.extend({

        _errorTemplate : STAT4YOU.templateManager.get('widget/map/map-error'),

        initialize : function (options) {
            this._dataset = options.dataset;
            this._filterOptions = options.filterOptions;
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
                this.rangesView.render();
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
            this.mapView = new STAT4YOU.Map.MapView({
                el : $mapContainer,
                dataset : this._dataset,
                filterOptions : this._filterOptions,
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
            this.zoomView = new STAT4YOU.Map.ZoomView({
                el : $elZoom.get(0),
                model : this._mapModel,
                width : this._width,
                height : this._height
            });
        },

        _initLeyendView : function () {
/*            var legendView = STAT4YOU.Map.LegendView({
                el : this._svg,
                model : this._mapModel
            });*/
        },

        _initRangesView : function () {
            var $elRanges = $('<div id="ranges-container"/>').appendTo(this.$el);
            this.rangesView = new STAT4YOU.Map.RangesView({
                el : $elRanges.get(0),
                model : this._mapModel,
                width : this._width,
                height : this._height
            });
        }

    });

})();