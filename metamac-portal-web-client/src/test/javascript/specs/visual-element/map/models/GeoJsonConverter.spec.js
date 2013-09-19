describe("GeoJsonConverter", function () {

    var GeoJsonConverter = App.Map.GeoJsonConverter;
    var geoJson, shapeList;

    beforeEach(function () {

        geoJson = {
            type : "FeatureCollection",
            features : [
                {
                    type : "Feature",
                    id : "CODE3_ADM-LEVEL-3",
                    geometry : {
                        type : "Polygon",
                        coordinates : [
                            [1, 2],
                            [3, 4]
                        ]
                    }
                },
                {
                    type : "Feature",
                    id : "CODE2_ADM-LEVEL-2",
                    geometry : {
                        type : "MultiPolygon",
                        coordinates : [
                            [
                                [5, 6],
                                [7, 8]
                            ]
                        ]
                    }
                },
                {
                    type : "Feature",
                    id : "CODE1_ADM-LEVEL-1",
                    geometry : {
                        type : "MultiPolygon",
                        coordinates : [
                            [
                                [5, 6],
                                [7, 8]
                            ]
                        ]
                    }
                },
                {
                    type : "Feature",
                    id : "CODECOUNTRY_COUNTRY",
                    geometry : {
                        type : "MultiPolygon",
                        coordinates : [
                            [
                                [5, 6],
                                [7, 8]
                            ]
                        ]
                    }
                },
                {
                    type : "Feature",
                    id : "CODECONTINENT_CONTINENT",
                    geometry : {
                        type : "MultiPolygon",
                        coordinates : [
                            [
                                [5, 6],
                                [7, 8]
                            ]
                        ]
                    }
                }
            ]
        };

        //TODO hierarchy!
        shapeList = [
            {
                normCode : "CODE3_ADM-LEVEL-3",
                geometryType : "Polygon",
                hierarchy : 1,
                shape : [
                    [1, 2],
                    [3, 4]
                ]
            },
            {
                normCode : "CODE2_ADM-LEVEL-2",
                geometryType : "MultiPolygon",
                hierarchy : 1,
                shape : [
                    [
                        [5, 6],
                        [7, 8]
                    ]
                ]
            },
            {
                normCode : "CODE1_ADM-LEVEL-1",
                geometryType : "MultiPolygon",
                hierarchy : 1,
                shape : [
                    [
                        [5, 6],
                        [7, 8]
                    ]
                ]
            },
            {
                normCode : "CODECOUNTRY_COUNTRY",
                geometryType : "MultiPolygon",
                hierarchy : 1,
                shape : [
                    [
                        [5, 6],
                        [7, 8]
                    ]
                ]
            },
            {
                normCode : "CODECONTINENT_CONTINENT",
                geometryType : "MultiPolygon",
                hierarchy : 1,
                shape : [
                    [
                        [5, 6],
                        [7, 8]
                    ]
                ]
            }
        ];
    });

    it("should convert from shapeList to geoJson", function () {
        expect(GeoJsonConverter.shapeListToGeoJson(shapeList)).toEqual(geoJson);
    });

    it("should filter null entries", function () {
        shapeList.push(null);
        expect(GeoJsonConverter.shapeListToGeoJson(shapeList)).toEqual(geoJson);
    });

    it("should convert from shapeList to geoJson adding extra properties", function () {
        _.each(geoJson.features, function (feature) {
            feature.properties.contour = true;
        });
        expect(GeoJsonConverter.shapeListToGeoJson(shapeList, {contour : true})).toEqual(geoJson);
    });

    it("should convert form geoJson to shapeList", function () {
        expect(GeoJsonConverter.geoJsonToShapeList(geoJson)).toEqual(shapeList);
    });

});