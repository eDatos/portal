(function () {
    "use strict";

    var Point = STAT4YOU.Table.Point,
        Size = STAT4YOU.Table.Size;

    STAT4YOU.namespace("STAT4YOU.Table.Rectangle");

    STAT4YOU.Table.Rectangle = function (point, size) {
        if (arguments.length === 2) {
            this.setPoint(arguments[0]);
            this.setSize(arguments[1]);
        } else if (arguments.length === 4) {
            this.setPoint(new Point(arguments[0], arguments[1]));
            this.setSize(new Size(arguments[2], arguments[3]));
        }
    };

    STAT4YOU.Table.Rectangle.prototype.getPoint = function () {
        return new STAT4YOU.Table.Point(this.x, this.y);
    };

    STAT4YOU.Table.Rectangle.prototype.setPoint = function (point) {
        this.x = point.x;
        this.y = point.y;
    };

    STAT4YOU.Table.Rectangle.prototype.getSize = function () {
        return new STAT4YOU.Table.Size(this.width, this.height);
    };

    STAT4YOU.Table.Rectangle.prototype.setSize = function (size) {
        this.width = size.width;
        this.height = size.height;
    };

    STAT4YOU.Table.Rectangle.prototype.topLeftPoint = function () {
        return this.getPoint();
    };

    STAT4YOU.Table.Rectangle.prototype.topRightPoint = function () {
        var point = this.getPoint();
        point.x = point.x + this.width;
        return point;
    };

    STAT4YOU.Table.Rectangle.prototype.bottomLeftPoint = function () {
        var point = this.getPoint();
        point.y = point.y + this.height;
        return point;
    };

    STAT4YOU.Table.Rectangle.prototype.bottomRightPoint = function () {
        var point = this.getPoint();
        point.x = point.x + this.width;
        point.y = point.y + this.height;
        return point;
    };

    STAT4YOU.Table.Rectangle.prototype.containsPoint = function (point) {
        var containsPoint = point.x >= this.x &&
            point.x < this.x + this.width &&
            point.y >= this.y &&
            point.y < this.y + this.height;
        return containsPoint;
    };

    STAT4YOU.Table.Rectangle.createFromPointWithOffset = function (point) {
        return new STAT4YOU.Table.Rectangle(point.x - 5, point.y - 5, 10, 10);
    };

}());
