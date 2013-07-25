describe("Rectangle", function () {

    var Rectangle = STAT4YOU.Table.Rectangle,
        Point = STAT4YOU.Table.Point,
        Size = STAT4YOU.Table.Size;

    it("should initialize width point and size", function () {
        var rectangle = new Rectangle(new Point(1, 2), new Size(3, 4));
        expect(rectangle.x).to.eql(1);
        expect(rectangle.y).to.eql(2);
        expect(rectangle.width).to.eql(3);
        expect(rectangle.height).to.eql(4);
    });

    it("should initialize width x, y, width, height", function () {
        var rectangle = new Rectangle(1, 2, 3, 4);
        expect(rectangle.x).to.eql(1);
        expect(rectangle.y).to.eql(2);
        expect(rectangle.width).to.eql(3);
        expect(rectangle.height).to.eql(4);
    });

    it("should calculate the the points limits", function () {
        var rectangle = new Rectangle(10, 20, 100, 200);
        expect(rectangle.topLeftPoint()).to.eql(new Point(10, 20));
        expect(rectangle.topRightPoint()).to.eql(new Point(110, 20));
        expect(rectangle.bottomLeftPoint()).to.eql(new Point(10, 220));
        expect(rectangle.bottomRightPoint()).to.eql(new Point(110, 220));
    });

    it("should calculate if a point belongs to the rectangle", function () {
        var rectangle = new Rectangle(20, 30, 100, 200);

        expect(rectangle.containsPoint(new Point(20, 150))).to.be.true;
        expect(rectangle.containsPoint(new Point(100, 150))).to.be.true;
        expect(rectangle.containsPoint(new Point(119, 229))).to.be.true;

        expect(rectangle.containsPoint(new Point(19, 150))).to.be.false;
        expect(rectangle.containsPoint(new Point(25, 231))).to.be.false;
        expect(rectangle.containsPoint(new Point(121, 231))).to.be.false;
    });
});