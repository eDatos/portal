(function () {

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
            var fixedDimensions = this.filterDimensions.dimensionsAtZone('fixed');
            fixedDimensions.each(function (dimension) {
                var selectedRepresentations = dimension.get('representations').where({selected : true});
                fixedPermutation[dimension.id] = selectedRepresentations[0].id;
            });
            return fixedPermutation;
        },

        getTitle : function () {
            var fixedDimensions = this.filterDimensions.dimensionsAtZone('fixed');
            var fixedLabels = fixedDimensions.map(function (dimension) {
                var selectedRepresentations = dimension.get('representations').where({selected : true});
                return selectedRepresentations[0].get('label');
            });
            return fixedLabels.length ? I18n.t("filter.text.for") + ": " + fixedLabels.join(", ") : "";
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
                    text : 'http://www.gobiernodecanarias.com/istac',
                    href : 'http://www.gobiernodecanarias.com/istac',
                    position : {
                        y : -20,
                        x : -20
                    }
                },
                legend : {
                    layout : 'horizontal',
                    backgroundColor : '#FFFFFF',
                    //align : 'bottom',
                    //verticalAlign : 'bottom',
                    x : 5,
                    y : 0,
                    borderWidth : 0,
                    floating : false,
                    shadow : true,
                    navigation : {
                        activeColor : '#3E576F',
                        animation : true,
                        arrowSize : 12,
                        inactiveColor : '#CCC',
                        style : {
                            fontWeight : 'bold',
                            color : '#333',
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
            this.$title.text(this.getTitle());
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
        }

    };

    _.extend(App.VisualElement.Base.prototype, Backbone.Events);

}());