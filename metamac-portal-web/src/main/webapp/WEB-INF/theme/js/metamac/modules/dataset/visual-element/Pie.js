App.namespace("App.VisualElement.PieChart");

App.VisualElement.PieChart = (function () {

    var Pie = function (options) {
        var self = this;

        this.dataset = options.dataset;
        this.filterOptions = options.filterOptions;
        this.el = options.el;
        self._chartOptions = {
            chart : {
                renderTo : '',
                defaultSeriesType : 'pie',
                plotBackgroundColor : null,
                plotBorderWidth : null,
                plotShadow : false,
                marginRight : 250,
                marginLeft : 250,
                backgroundColor : '#F5F5F5'
            },
            credits : {
                text : 'App.com',
                href : 'http://www.App.com'
            },
            title : {
                text : '',
                style : {
                    width : 500,
                    height : 60
                }
            },
            subtitle : {
                text : 'App',
                y : 80
            },
            tooltip : {
                formatter : function () {
                    return '<b>' + $('<span/>').text(this.point.name).html() + '</b>: ' + Math.round(this.percentage * 10) / 10 + ' %';
                }
            },
            plotOptions : {
                pie : {
                    allowPointSelect : true,
                    cursor : 'pointer',
                    dataLabels : {
                        enabled : true,
                        color : '#000000',
                        connectorColor : '#000000',
                        formatter : function () {
                            //return this.point.name +'<br/>'+ Math.round(this.percentage*10)/10 +' %';
                            return $('<span/>').text(this.point.name).html() + ': ' + Math.round(this.percentage * 10) / 10 + ' %';
                        }
                    }
                }
            },
            series : [],
            exporting : {
                chartOptions : {
                    title : {
                        text : null
                    },
                    margin : 0,
                    style : {
                        width : 0,
                        height : 0
                    }
                }
            }
        };
        self._type = 'pie';
    };

    Pie.prototype = new App.VisualElement.Base();

    Pie.prototype.destroy = function () {
        if (this._element) {
            this._element.destroy();
            this._element = undefined;
        }
        this.dataset.data.off(null, null, this);
    };

    Pie.prototype.load = function () {
        if (this.dataset.data.isAllSelectedDataLoaded()) {
            this._chartOptions.chart.renderTo = this.el;
            this._element = new Highcharts.Chart(this._chartOptions);

            this._dataLoad();
        } else {
            this.dataset.data.on("hasNewData", this.load, this);
            this.dataset.data.loadAllSelectedData();
        }
    };

    Pie.prototype.update = function () {
        this.destroy();
        this.load();
    };

    Pie.prototype.updatingDimensionPositions = function () {
        this.filterOptions.setZoneLengthRestriction({left : 1, top : 0});
        this.filterOptions.setSelectedCategoriesRestriction({sectors : this._ALPHA_MAX_DIM1});
    };

    Pie.prototype._dataLoad = function () {
        if (this.dataset.data.isAllSelectedDataLoaded()) {
            var self = this;
            /***** Setting the data *****/
            /* We need one serie at least */
            self._element.addSeries({
                type : 'pie',
                name : 'Serie1',
                data : [
                ]
            });

            /* Removing former elements */
            var numElements = self._element.series[0].data.length;
            for (var i = 0; i < numElements; i++) {
                self._element.series[0].data[0].remove(false);
            }

            var nan = false;

            var title = this.getTitle();
            var fixedPermutation = this.getFixedPermutation();

            var sectorsDimension = this.filterOptions.getSectorsDimension();
            var sectorsDimensionSelectedCategories = this.filterOptions.getSelectedCategories(sectorsDimension.number);

            _.each(sectorsDimensionSelectedCategories, function (category) {
                var currentPermutation = {};
                currentPermutation[sectorsDimension.id] = category.id;
                _.extend(currentPermutation, fixedPermutation);

                var elemento = self.dataset.data.getDataById(currentPermutation);


                var temp = {};
                temp.name = category.label;

                var strValue;
                if (elemento) {
                    strValue = elemento.replace(",", ".");
                }

                temp.y = parseFloat(strValue);
                if (isNaN(temp.y) || (temp.y < 0)) {
                    nan = true;
                }
                self._element.series[0].addPoint(temp);
            });

            // Setting the title (either App or error)
            var titleText = nan ? I18n.t("filter.text.pieError") : self.dataset.metadata.getProvider();
            self._element.setTitle({ text : title}, { text : titleText});
        }

        return Pie;
    };

    return Pie;

})();
