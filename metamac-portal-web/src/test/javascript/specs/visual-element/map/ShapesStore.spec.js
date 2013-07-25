describe("Shape Store", function () {
    var TIMEOUT = 3000;

    var asserts = function () {
        var ShapesStore = STAT4YOU.Map.ShapesStore;
        var store = new ShapesStore();

        STAT4YOU.configuration = {};
        STAT4YOU.configuration["map.version"] = 1;

        beforeEach(function () {
            var req = store.clear();
            waitsFor(function () {
                return req.state() === "resolved";
            });
        });

        var assertSaveAndGet = function (normCodes, shapes, expected) {
            var saveReq = store.save(shapes);

            waitsFor(function () {
                return saveReq.state() === "resolved";
            }, TIMEOUT);

            runs(function () {
                var resultShape;
                var getReq = store.get(normCodes);
                getReq.done(function (result) {
                    resultShape = result;
                });
                waitsFor(function () {
                    return getReq.state() === "resolved";
                }, TIMEOUT);

                runs(function () {
                    expect(resultShape).toEqual(expected);
                });
            });
        };

        it("should save and get a shape", function () {
            var normCode = "A";
            var shape = {normCode : "A", shape : "[1,2,3]", geometryType : "Polygon"};
            assertSaveAndGet(normCode, shape, shape);
        });

        it("should save and get a list of shapes", function () {
            var normCodes = ["A", "B"];
            var shapes = [
                {normCode : "A", shape : "[1,2,3]", geometryType : "Polygon"},
                {normCode : "B", shape : "[1,2,3]", geometryType : "Polygon"}
            ];
            assertSaveAndGet(normCodes, shapes, shapes);
        });

        it("get should return undefined if normCode is not saved", function () {
            var normCodes = ["A", "C"];
            var shapes = [
                {normCode : "A", shape : "[1,2,3]", geometryType : "Polygon"},
                {normCode : "B", shape : "[1,2,3]", geometryType : "Polygon"}
            ];
            assertSaveAndGet(normCodes, shapes, [shapes[0], undefined]);
        });

        it("should return undefined when get receive null parameter", function () {
            var req = store.get(null)
                .done(function (result) {
                    expect(result).toEqual(undefined);
                });

            waitsFor(function () {
                return req.state() === "resolved";
            });

        });
    }

    describe("IndexedDBStore", function () {
        asserts();
    });

    describe("MapStore", function () {

        spyOn(STAT4YOU.Map.ShapesStore, "hasIndexedDbSupport").andReturn(false);

        asserts();
    })


});
