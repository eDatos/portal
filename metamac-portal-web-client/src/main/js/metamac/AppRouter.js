(function () {
    "use strict";

    App.namespace('App.AppRouter');

    App.AppRouter = Backbone.Router.extend({
        // The agency, identifier and version needs to come the query string "?resourceType=datasetagencyId=ISTAC&resourceId=C00031A_000002&version=001.000"

        routes : {

            "" : "home",

            "selection" : "selection",
            "selection/permalink/:permalinkId" : "selectionPermalink",
            "visualization" : "visualization",
            "visualization/:visualizationType" : "visualizationType",
            "visualization/:visualizationType/permalink/:permalinkId" : "visualizationTypePermalink",

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

            this.checkQueryParamsValidity();
        },

        home : function () {
            this.datasetController.showDataset(App.queryParams);
        },        

        selection : function() {            
            this.datasetController.showDatasetSelection(App.queryParams);
        },
        
        selectionPermalink : function () {
            var args = this._nameArguments(["permalinkId"], arguments);
            args = _.defaults(App.queryParams, args);
            this.datasetController.showDatasetSelection(args);
        },

        visualization : function() {
            this.datasetController.showDatasetVisualization(App.queryParams);
        },

        visualizationType : function() {
            var args = this._nameArguments(["visualizationType"], arguments);
            args = _.defaults(App.queryParams, args);
            this.datasetController.showDatasetVisualization(args);
        },

        visualizationTypePermalink : function() {
            var args = this._nameArguments(["permalinkId", "visualizationType"], arguments);
            args = _.defaults(App.queryParams, args);
            this.datasetController.showDatasetVisualization(App.queryParams);
        },

        error : function () {
            console.error("error");
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
        },

        _nameArguments : function (names, args) {
            var results = {};
            _.each(names, function (name, i) {
                results[name] = args[i];
            });
            return results;
        },

        checkQueryParamsValidity : function() {
            switch (App.queryParams.type) {
                case 'dataset':
                case 'query':                     
                    break;
                default: 
                    return this.error();
            }

            if (_.isUndefined(App.queryParams.agency)) {
                return this.error();
            }

            if (_.isUndefined(App.queryParams.identifier)) {
                return this.error();
            }

            if (_.isUndefined(App.queryParams.type)) {
                return this.error();
            }

            // Collections and queries dont use version, so is not required for them
        }

    });

}());