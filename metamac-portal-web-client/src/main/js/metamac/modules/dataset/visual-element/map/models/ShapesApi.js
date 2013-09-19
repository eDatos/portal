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

        _createNormCodesQuery : function (codes) {
            var inContent = _.map(codes, function (code) {
                return "'" + code + "'";
            }).join(", ");
            return "ID IN (" + inContent + ")";
        },

        getShapes : function (normCodes, cb) {
            var variableId = this.extractVariableId(normCodes);
            var codes = this.extractCodes(normCodes);
            var ajaxParams = {
                type : "GET",
                url : App.endpoints.srm + "/variables/" + variableId + "/variableelements/~all/geoinfo",
                data : {
                    query : this._createNormCodesQuery(codes),
                    _type : "json"
                }
            };
            $.ajax(ajaxParams)
                .done(function (response) {
                    var shapeList = App.Map.GeoJsonConverter.geoJsonToShapeList(response);
                    _.each(shapeList, function (shape) {
                        shape.normCode = variableId + "." + shape.normCode;
                    });
                    cb(null, shapeList);
                })
                .fail(function (e) {
                    cb("Error fetching shapes");
                });
        },

        extractNormCodeFromUrn : function (urn) {
            if (urn) {
                return _.last(urn.split("="));
            }
        },

        getContainer : function (normCodes, cb) {
            var self = this;
            var url = App.endpoints.srm + "/variables/~all/variableelements?query=VARIABLE_TYPE%20EQ%20'GEOGRAPHICAL'%20AND%20GEOGRAPHICAL_GRANULARITY_URN%20IS_NULL&limit=1&_type=json";
            $.getJSON(url)
                .done(function (response) {
                    var urn = response.variableElement[0].urn;
                    cb(null, self.extractNormCodeFromUrn(urn));
                })
                .fail(function () {
                    cb("Error fetching container");
                });
        },

        getLastUpdatedDate : function (normCodes, cb) {
            var variableId = this.extractVariableId(normCodes);
            var codes = this.extractCodes(normCodes);
            if (codes.length) {
                var requestParams = {
                    url : App.endpoints.srm + "/variables/" + variableId + "/variableelements/" + codes[0] + "/geoinfo.json?fields=-geographicalGranularity,-geometry,-point",
                    method : "GET"
                };
                $.ajax(requestParams)
                    .done(function (response) {
                        var lastUpdateDate = new Date(response.features[0].properties.lastUpdatedDate);
                        cb(null, lastUpdateDate);
                    }).fail(function () {
                        cb("Error fetching lastUpdateDate");
                    });
            }
        },

        extractVariableId : function (normCodes) {
            if (normCodes.length) {
                var normCode = _.first(normCodes);
                var dotIndex = normCode.indexOf(".");
                return normCode.substring(0, dotIndex);
            }
        },

        extractCodes : function (normCodes) {
            var variableId = this.extractVariableId(normCodes);
            return _.map(normCodes, function (normCode) {
                return normCode.substring(variableId.length + 1);
            });
        }

    };

}());