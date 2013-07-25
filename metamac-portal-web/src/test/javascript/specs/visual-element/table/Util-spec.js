describe("[TableCanvas] Utils", function () {

    var Utils = STAT4YOU.Table.Utils;

    it("should calculate the rightProductAcumulate", function () {
        var result = Utils.rightProductAcumulate([5, 10, 2]);
        expect(result).to.eql([20, 2, 1]);
    });

    it("should divide an array in two", function () {
        var result = Utils.divideArray([0, 1]);
        expect(result).to.eql([
            [0],
            [1]
        ]);

        var result = Utils.divideArray([0]);
        expect(result).to.eql([
            [0],
            []
        ]);

        var result = Utils.divideArray([0, 1, 2]);
        expect(result).to.eql([
            [0, 1] ,
            [2]
        ]);
    });

    describe("floorIndex", function () {
        it("First element", function () {
            expect(Utils.floorIndex([0, 10, 20], 0)).to.eql(0);
        });

        it("Middle element", function () {
            expect(Utils.floorIndex([0, 10, 20], 10)).to.eql(1);
        });

        it("Last element", function () {
            expect(Utils.floorIndex([0, 10, 20], 20)).to.eql(2);
        });

        it("Middle element not in array", function () {
            expect(Utils.floorIndex([0, 10, 20], 5)).to.eql(0);
        });

    });

});
