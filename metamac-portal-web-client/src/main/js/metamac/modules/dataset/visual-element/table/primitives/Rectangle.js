(function () {
    "use strict";

    var Point = App.Table.Point,
        Size = App.Table.Size;

    App.namespace("App.Table.Rectangle");

    App.Table.Rectangle = function (point, size) {
        if (arguments.length === 2) {
            this.setPoint(arguments[0]);
            this.setSize(arguments[1]);
        } else if (arguments.length === 4) {
            this.setPoint(new Point(arguments[0], arguments[1]));
            this.setSize(new Size(arguments[2], arguments[3]));
        }
    };

    App.Table.Rectangle.prototype.getPoint = function () {
        return new App.Table.Point(this.x, this.y);
    };

    App.Table.Rectangle.prototype.setPoint = function (point) {
        this.x = point.x;
        this.y = point.y;
    };

    App.Table.Rectangle.prototype.getSize = function () {
        return new App.Table.Size(this.width, this.height);
    };

    App.Table.Rectangle.prototype.setSize = function (size) {
        this.width = size.width;
        this.height = size.height;
    };

    App.Table.Rectangle.prototype.topLeftPoint = function () {
        return this.getPoint();
    };

    App.Table.Rectangle.prototype.topRightPoint = function () {
        var point = this.getPoint();
        point.x = point.x + this.width;
        return point;
    };

    App.Table.Rectangle.prototype.bottomLeftPoint = function () {
        var point = this.getPoint();
        point.y = point.y + this.height;
        return point;
    };

    App.Table.Rectangle.prototype.bottomRightPoint = function () {
        var point = this.getPoint();
        point.x = point.x + this.width;
        point.y = point.y + this.height;
        return point;
    };

    App.Table.Rectangle.prototype.containsPoint = function (point) {
        var containsPoint = point.x >= this.x &&
            point.x < this.x + this.width &&
            point.y >= this.y &&
            point.y < this.y + this.height;
        return containsPoint;
    };

    App.Table.Rectangle.createFromPointWithOffset = function (point) {
        return new App.Table.Rectangle(point.x - 5, point.y - 5, 10, 10);
    };

}());
