STAT4YOU.namespace("STAT4YOU.VisualElement.PieChart");

STAT4YOU.VisualElement.PieChart = (function () {

    var Pie = function (options) {
        var self = this;

        this.dataset = options.dataset;
        this.filterOptions = options.filterOptions;
        this.el = options.el;

        // OPTIONS PIE CHART
        self._chartOptions = {
            chart : {
                renderTo : '',
                defaultSeriesType : 'pie',
                plotBackgroundColor : null,
                plotBorderWidth : null,
                plotShadow : false,
                marginRight : 250,
                marginLeft : 250,
                backgroundColor : 'white'
            },
            credits : {
                text : ' ',
                href : ' '
            },
            title : {
                text : '',
                style : {
                    width : 500,
                    height : 60
                }
            },
            subtitle : {
                text : 'stat4you',
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
            series : []
        };

        // Filter
//        self._filter = new STAT4YOU.Filters.PieChartFilter();
//        self._filter.setDimensionRestrictions(self._ALPHA_MAX_DIM1);


        self._type = 'pie';
    };

    Pie.prototype = new STAT4YOU.VisualElement.Base();

    Pie.prototype.destroy = function () {
        var self = this;
        if (self._element) {
            self._element.destroy();
            self._element = undefined;
        }
        this.dataset.data.off("allDataLoaded", this.load, this);
    };

    Pie.prototype.load = function () {
        if(this.dataset.data.isAllSelectedDataLoaded()){
            // Where to render
            this._chartOptions.chart.renderTo = this.el;
            this._element = new Highcharts.Chart(this._chartOptions);

            // Loading the data
            this._dataLoad();
        }else{
            this.dataset.data.on("allDataLoaded", this.load, this);
            this.dataset.data.loadAllSelectedData();
        }
    };

    Pie.prototype.update = function () {
        var self = this;
        self.destroy();
        self.load();
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

            // Setting the title (either Stat4you or error)
            var titleText = nan ? I18n.t("filter.text.pieError") : self.dataset.metadata.getProvider();
            self._element.setTitle({ text : title}, { text : titleText});
        };

        return Pie;
    }

    return Pie;

})();
