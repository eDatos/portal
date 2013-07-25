describe("App-ve-map", function () {

    var veMap = {};
    _.defaults(veMap, App.VisualElement.Map.prototype);

    veMap._dataJson = {
        1 : {name : "Mallorca", value : 10},
        2 : {name : "Menorca", value : 22},
        3 : {name : "Eivissa", value : 5},
        4 : {name : "Formentera", value : 39}
    };

    veMap._mapModel = new App.Map.MapModel();
    veMap._mapModel.attributes = {
        minScale : 1,
        maxScale : 32,
        scaleFactor : 2,
        currentScale : 1,
        x : 0,
        y : 0,
        animationDelay : 0,
        /* Leyend */
        minValue : 50,
        maxValue : 200,
        minRangesNum : 1,
        maxRangesNum : 10,
        currentRangesNum : 5
    };

    veMap.initialize = function () {

    };

    it("calculateRanges - should calculate the minValue and the MaxValue from the dataJson", function () {
        veMap._calculateRanges();
        expect(veMap._mapModel.attributes.minValue).toBe(5);
        expect(veMap._mapModel.attributes.maxValue).toBe(39);
    });

});