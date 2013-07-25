(function () {

    App.namespace("App.VisualElement");

    App.VisualElement.Base = function (options) {
        this.initialize(options);
    };

    App.VisualElement.Base.prototype = {

        initialize : function (options) {
            options = options || {};
            this.dataset = options.dataset;
            this.filterOptions = options.filterOptions;
            this.el = options.el;
            this.$el = $(this.el);
            this._initializeChartOptions();
        },

        getFixedPermutation : function () {
            var self = this;
            var fixedPermutation = {};
            var fixedDimensions = this.filterOptions.getFixedDimensions();
            _.each(fixedDimensions, function (dimension) {
                var selectedCategory = self.filterOptions.getSelectedCategories(dimension.number)[0];
                fixedPermutation[dimension.id] = selectedCategory.id;
            });
            return fixedPermutation;
        },

        getTitle : function () {
            var self = this;
            var fixedDimensions = this.filterOptions.getFixedDimensions();
            var fixedLabels = _.map(fixedDimensions, function (dimension) {
                var selectedCategory = self.filterOptions.getSelectedCategories(dimension.number)[0];
                return selectedCategory.label;
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
                    text : 'App.com',
                    href : 'http://www.App.com',
                    position : {
                        y : -5,
                        x : -5
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
        }

    };

    _.extend(App.VisualElement.Base.prototype, Backbone.Events);

}());