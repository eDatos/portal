STAT4YOU.namespace("STAT4YOU.VisualElement.BarAndLineChart");

STAT4YOU.VisualElement.BarAndLineChart = (function () {
    /*-----------------------------*/
    /* -- Base abstract class -- */
    /*-----------------------------*/
    var BarAndLineChart = function () {

    };

    BarAndLineChart.prototype = new STAT4YOU.VisualElement.Base();

    BarAndLineChart.prototype.initialize = function (options) {
        this.dataset = options.dataset;
        this.filterOptions = options.filterOptions;
        this.el = options.el;
    };

    /*---------------------------------------------------------------
     *                      PUBLIC METHODS
     * ----------------------------------------------------------- */

    BarAndLineChart.prototype.destroy = function () {
        var self = this;
        if (self._element !== null) {
            self._element.destroy();
            self._element = undefined;
        }
        this.dataset.data.off("allDataLoaded", this.load, this);
    };

    BarAndLineChart.prototype.load = function () {
        if(this.dataset.data.isAllSelectedDataLoaded()){
            // Where to render
            this._highChartsGenericDataLoad();
            this._element = new Highcharts.Chart(this._chartOptions);
        }else{
            this.dataset.data.on("allDataLoaded", this.load, this);
            this.dataset.data.loadAllSelectedData();
        }
    };

    BarAndLineChart.prototype.update = function () {
        var self = this;
        self.destroy();
        self.load();
    };

    /*--- NOTE: This implementation is used by LINE, BAR and COLUMN ---*/
    BarAndLineChart.prototype.updatingDimensionPositions = function (oldElement) {
        this.filterOptions.setZoneLengthRestriction({left : 1, top : 1});
        this.filterOptions.setSelectedCategoriesRestriction({horizontal : this._ALPHA_MAX_DIM1, columns : this._ALPHA_MAX_DIM2});
    };

    BarAndLineChart.prototype._highChartsGenericDataLoad = function () {
        var self = this;

        var title = this.getTitle();
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

                var elemento = self.dataset.data.getDataById(currentPermutation);

                var strValue;
                if (elemento){
                    strValue = elemento.replace(",", ".");
                }
                var floatData = parseFloat(strValue);

                if (isNaN(floatData)){
                    floatData = null;
                }

                serie.data.push(floatData);
            });

            serie.name = columnCategory.label;
            listSeries.push(serie);
        });

        /* General settings */
        var publisher = self.dataset.metadata.getProvider();
        var xaxis = _.pluck(horizontalDimensionSelectedCategories, "label");


        // Changing the options of the chart
        self._chartOptions.series = listSeries;
        self._chartOptions.title.text = title;
        self._chartOptions.subtitle.text = publisher;
        self._chartOptions.xAxis.categories = xaxis;

        // Where to render
        self._chartOptions.chart.renderTo =  this.el;

    };

    return BarAndLineChart;

})();
