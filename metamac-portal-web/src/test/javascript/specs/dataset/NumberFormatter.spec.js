describe("Number Formatter", function () {

    var NumberFormatter = App.dataset.data.NumberFormatter;

    it("should return null when no param", function () {

        expect(NumberFormatter.strToNumber()).to.be.null;
    });

    it("should return null with empty str", function () {
        expect(NumberFormatter.strToNumber('')).to.be.null;
    });

    it("should return null when input is invalid", function () {
        expect(NumberFormatter.strToNumber('abc')).to.be.null;
    });

    it("should parse integer numbers", function () {
        expect(NumberFormatter.strToNumber('123')).to.equal(123);
    });

    it("should parse float numbers with , separator", function () {
        expect(NumberFormatter.strToNumber('123,983')).to.equal(123.983);
    });

    it("should parse float numbers with thousand separator", function () {
        expect(NumberFormatter.strToNumber('12123.983')).to.equal(12123.983);
    });

});
