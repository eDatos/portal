(function () {
    "use strict";

    var UserUtils = App.modules.user.UserUtils;

    App.namespace('App.AppRouter');

    App.AppRouter = Backbone.Router.extend({
        // The agency, identifier and version needs to come the query string "?resourceType=datasetagencyId=ISTAC&resourceId=C00031A_000002&version=001.000"

        routes: {

            "": "home",

            "selection": "selection",
            "selection/permalink/:permalinkId": "selectionPermalink",

            "visualization": "visualization",
            "visualization/permalink/:permalinkId": "visualizationPermalink",

            "visualization/:visualizationType": "visualizationType",
            "visualization/:visualizationType/permalink/:permalinkId": "visualizationTypePermalink",

            "*path": "error"
        },

        // Override Router.route method to add a call to UserUtils.loginOnlyIfAlreadyLogged() before each route callback
        route: function (route, name, callback) {
            if(App.endpoints["external-users"] !== "error" && App.endpoints["external-users-web"] !== "error") {
                var router = this;
                if (!callback) callback = router[name];

                var f = function() {
                    UserUtils.loginOnlyIfAlreadyLoggedInExternalUsers();
                    callback.apply(router, arguments);
                }
                return Backbone.Router.prototype.route.call(router, route, name, f);
            } else {
                return Backbone.Router.prototype.route.call(this, route, name, callback);
            }
        },

        initialize: function (options) {
            options || (options = {});

            this.datasetController = options.datasetController;
            this.datasetController.router = this;

            this.routesByName = _.invert(this.routes);
            this.checkQueryParamsValidity();

            if(App.endpoints["external-users"] !== "error" && App.endpoints["external-users-web"] !== "error") {
                var self = this;
                // Duplicate each route adding a query parameter 'token'
                Object.keys(this.routes).forEach(function(route) {
                    self.route(self.addQueryParam(route, "token"), undefined, self.processTokenAndRedirect);
                });
            }
        },

        processTokenAndRedirect: function () {
            UserUtils.setAuthenticationTokenCookie(arguments[arguments.length - 1]);
            // After saving the token we can remove the token parameter from the current route
            this.navigate('/' + this.removeQueryParam(Backbone.history.getFragment(), "token"), { trigger: true });
        },

        removeQueryParam: function (route, param) {
            return route.replaceAll(new RegExp("[?&]" + param + "=[^/&]+(?=[^/]*$)", "g"), "");
        },

        addQueryParam: function (route, queryParamName) {
            var newRoute = route.trim();
            newRoute = newRoute[newRoute.length - 1] === '/' ? newRoute.slice(0, -1) : newRoute;
            newRoute += /\?[^/]+$/.test(newRoute) ? '&' : '?';
            return newRoute + queryParamName + '=:' + queryParamName;
        },

        home: function () {
            this.datasetController.showDataset(App.queryParams);
        },

        selection: function () {
            this.datasetController.showDatasetSelection(App.queryParams);
        },

        selectionPermalink: function () {
            var args = this._nameArguments(["permalinkId"], arguments);
            args = _.defaults(args, App.queryParams);
            this.datasetController.showDatasetSelection(args);
        },

        visualization: function () {
            this.datasetController.showDatasetVisualization(App.queryParams);
        },

        visualizationPermalink: function () {
            var args = this._nameArguments(["permalinkId"], arguments);
            args = _.defaults(args, App.queryParams);
            this.datasetController.showDatasetVisualization(args);
        },

        visualizationType: function () {
            var args = this._nameArguments(["visualizationType"], arguments);
            args = _.defaults(args, App.queryParams);
            this.datasetController.showDatasetVisualization(args);
        },

        visualizationTypePermalink: function () {
            var args = this._nameArguments(["visualizationType", "permalinkId"], arguments);
            args = _.defaults(args, App.queryParams);
            this.datasetController.showDatasetVisualization(args);
        },

        error: function () {
            console.error("error");
        },

        linkTo: function (routeName, params) {
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

        _nameArguments: function (names, args) {
            var results = {};
            _.each(names, function (name, i) {
                results[name] = args[i];
            });
            return results;
        },

        checkQueryParamsValidity: function () {
            switch (App.queryParams.type) {
                case 'dataset':
                case 'query':
                case 'indicator':
                case 'indicatorInstance':
                    break;
                default:
                    return this.error();
            }

            if (_.isUndefined(App.queryParams.identifier)) {
                return this.error();
            }

            if (_.isUndefined(App.queryParams.type)) {
                return this.error();
            }

            if (_.isUndefined(App.queryParams.agency) && !(App.queryParams.type === 'indicator' || App.queryParams.type === 'indicatorInstance')) {
                return this.error();
            }

            if (App.queryParams.type === 'indicatorInstance' && _.isUndefined(App.queryParams.indicatorSystem)) {
                return this.error();
            }

            // Collections and queries dont use version, so is not required for them
        }

    });

}());