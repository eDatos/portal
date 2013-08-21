(function() {
    App.namespace("App.modules.dataset");
    
    App.modules.dataset.DatasetRouter = Backbone.Router.extend({

        initialize : function (options) {
            this.defaultType = "canvasTable";
        },

        routes : {
            "selection" : "selection",
            "visualization/:type" : "visualization",
            "visualization/:type/selection/:selection" : "visualization",
            "" : "defaultChart"
        },

        selection : function () {
            App.modules.dataset.DatasetApplication.showSelection();
        },

        visualization : function(type, selection) {
            App.modules.dataset.DatasetApplication.showVisualization({type : type, selection : selection});
        },
        
        defaultChart : function() {
            App.modules.dataset.DatasetApplication.showDefault();
        }

    });
})();