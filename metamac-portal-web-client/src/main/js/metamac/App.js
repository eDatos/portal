(function () {
    "use strict";

    var App = new Backbone.Marionette.Application();

    App.addRegions({
        mainRegion : ".metamac-container"
    });

    App.addInitializer(function () {
        App.collectionController = new App.modules.collection.CollectionController({region : this.mainRegion});
        App.datasetController = new App.modules.dataset.DatasetController({region : this.mainRegion});
        App.errorController = new App.modules.error.ErrorController({region : this.mainRegion});

        App.router = new App.AppRouter({collectionController : App.collectionController, datasetController : App.datasetController, errorController : App.errorController});

        Backbone.history.start();
    });

    App.context = "";
    App.apiContext = "";
    App.resourceContext = "";

    //TODO Migrate to use endpoint properties
    App.endpoints = {
        srm : "",
        "statistical-resources" : ""
    };


    App.namespace = function (namespaceString) {

        if (!namespaceString) {
            return null;
        }

        var parts = namespaceString.split('.'),
            parent = window,
            currentPart = '',
            i,
            length = parts.length;

        for (i = 0; i < length; i++) {
            currentPart = parts[i];
            parent[currentPart] = parent[currentPart] || {};
            parent = parent[currentPart];
        }

        return parent;
    };

    Backbone.Marionette.Renderer.render = function (template, data) {
        return App.templateManager.get(template)(data);
    };

    _.extend(App, Backbone.Events);

    window.App = App;

}());