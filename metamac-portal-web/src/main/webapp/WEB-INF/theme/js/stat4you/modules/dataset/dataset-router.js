(function() {
    STAT4YOU.namespace("STAT4YOU.modules.dataset");
    
    STAT4YOU.modules.dataset.Router = Backbone.Router.extend({

        initialize : function (options) {
            this.defaultType = options.defaultType;
        },

        routes : {
            "type/:type" : "type",
            "" : "defaultType"
        },

        type : function(type) {
            this.trigger('selectType', type);
        },
        
        defaultType : function() {
            this.trigger('selectType', this.defaultType);
        }

    });
})();