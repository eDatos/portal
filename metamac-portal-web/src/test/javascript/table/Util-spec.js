describe("[TableCanvas] Utils", function () {

    var Utils = STAT4YOU.Table.Utils;

    it("should calculate the rightProductAcumulate", function () {
        var result = Utils.rightProductAcumulate([5, 10, 2]);
        expect(result).toEqual([20, 2, 1]);
    });

    it("should divide an array in two", function () {
        var result = Utils.divideArray([0, 1]);
        expect(result).toEqual([
            [0],
            [1]
        ]);

        var result = Utils.divideArray([0]);
        expect(result).toEqual([
            [0],
            []
        ]);

        var result = Utils.divideArray([0, 1, 2]);
        expect(result).toEqual([
            [0, 1] ,
            [2]
        ]);
    });
});
