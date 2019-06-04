(function () {
    "use strict";

    var Constants = App.Constants;
    var MAX_ELEMENTS = 10;
    var WIDTH = 400; // El mismo que en tooltip.less .tooltip-inner
    var HEIGHT = WIDTH * 9 / 16;

    App.namespace("App.VisualElement.TooltipLine");

    App.VisualElement.TooltipLine = function (options) {
        this.$el = options.el;
        this.data = options.data;
        this.timeDimension = options.timeDimension;
        this.permutation = options.permutation;

        this._chartOptions = {
            chart: {
                animation: false,
                renderTo: '',
                type: 'line',
                borderWidth: 0,
                backgroundColor: Constants.colors.istacWhite,
                marginRight: 0
            },
            title: {
                text: '',
                style: {
                    color: App.Constants.colors.hiddenText,
                    fontSize: App.Constants.font.title.size
                }
            },
            subtitle: {
                text: '',
                style: {
                    color: App.Constants.colors.hiddenText
                }
            },
            credits: {
                position: {
                    y: -5,
                    x: -10
                }
            },
            tooltip: {
                formatter: this.tooltipFormatter
            },
            xAxis: {
                labels: {}
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
                ]
            },
            plotOptions: {
                line: {
                    lineWidth: 1.5,
                    marker: {
                        radius: 3
                    }
                },
                series: {
                    animation: false
                }
            },
            legend: {
                layout: 'horizontal',
                backgroundColor: Constants.colors.istacWhite,
                x: 5,
                y: 0,
                borderWidth: 1,
                borderColor: Constants.colors.istacGreyMedium,
                floating: false,
                navigation: {
                    activeColor: Constants.colors.istacBlueMedium,
                    animation: true,
                    arrowSize: 12,
                    inactiveColor: Constants.colors.istacGreyMedium,
                    style: {
                        fontWeight: 'bold',
                        color: Constants.colors.istacBlack,
                        fontSize: '12px'
                    }
                }
            },
            exporting: {
                enabled: false
            }
        };
    };

    App.VisualElement.TooltipLine.prototype = {

        tooltipFormatter: function () {
            return '<strong>' + this.x + '</strong>:<br/>' + this.point.name;
        },

        destroy: function () {
            if (this.detailChart) {
                this.detailChart.destroy();
                this.detailChart = null;
            }
        },

        render: function () {
            var data = this._getData();
            this._chartOptions.series = data.series;
            this._chartOptions.xAxis.categories = data.xAxis;
            
            this.$el.css({ height: HEIGHT, width: WIDTH });
            this._chartOptions.chart.renderTo = this.$el[0];
            this._chartOptions.xAxis.tickInterval = 1;
            this._chartOptions.credits.style = {
                color: App.Constants.colors.hiddenText
            }

            this.detailChart = new Highcharts.Chart(this._chartOptions);
        },

        _getData: function () {
            var timeDimensionCategories = _.sortBy(this.timeDimension.getDrawableRepresentations(), function (representation) {
                return representation.normCode;
            }).reverse();

            var fixedPermutation = this.permutation;
            
            var serie = {};
            serie.data = [];
            var xAxis = [];

            for (var i = 1; i <= MAX_ELEMENTS; i++) {
                var index = timeDimensionCategories.length - i;
                var timeCategory = timeDimensionCategories[index];

                var currentPermutation = {};
                currentPermutation[this.timeDimension.id] = timeCategory.id;
                currentPermutation = _.extend({}, fixedPermutation, currentPermutation);

                var y = this.data.getNumberData({ ids: currentPermutation });
                var name = this.data.getStringData({ ids: currentPermutation });
                serie.data.unshift({ y: y, name: name });

                xAxis.unshift(timeCategory.get("visibleLabel"));
            }

            return {
                series: [serie],
                xAxis: xAxis
            };
        }

    };

}());
