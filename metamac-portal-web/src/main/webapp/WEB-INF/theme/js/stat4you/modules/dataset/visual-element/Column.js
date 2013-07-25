(function () {
    "use strict";


    STAT4YOU.namespace("STAT4YOU.VisualElement.ColumnChart");

    STAT4YOU.VisualElement.ColumnChart = function (options) {
        this.initialize(options);
        this._type = 'column';

        _.extend(this._chartOptions, {
            chart : {
                animation : false,
                renderTo : '',
                defaultSeriesType : 'column',
                backgroundColor : '#F5F5F5'
            },
            xAxis : {
                categories : []
            },
            yAxis : {
                title : {
                    text : ""
                }
            },
            tooltip : {
                formatter : this.tooltipFormatter
            },
            plotOptions : {
                series : {
                    animation : false
                },
                column : {
                    pointPadding : 0.2,
                    borderWidth : 0,
                    events : {
                        legendItemClick : function () {
                            return false;
                        }
                    }
                }
            },
            series : []
        });
    };

    STAT4YOU.VisualElement.ColumnChart.prototype = new STAT4YOU.VisualElement.Base();

    _.extend(STAT4YOU.VisualElement.ColumnChart.prototype, {

        load : function () {
            this._bindEvents();
            this.render();
        },

        destroy : function () {
            this._unbindEvents();

            if (this.chart) {
                this.chart.destroy();
            }
        },

        _bindEvents : function () {
            this.listenTo(this.filterOptions, "change", this.update);

            var resize = _.debounce(_.bind(this._updateSize, this), 200);
            var self = this;
            this.$el.on("resize", function (e) {
                e.stopPropagation();
                resize();
            });
        },

        _unbindEvents : function () {
            this.stopListening();
            this.$el.off("resize");
        },

        updatingDimensionPositions : function () {
            this.filterOptions.setZoneLengthRestriction({left : 1, top : 1});
            this.filterOptions.setSelectedCategoriesRestriction({horizontal : -1, columns : -1});
        },

        render : function () {
            var self = this;
            this.dataset.data.loadAllSelectedData()
                .then(function () {
                    self.$el.html("");
                    self.$title = $('<h3></h3>');
                    self.updateTitle();
                    self.$el.append(self.$title);

                    self.$chartContainer = $('<div></div>');
                    var newHeight = self.$el.height() - self.$title.height();
                    self.$chartContainer.height(newHeight);

                    self.$el.append(self.$chartContainer);

                    var data = self.getData();
                    self._chartOptions.series = data.series;
                    self._chartOptions.xAxis.categories = data.xAxis;
                    self._chartOptions.chart.renderTo = self.$chartContainer[0];

                    self.chart = new Highcharts.Chart(self._chartOptions);
                    self.$el.on("resize", function () {});
                });
        },

        resizeFullScreen : function () {

        },

        tooltipFormatter : function () {
            return '<strong>'
                + this.series.name
                + ', '
                + this.x
                + '</strong>:<br/>'
                + STAT4YOU.dataset.data.NumberFormatter.strNumberToLocalizedString(this.y.toString());
        },

        getData : function () {
            var self = this;

            var result = {};
            var fixedPermutation = this.getFixedPermutation();

            var horizontalDimension = this.filterOptions.getHorizontalDimension();
            var columnsDimension = this.filterOptions.getColumnsDimension();
            var horizontalDimensionSelectedCategories = this.filterOptions.getSelectedCategories(horizontalDimension.number);
            var columnsDimensionSelectedCategories = this.filterOptions.getSelectedCategories(columnsDimension.number);

            var listSeries = [];
            _.each(columnsDimensionSelectedCategories, function (columnCategory) {
                var serie = {};
                serie.data = [];
                serie.name = "";

                _.each(horizontalDimensionSelectedCategories, function (horizontalCategory) {
                    var currentPermutation = {};
                    currentPermutation[horizontalDimension.id] = horizontalCategory.id;
                    currentPermutation[columnsDimension.id] = columnCategory.id;
                    _.extend(currentPermutation, fixedPermutation);

                    var numberValue = self.dataset.data.getNumberDataById(currentPermutation);
                    serie.data.push(numberValue);
                });

                serie.name = columnCategory.label;
                listSeries.push(serie);
            });

            var xaxis = _.pluck(horizontalDimensionSelectedCategories, "label");

            // Changing the options of the chart
            result.series = listSeries;
            result.xAxis = xaxis;
            return result;
        },

        update : function () {
            this.chart.showLoading();

            var self = this;
            this.dataset.data.loadAllSelectedData().then(function () {
                self.chart.hideLoading();

                self.updateTitle();
                var data = self.getData();

                self.replaceSeries(self.chart, data.series);
                self.chart.xAxis[0].setCategories(data.xAxis, false);
                self.chart.redraw(false);
            });
        },

        _updateSize : function () {
            var newHeight = this.$el.height() - this.$title.height();
            this.$chartContainer.height(newHeight);
            this.chart.setSize(this.$chartContainer.width(), this.$chartContainer.height(), false);
        }

    });



}());
