(function () {
    "use strict";

    App.namespace("App.Table.Zone");

    var Point = App.Table.Point,
        Rectangle = App.Table.Rectangle,
        Size = App.Table.Size;

    App.Table.Zone = function (options) {
        this.initialize(options);
    };

    App.Table.Zone.prototype.initialize = function (options) {
        if (!options) {
            options = {};
        }

        this.ctx = options.context;
        this.viewPort = new Rectangle(new Point(0, 0), new Size(0, 0));
        this.size = new Size(0, 0);
        this.origin = new Point(0, 0);
        this.needRepaint = false;
    };

    App.Table.Zone.prototype.setSize = function (size) {
        this.size = size;
    };

    App.Table.Zone.prototype.setViewPort = function (viewPort) {
        this.viewPort = viewPort;
        this.needRepaint = true;

        this.limitPointToValidOrigin(this.origin);
    };

    App.Table.Zone.prototype.setOrigin = function (origin) {
        this.origin = origin;
        this.needRepaint = true;
    };

    App.Table.Zone.prototype.limitPointToValidOrigin = function (point) {
        var maxValidOrigin = new Point(this.size.width - this.viewPort.width, this.size.height - this.viewPort.height);

        if (point.x > maxValidOrigin.x) {
            point.x = maxValidOrigin.x;
        }

        if (point.x < 0) {
            point.x = 0;
        }

        if (point.y > maxValidOrigin.y) {
            point.y = maxValidOrigin.y;
        }

        if (point.y < 0) {
            point.y = 0;
        }

        return point;
    };

    App.Table.Zone.prototype.move = function (distance) {
        var newOrigin = this.origin.distance(distance);
        this.limitPointToValidOrigin(newOrigin);
        this.setOrigin(newOrigin);
    };

    // Convierte una posición absoluta a una posición relativa al canvas
    App.Table.Zone.prototype.absolutePoint2RelativePoint = function (point) {
        return point.distance(this.origin).plus(this.viewPort.getPoint());
    };

    // Convierte una posicion relative al canvas a una posición absoluta
    App.Table.Zone.prototype.relativePoint2AbsolutePoint = function (point) {
        return point.distance(this.viewPort.getPoint()).plus(this.origin);
    };

    // Comprueba si un punto relativo es visible
    App.Table.Zone.prototype.isRelativePointVisible = function (point) {
        return (point.x >= this.viewPort.x && point.x < this.viewPort.width + this.viewPort.x) &&
               (point.y >= this.viewPort.y && point.y < this.viewPort.height + this.viewPort.y);
    };

    App.Table.Zone.prototype.isRelativeRectangleVisible = function (rectangle) {
        var rectangleTopLeft = rectangle.topLeftPoint();
        var rectangleBottonRight = rectangle.bottomRightPoint();

        var isVisible = (rectangleTopLeft.x <= this.viewPort.x + this.viewPort.width) &&
                (rectangleBottonRight.x >= this.viewPort.x) &&
                (rectangleTopLeft.y <= this.viewPort.y + this.viewPort.height) &&
                (rectangleBottonRight.y >= this.viewPort.y);

        return isVisible;
    };

    // Limpia el viewPort
    App.Table.Zone.prototype.clear = function () {
        this.ctx.clearRect(this.viewPort.x, this.viewPort.y, this.viewPort.width, this.viewPort.height);
    };

}());
