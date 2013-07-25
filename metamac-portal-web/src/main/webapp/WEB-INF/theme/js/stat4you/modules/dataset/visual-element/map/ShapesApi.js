(function () {

    STAT4YOU.namespace('STAT4YOU.Map.ShapesApi');

    STAT4YOU.Map.ShapesApi = function () {
    };

    STAT4YOU.Map.ShapesApi.prototype = {

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
            var url = STAT4YOU.apiContext + "/maps/shapes";
            var params = this._prepareRequestParams(normCodes, url);
            return $.ajax(params).then(function (response) {
                return STAT4YOU.Map.GeoJsonConverter.geoJsonToShapeList(response);
            });
        },

        getContainer : function (normCodes) {
            var url = STAT4YOU.apiContext + "/maps/container";
            var params = this._prepareRequestParams(normCodes, url);
            return $.ajax(params);
        }

    };

}());