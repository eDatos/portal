(function() {
    STAT4YOU.namespace("STAT4YOU.modules.dataset");
    
    STAT4YOU.modules.dataset.Router = Backbone.Router.extend({

        initialize : function (options) {
            this.defaultType = options.defaultType;
        },

        routes : {
            "type/:type" : "changeChart",
            "type/:type/selection/:selection" : "changeChart",
            "" : "defaultChart"
        },

        changeChart : function(type, selection) {
            this.trigger('changeChart', {type : type, selection : selection });
        },
        
        defaultChart : function() {
            this.trigger('changeChart', {type : this.defaultType, selection : undefined });
        }

    });
})();