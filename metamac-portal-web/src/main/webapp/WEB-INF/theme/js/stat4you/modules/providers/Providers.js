(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.modules.providers.Providers");

    STAT4YOU.modules.providers.Providers = Backbone.Collection.extend({

        model : STAT4YOU.modules.providers.Provider,

        findByAcronym : function (acronym) {
            return this.find(function (provider) {
                return provider.get('acronym') === acronym;
            });
        }

    });

}());


