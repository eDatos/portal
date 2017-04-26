(function () {
    "use strict";

    App.namespace('App.AppRouter');

    App.AppRouter = Backbone.Router.extend({
        // QueryStringMode, the shorter urls that expect tha identifiers on the query string "?agencyId=ISTAC&resourceId=C00031A_000002&version=001.000"

        routes : {
            "collections/:agency/:identifier" : "collection",

            "datasets/:agency/:identifier/:version" : "dataset",
            "datasets" : "dataset",

            "datasets/:agency/:identifier/:version/selection" : "datasetSelection",
            "datasets/selection" : "datasetSelection",

            "datasets/:agency/:identifier/:version/selection/permalink/:permalinkId" : "datasetSelectionPermalink",
            "datasets/selection/permalink/:permalinkId" : "datasetSelectionPermalinkQueryStringMode",

            "datasets/:agency/:identifier/:version/visualization" : "datasetVisualization",
            "datasets/visualization" : "datasetVisualization",

            "datasets/:agency/:identifier/:version/visualization/:visualizationType" : "datasetVisualizationType",
            "datasets/visualization/:visualizationType" : "datasetVisualizationTypeQueryStringMode",

            "datasets/:agency/:identifier/:version/visualization/:visualizationType/permalink/:permalinkId" : "datasetVisualizationTypePermalink",
            "datasets/visualization/:visualizationType/permalink/:permalinkId" : "datasetVisualizationTypePermalinkQueryStringMode",


            "queries/:agency/:identifier" : "query",
            "queries" : "query",

            "queries/:agency/:identifier/selection" : "querySelection",
            "queries/selection" : "querySelection",

            "queries/:agency/:identifier/visualization" : "queryVisualization",
            "queries/visualization" : "queryVisualization",

            "queries/:agency/:identifier/visualization/:visualizationType" : "queryVisualizationType",
            "queries/visualization/:visualizationType" : "queryVisualizationTypeQueryStringMode",

            "queries/:agency/:identifier/visualization/:visualizationType/permalink/:permalinkId" : "queryVisualizationTypePermalink",
            "queries/visualization/:visualizationType/permalink/:permalinkId" : "queryVisualizationTypePermalinkQueryStringMode",


            "*path" : "error"
        },

        initialize : function (options) {
            options || (options = {});
            this.collectionController = options.collectionController;
            this.datasetController = options.datasetController;
            this.errorController = options.errorController;

            this.collectionController.router = this;
            this.datasetController.router = this;
            this.errorController.router = this;

            this.routesByName = _.invert(this.routes);
        },

        _nameArguments : function (names, args) {
            var results = {};
            _.each(names, function (name, i) {
                results[name] = args[i];
            });
            return results;
        },

        _nameCollectionArguments : function (args) {
            return this._nameArguments(["agency", "identifier", "version"], args);
        },

        _nameDatasetArguments : function (args) {
            var args = this._nameArguments(["agency", "identifier", "version", "visualizationType", "permalinkId"], args);
            args.type = "dataset";
            return args;
        },
        
        _nameDatasetSelectionPermalinkArguments : function (args) {
            var args = this._nameArguments(["agency", "identifier", "version", "permalinkId"], args);
            args.type = "dataset";
            return args;
        },

        _nameQueryArguments : function (args) {
            var args = this._nameArguments(["agency", "identifier", "visualizationType", "permalinkId"], args);
            args.type = "query";
            return args;
        },

        _nameDatasetArgumentsQueryStringMode : function (args) {
            var args = this._nameArguments(["visualizationType", "permalinkId"], args);
            args.type = "dataset";
            return args;
        },
        
        _nameDatasetSelectionPermalinkArgumentsQueryStringMode : function (args) {
            var args = this._nameArguments(["permalinkId"], args);
            args.type = "dataset";
            return args;
        },

        _nameQueryArgumentsQueryStringMode : function (args) {
            var args = this._nameArguments(["visualizationType", "permalinkId"], args);
            args.type = "query";
            return args;
        },

        collection : function () {
            var args = this._nameCollectionArguments(arguments);
            args = _.defaults(App.queryParams, args);
            this.collectionController.showCollection(args);
        },

        dataset : function () {
            var args = this._nameDatasetArguments(arguments);
            args = _.defaults(App.queryParams, args);
            this.datasetController.showDataset(args);
        },

        datasetSelection : function () {
            var args = this._nameDatasetArguments(arguments);
            args = _.defaults(App.queryParams, args);
            this.datasetController.showDatasetSelection(args);
        },
        
        datasetSelectionPermalink : function () {
            var args = this._nameDatasetSelectionPermalinkArguments(arguments);
            this.datasetController.showDatasetSelection(args);
        },
        datasetSelectionPermalinkQueryStringMode : function () {
            var args = this._nameDatasetSelectionPermalinkArgumentsQueryStringMode(arguments);
            args = _.defaults(App.queryParams, args);
            this.datasetController.showDatasetSelection(args);
        },

        datasetVisualization : function () {
            var args = this._nameDatasetArguments(arguments);
            args = _.defaults(App.queryParams, args);
            this.datasetController.showDatasetVisualization(args);
        },

        datasetVisualizationType : function () {
            var args = this._nameDatasetArguments(arguments);
            this.datasetController.showDatasetVisualization(args);
        },
        datasetVisualizationTypeQueryStringMode : function () {
            var args = this._nameDatasetArgumentsQueryStringMode(arguments);
            args = _.defaults(App.queryParams, args);
            this.datasetController.showDatasetVisualization(args);
        },

        datasetVisualizationTypePermalink : function () {
            var args = this._nameDatasetArguments(arguments);
            this.datasetController.showDatasetVisualization(args);
        },
        datasetVisualizationTypePermalinkQueryStringMode : function () {
            var args = this._nameDatasetArgumentsQueryStringMode(arguments);
            args = _.defaults(App.queryParams, args);
            this.datasetController.showDatasetVisualization(args);
        },


        query : function () {
            var args = this._nameQueryArguments(arguments);
            args = _.defaults(App.queryParams, args);
            this.datasetController.showDataset(args);
        },

        querySelection : function () {
            var args = this._nameQueryArguments(arguments);
            args = _.defaults(App.queryParams, args);
            this.datasetController.showDatasetSelection(args);
        },

        queryVisualization : function () {
            var args = this._nameQueryArguments(arguments);
            args = _.defaults(App.queryParams, args);
            this.datasetController.showDatasetVisualization(args);
        },

        queryVisualizationType : function () {
            var args = this._nameQueryArguments(arguments);
            this.datasetController.showDatasetVisualization(args);
        },
        queryVisualizationTypeQueryStringMode : function () {
            var args = this._nameQueryArgumentsQueryStringMode(arguments);
            args = _.defaults(App.queryParams, args);
            this.datasetController.showDatasetVisualization(args);
        },

        queryVisualizationTypePermalink : function () {
            var args = this._nameQueryArguments(arguments);
            this.datasetController.showDatasetVisualization(args);
        },
        queryVisualizationTypePermalinkQueryStringMode : function () {
            var args = this._nameQueryArgumentsQueryStringMode(arguments);
            args = _.defaults(App.queryParams, args);
            this.datasetController.showDatasetVisualization(args);
        },

        error : function () {
            console.log("error");
            this.errorController.showError({errorCode : 404});
        },

        linkTo : function (routeName, params) {
            var route = this.routesByName[routeName];

            if (_.isUndefined(route)) {
                throw new Error("Invalid route " + routeName);
            }

            var link = route;
            _.each(params, function (paramValue, paramName) {
                var paramRegExp = new RegExp(":" + paramName, "g");
                link = link.replace(paramRegExp, paramValue);
            });

            return link;
        }

    });

}());