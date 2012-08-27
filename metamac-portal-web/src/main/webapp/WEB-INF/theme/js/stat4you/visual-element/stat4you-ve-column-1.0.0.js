STAT4YOU.namespace("STAT4YOU.VisualElement.ColumnChart");



STAT4YOU.VisualElement.ColumnChart = (function() {
    
    var Column = function (options) {
        var self = this;

        self.initialize(options);

        // OPTIONS COLUMNS CHART
        self._chartOptions = {
                  chart: {
                      renderTo: '',
                      defaultSeriesType: 'column',
                      //zoomType: 'xy',
                      marginRight: 185,
                      backgroundColor: 'white'
                   },
                   credits : {
                       text : ' ',
                       href : ' '
                   },
                   title: {
                       text: '',
                       margin: 30,
                       style: {
                           width: 500,
                           height: 60
                       }
                   },
                   subtitle: {
                       text: 'stat4you',
                       y: 80
                   },
                   xAxis: {
                      categories: [

                      ]
                   },
                   yAxis: {
                      title: {
                          text: I18n.t("page.dataset.observation")
                      }
                   },
                   legend: {
                      layout: 'vertical',
                      backgroundColor: '#FFFFFF',
                      align: 'right',
                      verticalAlign: 'top',
                      x: 5,
                      y: 30,
                      borderWidth: 0,
                      floating: true,
                      shadow: true
                   },
                   tooltip: {
                      formatter: function() {
                         return '<b>'+ 
                         $('<span/>').text(this.x).html() +'</b>: '+ $('<span/>').text(this.y).html();
                      }
                   },
                   plotOptions: {
                      column: {
                         pointPadding: 0.2,
                         borderWidth: 0
                      }
                   },
                   series: []
        };

        // Filter
//        self._filter = new STAT4YOU.Filters.BarAndLineChartFilter("column");
//        self._filter.setDimensionRestrictions(self._ALPHA_MAX_DIM1, self._ALPHA_MAX_DIM2);
        // Other attributes
        self._type = 'column';
        self._element = null;
    };

    Column.prototype = new STAT4YOU.VisualElement.BarAndLineChart();

    return Column;
    
})();
