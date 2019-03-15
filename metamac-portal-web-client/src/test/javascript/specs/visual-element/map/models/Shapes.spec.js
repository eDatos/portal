describe("Shapes", function () {
    var shapes;
    var getShapesApiResponse = [
        {normCode : "CODE1", shape : "[shape1]", geometryType : "Polygon", granularity : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).COUNTRIES"},
        {normCode : "CODE2", shape : "[shape2]", geometryType : "Polygon", granularity : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).ISLAND"}
    ];
    var getGranularityOrderApiResponse = [
        {
            id : "COUNTRIES",
            order : 1,
            urn : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).COUNTRIES"
        },
        {
            id : "ISLAND",
            order : 2,
            urn : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).ISLAND"
        }
    ];
    var expectedResult = [
        {normCode : "CODE1", shape : "[shape1]", geometryType : "Polygon", granularity : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).COUNTRIES", hierarchy : 1},
        {normCode : "CODE2", shape : "[shape2]", geometryType : "Polygon", granularity : "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_GEO_GRANULARITIES(01.001).ISLAND", hierarchy : 2}
    ];

    var normCodes = _.pluck(getShapesApiResponse, "normCode");

    var mockAsyncFuncWithResult = function (result) {
        return function () {
            var cb = _.last(_.toArray(arguments));
            cb(null, result);
        }
    };

    beforeEach(function () {
        shapes = new App.Map.Shapes();
        shapes.api.getShapes = mockAsyncFuncWithResult([]);
        shapes.store.get = mockAsyncFuncWithResult([]);
        shapes.api.getLastUpdatedDate = mockAsyncFuncWithResult(new Date());
        shapes.api.getGranularityOrder = mockAsyncFuncWithResult(getGranularityOrderApiResponse);
    });

    it('should query the api for the last updated date only the first time', function (done) {
        var getLastUpdatedDateSpy = sinon.spy(shapes.api, "getLastUpdatedDate");
        shapes.fetchShapes(normCodes, function () {
            expect(getLastUpdatedDateSpy.callCount).to.equal(1);
            shapes.fetchShapes(normCodes, function () {
                expect(getLastUpdatedDateSpy.callCount).to.equal(1);
                done();
            });
        });
    });

    it("should try to recover the shapes to store first", function (done) {
        shapes.store.get = mockAsyncFuncWithResult(getShapesApiResponse);
        shapes.fetchShapes(normCodes, function (err, result) {
            expect(result).to.eql(expectedResult);
            done();
        });
    });

    describe.skip("when all shapes aren't in the database", function () {
        beforeEach(function () {
            var storeResponse = [getShapesApiResponse[0], undefined];
            shapes.store.get = mockAsyncFuncWithResult(storeResponse);
        });

        it('should call the api and store the new data in the store', function (done) {
            var apiResponse = [getShapesApiResponse[1]];

            shapes.api.getShapes = mockAsyncFuncWithResult(apiResponse);
            shapes.store.put = function (normCodes, cb) {
                expect(normCodes).to.eql(apiResponse);
                cb();
            };
            shapes.fetchShapes(normCodes, function (err, result) {
                expect(result).to.eql(expectedResult);
                done();
            });
        });
    });

    it("should find the contour to cache first", function (done) {
        var storeResponse = {normCode : "CONTAINER", shape : "[shape1]"};
        shapes.api.getContainerNormCode = mockAsyncFuncWithResult("CONTAINER");
        shapes.store.get = mockAsyncFuncWithResult([storeResponse]);

        shapes.fetchContainer(function (err, result) {
            expect(result).to.eql(storeResponse);
            done();
        });
    });

});