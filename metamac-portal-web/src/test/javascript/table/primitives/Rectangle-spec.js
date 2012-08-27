describe("Rectangle", function () {

    var Rectangle = STAT4YOU.Table.Rectangle,
        Point = STAT4YOU.Table.Point,
        Size = STAT4YOU.Table.Size;

    it("should initialize width point and size", function () {
        var rectangle = new Rectangle(new Point(1, 2), new Size(3, 4));
        expect(rectangle.x).toEqual(1);
        expect(rectangle.y).toEqual(2);
        expect(rectangle.width).toEqual(3);
        expect(rectangle.height).toEqual(4);
    });

    it("should initialize width x, y, width, height", function () {
        var rectangle = new Rectangle(1, 2, 3, 4);
        expect(rectangle.x).toEqual(1);
        expect(rectangle.y).toEqual(2);
        expect(rectangle.width).toEqual(3);
        expect(rectangle.height).toEqual(4);
    });

    it("should calculate the the points limits", function () {
        var rectangle = new Rectangle(10, 20, 100, 200);
        expect(rectangle.topLeftPoint()).toEqual(new Point(10, 20));
        expect(rectangle.topRightPoint()).toEqual(new Point(110, 20));
        expect(rectangle.bottomLeftPoint()).toEqual(new Point(10, 220));
        expect(rectangle.bottomRightPoint()).toEqual(new Point(110, 220));
    });

    it("should calculate if a point belongs to the rectangle", function () {
        var rectangle = new Rectangle(20, 30, 100, 200);

        expect(rectangle.containsPoint(new Point(20, 150))).toBeTruthy();
        expect(rectangle.containsPoint(new Point(100, 150))).toBeTruthy();
        expect(rectangle.containsPoint(new Point(119, 229))).toBeTruthy();

        expect(rectangle.containsPoint(new Point(19, 150))).toBeFalsy();
        expect(rectangle.containsPoint(new Point(25, 231))).toBeFalsy();
        expect(rectangle.containsPoint(new Point(121, 231))).toBeFalsy();
    });
});