describe('DB', function () {

    var db;

    beforeEach(function (done) {
        var dbOptions = {
            server : 'metamac',
            version : 1,
            schema : {
                shapes : {
                    key : { keyPath : 'normCode', autoIncrement : true }
                },
                config : {
                    key : {keyPath : 'key', autoIncrement : false}
                }
            }
        };

        db = new App.DB(dbOptions);
        db.connect(function (err) {
            db.clear(function (err) {
                done();
            });
        });
    });


    var asserts = function () {
        var assertSaveAndGet = function (normCodes, shapes, expected, done) {
            db.shapes.put(shapes, function (err) {
                db.shapes.get(normCodes, function (err, result) {
                    expect(result).to.eql(expected);
                    done();
                });
            });
        };

        it("should save and get a shape", function (done) {
            var normCode = "A";
            var shape = {normCode : "A", shape : "[1,2,3]", geometryType : "Polygon"};
            assertSaveAndGet(normCode, shape, shape, done);
        });

        it("should save and get a list of shapes", function (done) {
            var normCodes = ["A", "B"];
            var shapes = [
                {normCode : "A", shape : "[1,2,3]", geometryType : "Polygon"},
                {normCode : "B", shape : "[1,2,3]", geometryType : "Polygon"}
            ];
            assertSaveAndGet(normCodes, shapes, shapes, done);
        });

        it("get should return undefined if normCode is not saved", function (done) {
            var normCodes = ["A", "C"];
            var shapes = [
                {normCode : "A", shape : "[1,2,3]", geometryType : "Polygon"},
                {normCode : "B", shape : "[1,2,3]", geometryType : "Polygon"}
            ];
            assertSaveAndGet(normCodes, shapes, [shapes[0], undefined], done);
        });

        it("should return undefined when get receive null parameter", function (done) {
            db.shapes.get(null, function (err, result) {
                expect(result).to.be.undefined;
                done();
            });
        });
    };

    describe("IndexedDB", function () {
        asserts();
    });

    describe('HashDB', function () {

        beforeEach(sinon.test(function () {
            sinon.stub(App.DB, "hasIndexedDBSupport").returns(false);
            asserts();
        }));

    });


});