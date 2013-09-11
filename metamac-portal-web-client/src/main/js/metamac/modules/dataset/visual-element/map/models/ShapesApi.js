(function () {

    App.namespace('App.Map.ShapesApi');

    App.Map.ShapesApi = function () {
    };

    App.Map.ShapesApi.prototype = {

        _prepareRequestParams : function (normCodes, url) {
            var data = {normCodes : _.compact(normCodes)};

            var params = {
                url : url,
                dataType : 'json'
            };

            if (data.normCodes.length > 100) {
                // Post
                params.type = "POST";
                params.contentType = 'application/json';
                params.data = JSON.stringify(data);
            } else {
                // Get
                params.type = "GET";
                params.data = data;
                params.traditional = true;
            }

            return params;
        },

        getShapes : function (normCodes) {
            var url = App.apiContext + "/maps/shapes";
            var params = this._prepareRequestParams(normCodes, url);
            return $.ajax(params).then(function (response) {
                return App.Map.GeoJsonConverter.geoJsonToShapeList(response);
            });
        },

        getContainer : function (normCodes) {
            var url = App.apiContext + "/maps/container";
            var params = this._prepareRequestParams(normCodes, url);
            return $.ajax(params);
        }

    };

}());