(function () {
    "use strict";
    
     App.namespace("App.charts.ChartsView");

    App.charts.ChartsView = Backbone.View.extend({
        
        template : App.templateManager.get('charts/charts'),
        
        render : function () {
            var context = {
            }
            this.$el.html(this.template(context));
        }   
     });      
     
}());