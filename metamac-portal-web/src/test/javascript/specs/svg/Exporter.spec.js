describe("Exporter", function () {

    it("should add style to svg", function () {
        var exporter = new App.svg.Exporter();
        var svg = "<svg><rect/></svg>";
        var css = ".color {fill : #fff}";
        var result = exporter._insertStyleInSvg(svg, css);
        expect(result).to.equal('<svg><defs><style type="text/css"><![CDATA[' + css + ']]></style></defs><rect/></svg>');
    });

});