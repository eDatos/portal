(function () {
    "use strict";

    App.namespace('App.modules.dataset.DatasetController');

    App.modules.dataset.DatasetController = App.Controller.extend({

        initialize: function (options) {
            this.region = options.region;
        },

        showDataset: function (datasetIdentifier) {
            var self = this;
            this._loadMetadata(datasetIdentifier).then(function () {
                var routeParts = [];

                if (self.metadata.getAutoOpen()) {
                    routeParts.push("visualization");
                } else {
                    routeParts.push("selection");
                }

                var route = routeParts.join("/");
                Backbone.history.navigate(route, { trigger: true, replace: true });
            });
        },

        showDatasetSelection: function (datasetIdentifier) {
            var link = this._linkToDatasetSelection(datasetIdentifier);
            this.router.navigate(link);

            var self = this;
            this._loadMetadata(datasetIdentifier).then(function () {
                self.region.show(self.selectionView);
            });
        },

        showDatasetVisualization: function (options) {
            var link = this._linkToDatasetVisualization(options);
            this.router.navigate(link);

            var self = this;
            var datasetIdentifier = _.pick(options, "type", "agency", "identifier", "version", "permalinkId", "indicatorSystem", "geo", "multidatasetId");
            this._loadMetadata(datasetIdentifier).then(function () {
                options = _.defaults(options, {
                    visualizationType: "table",
                    fullScreen: false
                });
                if (self.region.currentView !== self.visualizationView) {
                    self.region.show(self.visualizationView);
                }
                self.visualizationView.showChart(options);
            });
        },

        changeDatasetVisualization: function (options) {
            var link = this._linkToDatasetVisualization(options);
            this.router.navigate(link, { replace: true });
            this.visualizationView.showChart(options);
        },

        _linkToDatasetVisualization: function (options) {
            var routeName = "visualization";
            if (options.visualizationType) {
                routeName = routeName + "Type";
            }
            if (options.permalinkId) {
                routeName = routeName + "Permalink";
            }
            return this.router.linkTo(routeName, options);
        },

        _linkToDatasetSelection: function (options) {
            var routeName = "selection";
            if (options.permalinkId) {
                routeName = routeName + "Permalink";
            }
            return this.router.linkTo(routeName, options);
        },

        _loadMetadata: function (datasetIdentifier) {
            var deferred = $.Deferred();
            var datasourceIdentifier = new App.datasource.DatasourceIdentifier(datasetIdentifier);

            if (datasourceIdentifier.equals(this.datasourceIdentifier)) {
                deferred.resolve();
                return deferred.promise();
            }
            
            this.datasourceIdentifier = datasourceIdentifier;
            this.metadataRequest = new App.datasource.MetadataRequest(this.datasourceIdentifier);
            this.dataRequest = new App.datasource.DataRequest(this.datasourceIdentifier);

            var loads = {
                metadata: _.bind(this.metadataRequest.fetch, this.metadataRequest),
                data: _.bind(this.dataRequest.fetch, this.dataRequest)
            };

            var self = this;
            async.parallel(loads, function (err, result) {
                self.metadata = self.metadataRequest.getMetadataResponse();
                self.filterDimensions = App.modules.dataset.filter.models.FilterDimensions.initializeWithMetadata(self.metadata);
                self.data = self.dataRequest.getDataResponse(self.metadata, self.filterDimensions);

                self.selectionView = new App.modules.selection.SelectionView({ controller: self, collection: self.filterDimensions, metadata: self.metadata });
                self.visualizationView = new App.modules.dataset.DatasetView({ controller: self, filterDimensions: self.filterDimensions, metadata: self.metadata, data: self.data });

                if (datasetIdentifier.permalinkId) {
                    App.modules.dataset.DatasetPermalink.retrievePermalink(datasetIdentifier.permalinkId).done(function (content) {
                        self.filterDimensions.importJSON(content.selection);
                        if (!window.location.hash.includes(content.hash)) {
                            self.visualizationView.optionsModel.set('mustApplyVisualizationRestrictions', true);
                        }
                        deferred.resolve();
                    }).fail(function () {
                        deferred.resolve();
                    });
                } else if (datasetIdentifier.geo) {
                    self.filterDimensions.importGeographicSelection(datasetIdentifier.geo);
                    deferred.resolve();
                } else {
                    deferred.resolve();
                }
            });
   
            return deferred.promise();
        }
    });

}());