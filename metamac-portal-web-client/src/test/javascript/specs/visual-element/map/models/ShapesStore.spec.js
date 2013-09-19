describe("ShapesStore", function () {


    var shapesStore;

    beforeEach(function (done) {
        shapesStore = new App.Map.ShapesStore();
        //shapesStore.clear(done);
        done();
    });


    it('should put and get shapes', function (done) {
        var shapes = [
            {normCode : "A", shape : "[1,2,3]", geometryType : "Polygon"},
            {normCode : "B", shape : "[1,2,3]", geometryType : "Polygon"}
        ];
        var normCodes = _.pluck(shapes, "normCode");
        shapesStore.put(shapes, function (err) {
            shapesStore.get(normCodes, function (err, result) {
                expect(result).to.eql(shapes);
                done();
            });
        });
    });


    describe('when db lastUpdatedDate', function () {

        beforeEach(function (done) {
            var shapes = [
                {normCode : "A", shape : "[1,2,3]", geometryType : "Polygon"},
                {normCode : "B", shape : "[1,2,3]", geometryType : "Polygon"}
            ];
            shapesStore.setLastUpdatedDate(new Date(), function (err) {
                shapesStore.put(shapes, done);
            });
        });

        it("should clear cache if new date is previous", function (done) {
            var previousDate = new Date();
            var invalidateCacheSpy = sinon.spy(shapesStore, "invalidateCache");
            shapesStore.setLastUpdatedDate(previousDate, function (err) {
                expect(invalidateCacheSpy.called).to.be.true;
                done();
            });
        });

    });


});
