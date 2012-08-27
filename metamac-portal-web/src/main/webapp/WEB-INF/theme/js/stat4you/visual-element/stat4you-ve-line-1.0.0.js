STAT4YOU.namespace("STAT4YOU.VisualElement.LineChart");



STAT4YOU.VisualElement.LineChart = (function() {

    var Line = function (options) {
        var self = this;

        this.initialize(options);

        // OPTIONS LINE CHART
        self._chartOptions = {
                  chart: {
                      renderTo: '',
                      defaultSeriesType: 'line',
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
                      },
                      plotLines: [{
                         value: 0,
                         width: 1,
                         color: '#808080'
                      }]
                   },
                   tooltip: {
                      formatter: function() {
                          return '<strong>'+ 
                          $('<span/>').text(this.series.name).html() +', '+ $('<span/>').text(this.x).html() 
                          + '</strong>:<br/>' + $('<span/>').text(this.y).html();
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
                   series: []
        };
        
        // Filter
//        self._filter = new STAT4YOU.Filters.BarAndLineChartFilter("line");
//        self._filter.setDimensionRestrictions(self._ALPHA_MAX_DIM1, self._ALPHA_MAX_DIM2);
        // Other attributes
        self._type = 'line';
        self._element = null;
        
    };

    Line.prototype = new STAT4YOU.VisualElement.BarAndLineChart();

    return Line;
            
})();
