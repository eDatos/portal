(function () {
    "use strict";

    App.namespace("App.modules.providers.Providers");

    App.modules.providers.Providers = Backbone.Collection.extend({

        model : App.modules.providers.Provider,

        findByAcronym : function (acronym) {
            return this.find(function (provider) {
                return provider.get('acronym') === acronym;
            });
        }

    });

}());


