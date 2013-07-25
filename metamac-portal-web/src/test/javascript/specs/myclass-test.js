describe("myClass", function () {

    it("should be true", function () {
        expect(true).to.be.true;
    });

    it("should create jquery element", function () {
        expect($(document)).not.to.be.undefined;
    })

});