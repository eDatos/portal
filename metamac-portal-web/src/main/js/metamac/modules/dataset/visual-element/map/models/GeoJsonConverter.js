(function () {
    'use strict';

    App.namespace('App.Map.GeoJsonConverter');

    App.Map.GeoJsonConverter = {

        shapeListToGeoJson : function (shapeList, extraProperties) {

            var result = {
                type : "FeatureCollection"
            };

            result.features = _.chain(shapeList)
                .compact()
                .map(function (item) {
                    var feature = {
                        type : 'Feature',
                        id : item.normCode,
                        properties : {
                            normCode : item.normCode
                        },
                        geometry : {
                            type : item.geometryType,
                            coordinates : item.shape
                        }
                    };

                    if (extraProperties) {
                        _.extend(feature.properties, extraProperties);
                    }
                    return feature;
                })
                .value();

            return result;
        },

        geoJsonToShapeList : function (geoJson) {
            return _.map(geoJson.features, function (feature) {
                return {
                    normCode : feature.properties.normCode,
                    geometryType : feature.geometry.type,
                    shape : feature.geometry.coordinates,
                    hierarchy : this._hierarchyByNormCode(feature.properties.normCode)
                };
            }, this);
        },

        _hierarchyByNormCode : function (normCode) {
            var hierarchy = -1;
            if (normCode) {
                var hierarchies = ["WORLD", "CONTINENT", "COUNTRY", "ADM-LEVEL-1", "ADM-LEVEL-2", "ISLAND", "ADM-LEVEL-3"];
                var hierarchyCode = normCode.substring(normCode.lastIndexOf("_") + 1);
                hierarchy =  _.indexOf(hierarchies, hierarchyCode);
            }
            return hierarchy;
        }

    };


}());