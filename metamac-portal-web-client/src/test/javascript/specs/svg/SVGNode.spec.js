
describe("SVGNode", function () {

    var SVGNode = App.svg.SVGNode;

    it("should set single attribute", function () {
        var node = new SVGNode("rect");
        node.set("width", 300);
        expect(node.attrs.width).to.equal(300);
    });

    it("should set multiple attributes", function () {
        var node = new SVGNode("rect");
        node.set({width : 300, height : 200});
        expect(node.attrs.width).to.equal(300);
        expect(node.attrs.height).to.equal(200);
    });

    it("should append single elements to container", function () {
        var container = new SVGNode("g");
        var child = new SVGNode("rect");
        child.set({id : "id1"});
        container.append(child);
        expect(container.node.childNodes.length).to.equal(1);
        expect(container.node.childNodes[0].id).to.equal("id1");
    });

    it("should append multiple elements to container", function () {
        var container = new SVGNode("g");
        var child1 = new SVGNode("rect");
        child1.set({id : "id1"});
        var child2 = new SVGNode("text");
        child2.set({id : "id2"});
        container.append([child1, child2]);
        expect(container.node.childNodes.length).to.equal(2);
        expect(container.node.childNodes[0].id).to.equal("id1");
        expect(container.node.childNodes[1].id).to.equal("id2");
    });

    it("should append first to container", function () {
        var container = new SVGNode("g");
        var child1 = new SVGNode("rect");
        child1.set({id : "id1"});
        var child2 = new SVGNode("text");
        child2.set({id : "id2"});
        container.append(child1);
        container.appendFirst(child2);
        expect(container.node.childNodes.length).to.equal(2);
        expect(container.node.childNodes[0].id).to.equal("id2");
        expect(container.node.childNodes[1].id).to.equal("id1");
    });

    it("factory should create n elements of the same type", function () {
        var nodes = SVGNode.factory("text", 3);
        expect(nodes.length).to.equal(3);
        _.each(nodes, function (node) {
            expect(node.name).to.equal("text");
        });
    });

    it("should align node to the bottom right of a frame", function () {
        var node = new SVGNode("rect");
        sinon.stub(node.node, 'getBBox').returns({width : 300, height: 600});
        var frame = {width : 1200, height: 2000};
        node.alignBottomRight(frame, 0, 0);
        expect(node.attrs.transform).to.equal("translate(900, 1400)");
    });

    it("should align node to the bottom right of a frame", function () {
        var node = new SVGNode("rect");
        sinon.stub(node.node, 'getBBox').returns({width : 300, height: 600});
        var frame = {width : 1200, height: 2000};
        node.alignBottomRight(frame, 50, 100);
        expect(node.attrs.transform).to.equal("translate(800, 1350)");
    });

});
