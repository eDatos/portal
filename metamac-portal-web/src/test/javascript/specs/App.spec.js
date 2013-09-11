describe("App", function () {

    it("can define namespace", function () {
        var result = App.namespace("App.a.b.c");
        expect(App.a.b.c).to.exists;
        expect(App.a.b.c).to.equal(result);
    });

    it("return null when define null namespace", function () {
        var result = App.namespace(null);
        expect(result).to.be.null;
    });

});