(function () {

    var Constants = App.Constants;

    App.namespace("App.VisualElement");

    App.VisualElement.Base = function (options) {
        this.initialize(options);
    };

    App.VisualElement.Base.prototype = {

        initialize : function (options) {
            options = options || {};
            this.dataset = options.dataset;

            this.filterOptions = options.filterOptions; //deprecated
            this.filterDimensions = options.filterDimensions;

            this.el = options.el;

            this._initializeChartOptions();
        },

        getFixedPermutation : function () {
            var fixedPermutation = {};
            var self = this;
            this.filterDimensions.getAllFixedDimensionsCopy().forEach(function (dimension) {
                var selectedRepresentations = self.getDrawableRepresentations(dimension);
                fixedPermutation[dimension.id] = selectedRepresentations[0].id;
            });
            return fixedPermutation;
        },

        getTitle : function () {
            var self = this;
            var fixedLabels = this.filterDimensions.getAllFixedDimensionsCopy().map(function (dimension) {
                var selectedRepresentations = self.getDrawableRepresentations(dimension);
                return selectedRepresentations[0].get('visibleLabel') + ".";
            });
            return fixedLabels.length ? fixedLabels.join(" ") : "";
        },

        load : function () {
        },

        destroy : function () {
        },

        updatingDimensionPositions : function () {
        },

        resizeFullScreen : function () {
            this.destroy();
            this.load();
        },

        _initializeChartOptions : function () {            
            this._chartOptions = {
                title : {
                    text : null
                },
                credits : {
                    position : {
                        y : -20,
                        x : -20
                    }
                },
                legend : {
                    layout : 'horizontal',
                    backgroundColor : Constants.colors.istacWhite,
                    //align : 'bottom',
                    //verticalAlign : 'bottom',
                    x : 5,
                    y : 0,
                    borderWidth : 0,
                    floating : false,
                    shadow : true,
                    navigation : {
                        activeColor : Constants.colors.istacBlueMedium,
                        animation : true,
                        arrowSize : 12,
                        inactiveColor : Constants.colors.istacGreyMedium,
                        style : {
                            fontWeight : 'bold',
                            color : Constants.colors.istacBlack,
                            fontSize : '12px'
                        }
                    }
                },
                exporting : {
                    enabled : false
                }
            };
        },

        updateTitle : function () {
            var title = this.getTitle();
            this.$title.text(title);
            if (title) {
                this.$title.prepend('<b>' + I18n.t("filter.text.for") + ': ' + '</b>');
            }
        },

        replaceSeries : function (chart, series) {
            while (chart.series.length > 0) {
                chart.series[0].remove(false);
            }
            _.each(series, function (serie) {
                chart.addSeries(serie, false, false);
            });
        },

        setEl : function (el) {
            this.$el = $(el);
            this.el = this.$el[0];
        },

        _forceDimensionTypeInZone : function(dimensionType, zone) {
            var dimensions = this.filterDimensions.where({type : dimensionType});
            if (dimensions.length == 0) {
                throw new Error("No " + dimensionType + " dimension");
            }
            var dimension = dimensions[0];
            this.filterDimensions.zones.setDimensionZone(zone, dimension, { force : true });
        },

        _moveAllDimensionsToZone : function(zone) {
            var self = this;
            this.filterDimensions.each(function(dimension) {
                self.filterDimensions.zones.setDimensionZone(zone, dimension, { force : true });
            });
        },

        _forceMeasureDimensionInZone : function(zone) {
            this._forceDimensionTypeInZone("MEASURE_DIMENSION", zone);
        },

        _forceTimeDimensionInZone : function(zone) {
            this._forceDimensionTypeInZone("TIME_DIMENSION", zone);
        },

        _forceGeographicDimensionInZone : function(zone) {
            this._forceDimensionTypeInZone("GEOGRAPHIC_DIMENSION", zone);
        },

        _preselectBiggestHierarchyGeographicValue : function() {
            var fixedGeographicDimensions = this.filterDimensions.getAllFixedDimensionsCopyByType("GEOGRAPHIC_DIMENSION");
            _(fixedGeographicDimensions).each(function(geographicDimension) { 
                var selectedRepresentations = geographicDimension.get('representations')._selectedModels();              
                var biggestHierarchyGeographicValue = _(selectedRepresentations).min(function(representation) {
                    return representation.get("level");
                });
                if (biggestHierarchyGeographicValue != Infinity) {
                    biggestHierarchyGeographicValue.set({drawable : true});
                }
            });
        },
        
        _preselectMostRecentTimeRepresentation : function() {
            var fixedTimeDimensions = this.filterDimensions.getAllFixedDimensionsCopyByType("TIME_DIMENSION");
            _(fixedTimeDimensions).each(function(timeDimension) { 
                var selectedRepresentations = timeDimension.get('representations')._selectedModels();              
                var mostRecentTimeRepresentation  = timeDimension.get('reversed') 
                    ? _(selectedRepresentations).last()
                    : _(selectedRepresentations).first();
                mostRecentTimeRepresentation.set({drawable : true});
            });
        },

        getRightsHolderText : function() {
            return App.config.showRightsHolder && this.dataset ? this.dataset.metadata.getRightsHolder().name : '';
        },

        getDrawableRepresentations : function(dimension) {
            return dimension.getDrawableRepresentations();
        }

    };

    _.extend(App.VisualElement.Base.prototype, Backbone.Events);

}());