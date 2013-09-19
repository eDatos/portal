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
                    },
                    properties: {
                        geographicalGranularity: "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).ADM-LEVEL3"
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
                    },
                    properties: {
                        geographicalGranularity: "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).ADM-LEVEL2"
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
                    },
                    properties: {
                        geographicalGranularity: "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).ADM-LEVEL1"
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
                    },
                    properties: {
                        geographicalGranularity: "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).COUNTRY"
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
                    },
                    properties: {
                        geographicalGranularity: "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).CONTINENT"
                    }
                }
            ]
        };

        //TODO hierarchy!
        shapeList = [
            {
                normCode : "CODE3_ADM-LEVEL-3",
                geometryType : "Polygon",
                granularity : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).ADM-LEVEL3",
                shape : [
                    [1, 2],
                    [3, 4]
                ]
            },
            {
                normCode : "CODE2_ADM-LEVEL-2",
                geometryType : "MultiPolygon",
                granularity : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).ADM-LEVEL2",
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
                granularity : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).ADM-LEVEL1",
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
                granularity : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).COUNTRY",
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
                granularity : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).CONTINENT",
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
        expect(GeoJsonConverter.shapeListToGeoJson(shapeList)).to.eql(geoJson);
    });

    it("should filter null entries", function () {
        shapeList.push(null);
        expect(GeoJsonConverter.shapeListToGeoJson(shapeList)).to.eql(geoJson);
    });

    it("should convert from shapeList to geoJson adding extra properties", function () {
        _.each(geoJson.features, function (feature) {
            feature.properties.contour = true;
        });
        expect(GeoJsonConverter.shapeListToGeoJson(shapeList, {contour : true})).to.eql(geoJson);
    });

    it("should convert form geoJson to shapeList", function () {
        expect(GeoJsonConverter.geoJsonToShapeList(geoJson)).to.eql(shapeList);
    });

});