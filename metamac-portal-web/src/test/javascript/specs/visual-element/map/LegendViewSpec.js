describe("LegendView", function () {

    var model, legendView;

    beforeEach(function () {
        model = new App.Map.MapModel();
        model.set({
            minScale : 1,
            maxScale : 32,
            scaleFactor : 2,
            currentScale : 1,
            x : 0,
            y : 0,
            animationDelay : 0,
            /* Leyend */
            minValue : 0,
            maxValue : 40,
            values : [1, 9, 14, 20, 39],
            minRangesNum : 1,
            maxRangesNum : 10,
            currentRangesNum : 5
        });
        legendView = new App.Map.LegendView({model : model});
    });

    describe("CreateRanges", function () {
        it("should create ranges for multiple ranges", function () {
            var templateQuantiles = legendView._createRanges();
            expect(templateQuantiles.length).toBe(5);
            expect(templateQuantiles).toEqual([ '0.00 < 7.40', '7.40 < 12.00', '12.00 < 16.40', '16.40 < 23.80', '23.80 < 40.00' ]);
        });

        it("should create ranges for two ranges", function () {
            model.set({ currentRangesNum : 2});
            var templateQuantiles = legendView._createRanges();
            expect(templateQuantiles.length).toBe(2);
            expect(templateQuantiles).toEqual([  '0.00 < 14.00', '14.00 < 40.00' ]);
        });

        it("should create ranges for one ranges", function () {
            model.set({ currentRangesNum : 1});
            var templateQuantiles = legendView._createRanges();
            expect(templateQuantiles.length).toBe(1);
            expect(templateQuantiles).toEqual([ '0.00 < 40.00' ]);
        });
    });

});