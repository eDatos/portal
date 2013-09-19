describe("Shapes", function () {
    var shapes;
    var expectedResult = [
        {normCode : "CODE1", shape : "[shape1]", geometryType : "Polygon"},
        {normCode : "CODE2", shape : "[shape2]", geometryType : "Polygon"}
    ];
    var normCodes = _.pluck(expectedResult, "normCode");

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
        shapes.store.get = mockAsyncFuncWithResult(expectedResult);
        shapes.fetchShapes(normCodes, function (err, result) {
            expect(result).to.eql(expectedResult);
            done();
        });
    });

    describe("when all shapes aren't in the database", function () {
        beforeEach(function () {
            var storeResponse = [expectedResult[0], undefined];
            shapes.store.get = mockAsyncFuncWithResult(storeResponse);
        });

        it('should call the api and store the new data in the store', function (done) {
            var apiResponse = [expectedResult[1]];

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
        shapes.api.getContainer = mockAsyncFuncWithResult({normCode : "CONTAINER"});
        shapes.store.get = mockAsyncFuncWithResult([storeResponse]);

        shapes.fetchContainer(["CODE1", "CODE2"], function (err, result) {
            console.log(err, result);
            expect(result).to.eql(storeResponse);
            done();
        });
    });


    it("should return undefined if pass empty normCodes list to container", function (done) {
        var apiSpy = sinon.spy(shapes.api, "getContainer");
        var storeSpy = sinon.spy(shapes.store, "get");

        shapes.fetchContainer([null, undefined], function (err, result) {
            expect(result).to.be.undefined;
            expect(apiSpy.called).to.be.false;
            expect(storeSpy.called).to.be.false;
            done();
        });
    });

});