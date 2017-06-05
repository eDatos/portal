describe('ApiIndicatorResponse', function () {

    var apiResponse;

    beforeEach(function () {
        apiResponse = new App.dataset.data.ApiResponse(App.test.indicatorResponse.data, undefined, App.Constants.api.type.INDICATOR);
    });


    describe('should getDataById', function () {
        var emptyAttributes = {
            primaryMeasureAttributes: [],
            combinatedDimensionsAttributes: []
        }
        it('first value', function () {
            var value = apiResponse.getDataById({ GEOGRAPHICAL: "ES", TIME: "2012M11", MEASURE: "ABSOLUTE" });
            console.log(value);
            expect(value).to.eql({ value: "31697.00", attributes: emptyAttributes });
        });

        it('last value', function () {
            var value = apiResponse.getDataById({ GEOGRAPHICAL: "ES611", TIME: "2012M11", MEASURE: "ABSOLUTE" });
            console.log(value);
            expect(value).to.eql({ value: "877.00", attributes: emptyAttributes });
        });

    });

    it('should getDataByPos', function () {

    });

});