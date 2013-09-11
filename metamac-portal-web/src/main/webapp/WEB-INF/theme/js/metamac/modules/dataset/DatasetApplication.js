(function () {
    "use strict";

    App.modules.dataset.DatasetApplication = new Backbone.Marionette.Application();

    App.modules.dataset.DatasetApplication.addRegions({
        mainRegion : "#dataset-container"
    });

    App.modules.dataset.DatasetApplication.addInitializer(function (options) {
        var self = this;
        var metadata = this.metadata = new App.dataset.Metadata(options.datasetIdentifier);
        metadata.fetch().then(function () {
            var filterDimensions = App.modules.dataset.filter.models.FilterDimensions.initializeWithMetadata(metadata);
            self.selectionView = new App.modules.selection.SelectionView({collection : filterDimensions, metadata : metadata});
            self.visualizationView = new App.modules.dataset.DatasetView({filterDimensions : filterDimensions, metadata : metadata});

            new App.modules.dataset.DatasetRouter();
            Backbone.history.start();
        });
    });

    App.modules.dataset.DatasetApplication.showVisualization = function (options) {
        options || (options = {});
        _.defaults(options, {type : 'canvasTable'});

        this.mainRegion.show(this.visualizationView);
        this.visualizationView.showChart(options);
    };

    App.modules.dataset.DatasetApplication.showSelection = function () {
        this.mainRegion.show(this.selectionView);
    };

    App.modules.dataset.DatasetApplication.showDefault = function () {
        if (this.metadata.getAutoOpen()) {
            Backbone.history.navigate("visualization/canvasTable", {trigger : true, replace : true});
        } else {
            Backbone.history.navigate("selection", {trigger : true, replace : true});
        }
    }


}());