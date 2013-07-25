describe("stat4you", function () {

    it("can define namespace", function () {
        var result = STAT4YOU.namespace("STAT4YOU.a.b.c");
        expect(STAT4YOU.a.b.c).to.exists;
        expect(STAT4YOU.a.b.c).to.equal(result);
    });

    it("return null when define null namespace", function () {
        var result = STAT4YOU.namespace(null);
        expect(result).to.be.null;
    });

});