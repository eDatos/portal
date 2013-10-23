App.namespace("App.VisualElement.LineChart");

(function () {
    "use strict";

    App.namespace("App.VisualElement.LineChart");

    App.VisualElement.LineChart = function (options) {
        this.initialize(options);
        this._type = 'line';

        this._masterOptions = {
            chart : {
                animation : false,
                renderTo : '',
                type : 'line',
                borderWidth : 0,
                backgroundColor : null,
                marginLeft : 5,
                marginRight : 5
            },
            credits : {
                enabled : false
            },
            tooltip : {
                formatter : function () {
                    return false;
                }
            },
            xAxis : {
                labels : {
                    formatter : function () {
                        return this.value.substring(0, 8);
                    }
                },
                tickInterval : 1
            },
            yAxis : {
                gridLineWidth : 0,
                labels : {
                    enabled : false
                },
                title : {
                    text : null
                },
                min : 0.6,
                showFirstLabel : false
            },
            title : {
                text : null
            },
            legend : {
                enabled : false
            },
            plotOptions : {
                series : {
                    animation : false
                },
                line : {
                    lineWidth : 1,
                    marker : {
                        enabled : false
                    }
                }
            },
            exporting : {
                enabled : false
            }
        };
        _.extend(this._chartOptions, {
            chart : {
                animation : false,
                renderTo : '',
                type : 'line',
                borderWidth : 0,
                backgroundColor : '#F5F5F5',
                marginRight : 0
            },
            tooltip : {
                formatter : this.tooltipFormatter
            },
            xAxis : {
                labels : {}
            },
            yAxis : {
                title : {
                    text : ""
                },
                plotLines : [
                    {
                        value : 0,
                        width : 1,
                        color : '#808080'
                    }
                ]
            },
            plotOptions : {
                line : {
                    lineWidth : 2
                },
                series : {
                    animation : false
                }
            }
        });

        this._element = null;

        this.config = {
            masterHeight : 80,
            xAxisTicks : 6
        };

        var hasTimeDimensions = this.dataset.metadata.getTimeDimensions().length > 0;
        var detailZoomModelStart = hasTimeDimensions ? 0.5 : 0;
        var detailZoomModelStop = hasTimeDimensions ? 1 : 0.5;

        this.detailZoomModel = new App.VisualElement.line.DetailZoomModel({start : detailZoomModelStart, stop : detailZoomModelStop});
        this.detailZoomModel.on("change", _.debounce(this._updateDetail, 300), this);
    };

    App.VisualElement.LineChart.prototype = {

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
            this.listenTo(this.filterDimensions, "change:selected change:zone reverse", _.debounce(this.update, 20));

            var resize = _.debounce(_.bind(this._updateSize, this), 200);
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
            this.filterDimensions.zones.get('left').set('fixedSize', 1);
            this.filterDimensions.zones.get('top').set('fixedSize', 1);

            //TODO
            //this.filterOptions.setZoneLengthRestriction({left : 1, top : 1});
            //this.filterOptions.setSelectedCategoriesRestriction({horizontal : -1, columns : -1});
        },

        tooltipFormatter : function () {
            return '<strong>' + this.series.name + ', ' + this.x + '</strong>:<br/>' + this.point.name;
        },

        render : function () {
            var self = this;
            this.dataset.data.loadAllSelectedData()
                .then(function () {
                    self.$el.empty();
                    self.$title = $('<h3></h3>');
                    self.updateTitle();
                    self.$el.append(self.$title);


                    self._renderContainers();
                    self._renderMaster();
                    self._renderDetail();
                });
        },

        _renderContainers : function () {
            var detailHeight = this.$el.height() - this.config.masterHeight - this.$title.height();
            this.$detailContainer = $('<div id="detail-container">')
                .css({height : detailHeight})
                .appendTo(this.$el);

            this.$masterContainer = $('<div id="master-container">')
                .css({ position : 'absolute', top : detailHeight + this.$title.height(), height : this.config.masterHeight, width : '100%' })
                .appendTo(this.$el);
        },

        _renderMaster : function () {
            this.getData();

            this.detailZoomModel.set('step', 1 / this.data.xAxis.length);

            this._masterOptions.chart.renderTo = this.$masterContainer[0];
            this._masterOptions.series = this.data.series;
            this._masterOptions.xAxis.categories = this.data.xAxis;
            this._masterOptions.xAxis.tickInterval = Math.ceil(this.data.xAxis.length / this.config.xAxisTicks);
            this.masterChart = new Highcharts.Chart(this._masterOptions);

            this.detailZoomView = new App.VisualElement.line.DetailZoomView({model : this.detailZoomModel, "$targetEl" : this.$masterContainer});
            this.detailZoomView.render();
        },

        _renderDetail : function () {
            var detailData = this.getDetailData();

            this._chartOptions.chart.renderTo = this.$detailContainer[0];
            this._chartOptions.series = detailData.series;
            this._chartOptions.xAxis.categories = detailData.xAxis;
            this._chartOptions.xAxis.min = detailData.min;
            this._chartOptions.xAxis.max = detailData.max;
            this._chartOptions.xAxis.tickInterval = detailData.tickInterval;

            this.detailChart = new Highcharts.Chart(this._chartOptions);
        },

        _updateSize : function () {
            var detailHeight = this.$el.height() - this.config.masterHeight - this.$title.height();
            this.$detailContainer.css({height : detailHeight});
            this.$masterContainer.css({ top : detailHeight + this.$title.height()});

            this.detailChart.setSize(this.$detailContainer.width(), this.$detailContainer.height(), false);
            this.masterChart.setSize(this.$masterContainer.width(), this.$masterContainer.height(), false);
            this.detailZoomView.updateSize();
        },

        update : function () {
            var self = this;

            self.detailChart.showLoading();
            self.masterChart.showLoading();

            this.dataset.data.loadAllSelectedData().then(function () {
                self.detailChart.hideLoading();
                self.masterChart.hideLoading();
                self.updateTitle();
                self._updateMaster();
                self._updateDetail();
            });
        },

        _updateMaster : function () {
            var data = this.getData();
            this.replaceSeries(this.masterChart, data.series);
            this.masterChart.xAxis[0].setCategories(data.xAxis, false);
            this.masterChart.counters.color = 0;
            this.masterChart.redraw();
        },

        _updateDetail : function () {
            if (this.detailChart) {
                var detailData = this.getDetailData();
                this.replaceSeries(this.detailChart, detailData.series);

                this.detailChart.xAxis[0].update(
                    {
                        categories : detailData.xAxis,
                        min : detailData.min,
                        max : detailData.max,
                        tickInterval : detailData.tickInterval
                    },
                    false
                );

                this.detailChart.counters.color = 0;

                this.detailChart.redraw(false);
            }
        },

        getData : function () {
            var self = this;

            var result = {};
            var fixedPermutation = this.getFixedPermutation();

            var horizontalDimension = this.filterDimensions.dimensionsAtZone('left').at(0);
            var columnsDimension = this.filterDimensions.dimensionsAtZone('top').at(0);
            var horizontalDimensionSelectedCategories = horizontalDimension.get('representations').where({selected : true});
            var columnsDimensionSelectedCategories = columnsDimension.get('representations').where({selected : true});

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

                    var y = self.dataset.data.getNumberData({ids : currentPermutation});
                    var name = self.dataset.data.getStringData({ids : currentPermutation});
                    serie.data.push({y : y, name : name});
                });

                serie.name = columnCategory.get('label');
                listSeries.push(serie);
            });

            var xaxis = _.invoke(horizontalDimensionSelectedCategories, 'get', 'label');

            // Changing the options of the chart
            result.series = listSeries;
            result.xAxis = xaxis;

            this.data = result;

            return result;
        },

        getDetailData : function () {
            var total = this.data.xAxis.length;
            var indexStart = Math.round(total * this.detailZoomModel.get('start'));
            var indexStop = Math.round(total * this.detailZoomModel.get('stop'));

            var marginIndexStart = Math.max(0, indexStart - 1);
            var marginIndexStop = Math.min(total, indexStop + 1);

            var tickInterval = 1;
            if (this.filterDimensions.dimensionsAtZone('left').at(0).get('type') === "TIME_DIMENSION") {
                var filteredTotal = marginIndexStop - marginIndexStart;
                tickInterval = Math.ceil(filteredTotal / this.config.xAxisTicks);
            }

            var result = {
                series : this.data.series,
                xAxis : this.data.xAxis,
                min : indexStart,
                max : indexStop - 1,
                tickInterval : tickInterval
            };
            return result;
        }

    };

    _.defaults(App.VisualElement.LineChart.prototype, App.VisualElement.Base.prototype);

}());
