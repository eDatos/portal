(function () {
    "use strict";

    App.namespace("App.mixins.FetchEventsForCollection");

    App.mixins.FetchEventsForCollection = {
        fetch : function(options) {
            var self = this;
            options = options || {};

            options.data = options.data || {};
            var success = options.success;
            options.success = function(model, resp){
                self.trigger('fetch:end', self);
                if(success){
                    success(model, resp);
                }
            };
            var error = options.error;
            options.error = function(originalModel, resp, options){
                self.trigger('fetch:end', self);
                if(error){
                    error(originalModel, resp, options);
                }
            };
            self.trigger('fetch:start', self);
            Backbone.Collection.prototype.fetch.call(this, options);
        }
    }

}());
