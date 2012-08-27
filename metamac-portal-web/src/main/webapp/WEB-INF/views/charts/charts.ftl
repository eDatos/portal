[#ftl]
[#include "/inc/includes.ftl"]
[@template.base]

<div id="content-right">
    <h3>Gráfica del dataset</h3>
</div>


<script type="text/javascript" src="[@spring.url "/theme/js/DatasetManager.js"/]" ></script>
<script type="text/javascript" src="[@spring.url "/theme/js/transformingToHighCharts.js"/]" ></script>
<script type="text/javascript" src="[@spring.url "/theme/js/fullScreen.js"/]" ></script>
<script type="text/javascript" src="[@spring.url "/theme/js/charts.js"/]" ></script>

<script type="text/javascript" src="[@spring.url "/theme/js/jquery.jscrollpane.min.js"/]" ></script>
<script type="text/javascript" src="[@spring.url "/theme/js/jquery.mousewheel.js"/]" ></script>

<script type="text/javascript" src="[@spring.url "/theme/js/stat4you-1.0.0.js"/]" ></script>
<script type="text/javascript" src="[@spring.url "/theme/js/stat4you-dataset-1.0.0.js"/]" ></script>


<script type="text/javascript" src="[@spring.url "/theme/js/Filter.js"/]" ></script>

<script type="text/javascript">

// Global variables
var optionsC6;
var optionsC7;
var optionsC8;
var optionsC9;
var datasetManager;
var dataset;
var data;
var optionsChart1 = 0;
var scrollBar;
var chart6;
var chart7;
var chart9;


$(document).ready(function() {


      // Chart
      optionsC6 = {
          chart: {
             renderTo: 'chart-container1',
             defaultSeriesType: 'column',
             zoomType: 'xy',
             marginRight: 185
          },
          title: {
[#--
             text: '${dataset.getTitle().getLocalisedLabel('es')}'
             text: '${dataset.getTitle()}'
--]

             text: 'Paro por municipios y sexos'

          },
          subtitle: {
             text: 'stat4you'
          },
          xAxis: {
             categories: [

             ]
          },
          yAxis: {
             min: 0,
             title: {
                text: 'Observación'
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
          tooltip: {
             formatter: function() {
                return ''+
                   this.x +': '+ this.y +'';
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
       
       


       

   // Chart
   optionsC7 = {
      chart: {
         renderTo: 'chart-container2',
         defaultSeriesType: 'bar',
         marginRight: 185
      },
      title: {
         text: 'Paro por municipios y sexos'
      },
      subtitle: {
         text: 'stat4you'
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
      credits: {
         enabled: false
      },
      series: []
   };




optionsC8 = new Highcharts.Chart({
      chart: {
         renderTo: 'chart-container3',
         plotBackgroundColor: null,
         plotBorderWidth: null,
         plotShadow: false
      },
      title: {
         text: 'Porcentaje del total de hombres de Tenerife correspondiente a cada municipio'
      },
      tooltip: {
         formatter: function() {
            return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage*10)/10 +' %';
         }
      },
      plotOptions: {
         pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
               enabled: true,
               color: '#000000',
               connectorColor: '#000000',
               formatter: function() {
                  return this.point.name +'<br/>'+ Math.round(this.percentage*10)/10 +' %';
               }
            }
         }
      },
       series: [{
         type: 'pie',
         name: 'Paro',
         data: [


         ]
      }]
   });
   
   
   
   optionsC9 = {
      chart: {
         renderTo: 'chart-container4',
         defaultSeriesType: 'line',
         marginRight: 185
      },
      title: {
         text: 'Paro por municipios y sexos',
         x: -20 //center
      },
      subtitle: {
         text: 'stat4you',
         x: -20
      },
      xAxis: {
         categories: [

         ]
      },
      yAxis: {
         title: {
            text: 'Observación'
         },
         plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
         }]
      },
      tooltip: {
         formatter: function() {
                   return '<b>'+ this.series.name +'</b><br/>'+
               this.x +': '+ this.y +'';
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



   
   
      
    // We will have in obs map the observations map splitted like:
    // [{"Tenerife", "M", 9}, {"Tenerife", "F", 15}, {"Hierro", "F", 10}, ...]
    jQuery.getJSON("resources/dataset/stat4you:dsd:dataset:7537162b-9416-43da-bf78-bca96ea0f3d3:1", function(dsAndData) {
    
        // Storing in the global variable
        datasetManager = new STAT4YOU.Dataset(dsAndData);
        
        transformingToHighCharts();
        transformingToHighChartsPie();
            
    });

});

</script>




<div id="container" class="container">
    <div id="chart-container1" class="chart-container">    
    </div>
    <button id="enter-exit-fs1" class="fs" onclick="enterFullScreen('container')"> Ver en pantalla completa</button>
    <button id="tableOptions1" onclick="chartFilter1.launch()"> Cambiar gráfica</button>
</div>


<div id="container2" class="container">
    <div id="chart-container2" class="chart-container">    
    </div>
    <button id="enter-exit-fs2" class="fs" onclick="enterFullScreen('container2')"> Ver en pantalla completa</button>
    <button id="tableOptions2" onclick="chartFilter2.launch()"> Cambiar gráfica</button>
</div>

<div id="container3" class="container">
    <div id="chart-container3" class="chart-container">    
    </div>
    <button id="enter-exit-fs3" class="fs" onclick="enterFullScreen('container3')"> Ver en pantalla completa</button>
    <button id="tableOptions3" onclick="chartFilter3.launch()"> Cambiar gráfica</button>
</div>

<div id="container4" class="container">
    <div id="chart-container4" class="chart-container">    
    </div>
    <button id="enter-exit-fs4" class="fs" onclick="enterFullScreen('container4')"> Ver en pantalla completa</button>
    <button id="tableOptions4" onclick="chartFilter4.launch()"> Cambiar gráfica</button>
</div>


<script type="text/javascript">

    /* chartOptionsLauncher */
    var chartFilter1 = new STAT4YOU.Filters.BarChartFilter("container", "chart-options1", "chartFilter1");
    var chartFilter2 = new STAT4YOU.Filters.BarChartFilter("container2", "chart-options2", "chartFilter2");
    var chartFilter3 = new STAT4YOU.Filters.PieChartFilter("container3", "chart-options3", "chartFilter3");
    var chartFilter4 = new STAT4YOU.Filters.BarChartFilter("container4", "chart-options4", "chartFilter4");
    
</script>

[/@template.base]