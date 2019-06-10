(function () {
    "use strict";

    var Constants = App.Constants;
    var WIDTH = 400; // El mismo que en tooltip.less .tooltip-inner
    var HEIGHT = WIDTH * 9 / 21;

    App.namespace("App.VisualElement.TooltipLineChart");

    App.VisualElement.TooltipLineChart = function (options) {
        this.$el = options.el;
        this.data = options.data;
        this.timeDimension = options.timeDimension;
        this._setPermutation(options.permutation);

        this._chartOptions = {
            chart: {
                animation: false,
                renderTo: '',
                type: 'line',
                borderWidth: 0,
                backgroundColor: Constants.colors.istacWhite,
                marginRight: 0
            },
            tooltip: {
                formatter: this.tooltipFormatter
            },
            yAxis: {
                title: {
                    text: ""
                },
                plotLines: [
                    {
                        value: 0,
                        width: 1,
                        color: Constants.colors.istacGreyDark
                    }
                ],
                minPadding: 0,
                maxPadding: 0
            },
            plotOptions: {
                line: {
                    lineWidth: 1.5,
                    marker: {
                        enabled: false
                    }
                },
                series: {
                    animation: false,
                    marker: {
                        states: {
                            hover: {
                                fillColor: Constants.colors.istacGreyDark
                            }
                        }
                    }
                }
            },
            title: {
                text: undefined
            },
            subtitle: {
                text: '',
                style: {
                    color: App.Constants.colors.hiddenText
                }
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            xAxis: {
                visible: false
            }
        };
    };

    App.VisualElement.TooltipLineChart.prototype = {

        _setPermutation: function(permutation) {
            this.permutation = permutation;
            this.measureUnit = this.data.metadata.measureUnitForSelection(permutation);
        },

        tooltipFormatter: function () {
            return this.point.name + '<br/>' + this.x;
        },

        destroy: function () {
            if (this.detailChart) {
                this.detailChart.destroy();
                this.detailChart = null;
            }
        },

        render: function () {
            this.$el.css({ height: HEIGHT, width: WIDTH });
            this._chartOptions.chart.renderTo = this.$el[0];
            
            var data = this._getData();
            this._chartOptions.series = [data.serie];
            this._chartOptions.xAxis.categories = data.xAxis;

            this.detailChart = new Highcharts.Chart(this._chartOptions);
        },

        update: function(permutation) {
            this._setPermutation(permutation);

            this.detailChart.series[0].remove(false);
            var data = this._getData();
            this.detailChart.addSeries(data.serie, true, false);
        },

        _getData: function () {
            var selectedTemporalGranularity = this.timeDimension.get("representations").getSelectedTemporalGranularity();
            var timeDimensionCategories = this.timeDimension.get('representations').where({ temporalGranularity: selectedTemporalGranularity });
            timeDimensionCategories = _.sortBy(timeDimensionCategories, function (representation) {
                return representation.normCode;
            }).reverse();

            var fixedPermutation = this.permutation;
            
            var serie = {};
            serie.data = [];
            var xAxis = [];

            var self = this;
            _.each(timeDimensionCategories, function (timeCategory) {
                var currentPermutation = {};
                currentPermutation[self.timeDimension.id] = timeCategory.id;
                currentPermutation = _.extend({}, fixedPermutation, currentPermutation);

                var y = self.data.getNumberData({ ids: currentPermutation });
                var name = self.data.getStringData({ ids: currentPermutation });
                if (self.measureUnit) {
                    name = name + ' (' + self.measureUnit + ')';
                }
                var point = { y: y, name: name };

                if (self.permutation[self.timeDimension.id] === timeCategory.id) {
                    point.marker = { enabled: true, radius: 5 };
                }

                serie.data.push(point);

                xAxis.push(timeCategory.get("visibleLabel"));
            });

            return {
                serie: serie,
                xAxis: xAxis
            };
        }

    };

}());
