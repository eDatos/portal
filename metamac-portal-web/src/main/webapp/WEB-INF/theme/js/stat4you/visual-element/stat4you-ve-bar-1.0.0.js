STAT4YOU.namespace("STAT4YOU.VisualElement.BarChart");



STAT4YOU.VisualElement.BarChart = (function() {
    

    var Bar = function (options) {
        this.prototype = new STAT4YOU.VisualElement.BarAndLineChart(options);

        // OPTIONS BAR CHART
        this._options = {
                  chart: {
                      renderTo: 'chart-container',
                      defaultSeriesType: 'bar',
                      marginRight: 185,
                      backgroundColor: 'white'
                   },
                   title: {
                       text: '',
                       style: {
                           width: 500,
                           height: 60
                       }
                   },
                   subtitle: {
                       text: 'stat4you',
                       y: 50
                   },
                   xAxis: {
                      categories: [

                      ]
                   },
                   yAxis: {
                      min: 0,
                      title: {
                         text: 'Observación',
                         align: 'high'
                      }
                   },
                   tooltip: {
                      formatter: function() {
                         return ''+
                             this.series.name +': '+ this.y +'';
                      }
                   },
                   plotOptions: {
                      bar: {
                         dataLabels: {
                            enabled: true
                         }
                      }
                   },
                   legend: {
                          layout: 'vertical',
                          backgroundColor: '#FFFFFF',
                          align: 'right',
                          verticalAlign: 'top',
                          x: 5,
                          y: 50,
                          borderWidth: 0,
                          floating: true,
                          shadow: true
                   },
                   series: []
        };
        
        // Filter
        this._filter = new STAT4YOU.Filters.BarAndLineChartFilter("column");
        this._type = 'bar';
    };
    
    

    
    
    /*---------------------------------------------------------------
     *                      PUBLIC METHODS
     * ----------------------------------------------------------- */

    
    return Bar;
    
})();