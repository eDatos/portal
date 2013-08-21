(function() {
    App.namespace("App.modules.dataset");
    
    App.modules.dataset.OptionsModel = Backbone.Model.extend({
        defaults : {
            type : '',
            fullScreen : false,
            filter : false,
            options : true
        }
    });
    
})();