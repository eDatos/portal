// Based on jQuery noConflict, to call after loading Highmaps but before calling Highcharts
Highmaps = Highcharts;
window.Highcharts = Highcharts = null;