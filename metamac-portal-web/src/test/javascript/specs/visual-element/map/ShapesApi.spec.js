describe("ShapesApi", function () {
    var TIMEOUT = 1000;
    var ShapesApi = App.Map.ShapesApi;
    var GeoJsonConverter = App.Map.GeoJsonConverter;
    var shapesApi = new ShapesApi();

    var geoJson = {
        type : "FeatureCollection",
        features : [
            {
                type : "Feature",
                id : "CODE1",
                properties : {
                    normCode : "CODE1"
                },
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
                id : "CODE2",
                properties : {
                    normCode : "CODE2"
                },
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

    it("should transform the returned geoJson into shapeList", function () {

        spyOn($, "ajax").andCallFake(function (params) {
            var response = new $.Deferred();
            response.resolve(geoJson);
            return response;
        });

        var req = shapesApi.getShapes(["CODE1", "CODE2"])
            .done(function (response) {
                expect(response).toEqual(GeoJsonConverter.geoJsonToShapeList(geoJson));
            });

        waitsFor(function () {
            return req.state() === "resolved";
        }, TIMEOUT);

    });

});