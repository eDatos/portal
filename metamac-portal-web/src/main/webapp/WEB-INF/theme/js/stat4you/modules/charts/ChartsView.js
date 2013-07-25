(function () {
    "use strict";
    
     STAT4YOU.namespace("STAT4YOU.charts.ChartsView");

    STAT4YOU.charts.ChartsView = Backbone.View.extend({
        
        template : STAT4YOU.templateManager.get('charts/charts'),
        
        render : function () {
            var context = {
            }
            this.$el.html(this.template(context));
        }   
     });      
     
}());