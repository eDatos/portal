(function () {

    App.namespace('App.Map.ShapesApi');

    App.Map.ShapesApi = function () {
    };

    App.Map.ShapesApi.prototype = {

        getShapes : function (normCodes, cb) {
            var variableId = this._extractVariableId(normCodes);
            var codes = this._extractCodes(normCodes);
            var ajaxParams = {
                type : "GET",
                url : App.endpoints["structural-resources"] + "/variables/" + variableId + "/variableelements/~all/geoinfo",
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

        getContainer : function (normCodes, cb) {
            var self = this;
            var url = App.endpoints["structural-resources"] + "/variables/~all/variableelements?query=VARIABLE_TYPE%20EQ%20'GEOGRAPHICAL'%20AND%20GEOGRAPHICAL_GRANULARITY_URN%20IS_NULL&limit=1&_type=json";
            $.getJSON(url)
                .done(function (response) {
                    var urn = response.variableElement[0].urn;
                    cb(null, self._extractNormCodeFromUrn(urn));
                })
                .fail(function () {
                    cb("Error fetching container");
                });
        },

        getLastUpdatedDate : function (normCodes, cb) {
            var variableId = this._extractVariableId(normCodes);
            var codes = this._extractCodes(normCodes);
            if (codes.length) {
                var requestParams = {
                    url : App.endpoints["structural-resources"] + "/variables/" + variableId + "/variableelements/" + codes[0] + "/geoinfo.json?fields=-geographicalGranularity,-geometry,-point",
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

        getGranularityOrder : function (cb) {
            //TODO query to retrieve granularityOrder codelist ID
            var codelist = {
                id : "CL_GEO_GRANULARITIES",
                version : "01.001"
            };

            var requestParams = {
                url : App.endpoints["structural-resources"] + "/codelists/ISTAC/" + codelist.id + "/" + codelist.version + "/codes?_type=json",
                method : "GET"
            };
            $.ajax(requestParams).
                done(function (response) {
                    var result = _.map(response.code, function (code) {
                        return _.pick(code, "id", "order", "urn");
                    });
                    cb(null, result);
                })
                .fail(function () {
                    cb("Error fetching granularity order");
                });
        },

        _createNormCodesQuery : function (codes) {
            var inContent = _.map(codes, function (code) {
                return "'" + code + "'";
            }).join(", ");
            return "ID IN (" + inContent + ")";
        },

        _extractNormCodeFromUrn : function (urn) {
            if (urn) {
                return _.last(urn.split("="));
            }
        },

        _extractVariableId : function (normCodes) {
            if (normCodes.length) {
                var normCode = _.first(normCodes);
                var dotIndex = normCode.indexOf(".");
                return normCode.substring(0, dotIndex);
            }
        },

        _extractCodes : function (normCodes) {
            var variableId = this._extractVariableId(normCodes);
            return _.map(normCodes, function (normCode) {
                return normCode.substring(variableId.length + 1);
            });
        }

    };

}());