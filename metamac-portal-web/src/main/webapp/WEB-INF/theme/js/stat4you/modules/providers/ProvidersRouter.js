(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.modules.providers.ProvidersRouter");

    var ProvidersView = STAT4YOU.modules.providers.ProvidersView;
    var ProviderDetailView = STAT4YOU.modules.providers.ProviderDetailView;

    STAT4YOU.modules.providers.ProvidersRouter = Backbone.Router.extend({

        initialize : function (options) {
            this.collection = options.collection;
            this.el = options.el;
        },

        routes : {
            ":acronym" : "detail",
            "" : "defaultRoute"
        },

        defaultRoute : function () {
            this.list();
        },

        list : function () {
            this.providersView = new ProvidersView({
                el : this.el,
                collection : this.collection
            });
            this.providersView.render();
        },

        detail : function (acronym) {
            var provider = this.collection.findByAcronym(acronym);
            this.providersDetailView = new ProviderDetailView({
                el : this.el,
                provider : provider,
                acronym : acronym
            });
            this.providersDetailView.render();
        }

    });

}());