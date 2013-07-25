(function () {
    "use strict";

    App.namespace("App.modules.search.SearchIndexRouter");

    App.modules.search.SearchIndexRouter = Backbone.Router.extend({

        routes : {
            "search*params" : "search",
            "" : "index"
        },

        index : function () {
            this.trigger("index");
        },

        search : function () {
            var params = this.parseQueryParams();
            this.trigger("search", params);
        },

        updateUrl : function (queryModel) {
            var urlParameters = queryModel.toURLParameters();
            var parametersString = "?" + $.param(urlParameters, true);

            if (this._locationSearch() !== parametersString) {
                this.navigate("search" + parametersString, {trigger : true});
            }
        },

        _locationSearch : function () {
            return location.search;
        },

        parseQueryParams : function () {
            var result = {query : '', facets : {}};

            var queryParams = this._locationSearch();

            if (queryParams[0] === '?') {
                queryParams = queryParams.slice(1); //remove ?
                queryParams = queryParams.replace(/\+/g, ' ');
                var params = queryParams.split("&");
                for (var i = 0; i < params.length; i++) {
                    var val = params[i].split("=");
                    if (val.length === 2) {
                        var key = decodeURIComponent(val[0]);
                        var value = decodeURIComponent(val[1]);

                        if (key === 'query') {
                            result.query = value;
                        } else {
                            if (!result.facets[key]) {
                                result.facets[key] = [];
                            }
                            result.facets[key].push(value);
                        }
                    }
                }
            }
            return result;
        }

    });

}());