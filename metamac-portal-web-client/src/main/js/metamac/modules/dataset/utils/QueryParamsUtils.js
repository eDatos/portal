(function () {
    "use strict";

    App.namespace("App.QueryParamsUtils");

    App.QueryParamsUtils = {

        getQueryParamsFromQuery: function(query) {
            return query.replace('?', '').split('&').reduce(function(queryParams, queryString){
                var pair = queryString.split('=');
                queryParams[pair[0]] = pair[1] || '';
                return queryParams;
            }, {});
        }
        
    };
}());