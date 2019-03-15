describe('IndicatorDataResponse', function () {

    var indicatorDataResponse;

    beforeEach(function () {
        indicatorDataResponse = new App.datasource.model.DataResponse(App.test.indicatorResponse.data, undefined, new App.datasource.helper.IndicatorHelper(), undefined);
    });


    describe('should getDataById', function () {
        var emptyAttributes = {
            dimensionsAttributes: [],
            primaryMeasureAttributes: [],
            combinatedDimensionsAttributes: []
        }
        it('first value', function () {
            var value = indicatorDataResponse.getDataById({ GEOGRAPHICAL: "ES", TIME: "2012M11", MEASURE: "ABSOLUTE" });
            expect(value).to.eql({ value: "31697.00", attributes: emptyAttributes });
        });

        it('last value', function () {
            var value = indicatorDataResponse.getDataById({ GEOGRAPHICAL: "ES611", TIME: "2012M11", MEASURE: "ABSOLUTE" });
            expect(value).to.eql({ value: "877.00", attributes: emptyAttributes });
        });

    });

});