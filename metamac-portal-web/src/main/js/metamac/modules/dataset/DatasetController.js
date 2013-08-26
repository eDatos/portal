(function () {
    "use strict";

    App.namespace('App.modules.dataset.DatasetController');

    App.modules.dataset.DatasetController = App.Controller.extend({

        initialize : function (options) {
            this.region = options.region;
            this.metadata = undefined;
        },

        showDataset : function (datasetIdentifier) {
            var link = this.router.linkTo(datasetIdentifier.type, datasetIdentifier);
            this.router.navigate(link);

            var self = this;
            this._loadMetadata(datasetIdentifier)
                .then(function () {
                    var routeParts = [datasetIdentifier.type + "s", datasetIdentifier.agency, datasetIdentifier.identifier];

                    if (datasetIdentifier.version) {
                        routeParts.push(datasetIdentifier.version);
                    }

                    if (self.metadata.getAutoOpen()) {
                        routeParts.push("visualization");
                    } else {
                        routeParts.push("selection");
                    }

                    var route = routeParts.join("/");
                    Backbone.history.navigate(route, {trigger : true, replace : true});
                });
        },

        showDatasetSelection : function (datasetIdentifier) {
            var link = this.router.linkTo(datasetIdentifier.type + "Selection", datasetIdentifier);
            this.router.navigate(link);

            var self = this;
            this._loadMetadata(datasetIdentifier)
                .then(function () {
                    self.region.show(self.selectionView);
                });
        },

        _linkToDatasetVisualization : function (options) {
            var routeName = options.type + "Visualization";
            if (options.visualizationType) {
                routeName = routeName + "Type";
            }
            return this.router.linkTo(routeName, options);
        },

        showDatasetVisualization : function (options) {
            var link = this._linkToDatasetVisualization(options);
            this.router.navigate(link);

            var self = this;
            var datasetIdentifier = _.pick(options, "type", "agency", "identifier", "version");
            this._loadMetadata(datasetIdentifier)
                .then(function () {
                    options = _.defaults(options, {
                        visualizationType : "canvasTable"
                    });
                    if (self.region.currentView !== self.visualizationView) {
                        self.region.show(self.visualizationView);
                    }
                    self.visualizationView.showChart(options);
                });
        },

        changeDatasetVisualization : function (options) {
            var link = this._linkToDatasetVisualization(options);
            this.router.navigate(link, {replace : true});
            this.visualizationView.showChart(options);
        },

        _loadMetadata : function (datasetIdentifier) {
            var self = this;
            var deferred = $.Deferred();

            var metadata = new App.dataset.Metadata(datasetIdentifier);
            if (metadata.equals(this.metadata)) {
                deferred.resolve();
            } else {
                this.metadata = metadata;
                metadata.fetch().then(function () {
                    self.filterDimensions = App.modules.dataset.filter.models.FilterDimensions.initializeWithMetadata(metadata);
                    self.selectionView = new App.modules.selection.SelectionView({controller : self, collection : self.filterDimensions, metadata : metadata});
                    self.visualizationView = new App.modules.dataset.DatasetView({controller : self, filterDimensions : self.filterDimensions, metadata : metadata});
                    deferred.resolve();
                });
            }
            return deferred.promise();
        }

    });

}());