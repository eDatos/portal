(function() {
    STAT4YOU.namespace("STAT4YOU.modules.dataset");
    
    STAT4YOU.modules.dataset.OptionsModel = Backbone.Model.extend({
        defaults : {
            type : '',
            fullScreen : false,
            filter : false,
            options : true
        }
    });
    
})();